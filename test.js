#!/usr/bin/env node

/**
 * SimpleCron Test Script
 * 
 * Test the cron service with a simple endpoint
 */

import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const testEndpoint = async () => {
  const url = process.env.ENDPOINT_1_URL
  const headers = JSON.parse(process.env.ENDPOINT_1_HEADERS || '{}')
  
  if (!url) {
    console.log('❌ No test endpoint configured')
    return
  }

  console.log(`🧪 Testing endpoint: ${url}`)
  
  try {
    const response = await axios({
      method: 'POST',
      url,
      headers,
      timeout: 30000
    })
    
    console.log(`✅ Test successful: ${response.status}`)
    console.log(`📄 Response:`, response.data)
  } catch (error) {
    console.log(`❌ Test failed:`, error.message)
    if (error.response) {
      console.log(`📄 Response:`, error.response.data)
    }
  }
}

testEndpoint()
