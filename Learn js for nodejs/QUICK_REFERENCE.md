# 📋 QUICK REFERENCE - Event Loop Internals

## Phases Order (Critical to Memorize)

```
EVERY EVENT LOOP CYCLE:

1. TIMERS          → setTimeout, setInterval
   ↓ (run microtasks)
2. PENDING         → I/O callbacks
   ↓ (run microtasks)
3. IDLE/PREPARE    → Internal only
   ↓ (run microtasks)
4. POLL            → Check for new I/O, wait if needed
   ↓ (run microtasks)
5. CHECK           → setImmediate
   ↓ (run microtasks)
6. CLOSE           → Connection cleanup
   ↓ (run microtasks)
   
GO BACK TO PHASE 1 (or exit if no pending callbacks)
```

## Execution Priority (Most Important)

```
┌─────────────────────────────────────────┐
│ 1. SYNCHRONOUS CODE (Immediate)        │ ← HIGHEST
├─────────────────────────────────────────┤
│ 2. process.nextTick()                   │
├─────────────────────────────────────────┤
│ 3. Promises (.then, .catch, .finally)   │
├─────────────────────────────────────────┤
│ 4. queueMicrotask()                     │
├─────────────────────────────────────────┤
│ 5. setTimeout, setInterval              │
├─────────────────────────────────────────┤
│ 6. setImmediate                         │
├─────────────────────────────────────────┤
│ 7. I/O callbacks                        │
├─────────────────────────────────────────┤
│ 8. UI events (browser only)             │
└─────────────────────────────────────────┘
              LOWEST
```

## Code Snippets You Should Know

### Measure Event Loop Lag
```javascript
const { performance } = require('perf_hooks');

function measureEventLoopLag() {
    const start = performance.now();
    setImmediate(() => {
        const lag = performance.now() - start;
        console.log(`Event loop lag: ${lag.toFixed(2)}ms`);
        if (lag > 50) console.warn('⚠️  High lag detected');
    });
}

// Run every second
setInterval(measureEventLoopLag, 1000);
```

### Yield to Event Loop
```javascript
// BAD: Blocks event loop
for (let i = 0; i < 10000000000; i++) {
    sum += i;
}

// GOOD: Yields control
async function nonBlocking() {
    let sum = 0;
    for (let i = 0; i < 10000000000; i++) {
        if (i % 1000000 === 0) {
            await new Promise(r => setImmediate(r));
        }
        sum += i;
    }
    return sum;
}
```

### Parallel Database Queries
```javascript
// SLOW: Serial (300ms)
const user = await db.query('SELECT * FROM users');
const posts = await db.query('SELECT * FROM posts');
const comments = await db.query('SELECT * FROM comments');

// FAST: Parallel (100ms)
const [user, posts, comments] = await Promise.all([
    db.query('SELECT * FROM users'),
    db.query('SELECT * FROM posts'),
    db.query('SELECT * FROM comments')
]);
```

### Connection Pool
```javascript
class Pool {
    constructor(max = 10) {
        this.available = Array(max).fill(0).map((_, i) => i);
        this.inUse = new Set();
        this.waiting = [];
    }
    
    async getConnection() {
        if (this.available.length > 0) {
            const conn = this.available.pop();
            this.inUse.add(conn);
            return conn;
        }
        return new Promise(r => this.waiting.push(r));
    }
    
    releaseConnection(conn) {
        this.inUse.delete(conn);
        if (this.waiting.length > 0) {
            const resolve = this.waiting.shift();
            resolve(conn);
        } else {
            this.available.push(conn);
        }
    }
}
```

### Memory Monitoring
```javascript
setInterval(() => {
    const mem = process.memoryUsage();
    const heapPercent = (mem.heapUsed / mem.heapTotal) * 100;
    
    console.log(`Heap: ${heapPercent.toFixed(1)}%`);
    
    if (heapPercent > 90) {
        console.error('🔴 CRITICAL: Memory > 90%');
    } else if (heapPercent > 80) {
        console.warn('🟡 WARNING: Memory > 80%');
    }
}, 10000);
```

