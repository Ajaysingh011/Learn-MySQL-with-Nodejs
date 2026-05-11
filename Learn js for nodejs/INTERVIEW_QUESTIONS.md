# 🎓 EVENT LOOP INTERNALS - INTERVIEW QUESTIONS (₹8 LPA+ Level)

> Senior Backend Engineer Interview Questions with Production Scenarios

---

## QUESTION 1: Event Loop Execution Order (Fundamental)

### The Question:

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve()
    .then(() => {
        console.log('3');
        setTimeout(() => console.log('4'), 0);
    })
    .then(() => console.log('5'));

setImmediate(() => console.log('6'));

console.log('7');

// What's the output order? Explain each step.
// Why does Promise execute before setTimeout?
```

### The Expected Answer:

```
Output:
1
7
3
5
2
6
4
```

### Detailed Explanation:

```javascript
/*
STEP 1: Synchronous execution
- console.log('1') → Output: 1
- setTimeout, Promise, setImmediate are SCHEDULED (not executed)
- console.log('7') → Output: 7
- Call stack is now empty

STEP 2: Event loop checks MICROTASK queue (highest priority)
- Promise.then() runs → Output: 3
  - setTimeout scheduled for TIMERS phase
  - Next Promise.then() scheduled for microtask
- Still in microtask queue: next .then() runs → Output: 5

STEP 3: Microtask queue empty, move to PHASE 1 (TIMERS)
- First setTimeout runs → Output: 2

STEP 4: Check microtask queue again (still empty)

STEP 5: Continue to PHASE 5 (CHECK)
- setImmediate runs → Output: 6

STEP 6: Check microtask queue (still empty)

STEP 7: Next cycle, PHASE 1 (TIMERS)
- Second setTimeout (scheduled inside first .then) → Output: 4

PRIORITY SUMMARY:
✓ Synchronous code first
✓ process.nextTick() (not shown but highest microtask)
✓ Promises (microtasks) - between ALL phases
✓ setTimeout (TIMERS phase)
✓ setImmediate (CHECK phase)

CRITICAL INSIGHT:
Microtasks run AFTER current phase but BEFORE next phase.
This is why Promise beats setTimeout every time!
*/
```

### Follow-up Question:

**\"What if we add process.nextTick?\"**

```javascript
console.log('1');

process.nextTick(() => console.log('2'));

Promise.resolve().then(() => console.log('3'));

setTimeout(() => console.log('4'), 0);

console.log('5');

// Output: 1, 5, 2, 3, 4
// Why? process.nextTick has HIGHEST microtask priority!
```

---

## QUESTION 2: Detecting Event Loop Blocking (Production Scenario)

### The Question:

```
You're debugging a production Node.js server. Users report random freezes
for 2-3 seconds. The server isn't crashing, but becomes unresponsive.

1. How do you identify if event loop is blocked?
2. Write code to monitor and alert.
3. What are the common causes?
4. How do you fix it?
```

### The Expected Answer:

#### 1. Detection Method:

```javascript
const { performance } = require('perf_hooks');

function monitorEventLoopLag() {
    const start = performance.now();
    
    // setImmediate executes in Phase 5 (CHECK)
    // If event loop is responsive, this should execute quickly
    setImmediate(() => {
        const lag = performance.now() - start;
        
        if (lag > 100) {
            console.error(`🔴 CRITICAL: Event loop blocked for ${lag.toFixed(2)}ms`);
            // Alert team, increase resources, etc
        } else if (lag > 50) {
            console.warn(`🟡 WARNING: Event loop lag ${lag.toFixed(2)}ms`);
        }
    });
}

// Run continuously
setInterval(monitorEventLoopLag, 1000);
```

#### 2. Complete Monitoring Solution:

```javascript
class EventLoopMonitor {
    constructor() {
        this.lag = 0;
        this.threshold = {
            warning: 50,
            critical: 100
        };
    }
    
    start() {
        setInterval(() => {
            const start = performance.now();
            
            setImmediate(() => {
                this.lag = performance.now() - start;
                this.checkHealth();
            });
        }, 1000);
    }
    
    checkHealth() {
        const memory = process.memoryUsage();
        const heapUsagePercent = (memory.heapUsed / memory.heapTotal) * 100;
        
        // Check event loop
        if (this.lag > this.threshold.critical) {
            this.alertCritical();
        } else if (this.lag > this.threshold.warning) {
            this.alertWarning();
        }
        
        // Check memory
        if (heapUsagePercent > 90) {
            this.alertMemory();
        }
    }
    
