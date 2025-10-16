#!/usr/bin/env node

/**
 * SimpleCron - Simple HTTP Endpoint Scheduler
 * 
 * A simple but powerful cron service that can call any HTTP endpoint
 * on a schedule. Perfect for API health checks, data processing, cleanup tasks, etc.
 * 
 * Features:
 * - Multiple endpoints with individual schedules
 * - Retry logic with exponential backoff
 * - Comprehensive logging
 * - Environment-based configuration
 * - Graceful shutdown
 * - Health monitoring
 */

import cron from 'node-cron'
import axios from 'axios'
import dotenv from 'dotenv'
import winston from 'winston'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config()

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: join(__dirname, 'logs', 'error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: join(__dirname, 'logs', 'combined.log') 
    })
  ]
})

// Ensure logs directory exists
import { mkdirSync } from 'fs'
try {
  mkdirSync(join(__dirname, 'logs'), { recursive: true })
} catch (err) {
  // Directory might already exist
}

class SimpleCron {
  constructor() {
    this.jobs = new Map()
    this.stats = {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      startTime: new Date()
    }
  }

  /**
   * Parse endpoint configuration from environment variables
   */
  parseEndpoints() {
    const endpoints = []
    let endpointIndex = 1

    while (true) {
      const prefix = `ENDPOINT_${endpointIndex}_`
      const name = process.env[`${prefix}NAME`]
      
      if (!name) break

      const config = {
        name,
        url: process.env[`${prefix}URL`],
        method: process.env[`${prefix}METHOD`] || 'GET',
        headers: this.parseHeaders(process.env[`${prefix}HEADERS`] || '{}'),
        schedule: process.env[`${prefix}SCHEDULE`],
        enabled: process.env[`${prefix}ENABLED`] === 'true',
        timeout: parseInt(process.env[`${prefix}TIMEOUT`] || '30000'),
        retryAttempts: parseInt(process.env[`${prefix}RETRY_ATTEMPTS`] || '3'),
        retryDelay: parseInt(process.env[`${prefix}RETRY_DELAY`] || '1000')
      }

      if (config.url && config.schedule) {
        endpoints.push(config)
        logger.info(`📋 Loaded endpoint: ${config.name} (${config.schedule})`)
      } else {
        logger.warn(`⚠️  Skipping endpoint ${config.name}: missing URL or schedule`)
      }

      endpointIndex++
    }

    return endpoints
  }

  /**
   * Parse headers from JSON string
   */
  parseHeaders(headersStr) {
    try {
      const headers = JSON.parse(headersStr)
      // Replace environment variables in header values
      const processedHeaders = {}
      for (const [key, value] of Object.entries(headers)) {
        processedHeaders[key] = typeof value === 'string' 
          ? value.replace(/\$(\w+)/g, (match, varName) => process.env[varName] || match)
          : value
      }
      return processedHeaders
    } catch (error) {
      logger.error(`❌ Failed to parse headers: ${headersStr}`, error)
      return {}
    }
  }

  /**
   * Make HTTP request with retry logic
   */
  async makeRequest(config, attempt = 1) {
    const { name, url, method, headers, timeout, retryAttempts, retryDelay } = config

    try {
      logger.info(`🚀 [${name}] Attempt ${attempt}/${retryAttempts + 1} - ${method} ${url}`)
      
      const response = await axios({
        method: method.toLowerCase(),
        url,
        headers,
        timeout,
        validateStatus: (status) => status < 500 // Don't throw on 4xx errors
      })

      const success = response.status >= 200 && response.status < 300
      
      if (success) {
        logger.info(`✅ [${name}] Success: ${response.status} - ${response.data?.message || 'OK'}`)
        this.stats.successfulCalls++
        return { success: true, status: response.status, data: response.data }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

    } catch (error) {
      logger.error(`❌ [${name}] Attempt ${attempt} failed:`, error.message)

      if (attempt <= retryAttempts) {
        const delay = retryDelay * Math.pow(2, attempt - 1) // Exponential backoff
        logger.info(`⏳ [${name}] Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.makeRequest(config, attempt + 1)
      } else {
        logger.error(`💥 [${name}] All retry attempts exhausted`)
        this.stats.failedCalls++
        return { success: false, error: error.message }
      }
    }
  }

  /**
   * Create and start a cron job for an endpoint
   */
  createJob(config) {
    const { name, schedule, enabled } = config

    if (!enabled) {
      logger.info(`⏸️  [${name}] Disabled - skipping`)
      return null
    }

    if (!cron.validate(schedule)) {
      logger.error(`❌ [${name}] Invalid cron schedule: ${schedule}`)
      return null
    }

    const job = cron.schedule(schedule, async () => {
      this.stats.totalCalls++
      await this.makeRequest(config)
    }, {
      scheduled: false,
      timezone: process.env.TIMEZONE || 'UTC'
    })

    logger.info(`⏰ [${name}] Scheduled: ${schedule}`)
    return job
  }

  /**
   * Start all cron jobs
   */
  start() {
    logger.info('🚀 Starting SimpleCron...')
    
    const endpoints = this.parseEndpoints()
    
    if (endpoints.length === 0) {
      logger.warn('⚠️  No endpoints configured. Check your .env file.')
      return
    }

    endpoints.forEach(config => {
      const job = this.createJob(config)
      if (job) {
        this.jobs.set(config.name, job)
        job.start()
      }
    })

    logger.info(`✅ Started ${this.jobs.size} cron jobs`)
    this.logStats()
  }

  /**
   * Stop all cron jobs
   */
  stop() {
    logger.info('🛑 Stopping SimpleCron...')
    
    this.jobs.forEach((job, name) => {
      job.stop()
      logger.info(`⏹️  Stopped: ${name}`)
    })
    
    this.jobs.clear()
    logger.info('✅ All jobs stopped')
  }

  /**
   * Log current statistics
   */
  logStats() {
    const uptime = Date.now() - this.stats.startTime.getTime()
    const uptimeMinutes = Math.floor(uptime / 60000)
    
    logger.info(`📊 Stats: ${this.stats.totalCalls} calls, ${this.stats.successfulCalls} success, ${this.stats.failedCalls} failed, uptime: ${uptimeMinutes}m`)
  }

  /**
   * Graceful shutdown handler
   */
  setupGracefulShutdown() {
    const shutdown = (signal) => {
      logger.info(`📡 Received ${signal}, shutting down gracefully...`)
      this.stop()
      process.exit(0)
    }

    process.on('SIGINT', () => shutdown('SIGINT'))
    process.on('SIGTERM', () => shutdown('SIGTERM'))
  }
}

// Start the service
const simplecron = new SimpleCron()
simplecron.setupGracefulShutdown()
simplecron.start()

// Log stats every 5 minutes
setInterval(() => {
  simplecron.logStats()
}, 5 * 60 * 1000)

export default SimpleCron
