# 🔥 EVENT LOOP INTERNALS (Node.js) - Production Level Guide

> **Senior Backend Engineer perspective** — 10+ years, scaling systems to millions of requests

---

# 📘 SECTION 1: CONCEPT EXPLANATION (Simple + Deep)

## 1.1 - Simple Explanation (Hinglish)

### **Event Loop kya hai?**

```
Event Loop = Ek machine jो JavaScript ko handle karta hai
Node.js single-threaded hai - ek time pe ek kaam
Par multiple tasks simultaneously (tarah) chalte hain dikhai dete hain

Iska magic: Event Loop = Task Scheduler
```

### **Real-World Analogy (Indian Context)**

**RTO (Motor Vehicle Department):**

```
RTO mein clerk baithta hai (single-threaded)
Queue mein 100 log hain (pending tasks)

1. License check (synchronous)
2. Waiting time (setTimeout - asynchronous)
3. Document verify (I/O operation - asynchronous)
4. Fee payment (Promise - asynchronous)

Clerk hर एक को quickly process karta hai
Ek task ke wait mein doosre nahi rukta
Intelligent scheduling se 100 log ka kam ek din mein ho jata hai!

Event Loop = Wo clerk ka brain (scheduling logic)
```

---

## 1.2 - Deep Explanation (Technical)

### **Event Loop Architecture (Node.js libuv)**

```
Node.js Event Loop: libuv library pe based (C library)

┌─────────────────────────────────────────────────────────────┐
│                    NODE.JS RUNTIME                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │ V8 Engine (JavaScript execution)                    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ libuv (Event Loop + Thread Pool + I/O)              │   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ THREAD POOL (Default: 4 threads)           │   │   │
│  │  │ - File operations                          │   │   │
│  │  │ - DNS lookups                              │   │   │
│  │  │ - Crypto operations                        │   │   │
│  │  │ - Compression (zlib)                       │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ EVENT LOOP (Single-threaded)                │   │   │
│  │  │ - Manages all async operations              │   │   │
│  │  │ - Executes callbacks                        │   │   │
│  │  │ - Coordinates with thread pool              │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### **Event Loop Phases (libuv - 6 phases)**

```javascript
/*
Event Loop ek CONTINUOUS CYCLE chalata hai
Har cycle ke phases hote hain

START OF CYCLE
    ↓
┌────────────────────────────────────────────────┐
│ Phase 1: TIMERS (setTimeout, setInterval)      │
│ Execute callbacks from timer queue               │
└────────────────────────────────────────────────┘
    ↓
┌────────────────────────────────────────────────┐
│ Phase 2: PENDING CALLBACKS                     │
│ Execute I/O callbacks (file read, network)      │
└────────────────────────────────────────────────┘
    ↓
┌────────────────────────────────────────────────┐
│ Phase 3: IDLE, PREPARE                         │
│ Internal use only                               │
└────────────────────────────────────────────────┘
    ↓
┌────────────────────────────────────────────────┐
│ Phase 4: POLL (Most Important)                 │
│ - Check for new I/O events                      │
│ - Wait if no events                             │
│ - Execute I/O callbacks                         │
└────────────────────────────────────────────────┘
    ↓
┌────────────────────────────────────────────────┐
│ Phase 5: CHECK (setImmediate)                  │
│ Execute setImmediate callbacks                  │
└────────────────────────────────────────────────┘
    ↓
┌────────────────────────────────────────────────┐
│ Phase 6: CLOSE CALLBACKS                       │
│ Close socket connections, cleanup               │
└────────────────────────────────────────────────┘
    ↓
NEXT CYCLE or EXIT if no pending tasks
*/
```

### **Important: Microtask Queue (Higher Priority)**

```
Event Loop ke BETWEEN phases, microtask queue execute hota hai

Microtask Queue (HIGH PRIORITY - empty hone tak):
┌──────────────────────────────────┐
│ 1. Promise callbacks (.then)      │
│ 2. process.nextTick()             │
│ 3. queueMicrotask()               │
│ 4. Mutation observers (Browser)   │
└──────────────────────────────────┘

Flow:
Phase 1 end → Microtask queue empty
Phase 2 end → Microtask queue empty
...और so on

Ye guarantee karta hai promises always setTimeout se pehle run hote hain!
```

### **Key Difference: Node.js vs Browser Event Loop**

```
BROWSER                          | NODE.JS
─────────────────────────────────┼─────────────────────────────────
Render phase after each phase    | No rendering
setTimeout minimum 4ms           | setTimeout 0 possible (depends)
requestAnimationFrame            | No requestAnimationFrame
Simpler 2-queue model            | Complex 6-phase model (libuv)
Single event loop                | Event loop + thread pool
```

---

# 🏭 SECTION 2: WHY THIS MATTERS IN REAL BACKEND SYSTEMS

## 2.1 - Production Problems It Solves

### **Problem 1: Blocking the Event Loop (Most Common)**

```javascript
❌ BAD - Blocks event loop for 5 seconds, all users affected:

app.get('/heavy-operation', (req, res) => {
    // Heavy CPU calculation - blocks everything!
    let sum = 0;
    for (let i = 0; i < 5000000000; i++) {
        sum += i;
    }
    res.json({ result: sum });
});

// During those 5 seconds:
// - Other users get NO response
// - Scheduled tasks delay
// - Database queries wait
// - YOUR SERVER BECOMES SLOW FOR EVERYONE
```

### **Problem 2: Not Understanding Async Properly**

```javascript
❌ BAD - Thinking file read is synchronous:

app.get('/data', (req, res) => {
    // This LOOKS synchronous but it's not!
    fs.readFile('data.txt', (err, data) => {
        if (err) {
            // Error handling late
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: data.toString() });
    });
    // Response goes here, but callback might not be called yet!
});
```

### **Problem 3: Memory Leaks from Promises**

```javascript
❌ BAD - Promises never resolve/reject:

app.get('/api', (req, res) => {
    new Promise((resolve) => {
        // Never called! Promise hangs
        // Memory: This promise stays in memory forever
    });
    res.json({ ok: true });
});

// After 1 million requests: Server crashes due to memory leak!
```

### **Problem 4: Database Queries Stalling**

```javascript
❌ BAD - Not understanding async waterfall:

app.get('/user/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    const posts = await Post.find({ userId: user.id });
    const comments = await Comment.find({ postId: posts[0].id });
    
    // Problem: Serial queries (slow!)
    // User query: 100ms
    // Posts query: 100ms  
    // Comments query: 100ms
    // Total: 300ms per request
    
    // With 100 concurrent users: System slows down
    
    res.json({ user, posts, comments });
});

✅ GOOD - Parallel queries:

app.get('/user/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    // Run in parallel if no dependency
    const [posts, comments] = await Promise.all([
        Post.find({ userId: user.id }),
        Comment.find({ userId: user.id })
    ]);
    
    // Total: 100ms (fastest) instead of 300ms
    
    res.json({ user, posts, comments });
});
```

---

## 2.2 - Where Event Loop Knowledge Is Used

### **1. Database Connection Pools**

```javascript
// Event loop + thread pool + connection pool = scalability

Pool manages N connections
Each request gets a connection from pool
After query completes, connection returns to pool

Without understanding event loop:
- Connection leak
- Thread pool exhaustion
- Deadlocks
```

### **2. Rate Limiting & Throttling**

```javascript
// Using event loop knowledge to throttle requests

const requests = {};

function rateLimit(req, res, next) {
    const ip = req.ip;
    const now = Date.now();
    
    if (!requests[ip]) {
        requests[ip] = [];
    }
    
    // Remove old requests (older than 1 minute)
    requests[ip] = requests[ip].filter(t => now - t < 60000);
    
    if (requests[ip].length > 100) {
        return res.status(429).json({ error: 'Too many requests' });
    }
    
    requests[ip].push(now);
    next();
}

// This works because event loop + async nature handles thousands of requests
```

### **3. WebSocket Broadcasting**

```javascript
// Multiple clients, one server, all connected via event loop

io.on('connection', (socket) => {
    socket.on('message', async (msg) => {
        // Event loop handles this asynchronously
        // Broadcasts to all clients WITHOUT blocking
        
        io.emit('message', {
            from: socket.id,
            text: msg,
            timestamp: Date.now()
        });
        
        // Save to database in background
        await Message.create({
            from: socket.id,
            text: msg,
            timestamp: Date.now()
        });
    });
});

// 10,000 simultaneous connections, all broadcasting
// Event loop + thread pool manages everything efficiently
```

### **4. Job Queues (Bull, RabbitMQ, Celery)**

```javascript
// Long-running tasks managed by event loop

// Don't do this:
app.post('/send-email', async (req, res) => {
    await sendBulkEmail(req.body.emails); // 30 seconds!
    res.json({ ok: true });
});

// Do this:
app.post('/send-email', async (req, res) => {
    // Add to queue - returns immediately
    await emailQueue.add({
        emails: req.body.emails,
        template: req.body.template
    });
    
    res.json({ queued: true });
});

// Background worker processes queue (event loop)
emailQueue.process(async (job) => {
    await sendBulkEmail(job.data.emails);
});
```

---

# 💻 SECTION 3: CODE IMPLEMENTATION (Step-by-Step)

## 3.1 - Understanding Event Loop Phases

### **Code 1: Demonstrate Event Loop Phases**

```javascript
// File: eventloop-phases.js

console.log('🟢 SCRIPT START');

// Phase 1: TIMERS
setTimeout(() => {
    console.log('🔵 PHASE 1: setTimeout (0ms)');
}, 0);

// Microtask: Promise
Promise.resolve()
    .then(() => {
        console.log('🟡 MICROTASK: Promise.then()');
    });