### Request Metrics Middleware
```javascript
app.use((req, res, next) => {
    const start = performance.now();
    const originalSend = res.send;
    
    res.send = function(data) {
        const duration = performance.now() - start;
        console.log(`${req.method} ${req.path}: ${duration.toFixed(0)}ms`);
        return originalSend.call(this, data);
    };
    
    next();
});
```

## Common Mistakes

```javascript
// ❌ MISTAKE 1: Thinking promises are slower
setTimeout(() => console.log('A'), 0);
Promise.resolve().then(() => console.log('B'));
// Output: B, A (Promise first!)

// ❌ MISTAKE 2: Leaving promises unresolved
new Promise(() => {}); // Leaks memory!

// ❌ MISTAKE 3: Not removing event listeners
emitter.on('data', handler); // Never removes!

// ❌ MISTAKE 4: Serial queries
let result = await query1();
result += await query2();  // Wait for first to complete

// ✅ CORRECT: Parallel queries
const [a, b] = await Promise.all([query1(), query2()]);

// ❌ MISTAKE 5: Unlimited concurrent connections
for (let i = 0; i < 10000; i++) {
    new Database().connect(); // Exhausts resources!
}

// ✅ CORRECT: Use connection pool
const pool = new Pool({ max: 20 });
```

## Production Checklist

### Before Deploying:

- [ ] Event loop lag monitored
- [ ] Memory usage tracked
- [ ] Database pool configured
- [ ] Concurrent request limits set
- [ ] Error handling implemented
- [ ] Promises always resolve/reject
- [ ] Event listeners removed
- [ ] Timers cleared on shutdown
- [ ] Slow queries parallelized
- [ ] Caching implemented for frequent requests

### When Things Go Wrong:

1. **High event loop lag** → Use Worker Threads, parallelize queries, reduce CPU work
2. **Memory grows constantly** → Find memory leak (check: caches, listeners, promises)
3. **Database connection errors** → Increase pool size, implement circuit breaker
4. **Random timeouts** → Event loop blocked, profile with `--inspect`
5. **Server unresponsive** → Too many concurrent connections, add rate limiting

## Tools for Monitoring

```javascript
// Built-in Node.js
node --inspect app.js
// Open chrome://inspect in Chrome

// Heap dumps
const heapdump = require('heapdump');
heapdump.writeSnapshot();

// Profiling
node --prof app.js
node --prof-process isolate-*.log > profile.txt

// Real-time metrics
const { performance } = require('perf_hooks');
console.time('operation');
// ... code ...
console.timeEnd('operation');

// Production monitoring
// - DataDog
// - New Relic
// - Prometheus
// - CloudWatch (AWS)
// - Stackdriver (GCP)
```

## Interview Talking Points

**Question:** \"Explain the event loop\"

**Answer:** \"Node.js uses libuv for event loop. It has 6 phases - TIMERS, PENDING, IDLE/PREPARE, POLL, CHECK, and CLOSE. Between each phase, microtasks (promises, process.nextTick) run. This allows Node.js to handle thousands of concurrent I/O operations efficiently. Event loop can block if CPU work takes > 50ms, which affects all users.\"

**Question:** \"How do you monitor event loop?\"

**Answer:** \"I measure lag by seeing how long it takes for setImmediate to execute. Normal: < 5ms, Warning: > 50ms, Critical: > 100ms. If lag is high, I look for: synchronous operations, tight loops, unoptimized queries, or memory pressure.\"

**Question:** \"Why are your queries fast?\"

**Answer:** \"I run independent queries in parallel using Promise.all(). Serial queries: 300ms (100+100+100). Parallel: 100ms (max of 100, 100, 100). Plus I implement caching and connection pooling to reduce load.\"

**Question:** \"What about CPU-intensive work?\"

**Answer:** \"Event loop is single-threaded and not good for CPU. For CPU-heavy work (encryption, image processing, ML), I use Worker Threads which run on separate CPU cores without blocking the event loop.\"

## One-Line Takeaways

1. Event loop = scheduler that manages async work
2. Microtasks (promises) > macrotasks (setTimeout)
3. Parallel > serial for independent operations
4. Connection pools prevent resource exhaustion
5. Monitor event loop lag in production
6. Use Worker Threads for CPU work
7. Always handle promise rejections
8. Remove event listeners when done
9. Cache aggressively
10. Test under load before production

---

**Print this page and keep it handy during interviews! 📄**
