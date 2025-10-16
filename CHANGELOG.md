# Changelog

All notable changes to SimpleCron will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of SimpleCron
- Support for multiple HTTP endpoints
- Configurable cron schedules
- Retry logic with exponential backoff
- Comprehensive logging with Winston
- Environment-based configuration
- Graceful shutdown handling
- Health monitoring and statistics
- Dynamic header substitution
- Test script for endpoint validation

### Features
- Multiple endpoint support with individual schedules
- Flexible configuration via environment variables
- Smart retry logic with configurable attempts and delays
- Comprehensive logging (console + files)
- Graceful shutdown on SIGINT/SIGTERM
- Real-time statistics monitoring
- Support for all HTTP methods
- Dynamic header value substitution
- Timeout configuration per endpoint
- Enable/disable endpoints individually

## [1.0.0] - 2024-10-15

### Added
- Initial release
- Core cron functionality
- HTTP endpoint calling
- Retry mechanism
- Logging system
- Configuration management
- Test utilities