// Phase 5: CHECK
setImmediate(() => {
    console.log('🟣 PHASE 5: setImmediate()');
});

console.log('🟢 SCRIPT END');

/*
ACTUAL OUTPUT:
🟢 SCRIPT START
🟢 SCRIPT END
🟡 MICROTASK: Promise.then()
🔵 PHASE 1: setTimeout (0ms)
🟣 PHASE 5: setImmediate()

WHY?
1. Synchronous code first: "SCRIPT START" → "SCRIPT END"
2. All timers/immediate scheduled
3. Microtask queue runs (Promise)
4. Next cycle - Phase 1 TIMERS: setTimeout
5. Next cycle - Phase 5 CHECK: setImmediate

setTimeout > Promise > setImmediate
(Timer phase) (Microtask) (Check phase)
*/
```

### **Code 2: process.nextTick vs setImmediate**

```javascript
// File: nextTick-vs-immediate.js

console.log('Start');

setImmediate(() => {
    console.log('setImmediate 1');
});

process.nextTick(() => {
    console.log('process.nextTick 1');
});

Promise.resolve().then(() => {
    console.log('Promise.then 1');
});

setImmediate(() => {
    console.log('setImmediate 2');
});

process.nextTick(() => {
    console.log('process.nextTick 2');
});

console.log('End');

/*
OUTPUT:
Start
End
process.nextTick 1
process.nextTick 2
Promise.then 1
setImmediate 1
setImmediate 2

PRIORITY ORDER:
1. Synchronous code
2. process.nextTick() - even higher than Promise!
3. Microtasks (Promise, queueMicrotask)
4. Timers (setTimeout)
5. Check phase (setImmediate)
*/
```

## 3.2 - Real Production Code: Event Loop Management

### **Code 3: CPU-Heavy Task Without Blocking**

```javascript
// File: cpu-heavy-task.js

const { performance } = require('perf_hooks');

// ❌ BAD: Blocks event loop
async function heavyCalculationBad(n) {
    console.time('Heavy calculation');
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += i;
    }
    console.timeEnd('Heavy calculation');
    return sum;
}

// ✅ GOOD: Yields to event loop periodically
async function heavyCalculationGood(n, chunkSize = 1000000) {
    console.time('Heavy calculation');
    let sum = 0;
    let i = 0;
    
    while (i < n) {
        // Process chunk
        const end = Math.min(i + chunkSize, n);
        for (; i < end; i++) {
            sum += i;
        }
        
        // Yield to event loop - let other tasks run
        await new Promise(resolve => setImmediate(resolve));
    }
    
    console.timeEnd('Heavy calculation');
    return sum;
}