    alertCritical() {
        // Send to monitoring service (DataDog, New Relic, etc)
        console.error(`CRITICAL: Event loop lag ${this.lag.toFixed(2)}ms`);
        
        // Potential actions:
        // - Scale up instances
        // - Kill long-running operations
        // - Redirect traffic
        // - Restart process
    }
    
    alertWarning() {
        console.warn(`WARNING: Event loop lag ${this.lag.toFixed(2)}ms`);
        // Monitor closely, might get worse
    }
    
    alertMemory() {
        console.error('CRITICAL: Memory usage > 90%');
        // Likely to run out of memory soon
    }
}

const monitor = new EventLoopMonitor();
monitor.start();
```

#### 3. Common Causes:

```javascript
// CAUSE 1: Synchronous operations
❌ fs.readFileSync('large-file.json'); // Blocks for seconds
❌ for (let i = 0; i < 10000000000; i++) { sum += i; } // CPU-bound

// CAUSE 2: Unoptimized database queries
❌ app.get('/api/data', async (req, res) => {
    // Serial queries instead of parallel
    const users = await db.query('SELECT * FROM users'); // 100ms
    const posts = await db.query('SELECT * FROM posts'); // 100ms
    const comments = await db.query('SELECT * FROM comments'); // 100ms
    // Total: 300ms - but should be 100ms in parallel
    res.json({ users, posts, comments });
});

// CAUSE 3: Too many concurrent promises
❌ const promises = [];
for (let i = 0; i < 100000; i++) {
    promises.push(new Promise(r => setTimeout(r, 1000)));
}
await Promise.all(promises); // Microtask queue explodes

// CAUSE 4: Unbounded event listeners
❌ emitter.on('data', (data) => { /* never removed */ });
// After 10,000 requests: 10,000 listeners accumulate

// CAUSE 5: Memory pressure (Garbage Collection)
// Creating millions of objects → GC pauses event loop
```

#### 4. Solutions:

```javascript
// SOLUTION 1: Use async/await (non-blocking)
✅ const users = await db.query('SELECT * FROM users');

// SOLUTION 2: Parallel queries
✅ const [users, posts, comments] = await Promise.all([
    db.query('SELECT * FROM users'),
    db.query('SELECT * FROM posts'),
    db.query('SELECT * FROM comments')
]);

// SOLUTION 3: Yield to event loop
✅ async function nonBlockingLoop(max) {
    let sum = 0;
    let i = 0;
    while (i < max) {
        const end = Math.min(i + 1000000, max);
        for (; i < end; i++) {
            sum += i;
        }
        await new Promise(r => setImmediate(r)); // Yield control
    }
    return sum;
}

// SOLUTION 4: Use Worker Threads for CPU-heavy work
✅ const { Worker } = require('worker_threads');
const worker = new Worker('./heavy-calculation.js');
worker.on('message', (result) => {
    // CPU work done in parallel thread
});

// SOLUTION 5: Limit concurrent operations
✅ const pLimit = require('p-limit');
const limit = pLimit(5); // Max 5 concurrent
const promises = items.map((item, i) =>
    limit(() => processItem(item))
);
await Promise.all(promises);

// SOLUTION 6: Use connection pool
✅ const pool = new Pool({ max: 20 });
// Limits concurrent database connections
```

### Interview Tips:

✅ **Demonstrate knowledge of phases**: Show understanding of when microtasks vs macrotasks run
✅ **Provide production code**: Show real monitoring code, not just theory
✅ **Common pitfall**: Many developers don't know about microtask priority
✅ **Follow-up is crucial**: Show you can troubleshoot real issues

---

## QUESTION 3: Database Query Optimization (Advanced)

### The Question:

```
Your endpoint /api/dashboard takes 500ms per request.
With 100 concurrent users, the server becomes slow.

Current code:
```javascript
app.get('/api/dashboard', async (req, res) => {
    const user = await User.findById(req.params.id);      // 100ms
    const posts = await Post.find({ userId: user.id });   // 150ms
    const comments = await Comment.find({ userId: user.id }); // 150ms
    res.json({ user, posts, comments });
});
```

