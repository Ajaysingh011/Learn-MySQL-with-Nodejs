/**
 * CODE 3: Production Server with Event Loop Monitoring
 * 
 * Real-world server implementation with:
 * - Event loop lag monitoring
 * - Memory tracking
 * - Request metrics
 * - Database pool management
 */

const http = require('http');
const { performance, PerformanceObserver } = require('perf_hooks');

console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║   PRODUCTION SERVER - EVENT LOOP MONITORING          ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

// ============================================
// DATABASE POOL (Simulated)
// ============================================

class DatabasePool {
    constructor(maxConnections = 10) {
        this.available = maxConnections;
        this.total = maxConnections;
        this.inUse = 0;
        this.waitingQueue = [];
        this.totalRequests = 0;
    }
    
    async getConnection() {
        if (this.available > 0) {
            this.available--;
            this.inUse++;
            return { id: Math.random() };
        }
        
        // Connection unavailable, queue the request
        return new Promise((resolve) => {
            this.waitingQueue.push(resolve);
        });
    }
    
    releaseConnection() {
        this.inUse--;
        this.available++;
        
        // Give connection to next waiting request
        if (this.waitingQueue.length > 0) {
            const resolve = this.waitingQueue.shift();
            resolve({ id: Math.random() });
        }
    }
    
    getStats() {
        return {
            available: this.available,
            inUse: this.inUse,
            total: this.total,
            waiting: this.waitingQueue.length,
            totalRequests: this.totalRequests
        };
    }
}

const dbPool = new DatabasePool(10);

// ============================================
// EVENT LOOP MONITOR
// ============================================

class EventLoopMonitor {
    constructor() {
        this.samples = [];
        this.maxSamples = 60;
        this.alerts = [];
    }
    
    startMonitoring() {
        // Measure event loop lag every 500ms
        setInterval(() => {
            const start = performance.now();
            
            setImmediate(() => {
                const lag = performance.now() - start;
                this.samples.push({
                    timestamp: new Date(),
                    lag: lag,
                    memory: process.memoryUsage().heapUsed / 1024 / 1024, // MB
                    dbPool: dbPool.getStats()
                });
                
                if (this.samples.length > this.maxSamples) {
                    this.samples.shift();
                }
                
                // Alert if lag is high
                if (lag > 100) {
                    this.addAlert('ERROR', `Event loop lag critical: ${lag.toFixed(2)}ms`);
                    console.error(`\n🔴 CRITICAL: Event loop lag ${lag.toFixed(2)}ms`);
                } else if (lag > 50) {
                    this.addAlert('WARNING', `Event loop lag high: ${lag.toFixed(2)}ms`);
                    console.warn(`🟡 WARNING: Event loop lag ${lag.toFixed(2)}ms`);
                }
            });
        }, 500);
    }
    
    addAlert(severity, message) {
        this.alerts.push({
            timestamp: new Date(),
            severity,
            message
        });
        
        // Keep last 10 alerts
        if (this.alerts.length > 10) {
            this.alerts.shift();
        }
    }
    
    getMetrics() {
        if (this.samples.length === 0) {
            return {
                avgLag: '0ms',
                maxLag: '0ms',
                memory: '0MB',
                samples: 0
            };
        }
        
        const lags = this.samples.map(s => s.lag);
        const avgLag = lags.reduce((a, b) => a + b, 0) / lags.length;
        const maxLag = Math.max(...lags);
        const memories = this.samples.map(s => s.memory);
        const avgMemory = memories.reduce((a, b) => a + b, 0) / memories.length;
        
        return {
            avgLag: avgLag.toFixed(2) + 'ms',
            maxLag: maxLag.toFixed(2) + 'ms',
            memory: avgMemory.toFixed(2) + 'MB',
            samples: this.samples.length,
            lastSample: {
                lag: lags[lags.length - 1].toFixed(2) + 'ms',
                memory: memories[memories.length - 1].toFixed(2) + 'MB'
            }
        };
    }
}

const monitor = new EventLoopMonitor();
monitor.startMonitoring();

// ============================================
// HTTP SERVER
// ============================================