// Test
(async () => {
    const n = 100000000; // 100 million
    
    console.log('
--- BAD APPROACH (blocks) ---');
    await heavyCalculationBad(n);
    
    console.log('
--- GOOD APPROACH (yields control) ---');
    await heavyCalculationGood(n);
    
    console.log('
Notice: GOOD approach takes longer but doesn\'t block!');
})();
```

### **Code 4: Handling Multiple Async Operations Efficiently**

```javascript
// File: async-operations.js

const fs = require('fs').promises;

// ❌ BAD: Serial operations (slow)
async function readFilesBad(files) {
    const results = [];
    
    for (let file of files) {
        const data = await fs.readFile(file, 'utf8');
        results.push(data);
    }
    
    return results;
}
// Time: 4 × 100ms = 400ms (if each file takes 100ms)

// ✅ GOOD: Parallel operations (fast)
async function readFilesGood(files) {
    return Promise.all(
        files.map(file => fs.readFile(file, 'utf8'))
    );
}
// Time: 100ms (all files read simultaneously)

// Test
(async () => {
    const files = [
        'file1.txt',
        'file2.txt',
        'file3.txt',
        'file4.txt'
    ];
    
    console.time('Serial read');
    // await readFilesBad(files);
    console.timeEnd('Serial read');
    
    console.time('Parallel read');
    // await readFilesGood(files);
    console.timeEnd('Parallel read');
})();
```

---

# 🏢 SECTION 4: PROJECT-LEVEL EXAMPLE

## 4.1 - Production Server with Event Loop Management

### **Project Structure:**

```
backend-eventloop-project/
├── server.js                    (Main entry)
├── config/
│   └── database.js              (DB connection)
├── middleware/
│   ├── errorHandler.js
│   ├── requestLogger.js
│   └── eventLoopMonitor.js      (Monitor health)
├── routes/
│   ├── userRoutes.js
│   └── dataRoutes.js
├── services/
│   ├── userService.js           (Business logic)
│   ├── dataService.js
│   └── taskQueue.js             (Background jobs)
├── utils/
│   ├── asyncHelpers.js
│   └── performance.js
└── package.json
```

### **Files:**

**File: package.json**

```json
{
  "name": "backend-eventloop-production",
  "version": "1.0.0",
  "type": "commonjs",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "node test.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "dotenv": "^16.0.0"
  }
}
```

**File: config/database.js**

```javascript
// Simulated database connection pool
class DatabasePool {
    constructor(maxConnections = 10) {
        this.available = maxConnections;
        this.total = maxConnections;
        this.waiting = [];
    }
    
    async getConnection() {
        if (this.available > 0) {
            this.available--;
            return { id: Math.random() };
        }
        
        // Wait for available connection
        return new Promise((resolve) => {
            this.waiting.push(resolve);
        });
    }
    
    releaseConnection(conn) {
        this.available++;
        
        if (this.waiting.length > 0) {
            const resolve = this.waiting.shift();
            resolve(conn);
        }
    }
    
    getStats() {
        return {
            available: this.available,
            total: this.total,
            inUse: this.total - this.available,
            waiting: this.waiting.length
        };
    }
}

const dbPool = new DatabasePool(10);

module.exports = { dbPool };
```

**File: middleware/eventLoopMonitor.js**

```javascript
// Monitor event loop health
const { performance } = require('perf_hooks');

class EventLoopMonitor {
    constructor() {
        this.samples = [];
        this.maxSamples = 60;
    }
    
    startMonitoring() {
        setInterval(() => {
            const start = performance.now();
            
            // Measure event loop lag
            setImmediate(() => {
                const lag = performance.now() - start;
                this.samples.push({
                    timestamp: new Date(),
                    lag: lag,
                    memory: process.memoryUsage()
                });
                
                if (this.samples.length > this.maxSamples) {
                    this.samples.shift();
                }
                
                // Alert if lag > 100ms
                if (lag > 100) {
                    console.warn(`⚠️  Event loop lag: ${lag.toFixed(2)}ms`);
                }
            });
        }, 5000);
    }
    
    getMetrics() {
        const avgLag = this.samples.length > 0
            ? this.samples.reduce((sum, s) => sum + s.lag, 0) / this.samples.length
            : 0;
        
        return {
            averageLag: avgLag.toFixed(2) + 'ms',
            maxLag: Math.max(...this.samples.map(s => s.lag)).toFixed(2) + 'ms',
            samples: this.samples.length,
            memory: process.memoryUsage()
        };
    }
}

const monitor = new EventLoopMonitor();

module.exports = { monitor };
```

**File: services/taskQueue.js**

```javascript
// Background task queue using event loop

class TaskQueue {
    constructor(concurrency = 5) {
        this.tasks = [];
        this.running = 0;
        this.concurrency = concurrency;
    }
    
    async add(fn, context = null) {
        return new Promise((resolve, reject) => {
            this.tasks.push({ fn, context, resolve, reject });
            this.process();
        });
    }
    
    async process() {
        while (this.running < this.concurrency && this.tasks.length > 0) {
            this.running++;
            const { fn, context, resolve, reject } = this.tasks.shift();
            
            try {
                const result = await fn.call(context);
                resolve(result);
            } catch (error) {
                reject(error);
            } finally {
                this.running--;
                this.process(); // Process next task
            }
        }
    }
    
    getStats() {
        return {
            queued: this.tasks.length,
            running: this.running,
            concurrency: this.concurrency
        };
    }
}

const taskQueue = new TaskQueue(5);

module.exports = { taskQueue };
```

**File: server.js**

```javascript
const express = require('express');
const { dbPool } = require('./config/database');
const { monitor } = require('./middleware/eventLoopMonitor');
const { taskQueue } = require('./services/taskQueue');

const app = express();

// Start monitoring
monitor.startMonitoring();

// Middleware
app.use(express.json());

// Routes

// 1. Simple endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        eventLoop: monitor.getMetrics(),
        database: dbPool.getStats(),
        queue: taskQueue.getStats()
    });
});

