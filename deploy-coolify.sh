#!/bin/bash

# WordPress SaaS Dashboard - Coolify Deployment Script
# Update these variables with your Coolify server details

COOLIFY_SERVER="coolify.einsof7.com"
COOLIFY_USER="root"  # Usually 'root' or your username
COOLIFY_PORT="22"
SSH_KEY="/tmp/coolify_private_key_correct"
APP_NAME="wordpress-saas-dashboard"
PROJECT_DIR="/mnt/w/FrontEnd-Final/PRPs-agentic-eng/saas-dashboard"

echo "🚀 Starting deployment to Coolify server..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if server details are configured
if [ "$COOLIFY_SERVER" = "YOUR_COOLIFY_SERVER_IP_OR_HOSTNAME" ]; then
    print_error "Please update the COOLIFY_SERVER variable with your actual server details"
    exit 1
fi

# Test SSH connection
print_status "Testing SSH connection to Coolify server..."
if ! ssh -i "$SSH_KEY" -p "$COOLIFY_PORT" -o ConnectTimeout=10 -o BatchMode=yes "$COOLIFY_USER@$COOLIFY_SERVER" "echo 'SSH connection successful'" 2>/dev/null; then
    print_error "Cannot connect to Coolify server. Please check:"
    echo "  - Server IP/hostname: $COOLIFY_SERVER"
    echo "  - SSH username: $COOLIFY_USER"
    echo "  - SSH port: $COOLIFY_PORT"
    echo "  - SSH key: $SSH_KEY"
    exit 1
fi

print_status "SSH connection successful!"

# Create deployment directory on server
DEPLOY_DIR="/tmp/wordpress-saas-dashboard-deploy"
print_status "Creating deployment directory on server..."
ssh -i "$SSH_KEY" -p "$COOLIFY_PORT" "$COOLIFY_USER@$COOLIFY_SERVER" "mkdir -p $DEPLOY_DIR"

# Copy application files to server
print_status "Copying application files to server..."
rsync -avz -e "ssh -i $SSH_KEY -p $COOLIFY_PORT" \
    --exclude="node_modules" \
    --exclude=".git" \
    --exclude="dist" \
    --exclude=".env.local" \
    "$PROJECT_DIR/" \
    "$COOLIFY_USER@$COOLIFY_SERVER:$DEPLOY_DIR/"

# Deploy using Coolify CLI (if available) or Docker Compose
print_status "Deploying application..."
ssh -i "$SSH_KEY" -p "$COOLIFY_PORT" "$COOLIFY_USER@$COOLIFY_SERVER" << 'EOF'
cd /tmp/wordpress-saas-dashboard-deploy

# Check if Coolify CLI is available
if command -v coolify &> /dev/null; then
    echo "Using Coolify CLI for deployment..."
    coolify deploy --config coolify.json
else
    echo "Using Docker Compose for deployment..."
    
    # Build and deploy with Docker Compose
    docker-compose down || true
    docker-compose build --no-cache
    docker-compose up -d
    
    # Check if deployment was successful
    if docker-compose ps | grep -q "Up"; then
        echo "✅ Deployment successful!"
        echo "📋 Container status:"
        docker-compose ps
    else
        echo "❌ Deployment failed!"
        echo "📋 Container logs:"
        docker-compose logs
        exit 1
    fi
fi
EOF

if [ $? -eq 0 ]; then
    print_status "✅ Deployment completed successfully!"
    print_status "🌐 Your application should now be available at:"
    print_status "   http://$COOLIFY_SERVER:3000"
    print_status ""
    print_status "📋 Next steps:"
    echo "  1. Configure environment variables in Coolify dashboard"
    echo "  2. Set up domain mapping if needed"
    echo "  3. Configure SSL certificate"
    echo "  4. Set up monitoring and backups"
else
    print_error "❌ Deployment failed! Check the logs above for details."
    exit 1
fi

# Cleanup
print_status "Cleaning up temporary files..."
ssh -i "$SSH_KEY" -p "$COOLIFY_PORT" "$COOLIFY_USER@$COOLIFY_SERVER" "rm -rf $DEPLOY_DIR"

print_status "🎉 Deployment process completed!"