const server = http.createServer(async (req, res) => {
    const startTime = performance.now();
    dbPool.totalRequests++;
    
    res.setHeader('Content-Type', 'application/json');
    
    try {
        if (req.url === '/health') {
            // Quick health check
            res.writeHead(200);
            res.end(JSON.stringify({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime().toFixed(1) + 's'
            }));
        }
        
        else if (req.url === '/metrics') {
            // Full metrics endpoint
            const responseTime = (performance.now() - startTime).toFixed(2);
            
            res.writeHead(200);
            res.end(JSON.stringify({
                eventLoop: monitor.getMetrics(),
                database: dbPool.getStats(),
                memory: {
                    heapUsed: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + 'MB',
                    heapTotal: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2) + 'MB'
                },
                responseTime: responseTime + 'ms',
                alerts: monitor.alerts.slice(-5) // Last 5 alerts
            }, null, 2));
        }
        
        else if (req.url === '/api/user') {
            // Simulate database query
            const conn = await dbPool.getConnection();
            
            try {
                // Simulate query execution
                await new Promise(resolve => {
                    setTimeout(resolve, Math.random() * 100 + 50); // 50-150ms
                });
                
                const responseTime = (performance.now() - startTime).toFixed(2);
                
                res.writeHead(200);
                res.end(JSON.stringify({
                    success: true,
                    data: {
                        id: 1,
                        name: 'Raj Kumar',
                        email: 'raj@example.com'
                    },
                    responseTime: responseTime + 'ms',
                    dbPoolStats: dbPool.getStats()
                }));
            } finally {
                dbPool.releaseConnection();
            }
        }
        
        else if (req.url === '/api/parallel-queries') {
            // Multiple parallel database queries
            const start = performance.now();
            
            const [users, posts, comments] = await Promise.all([
                new Promise(async resolve => {
                    const conn = await dbPool.getConnection();
                    setTimeout(() => {
                        dbPool.releaseConnection();
                        resolve('users');
                    }, 100);
                }),
                new Promise(async resolve => {
                    const conn = await dbPool.getConnection();
                    setTimeout(() => {
                        dbPool.releaseConnection();
                        resolve('posts');
                    }, 80);
                }),
                new Promise(async resolve => {
                    const conn = await dbPool.getConnection();
                    setTimeout(() => {
                        dbPool.releaseConnection();
                        resolve('comments');
                    }, 120);
                })
            ]);
            
            const totalTime = (performance.now() - start).toFixed(0);
            
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                data: { users, posts, comments },
                totalTime: totalTime + 'ms',
                note: 'Parallel queries should complete in ~120ms (max of individual), not 300ms (sum)'
            }));
        }
        
        else if (req.url === '/api/stress-test') {
            // Stress test - create many promises
            const promises = [];
            for (let i = 0; i < 100; i++) {
                promises.push(
                    new Promise(resolve => {
                        setTimeout(() => resolve(i), Math.random() * 50);
                    })
                );
            }
            
            const start = performance.now();
            await Promise.all(promises);
            const duration = (performance.now() - start).toFixed(0);
            
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                message: `Completed 100 parallel promises in ${duration}ms`,
                duration: duration + 'ms',
                eventLoopMetrics: monitor.getMetrics()
            }));
        }
        
        else {
            res.writeHead(404);
            res.end(JSON.stringify({
                error: 'Not found',
                availableEndpoints: [\n                    '/health - Quick health check',
                    '/metrics - Full metrics and monitoring data',
                    '/api/user - Single database query',
                    '/api/parallel-queries - Multiple parallel queries',
                    '/api/stress-test - Load test with 100 promises'
                ]
            }));
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.writeHead(500);
        res.end(JSON.stringify({
            error: error.message,
            timestamp: new Date().toISOString()
        }));
    }
});

const PORT = 3002;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}\n`);
    console.log('📊 MONITORING ENDPOINTS:\n');
    console.log(`  Health:    curl http://localhost:${PORT}/health`);
    console.log(`  Metrics:   curl http://localhost:${PORT}/metrics`);
    console.log(`  User API:  curl http://localhost:${PORT}/api/user`);
    console.log(`  Parallel:  curl http://localhost:${PORT}/api/parallel-queries`);
    console.log(`  Stress:    curl http://localhost:${PORT}/api/stress-test`);
    console.log('\n💡 TIP: Open http://localhost:' + PORT + '/metrics in browser for pretty JSON\n');
});

/*
WHAT THIS DEMONSTRATES:

1. EVENT LOOP MONITORING:
   - Measures lag every 500ms
   - Alerts when lag > 50ms (warning) or > 100ms (critical)
   - Tracks trends over time

2. DATABASE POOL:
   - Limits concurrent connections (prevents resource exhaustion)
   - Queues waiting requests
   - Shows stats (available, inUse, waiting)

3. PARALLEL vs SERIAL:
   - /api/parallel-queries runs 3 queries in parallel
   - Total time: ~120ms (max of 100, 80, 120)
   - Serial would be: 300ms (100 + 80 + 120)
   - Shows 2.5x speedup!

4. STRESS TESTING:
   - 100 promises created and resolved
   - Event loop manages all without blocking
   - Metrics show system health

PRODUCTION LESSONS:
✓ Always monitor event loop lag
✓ Use connection pools to prevent resource exhaustion
✓ Run independent queries in parallel
✓ Track metrics over time to detect trends
✓ Alert when thresholds exceeded
*/