// 2. Database query (with pool)
app.get('/api/user/:id', async (req, res) => {
    try {
        const conn = await dbPool.getConnection();
        
        // Simulate query
        await new Promise(resolve => setTimeout(resolve, 50));
        
        dbPool.releaseConnection(conn);
        
        res.json({
            id: req.params.id,
            name: 'Raj Kumar',
            email: 'raj@example.com'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Background task
app.post('/api/task', async (req, res) => {
    taskQueue.add(async () => {
        // Long-running task
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Task completed');
    });
    
    res.json({
        status: 'queued',
        queue: taskQueue.getStats()
    });
});

// 4. Parallel operations
app.get('/api/data', async (req, res) => {
    try {
        // All run in parallel (event loop handles)
        const [users, posts, comments] = await Promise.all([
            new Promise(r => setTimeout(() => r([1, 2, 3]), 100)),
            new Promise(r => setTimeout(() => r([4, 5, 6]), 100)),
            new Promise(r => setTimeout(() => r([7, 8, 9]), 100))
        ]);
        
        res.json({ users, posts, comments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('📊 Check health: http://localhost:3000/health');
});
```

---

# 🔥 SECTION 5: ADVANCED CONCEPTS

## 5.1 - libuv Thread Pool Deep Dive

```javascript
// Understanding thread pool behavior

const fs = require('fs');
const { performance } = require('perf_hooks');

// By default: 4 threads (can change with UV_THREADPOOL_SIZE=8)

async function demonstrateThreadPool() {
    console.log('Starting 10 file operations with 4 thread pool...
');
    
    const start = performance.now();
    
    const promises = [];
    for (let i = 0; i < 10; i++) {
        const p = new Promise((resolve) => {
            fs.readFile(__filename, (err, data) => {
                const elapsed = (performance.now() - start).toFixed(0);
                console.log(`✓ File ${i} read at ${elapsed}ms`);
                resolve();
            });
        });
        promises.push(p);
    }
    
    await Promise.all(promises);
    console.log(`
Total time: ${(performance.now() - start).toFixed(0)}ms`);
}

/*
OUTPUT (4 threads):
✓ File 0 read at 15ms  (Thread 1)
✓ File 1 read at 16ms  (Thread 2)
✓ File 2 read at 17ms  (Thread 3)
✓ File 3 read at 17ms  (Thread 4)
✓ File 4 read at 50ms  (Thread 1 available)
✓ File 5 read at 51ms  (Thread 2 available)
...

WITH 8 THREADS:
All 8 files read at 15ms (all parallel)
Files 9-10 at 50ms

Thread pool = Parallelism for I/O, not CPU!
*/
```

## 5.2 - CPU vs I/O Operations

```javascript
// Critical: Node.js excels at I/O, not CPU

// ✅ GOOD: I/O-heavy (network calls, file reads, DB queries)
async function ioHeavy() {
    const results = await Promise.all([
        fetch('https://api1.com'),
        fetch('https://api2.com'),
        fetch('https://api3.com'),
        fetch('https://api4.com')
    ]);
    return results;
}
// All run in parallel - Event loop magic!

// ❌ BAD: CPU-heavy (calculations, algorithms)
function cpuHeavy() {
    let result = 0;
    for (let i = 0; i < 10000000000; i++) {
        result += Math.sqrt(i);
    }
    return result;
}
// Blocks entire event loop! Use worker threads:

const { Worker } = require('worker_threads');

function cpuHeavyInWorker(n) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./cpu-worker.js');
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.postMessage(n);
    });
}
```

## 5.3 - Memory Leaks from Event Loop

```javascript
// Common pitfall: Promises that never resolve

// ❌ LEAK 1: Unresolved promises accumulate
setInterval(() => {
    new Promise((resolve) => {
        // Never called! Memory leak!
    });
}, 1000);

// After 1 million intervals, millions of pending promises = Memory crash

// ✅ FIX: Always resolve/reject
setInterval(() => {
    new Promise((resolve) => {
        setTimeout(() => resolve(), 1000);
    });
}, 1000);

// ❌ LEAK 2: Event listeners not removed
const emitter = new EventEmitter();

app.get('/api', (req, res) => {
    emitter.on('data', (data) => {
        res.json(data);
    });
    
    // Problem: Listener never removed!
    // Each request adds listener
});

// ✅ FIX: Remove listeners
app.get('/api', (req, res) => {
    const handler = (data) => {
        res.json(data);
        emitter.off('data', handler); // Remove!
    };
    
    emitter.on('data', handler);
});
```

---

# 🎓 SECTION 6: INTERVIEW PREPARATION

## Interview Questions (Hard Level)

### **Question 1: Event Loop Execution Order**

```javascript
// QUESTION:
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve()
    .then(() => {
        console.log('3');
        setTimeout(() => console.log('4'), 0);
    })
    .then(() => {
        console.log('5');
    });

console.log('6');

// What's the output order?
// Explain each step with event loop phases.

// ANSWER:
/*
Output:
1
6
3
5
2
4

Explanation:

Step 1: Synchronous code
- console.log('1') → output: 1
- setTimeout scheduled for TIMERS phase
- Promise scheduled for MICROTASK queue
- console.log('6') → output: 6

Step 2: Call stack empty, check MICROTASK queue
- Promise.then() runs → output: 3
- setTimeout inside then scheduled for TIMERS phase
- Next .then() scheduled in microtask
- All microtasks run before next phase

Step 3: Still in microtask queue
- Second .then() runs → output: 5

Step 4: Microtask queue empty, move to TIMERS phase
- First setTimeout runs → output: 2

Step 5: Back to microtask queue (empty)

Step 6: Next TIMERS phase
- Second setTimeout (inside first then) runs → output: 4

KEY POINTS:
✓ Microtasks (Promise) run BETWEEN phases
✓ Timers (setTimeout) run in Phase 1
✓ process.nextTick > Promise > setTimeout
*/
```

### **Question 2: Event Loop Blocking Detection**

```javascript
// QUESTION:
// You're given a Node.js server that's slow under load.
// Users complain about random delays.
// Explain how to detect if event loop is blocked.
// Write monitoring code.

// ANSWER:
const { performance } = require('perf_hooks');

function monitorEventLoopHealth() {
    let lastCheck = performance.now();
    
    setInterval(() => {
        const now = performance.now();
        const delay = now - lastCheck - 1000; // Should be 1000ms
        
        if (delay > 50) {
            console.warn(`⚠️  Event loop blocked for ${delay.toFixed(2)}ms`);
            console.log('Likely causes:');
            console.log('- Synchronous CPU operation');
            console.log('- Too many microtasks (promises)');
            console.log('- Memory pressure (GC pausing)');
        }
        
        lastCheck = performance.now();
    }, 1000);
}

// Production setup:
monitorEventLoopHealth();

// Monitor memory
setInterval(() => {
    const mem = process.memoryUsage();
    if (mem.heapUsed / mem.heapTotal > 0.9) {
        console.warn('⚠️  Heap usage > 90%');
    }
}, 5000);

// Track pending timers/promises
let promiseCount = 0;
const originalPromise = Promise.resolve;
Promise.resolve = function(...args) {
    promiseCount++;
    const p = originalPromise.apply(this, args);
    p.then(() => { promiseCount--; });
    return p;
};

setInterval(() => {
    if (promiseCount > 1000) {
        console.warn(`⚠️  High promise count: ${promiseCount}`);
    }
}, 5000);
```

### **Question 3: Optimize Slow API**

```javascript
// QUESTION:
// This API endpoint is slow (2 seconds per request).
// Explain event loop bottleneck and optimize.

// SLOW VERSION (500ms each):
app.get('/dashboard', async (req, res) => {
    const users = await db.query('SELECT * FROM users'); // 500ms
    const posts = await db.query('SELECT * FROM posts'); // 500ms
    const comments = await db.query('SELECT * FROM comments'); // 500ms
    
    res.json({ users, posts, comments });
});

// Event loop bottleneck: SERIAL queries
// Request timeline: 500ms + 500ms + 500ms = 1.5 seconds

// OPTIMIZED VERSION:
app.get('/dashboard', async (req, res) => {
    // Parallel queries
    const [users, posts, comments] = await Promise.all([
        db.query('SELECT * FROM users'),
        db.query('SELECT * FROM posts'),
        db.query('SELECT * FROM comments')
    ]);
    
    res.json({ users, posts, comments });
});

// Event loop: All 3 queries run in parallel
// Request timeline: 500ms (all together)
// Improvement: 3x faster!

// Even better: Cache + parallel + streaming:

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 });

app.get('/dashboard', async (req, res) => {
    // Check cache first
    const cached = cache.get('dashboard');
    if (cached) {
        return res.json(cached);
    }
    
    // Parallel queries
    const [users, posts, comments] = await Promise.all([
        db.query('SELECT * FROM users LIMIT 100'),
        db.query('SELECT * FROM posts LIMIT 100'),
        db.query('SELECT * FROM comments LIMIT 100')
    ]);
    
    const result = { users, posts, comments };
    cache.set('dashboard', result);
    
    res.json(result);
});

// Result: 500ms first time, 0ms for 5 minutes (cache)
```

### **Question 4: Promise vs Callback**

```javascript
// QUESTION:
// Why do Promises execute before setTimeout even though both are async?
// Explain using event loop phases.

// ANSWER:
setTimeout(() => {
    console.log('setTimeout');
}, 0);

Promise.resolve().then(() => {
    console.log('Promise');
});

// Output: Promise, then setTimeout

/*
Event Loop Order:
1. SYNCHRONOUS CODE
2. MICROTASKS (Promises, process.nextTick) ← Promise here
3. PHASE 1 TIMERS ← setTimeout here
4. PHASE 2-6 (other I/O)

setTimeout goes to TIMERS phase (Phase 1)
Promise goes to MICROTASKS (runs between all phases)

Microtasks always run before next phase!
So Promise executes first.

KEY: If you want setTimeout to run first, you need a macro-task trick:
setImmediate(() => {
    setTimeout(() => {
        console.log('setTimeout');
    }, 0);
});

Promise.resolve().then(() => {
    console.log('Promise');
});

// Output: Promise, setTimeout (Promise still first!)
// Because setImmediate is PHASE 5 (CHECK)
// And microtasks run BETWEEN phases
*/
```

### **Question 5: Worker Threads vs Event Loop**

```javascript
// QUESTION:
// When should you use Worker Threads instead of event loop?

// ANSWER:

// ✅ EVENT LOOP (I/O-bound):
app.get('/api/users', async (req, res) => {
    const users = await db.query('SELECT * FROM users'); // Network I/O
    res.json(users);
});
// Event loop excellent here - non-blocking

// ❌ EVENT LOOP (CPU-bound):
app.get('/calculate', (req, res) => {
    let result = 0;
    for (let i = 0; i < 10000000000; i++) {
        result += Math.sqrt(i); // Blocks all users!
    }
    res.json({ result });
});

// ✅ WORKER THREADS (CPU-bound):
const { Worker } = require('worker_threads');

app.get('/calculate', (req, res) => {
    const worker = new Worker('./heavy-calc.js');
    
    worker.on('message', (result) => {
        res.json({ result });
        worker.terminate();
    });
});

/*
EVENT LOOP best for:
- I/O operations (network, database, file)
- Event handling
- Request routing

WORKER THREADS best for:
- CPU-heavy calculations
- Image processing
- Data parsing
- Machine learning inference

Rule: If blocking event loop > 50ms, use worker threads!
*/
```

---

# 🚀 SECTION 7: PRODUCTION BEST PRACTICES

## 7.1 - Event Loop Health Checklist

```javascript
// ✅ DO:

// 1. Use async/await for all I/O
async function getData() {
    return await db.query('SELECT * FROM users');
}

// 2. Run DB queries in parallel
await Promise.all([
    db.query('SELECT * FROM users'),
    db.query('SELECT * FROM posts'),
    db.query('SELECT * FROM comments')
]);

// 3. Use connection pools
const pool = new Pool({ max: 20 }); // Not unlimited

// 4. Monitor event loop
const lag = measure(() => {
    setImmediate(resolve);
});
if (lag > 100) console.warn('Event loop lag!');

// 5. Implement rate limiting
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));

// 6. Use caching (Redis, in-memory)
const cache = new NodeCache();
const data = cache.get('key') || await fetchData();

// 7. Implement job queues for background tasks
await jobQueue.add({
    type: 'send-email',
    data: emailData
});

// ❌ DON'T:

// 1. Synchronous operations
fs.readFileSync('data.txt'); // BLOCKS!

// 2. Tight loops
for (let i = 0; i < 10000000000; i++) {
    sum += i; // BLOCKS!
}

// 3. Large nested promises
Promise.resolve()
    .then(() => Promise.resolve()
        .then(() => Promise.resolve()
            .then(() => { /* nested hell */ })
        )
    );

// 4. Creating unlimited connections
for (let i = 0; i < 10000; i++) {
    new Database().connect(); // Memory explosion!
}

// 5. Not handling rejections
new Promise((resolve, reject) => {
    reject(new Error('Oops'));
});
// UnhandledPromiseRejectionWarning!

// 6. Polling instead of events
setInterval(() => {
    checkForUpdates(); // CPU waste!
}, 1000);

// Better: Use event listeners, streams, webhooks
```

## 7.2 - Production Monitoring Code

```javascript
// File: monitoring/eventLoopMonitor.js

const { performance, PerformanceObserver } = require('perf_hooks');
const os = require('os');

class ProductionMonitor {
    constructor() {
        this.metrics = {
            eventLoopLag: [],
            memory: [],
            cpu: [],
            requests: 0
        };
    }
    
    startMonitoring() {
        // Monitor event loop lag
        this.monitorEventLoopLag();
        
        // Monitor memory
        this.monitorMemory();
        
        // Monitor CPU
        this.monitorCPU();
    }
    
    monitorEventLoopLag() {
        const start = performance.now();
        
        setImmediate(() => {
            const lag = performance.now() - start;
            this.metrics.eventLoopLag.push(lag);
            
            if (lag > 100) {
                console.error(`🔴 CRITICAL: Event loop lag ${lag.toFixed(2)}ms`);
                this.alertOps({
                    severity: 'critical',
                    message: `Event loop lag exceeded 100ms: ${lag.toFixed(2)}ms`
                });
            } else if (lag > 50) {
                console.warn(`🟡 WARNING: Event loop lag ${lag.toFixed(2)}ms`);
            }
            
            // Keep last 1000 samples
            if (this.metrics.eventLoopLag.length > 1000) {
                this.metrics.eventLoopLag.shift();
            }
        });
    }
    
    monitorMemory() {
        setInterval(() => {
            const mem = process.memoryUsage();
            const usage = (mem.heapUsed / mem.heapTotal) * 100;
            
            this.metrics.memory.push(usage);
            
            if (usage > 90) {
                console.error(`🔴 CRITICAL: Memory usage ${usage.toFixed(1)}%`);
                this.alertOps({
                    severity: 'critical',
                    message: `Memory usage exceeded 90%: ${usage.toFixed(1)}%`
                });
            } else if (usage > 80) {
                console.warn(`🟡 WARNING: Memory usage ${usage.toFixed(1)}%`);
            }
        }, 10000); // Every 10 seconds
    }
    
    monitorCPU() {
        const startUsage = process.cpuUsage();
        
        setInterval(() => {
            const endUsage = process.cpuUsage(startUsage);
            const cpuUser = endUsage.user / 1000000; // Convert to seconds
            
            if (cpuUser > 5) {
                console.warn(`🟡 WARNING: High CPU usage: ${cpuUser.toFixed(2)}s`);
            }
        }, 10000);
    }
    
    getMetrics() {
        const lagAvg = this.metrics.eventLoopLag.length > 0
            ? this.metrics.eventLoopLag.reduce((a, b) => a + b, 0) / this.metrics.eventLoopLag.length
            : 0;
        
        const memAvg = this.metrics.memory.length > 0
            ? this.metrics.memory.reduce((a, b) => a + b, 0) / this.metrics.memory.length
            : 0;
        
        return {
            eventLoop: {
                avgLag: lagAvg.toFixed(2) + 'ms',
                maxLag: Math.max(...this.metrics.eventLoopLag).toFixed(2) + 'ms'
            },
            memory: {
                avgUsage: memAvg.toFixed(1) + '%',
                current: process.memoryUsage()
            },
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        };
    }
    
    alertOps(alert) {
        // Send to monitoring service (Datadog, NewRelic, etc)
        console.log('📊 ALERT:', alert);
        // In production: send to external service
    }
}

const monitor = new ProductionMonitor();
module.exports = { monitor };
```

---

# 📝 SECTION 8: MINI TASK FOR YOU

## Task: Build a Production Event Loop Dashboard

### **Requirements:**

```javascript
/*
Build a real-time monitoring dashboard for Node.js event loop

Features needed:

1. Real-time metrics collection:
   - Event loop lag (ms)
   - Memory usage (%)
   - Active timers count
   - Pending promises count
   - Request queue length

2. HTTP endpoints:
   - GET /metrics → Return current metrics
   - GET /health → Health check
   - POST /test-stress → Generate load to test event loop
   - POST /clear-metrics → Reset metrics

3. Data storage:
   - Keep last 100 samples
   - Calculate averages, min, max

4. Alerts:
   - Warn if event loop lag > 50ms
   - Error if event loop lag > 100ms
   - Warn if memory > 80%
   - Error if memory > 90%

5. Express integration:
   - Middleware to track requests
   - Response time tracking
   - Request queuing metrics

Files to create:
- package.json
- server.js
- middleware/metrics.js
- services/eventLoopMonitor.js
- routes/metricsRoutes.js
- utils/logger.js

Expected output when running:
```

http://localhost:3000/metrics
```
{
  "eventLoop": {
    "current": "2.5ms",
    "average": "1.8ms",
    "max": "15.3ms",
    "samples": 50
  },
  "memory": {
    "usage": "45.2%",
    "heap": "48MB",
    "external": "2MB"
  },
  "requests": {
    "total": 1245,
    "active": 3,
    "queue": 0,
    "avgResponseTime": "125ms"
  },
  "alerts": [
    { "severity": "warning", "message": "Memory above 80%" }
  ]
}
```

### **Starter Code:**

```javascript
// server.js
const express = require('express');
const app = express();

// TODO: Implement your solution here

app.listen(3000, () => {
    console.log('🎯 Metrics dashboard at http://localhost:3000/metrics');
});

// middleware/metrics.js
// TODO: Create middleware to track:
// - Request start time
// - Response time
// - Memory at request start/end
// - Event loop lag during request

// services/eventLoopMonitor.js
// TODO: Create class to:
// - Measure event loop lag
// - Store samples
// - Calculate statistics
// - Generate alerts

// routes/metricsRoutes.js
// TODO: Create routes for /metrics, /health, etc
```

### **How to Approach:**

```
Step 1: Create basic Express server
Step 2: Add event loop monitoring (measure lag every 100ms)
Step 3: Add memory tracking
Step 4: Add request middleware
Step 5: Create /metrics endpoint to return all data
Step 6: Add alert generation logic
Step 7: Add stress test endpoint (/test-stress)
Step 8: Test with concurrent requests

Success criteria:
✓ Event loop lag measured accurately
✓ Memory usage tracked
✓ Response times calculated
✓ Alerts triggered when thresholds exceeded
✓ All endpoints return proper JSON
```

---

# 🎯 SUMMARY

## What You Learned:

✅ Event loop internals (6 phases in libuv)
✅ Microtask vs macrotask queues
✅ Priority order: Sync > nextTick > Promise > setTimeout > setImmediate
✅ Why Node.js excels at I/O (not CPU)
✅ Thread pool behavior (4 threads default)
✅ Real production monitoring
✅ Event loop bottlenecks and fixes
✅ Interview-level questions
✅ Production best practices

## Key Takeaways:

1. **Event loop enables async I/O** - Handle millions of connections simultaneously
2. **Understand phases** - setTimeout !== Promise execution order
3. **Monitor in production** - Event loop lag > 50ms = investigate
4. **Use promises correctly** - Parallel > Serial, always
5. **CPU-heavy work** - Use Worker Threads, not event loop
6. **Connection pooling** - Limit resource usage
7. **Error handling** - Always resolve/reject promises

---

**Next: Implement the mini task and come back with questions! 🚀**