1. Why is it slow?
2. How do you optimize?
3. What's the event loop impact?
4. Write optimized code.
```

### The Expected Answer:

#### Analysis:

```
CURRENT (SERIAL):
Request 1: |===100ms===|===150ms===|===150ms===| = 400ms total
Request 2:          (waiting for post query)
Request 3:                   (waiting for comment query)
With 100 concurrent users: All pile up, server slows!

WHY:
- Queries run one after another (serial)
- Each request blocks others
- Event loop switches between requests but each takes 400ms
- Thread pool (if DB-backed): connections exhausted
```

#### Optimization Strategy:

```javascript
// STEP 1: Parallel independent queries
app.get('/api/dashboard', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        // Posts and comments don't depend on each other
        // Run them in parallel
        const [posts, comments] = await Promise.all([
            Post.find({ userId: user.id }),
            Comment.find({ userId: user.id })
        ]);
        
        res.json({ user, posts, comments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Time: max(100, 150, 150) = 150ms instead of 400ms
// Improvement: 2.6x faster!

// STEP 2: Add caching
const cache = new Map();

app.get('/api/dashboard', async (req, res) => {
    const cacheKey = `dashboard-${req.params.id}`;
    
    // Check cache first
    if (cache.has(cacheKey)) {
        return res.json(cache.get(cacheKey));
    }
    
    const user = await User.findById(req.params.id);
    const [posts, comments] = await Promise.all([
        Post.find({ userId: user.id }),
        Comment.find({ userId: user.id })
    ]);
    
    const result = { user, posts, comments };
    
    // Cache for 5 minutes
    cache.set(cacheKey, result);
    setTimeout(() => cache.delete(cacheKey), 300000);
    
    res.json(result);
});

// First request: 150ms
// Subsequent requests: <1ms from cache!

// STEP 3: Limit concurrent requests
const pLimit = require('p-limit');
const limit = pLimit(10); // Max 10 concurrent

app.get('/api/dashboard', async (req, res) => {
    try {
        const handler = async () => {
            const user = await User.findById(req.params.id);
            const [posts, comments] = await Promise.all([
                Post.find({ userId: user.id }),
                Comment.find({ userId: user.id })
            ]);
            return { user, posts, comments };
        };
        
        const result = await limit(handler);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Prevents request explosion, protects database pool
```

#### Event Loop Impact:

```
SERIAL (BAD):
- 100 concurrent requests
- Each waits for 400ms
- Total throughput: ~250 requests/second
- Event loop context-switches constantly
- Database connections exhausted
- Memory pressure increases

PARALLEL (GOOD):
- 100 concurrent requests
- Each waits for 150ms
- Total throughput: ~667 requests/second
- 2.6x improvement!
- Event loop processes more efficiently
- Database pool handles well

CACHED (BEST):
- Most requests from cache: <1ms
- Only new requests: 150ms
- Total throughput: >10,000 requests/second!
- Event loop barely loaded
- Perfect scalability
```

### Interview Tips:

✅ **Show you think about scale**: Mention concurrent users, throughput
✅ **Combine multiple techniques**: Cache + parallel + limiting
✅ **Give numbers**: \"2.6x faster\", \"667 req/s\" - concrete metrics
✅ **Consider bottlenecks**: Database connections, memory, thread pool

---

## QUESTION 4: Memory Leak Detection (Tricky)

### The Question:

```
Your server starts using 500MB RAM and increases by 10MB per hour.
After 24 hours: 740MB (almost at 1GB limit).
What's the problem? How do you find it?
```

### The Expected Answer:

#### Detection Code:

```javascript
const interval = setInterval(() => {
    const mem = process.memoryUsage();
    console.log({
        heapUsed: (mem.heapUsed / 1024 / 1024).toFixed(0) + 'MB',
        heapTotal: (mem.heapTotal / 1024 / 1024).toFixed(0) + 'MB',
        external: (mem.external / 1024 / 1024).toFixed(0) + 'MB',
        timestamp: new Date().toISOString()
    });
}, 60000); // Log every minute

// If heapUsed increases linearly: memory leak!
```

#### Common Memory Leaks:

```javascript
// LEAK 1: Accumulated array/object
❌ const cache = [];

app.get('/api', async (req, res) => {
    cache.push(req.body); // Keeps growing!
    // After 100,000 requests: cache = 100,000 objects
    res.json({ ok: true });
});

// FIX: Use LRU cache with size limit
✅ const LRU = require('lru-cache');
const cache = new LRU({ max: 1000 }); // Max 1000 items

// LEAK 2: Event listeners not removed
❌ const emitter = new EventEmitter();

router.get('/subscribe', (req, res) => {
    emitter.on('update', (data) => {
        res.json(data);
    });
    // If response never ends: listener stays forever!
});

// FIX: Remove listener when done
✅ router.get('/subscribe', (req, res) => {
    const handler = (data) => {
        res.json(data);
        emitter.off('update', handler); // Remove!
    };
    emitter.on('update', handler);
});

// LEAK 3: Timers/intervals not cleared
❌ setInterval(() => {
    // Process something
}, 5000);
// If process never stops: interval runs forever!

// FIX: Clear interval when done
✅ const intervalId = setInterval(() => {
    // ...
}, 5000);

process.on('SIGTERM', () => {
    clearInterval(intervalId); // Cleanup
    process.exit(0);
});

// LEAK 4: Unresolved promises
❌ new Promise((resolve) => {
    // Never resolved = promise stays in memory
});

// FIX: Always resolve or reject
✅ new Promise((resolve, reject) => {
    setTimeout(() => resolve('done'), 1000);
});
```

#### Debugging with Heap Snapshots:

```javascript
// Use Node.js built-in:
// node --inspect app.js
// Then open chrome://inspect in Chrome

// Or programmatically:
const heapdump = require('heapdump');

setInterval(() => {
    heapdump.writeSnapshot('./heap-' + Date.now() + '.heapsnapshot');
}, 600000); // Every 10 minutes

// Compare snapshots to find what's growing!
```

---

## QUESTION 5: Worker Threads vs Event Loop (Architecture)

### The Question:

```
When should you use Worker Threads instead of the event loop?
Give examples for both CPU-bound and I/O-bound tasks.
What are the tradeoffs?
```

### The Expected Answer:

```javascript
// EVENT LOOP (Best for I/O)
app.get('/api/users', async (req, res) => {
    const users = await db.query('SELECT * FROM users');
    res.json(users);
});
// Why: I/O operation (non-blocking)
// Event loop handles 1000s concurrently
// Perfect for this use case

// WORKER THREADS (Best for CPU)
app.post('/api/encrypt', (req, res) => {
    const worker = new Worker('./crypto-worker.js');
    
    worker.on('message', (result) => {
        res.json({ encrypted: result });
        worker.terminate();
    });
    
    worker.postMessage(req.body.data);
});
// Why: CPU-intensive (encryption)
// Event loop can't help here
// Worker thread runs on separate CPU core
// Event loop stays responsive!

// COMPARISON TABLE:

// EVENT LOOP
✓ I/O operations (network, database, file)
✓ Lightweight async tasks
✓ Scalable to 1000s concurrent
✓ Low memory overhead
✓ Simple to implement
✗ Bad for CPU-heavy work
✗ Blocks if CPU usage > 50ms

// WORKER THREADS
✓ CPU-intensive calculations
✓ Image processing
✓ Data parsing
✓ Machine learning inference
✗ Memory overhead (each thread = 30MB+)
✗ Higher latency (thread startup)
✗ Limited to CPU count
✗ Complex communication

// RULE:
if (operation takes > 50ms) {
    if (I/O operation) {
        use event loop + async/await;
    } else {
        use Worker Threads;
    }
}
```

---

# 🎯 Summary: What Interviewers Look For

## Core Concepts:

✅ **Event loop phases** - Know the 6 phases of libuv
✅ **Microtask priority** - process.nextTick > Promise > setTimeout
✅ **Blocking detection** - How to measure event loop lag
✅ **Optimization** - Parallel queries, caching, connection pools
✅ **Memory** - Identify and fix leaks
✅ **Architecture** - When to use event loop vs worker threads

## Red Flags (What NOT to Do):

❌ \"I don't know the difference between setTimeout and Promise\"
❌ \"Event loop? Never heard of it\"
❌ \"We don't monitor production servers\"
❌ \"If it's slow, just restart it\"
❌ \"We use synchronous operations\"
❌ \"I've never seen a memory leak\"

## Green Flags (What TO Do):

✅ \"I monitor event loop lag in production\"
✅ \"We run database queries in parallel\"
✅ \"We use connection pools and limit concurrency\"
✅ \"I know about microtask and macrotask queues\"
✅ \"We use Worker Threads for CPU-heavy work\"
✅ \"We cache aggressively\"

---

**Master these questions, and you're ready for ₹8 LPA+ backend positions! 🚀**
