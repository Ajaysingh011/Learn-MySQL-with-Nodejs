# 🎯 MINI TASK: Build Production Event Loop Dashboard

## Objective:

Build a real-time monitoring dashboard backend that tracks event loop health, memory usage, database performance, and system metrics.

---

## What You'll Learn:

✅ Implementing real production monitoring
✅ Collecting and analyzing metrics
✅ Understanding event loop behavior in production
✅ Building professional API endpoints
✅ Error handling and alerts
✅ Database connection management
✅ Memory leak detection

---

## Requirements (Detailed)

### Part 1: Event Loop Monitoring

**What to implement:**
- Measure event loop lag every 500ms
- Store last 120 measurements
- Calculate statistics (average, max, min)
- Alert if lag > 50ms (warning) or > 100ms (critical)

**Expected output:**
```json
{
  \"eventLoop\": {
    \"currentLag\": \"2.5ms\",
    \"averageLag\": \"1.8ms\",
    \"maxLag\": \"15.3ms\",
    \"minLag\": \"0.5ms\",
    \"samples\": 120,
    \"status\": \"healthy\"
  }
}
```

### Part 2: Memory Monitoring

**What to implement:**
- Track heap usage percentage
- Track external memory
- Alert if > 80% (warning) or > 90% (critical)
- Store trend data

**Expected output:**
```json
{
  \"memory\": {
    \"heapUsedPercent\": \"45.2%\",
    \"heapTotal\": \"128MB\",
    \"heapUsed\": \"58MB\",
    \"external\": \"2.3MB\",
    \"trend\": \"stable\"
  }
}
```

### Part 3: Request Tracking

**What to implement:**
- Track response times for each request
- Calculate average response time
- Count total requests
- Store metadata (method, path, status code)

**Expected output:**
```json
{
  \"requests\": {
    \"total\": 1245,
    \"avgResponseTime\": \"125ms\",
    \"maxResponseTime\": \"850ms\",
    \"minResponseTime\": \"2ms\",
    \"errorRate\": \"0.8%\",
    \"requestsPerSecond\": \"12.4\"
  }
}
```

### Part 4: Database Pool Metrics

**What to implement:**
- Connection pool with 10 connections (configurable)
- Track available/in-use/waiting connections
- Simulate database queries (50-150ms)
- Track query performance

**Expected output:**
```json
{
  \"database\": {
    \"available\": \"8\",
    \"inUse\": \"2\",
    \"waiting\": \"0\",
    \"totalConnections\": \"10\",
    \"totalQueries\": \"523\",
    \"avgQueryTime\": \"87ms\",
    \"errorCount\": \"0\"
  }
}
```

### Part 5: Express Endpoints

**Implement these endpoints:**

1. **GET /health** - Quick health check
   ```json
   {
     \"status\": \"healthy\",
     \"timestamp\": \"2024-01-20T10:30:00Z\"
   }
   ```

2. **GET /metrics** - Full metrics dashboard
   ```json
   {
     \"eventLoop\": {...},
     \"memory\": {...},
     \"requests\": {...},
     \"database\": {...},
     \"alerts\": [...],
     \"uptime\": \"1234.5s\",
     \"timestamp\": \"2024-01-20T10:30:00Z\"
   }
   ```

3. **GET /api/users/:id** - Simulate database query
   ```json
   {
     \"success\": true,
     \"data\": {\"id\": 1, \"name\": \"Raj Kumar\"},
     \"queryTime\": \"87ms\"
   }
   ```

4. **GET /api/parallel** - Parallel database queries
   ```json
   {
     \"success\": true,
     \"data\": {\"users\": 100, \"posts\": 250, \"comments\": 500},
     \"totalTime\": \"125ms\",
     \"note\": \"All queries in parallel\"
   }
   ```

5. **POST /api/stress** - Load test
   ```json
   {
     \"success\": true,
     \"message\": \"Executed 50 queries in 200ms\",
     \"avgPerQuery\": \"4ms\",
     \"eventLoopHealth\": {...}
   }
   ```

6. **GET /metrics/history** - Time series data
   ```json
   {
     \"eventLoopHistory\": [...],
     \"memoryHistory\": [...],
     \"requestHistory\": [...]
   }
   ```

---

## Starter Code Structure

```javascript
// server.js - Main entry point
const express = require('express');
const app = express();

// TODO: Create and initialize monitoring classes
// TODO: Create middleware to track requests
// TODO: Implement all endpoints
// TODO: Handle errors properly

app.listen(3000, () => {
    console.log('Dashboard running on http://localhost:3000/metrics');
});
```

---

## Step-by-Step Implementation Guide

### Step 1: Create EventLoopMonitor Class
```javascript
class EventLoopMonitor {
    constructor() {
        // TODO: Initialize measurement storage
    }
    
    startMonitoring() {
        // TODO: Measure lag every 500ms
        // Hint: Use setImmediate() to measure delay
    }
    
    getStats() {
        // TODO: Return calculated statistics
        // Calculate: avg, max, min, samples count
    }
}
```

### Step 2: Create MemoryMonitor Class
```javascript
class MemoryMonitor {
    constructor() {
        // TODO: Initialize memory tracking
    }
    
    startMonitoring() {
        // TODO: Track memory usage every 1 second
        // Use process.memoryUsage()
    }
    
    getStats() {
        // TODO: Return memory metrics
        // Include: heap used%, trend, alerts
    }
}
```

### Step 3: Create DatabasePool Class
```javascript
class DatabasePool {
    constructor(maxConnections = 10) {
        // TODO: Initialize connection pool
    }
    
    async getConnection() {
        // TODO: Return available connection or queue request
    }
    
    async query(sql) {
        // TODO: Execute query with connection
        // Simulate 50-150ms delay
        // Track query time
    }
    
    getStats() {
        // TODO: Return pool statistics
    }
}
```

