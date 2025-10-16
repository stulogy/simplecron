#!/bin/bash

# SimpleCron Railway Deployment Script
# Run this script to deploy SimpleCron to Railway with your custom endpoints

echo "🚀 Deploying SimpleCron to Railway..."

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it first:"
    echo "npm install -g @railway/cli"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from example..."
    cp .env.example .env
    echo "📝 Please edit .env with your endpoint configuration before running this script again."
    echo "   Or set environment variables manually with: railway variables --set \"KEY=value\""
    exit 1
fi

# Login to Railway (interactive)
echo "🔐 Please login to Railway..."
railway login

# Link to the project
echo "🔗 Linking to Railway project..."
railway link

# Set environment variables from .env file
echo "⚙️  Setting environment variables from .env file..."

# Read .env file and set variables (skip comments and empty lines)
while IFS= read -r line || [ -n "$line" ]; do
    # Skip comments and empty lines
    if [[ $line =~ ^[[:space:]]*# ]] || [[ -z "${line// }" ]]; then
        continue
    fi
    
    # Extract key=value pairs
    if [[ $line =~ ^([^=]+)=(.*)$ ]]; then
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
        
        # Remove quotes if present
        value=$(echo "$value" | sed 's/^"//;s/"$//')
        
        echo "Setting $key..."
        railway variables --set "$key=$value"
    fi
done < .env

echo "✅ Environment variables set!"

# Deploy the service
echo "🚀 Deploying to Railway..."
railway up

echo "🎉 SimpleCron deployed to Railway!"
echo "📊 Check your Railway dashboard for logs and monitoring"
echo "🔗 Your cron service is now running with your configured endpoints"
echo ""
echo "💡 To update endpoints later:"
echo "   1. Edit .env file"
echo "   2. Run: railway variables --set \"KEY=value\" for each variable"
echo "   3. Run: railway up to redeploy"
