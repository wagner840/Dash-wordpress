# WordPress SaaS Dashboard - Production Dockerfile
FROM node:20-alpine AS build

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package.json ./

# Copy destroy script first
COPY scripts/destroy-css-color.js ./scripts/

# Install dependencies and DESTROY problematic packages
RUN npm install --legacy-peer-deps --no-audit

# NUCLEAR OPTION: Manual destruction of problematic packages
RUN node scripts/destroy-css-color.js

# Verify they're gone
RUN ls -la node_modules/ | grep -E "(asamuzakjp|cssstyle|jsdom)" || echo "✅ All problematic packages destroyed!"

# Copy source code AFTER installing dependencies
COPY . .

# Environment variables for build
ENV NODE_ENV=production
ENV VITE_APP_ENV=production

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add labels for Coolify
LABEL coolify.managed=true
LABEL coolify.version=latest

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]