### Step 4: Create RequestMetrics Middleware
```javascript
class RequestMetrics {
    constructor() {
        // TODO: Initialize request tracking
    }
    
    middleware() {
        return (req, res, next) => {
            // TODO: Record request start time
            // Track response time when response sent
            // Store metadata
        };
    }
    
    getStats() {
        // TODO: Return request statistics
        // Calculate: avg response time, total, errors, RPS
    }
}
```

### Step 5: Implement Express Endpoints
```javascript
app.get('/health', (req, res) => {
    // TODO: Quick health response
});

app.get('/metrics', (req, res) => {
    // TODO: Return all metrics combined
});

app.get('/api/users/:id', async (req, res) => {
    // TODO: Use database pool to query
    // Return user data
});

app.get('/api/parallel', async (req, res) => {
    // TODO: Run 3 parallel database queries
    // Show event loop managed them concurrently
});

app.post('/api/stress', async (req, res) => {
    // TODO: Execute N parallel queries
    // Test event loop under load
});
```

---

## Testing Checklist

- [ ] Server starts without errors
- [ ] `curl http://localhost:3000/health` returns 200
- [ ] `curl http://localhost:3000/metrics` returns all metrics
- [ ] Event loop lag displayed accurately
- [ ] Memory usage tracked correctly
- [ ] Database queries work
- [ ] Parallel queries faster than serial
- [ ] Response times calculated correctly
- [ ] Stress test completes without crashing
- [ ] Metrics update in real-time
- [ ] Alerts trigger at thresholds

---

## Bonus Features (If You Want Challenge)

1. **Add Redis Caching**
   - Cache metrics for 5 seconds
   - Reduce computational overhead

2. **Add WebSocket Real-time Updates**
   - Push metrics to browser in real-time
   - Update every 1 second

3. **Add Prometheus Metrics Export**
   - Expose metrics in Prometheus format
   - `GET /metrics/prometheus`

4. **Add Email Alerts**
   - Send email when critical alert triggered
   - Include stack trace and recommendations

5. **Add Database Query History**
   - Store last 100 queries
   - Show slowest queries
   - Show most frequent queries

6. **Add Performance Recommendations**
   - Analyze metrics
   - Suggest optimizations
   - Example: \"Consider parallel queries (save 200ms)\"

---

## Expected Performance

When complete, your dashboard should handle:

- **100 concurrent requests** without blocking
- **Event loop lag < 10ms** under normal load
- **Memory stable** (not growing)
- **Response times < 200ms** for most endpoints
- **Database pool efficiency** visible in metrics

---

## Hints and Tips

### Tip 1: Event Loop Measurement
```javascript
const { performance } = require('perf_hooks');
const start = performance.now();
setImmediate(() => {
    const lag = performance.now() - start;
    // This lag shows event loop delay
});
```

### Tip 2: Memory Usage
```javascript
const mem = process.memoryUsage();
const heapPercent = (mem.heapUsed / mem.heapTotal) * 100;
```

### Tip 3: Request Middleware
```javascript
app.use((req, res, next) => {
    const start = performance.now();
    const originalSend = res.send;
    
    res.send = function(data) {
        const duration = performance.now() - start;
        // Track duration
        return originalSend.call(this, data);
    };
    
    next();
});
```

### Tip 4: Parallel Database Queries
```javascript
const [result1, result2, result3] = await Promise.all([
    dbPool.query('SELECT 1'),
    dbPool.query('SELECT 2'),
    dbPool.query('SELECT 3')
]);
// All run in parallel!
```

---

## Expected File Structure When Complete

```
project/
├── package.json
├── server.js                 (Main entry point)
├── classes/
│   ├── EventLoopMonitor.js
│   ├── MemoryMonitor.js
│   ├── DatabasePool.js
│   └── RequestMetrics.js
├── middleware/
│   └── metricsMiddleware.js
├── routes/
│   ├── health.js
│   ├── metrics.js
│   └── api.js
└── utils/
    └── logger.js
```

---

## Success Criteria

Your solution is successful when:

✅ All 5+ endpoints respond correctly
✅ Metrics are accurate and update in real-time
✅ Event loop lag is measured and displayed
✅ Database pool works correctly
✅ Parallel queries are faster than serial
✅ Server handles 100+ concurrent requests
✅ No memory leaks detected
✅ Proper error handling throughout
✅ Code is clean and well-commented
✅ Can explain every line when asked

---

## How to Submit/Verify

1. **Run your server:**
   ```bash
   node server.js
   ```

2. **Test endpoints:**
   ```bash
   # Health check
   curl http://localhost:3000/health
   
   # Full metrics
   curl http://localhost:3000/metrics
   
   # Get user
   curl http://localhost:3000/api/users/1
   
   # Parallel queries
   curl http://localhost:3000/api/parallel
   
   # Stress test
   curl -X POST http://localhost:3000/api/stress \\
     -H \"Content-Type: application/json\" \\
     -d '{\"count\": 50}'
   ```

3. **Browser test:**
   - Open http://localhost:3000/metrics in browser
   - Verify pretty JSON display
   - Check metrics update every second

4. **Load test:**
   ```bash
   # Use Apache Bench
   ab -n 1000 -c 100 http://localhost:3000/metrics
   ```

---

## Real-World Application

This dashboard is used in production at companies like:
- Uber (monitoring thousands of services)
- Netflix (tracking millions of requests)
- Google Cloud (customer observability)
- Datadog (monitoring as a service)

What you build here is production-grade monitoring!

---

**Ready? Start with Step 1 and build one class at a time. Message me when complete! 🚀**
