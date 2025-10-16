# SimpleCron 🕐

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![npm version](https://badge.fury.io/js/simplecron.svg)](https://badge.fury.io/js/simplecron)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

A simple, flexible cron service for calling HTTP endpoints on schedule. Perfect for API health checks, data processing, cleanup tasks, and more.

> **SimpleCron** makes it easy to schedule HTTP requests to any endpoint with retry logic, comprehensive logging, and flexible configuration.

## Table of Contents

- [Features](#features-)
- [Quick Start](#quick-start-)
- [Configuration](#configuration-)
- [Use Cases](#use-cases-)
- [Deployment](#deployment-)
- [Examples](#examples-)
- [Contributing](#contributing-)
- [License](#license-)

## Features ✨

- **Multiple Endpoints**: Configure unlimited endpoints with individual schedules
- **Retry Logic**: Exponential backoff with configurable retry attempts
- **Smart Logging**: Comprehensive logging with Winston
- **Environment Config**: Easy configuration via `.env` file
- **Graceful Shutdown**: Clean shutdown on SIGINT/SIGTERM
- **Health Monitoring**: Built-in statistics and monitoring
- **Flexible Headers**: Support for dynamic headers with environment variables

## Installation

### NPM
```bash
npm install simplecron
```

### Docker
```bash
docker run -d --env-file .env yourusername/simplecron
```

### From Source
```bash
git clone https://github.com/yourusername/simplecron.git
cd simplecron
npm install
```

## Quick Start 🚀

1. **Install SimpleCron:**
   ```bash
   npm install simplecron
   ```

2. **Create configuration:**
   ```bash
   cp .env.example .env
   # Edit .env with your endpoints (this file is gitignored)
   ```

3. **Start the service:**
   ```bash
   npx simplecron
   # or
   npm start
   ```

4. **Test an endpoint:**
   ```bash
   npm test
   ```

## Configuration 📋

Each endpoint is configured using environment variables with a numbered prefix:

```bash
# Endpoint 1
ENDPOINT_1_NAME=my-api
ENDPOINT_1_URL=https://api.example.com/process
ENDPOINT_1_METHOD=POST
ENDPOINT_1_HEADERS={"Authorization": "Bearer $API_TOKEN", "Content-Type": "application/json"}
ENDPOINT_1_SCHEDULE=*/5 * * * *
ENDPOINT_1_ENABLED=true
ENDPOINT_1_TIMEOUT=300000
ENDPOINT_1_RETRY_ATTEMPTS=3
ENDPOINT_1_RETRY_DELAY=5000

# Endpoint 2
ENDPOINT_2_NAME=health-check
ENDPOINT_2_URL=https://api.example.com/health
ENDPOINT_2_METHOD=GET
ENDPOINT_2_HEADERS={}
ENDPOINT_2_SCHEDULE=0 */6 * * *
ENDPOINT_2_ENABLED=true
```

### Configuration Options

| Variable | Description | Default |
|----------|-------------|---------|
| `ENDPOINT_X_NAME` | Friendly name for the endpoint | Required |
| `ENDPOINT_X_URL` | Full URL to call | Required |
| `ENDPOINT_X_METHOD` | HTTP method (GET, POST, PUT, etc.) | GET |
| `ENDPOINT_X_HEADERS` | JSON object of headers | {} |
| `ENDPOINT_X_SCHEDULE` | Cron schedule expression | Required |
| `ENDPOINT_X_ENABLED` | Enable/disable this endpoint | true |
| `ENDPOINT_X_TIMEOUT` | Request timeout in milliseconds | 30000 |
| `ENDPOINT_X_RETRY_ATTEMPTS` | Number of retry attempts | 3 |
| `ENDPOINT_X_RETRY_DELAY` | Base delay between retries (ms) | 1000 |

### Dynamic Headers

Headers support environment variable substitution:

```bash
ENDPOINT_1_HEADERS={"Authorization": "Bearer $API_TOKEN", "X-Custom-Header": "$CUSTOM_VALUE"}
```

## Cron Schedule Examples 📅

```bash
# Every 5 minutes
*/5 * * * *

# Every hour at minute 0
0 * * * *

# Every 6 hours
0 */6 * * *

# Every day at 2:30 AM
30 2 * * *

# Every Monday at 9:00 AM
0 9 * * 1

# Every weekday at 6:00 PM
0 18 * * 1-5
```

## Use Cases 💡

### 1. API Health Checks
```bash
ENDPOINT_1_NAME=health-check
ENDPOINT_1_URL=https://my-api.com/health
ENDPOINT_1_SCHEDULE=*/10 * * * *
```

### 2. Data Processing
```bash
ENDPOINT_1_NAME=process-data
ENDPOINT_1_URL=https://my-api.com/process
ENDPOINT_1_METHOD=POST
ENDPOINT_1_SCHEDULE=0 2 * * *
```

### 3. Cleanup Tasks
```bash
ENDPOINT_1_NAME=cleanup
ENDPOINT_1_URL=https://my-api.com/cleanup
ENDPOINT_1_SCHEDULE=0 0 * * 0
```

### 4. Monitoring & Alerts
```bash
ENDPOINT_1_NAME=uptime-check
ENDPOINT_1_URL=https://my-api.com/ping
ENDPOINT_1_SCHEDULE=*/1 * * * *
```

## Deployment 🚀

### Railway
1. Connect your GitHub repo to Railway
2. Set environment variables in Railway dashboard
3. Deploy!

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["npm", "start"]
```

### PM2
```bash
pm2 start index.js --name simplecron
pm2 save
pm2 startup
```

## Logging 📊

Logs are written to:
- Console (with colors)
- `logs/combined.log` (all logs)
- `logs/error.log` (errors only)

Log levels: `error`, `warn`, `info`, `debug`

## Monitoring 📈

The service logs statistics every 5 minutes:
- Total calls made
- Successful calls
- Failed calls
- Uptime

## Examples 🎯

### API Data Processing
```bash
ENDPOINT_1_NAME=data-processor
ENDPOINT_1_URL=https://your-api.com/api/process
ENDPOINT_1_METHOD=POST
ENDPOINT_1_HEADERS={"Authorization": "Bearer $API_TOKEN", "Content-Type": "application/json"}
ENDPOINT_1_SCHEDULE=*/5 * * * *
ENDPOINT_1_ENABLED=true
ENDPOINT_1_TIMEOUT=300000
```

### Multiple Services
```bash
# Service 1: Every 5 minutes
ENDPOINT_1_NAME=service1
ENDPOINT_1_URL=https://service1.com/process
ENDPOINT_1_SCHEDULE=*/5 * * * *

# Service 2: Every hour
ENDPOINT_2_NAME=service2
ENDPOINT_2_URL=https://service2.com/health
ENDPOINT_2_SCHEDULE=0 * * * *

# Service 3: Daily at midnight
ENDPOINT_3_NAME=service3
ENDPOINT_3_URL=https://service3.com/cleanup
ENDPOINT_3_SCHEDULE=0 0 * * *
```

## License 📄

MIT License - feel free to use in your projects!

## Contributing 🤝

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Support 💬

- 📖 [Documentation](https://github.com/yourusername/simplecron#readme)
- 🐛 [Report Issues](https://github.com/yourusername/simplecron/issues)
- 💡 [Request Features](https://github.com/yourusername/simplecron/issues)
- 💬 [Discussions](https://github.com/yourusername/simplecron/discussions)

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Built with [Node.js](https://nodejs.org/)
- Uses [node-cron](https://github.com/node-cron/node-cron) for scheduling
- Powered by [Winston](https://github.com/winstonjs/winston) for logging
- HTTP requests handled by [Axios](https://github.com/axios/axios)

---

**Happy Cronning!** 🎉

Made with ❤️ by the SimpleCron community
