# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S simplecron -u 1001

# Copy application code
COPY . .

# Create logs directory
RUN mkdir -p logs && chown -R simplecron:nodejs logs

# Switch to non-root user
USER simplecron

# Expose port (if needed for health checks)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('SimpleCron is running')" || exit 1

# Start the application
CMD ["npm", "start"]
