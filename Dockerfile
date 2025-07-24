# WordPress SaaS Dashboard - Production Dockerfile
FROM node:20-alpine AS dependencies

# Install system dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --ignore-scripts --prefer-offline --no-audit

# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# Environment variables for build
ENV NODE_ENV=production
ENV VITE_APP_ENV=production

# Clear npm cache and build the application
RUN npm cache clean --force
RUN npm run build

# Production stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from build stage
COPY --from=build /app/dist .

# Add labels for Coolify
LABEL coolify.managed=true
LABEL coolify.version=latest

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]