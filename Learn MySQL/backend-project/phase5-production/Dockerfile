# Phase 5: Production Dockerfile

# Multi-stage build for optimization
# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set user
USER nodejs

# Expose port
EXPOSE 3000

# Environment
ENV NODE_ENV=production

# Health check
# Ye check karta hai ke server healthy hai ya nahi
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
# Ye command server ko start karti hai
CMD ["npm", "start"]

# ====================================
# Dockerfile Explanation (Hinglish)
# ====================================

/**
 * Ye file Docker image banati hai
 *
 * Step 1: Builder stage
 *   - Node.js 18 Alpine base image
 *   - Dependencies install
 *   - Code copy
 *   - Optimization ke liye beech ke files remove
 *
 * Step 2: Production stage
 *   - Sirf zaroor ke files ko copy
 *   - Smaller image size
 *   - Security: Non-root user
 *   - Health check configure
 *
 * Benefits:
 *   ✅ Smaller image (only production files)
 *   ✅ Secure (non-root user)
 *   ✅ Health monitoring
 *   ✅ Fast startup
 *   ✅ Easy deployment
 *
 * Docker Commands:
 *   docker build -t socialconnect:latest .
 *   docker run -p 3000:3000 socialconnect:latest
 *   docker push your-registry/socialconnect:latest
 */
