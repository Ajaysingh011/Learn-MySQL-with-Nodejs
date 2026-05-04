# Phase 5: Production Deployment Guide

## 🚀 Deployment Strategies

---

## Strategy 1: Local Docker Deployment

### Step 1: Install Docker
```bash
# Download: https://www.docker.com/products/docker-desktop

# Verify installation
docker --version
docker-compose --version
```

### Step 2: Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["npm", "start"]
```

### Step 3: Create docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DB_HOST: mysql
      DB_USER: root
      DB_PASSWORD: password123
      DB_NAME: socialconnect
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - backend
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password123
      MYSQL_DATABASE: socialconnect
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./migrations:/docker-entrypoint-initdb.d
    networks:
      - backend
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - backend
    restart: unless-stopped

volumes:
  mysql_data:
  redis_data:

networks:
  backend:
```

### Step 4: Run Application
```bash
# Build and start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Restart services
docker-compose restart
```

---

## Strategy 2: Heroku Deployment

### Step 1: Install Heroku CLI
```bash
# Download: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login
```

### Step 2: Create app.json
```json
{
  "name": "socialconnect-backend",
  "description": "Instagram-like social backend",
  "buildpacks": [
    {
      "url": "heroku/nodejs"
    }
  ],
  "env": {
    "NODE_ENV": {
      "description": "Node environment",
      "value": "production"
    },
    "JWT_SECRET": {
      "description": "JWT secret key",
      "value": "your-secret-key"
    },
    "DB_HOST": {
      "description": "Database host",
      "value": "your-db-host"
    }
  },
  "addons": [
    "cleardb",
    "heroku-redis"
  ]
}
```

### Step 3: Deploy
```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create Heroku app
heroku create socialconnect-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Open app
heroku open
```

---

## Strategy 3: AWS EC2 Deployment

### Step 1: Launch EC2 Instance
```bash
# 1. Go to AWS Console
# 2. EC2 → Launch Instance
# 3. Choose: Ubuntu 20.04 LTS
# 4. Instance type: t2.micro (free tier)
# 5. Add storage: 30GB
# 6. Security group: Allow 80, 443, 3000, 3306, 6379
```

### Step 2: Connect & Setup
```bash
# SSH into instance
ssh -i key.pem ubuntu@your-instance-ip

# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install Redis
sudo apt install -y redis-server

# Install Git
sudo apt install -y git
```

### Step 3: Deploy Application
```bash
# Clone repository
git clone your-repo-url
cd your-app

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with production values

# Run migrations
mysql -u root -p < migrations/create-schema.sql

# Start application
npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start server.js --name "socialconnect"
pm2 startup
pm2 save
```

### Step 4: Setup Nginx Reverse Proxy
```nginx
# /etc/nginx/sites-available/default

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 5: Setup SSL
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d your-domain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## Strategy 4: Digital Ocean Deployment

### Step 1: Create Droplet
```bash
# 1. Digital Ocean → Create → Droplet
# 2. Choose: Ubuntu 20.04 LTS
# 3. Size: Basic ($5/month)
# 4. SSH key setup
```

### Step 2: Initial Setup
```bash
# SSH
ssh root@your-droplet-ip

# Create non-root user
adduser appuser
usermod -aG sudo appuser

# Switch user
su - appuser
```

### Step 3: Install Stack
```bash
# Same as AWS EC2 setup
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs mysql-server redis-server git
```

### Step 4: Deploy App
```bash
# Clone and setup
git clone your-repo
cd your-app
npm install

# Setup environment
cp .env.example .env
# Edit .env

# Run with PM2
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

---

## 📋 Pre-Deployment Checklist

```
Code Quality:
  ✅ All tests passing
  ✅ Code review done
  ✅ No console.log left
  ✅ No hardcoded secrets

Security:
  ✅ All dependencies updated
  ✅ No vulnerabilities (npm audit)
  ✅ Password hashing enabled
  ✅ JWT secrets secure
  ✅ Input validation complete
  ✅ SQL injection prevented
  ✅ CORS configured
  ✅ Rate limiting enabled

Performance:
  ✅ Database indexes created
  ✅ Queries optimized
  ✅ Caching configured
  ✅ Connection pooling enabled
  ✅ Response compression enabled

Configuration:
  ✅ Environment variables set
  ✅ Database backups configured
  ✅ Error logging setup
  ✅ Monitoring configured
  ✅ Health checks defined

Documentation:
  ✅ API documented
  ✅ Setup guide written
  ✅ Deployment procedure documented
  ✅ Troubleshooting guide created
```

---

## 🔒 Post-Deployment Security

```bash
# 1. Enable firewall
sudo ufw enable
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

# 2. SSL/TLS
Install SSL certificate (Let's Encrypt)
Force HTTPS

# 3. Database
Change default credentials
Enable database encryption
Regular backups

# 4. Application
Disable debug mode
Set NODE_ENV=production
Secure JWT secret
Enable rate limiting

# 5. Monitoring
Setup error tracking
Enable logging
Configure alerts
Monitor resource usage
```

---

## 📊 Monitoring Setup

### Application Monitoring
```javascript
// config/monitoring.js
const monitoring = {
  // Error tracking
  errorTracking: {
    service: 'Sentry',
    dsn: process.env.SENTRY_DSN
  },

  // Logging
  logging: {
    level: 'info',
    format: 'json',
    transport: 'file'
  },

  // Metrics
  metrics: {
    service: 'DataDog',
    apiKey: process.env.DATADOG_API_KEY
  }
};

module.exports = monitoring;
```

### Health Checks
```javascript
// routes/health.js
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

---

## 🚨 Troubleshooting

### Application Won't Start
```bash
# Check logs
pm2 logs

# Check port
lsof -i :3000

# Restart
pm2 restart all
```

### Database Connection Failed
```bash
# Check MySQL running
sudo systemctl status mysql

# Test connection
mysql -u root -p

# Restart MySQL
sudo systemctl restart mysql
```

### High Memory Usage
```bash
# Check processes
top

# Restart application
pm2 restart all

# Check for memory leaks
# Add monitoring
```

### Slow Performance
```bash
# Check database indexes
SHOW INDEXES FROM table_name;

# Check query performance
EXPLAIN SELECT ...;

# Enable caching
# Optimize queries
```

---

## 📈 Scaling Strategies

### Vertical Scaling
```
= Upgrade server (more CPU, RAM)
Easier but limited
```

### Horizontal Scaling
```
= Add more servers
Load balancer distributes traffic
Database replicas for read operations
Cache layer (Redis) for performance
```

### Architecture
```
Load Balancer
    ↓
├─ Server 1
├─ Server 2
└─ Server 3
    ↓
Shared Database
Shared Redis Cache
```

---

## 🎯 Deployment Checklist

```
Before Deployment:
  ✅ Backup database
  ✅ Test migrations
  ✅ Verify environment variables
  ✅ Check disk space
  ✅ Review logs

During Deployment:
  ✅ Stop old application
  ✅ Deploy new code
  ✅ Run migrations
  ✅ Start new application
  ✅ Verify health checks

After Deployment:
  ✅ Test all endpoints
  ✅ Check error logs
  ✅ Verify database integrity
  ✅ Monitor performance
  ✅ Alert team
```

---

## 📞 Support & Monitoring Services

```
Error Tracking: Sentry, Rollbar
Logging: LogRocket, Datadog
Monitoring: New Relic, Prometheus
Uptime: StatusPage, Pingdom
CDN: Cloudflare, CloudFront
```

---

**Duration:** 2-4 weeks
**Level:** Advanced
**Status:** Production Ready!

Your backend is ready for the world! 🚀

