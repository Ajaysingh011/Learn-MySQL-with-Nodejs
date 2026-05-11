/**
 * CODE 2: Blocking Event Loop - Production Problem
 * 
 * Demonstrates what happens when event loop is blocked
 * and how it affects all users
 */

const http = require('http');
const { performance } = require('perf_hooks');

console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║   BLOCKING EVENT LOOP - PRODUCTION PROBLEM           ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

// ============================================
// EXAMPLE 1: BAD - Blocking calculation
// ============================================

const server = http.createServer(async (req, res) => {
    if (req.url === '/bad-calculation') {
        const start = performance.now();
        console.log(`\n[${new Date().toISOString()}] Request started`);
        
        // ❌ BAD: Synchronous heavy calculation
        let sum = 0;
        for (let i = 0; i < 1000000000; i++) {
            sum += i;
        }
        
        const duration = (performance.now() - start).toFixed(0);
        console.log(`[${new Date().toISOString()}] Request completed in ${duration}ms`);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ result: sum, duration: `${duration}ms` }));
    }
    
    // ============================================
    // EXAMPLE 2: GOOD - Non-blocking calculation
    // ============================================
    
    else if (req.url === '/good-calculation') {
        const start = performance.now();
        console.log(`\n[${new Date().toISOString()}] Request started (good version)`);
        
        // ✅ GOOD: Yield to event loop
        async function nonBlockingCalculation(max) {
            let sum = 0;
            let i = 0;
            const chunkSize = 100000000; // Process in chunks
            
            while (i < max) {
                const end = Math.min(i + chunkSize, max);
                
                for (; i < end; i++) {
                    sum += i;
                }
                
                // Yield to event loop - let other requests process
                await new Promise(resolve => setImmediate(resolve));
            }
            
            return sum;
        }
        
        try {
            const result = await nonBlockingCalculation(1000000000);
            const duration = (performance.now() - start).toFixed(0);
            
            console.log(`[${new Date().toISOString()}] Request completed in ${duration}ms`);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ result, duration: `${duration}ms` }));
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message }));
        }
    }
    
    // ============================================
    // EXAMPLE 3: Monitoring endpoint
    // ============================================
    
    else if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            timestamp: new Date().toISOString(),
            message: 'Try /bad-calculation vs /good-calculation'
        }));
    }
    
    else {
        res.writeHead(404);
        res.end('Not found');
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log('\n📊 TESTING EVENT LOOP BLOCKING:\n');
    console.log('1. In terminal 1: node this-file.js');
    console.log('2. In terminal 2: Run these commands:\n');
    console.log('   curl http://localhost:3001/health');
    console.log('   curl http://localhost:3001/bad-calculation');
    console.log('   (Make 2 requests quickly to see blocking)');
    console.log('\n   curl http://localhost:3001/good-calculation');
    console.log('   (Make 2 requests quickly - both process!)');
    console.log('\n🔍 OBSERVATION:');
    console.log('- BAD version: 2nd request waits for 1st to finish');
    console.log('- GOOD version: Both requests process (slower but concurrent)');
});

/*
EXPLANATION:

❌ BAD - Blocking:
Request 1: ████████████████████████████ 3 seconds (BLOCKS ALL)
Request 2: (waiting...) ████████████████████████████ 3 seconds

Total for 2 requests: 6 seconds (serial)
All other users affected: YES

✅ GOOD - Non-blocking:
Request 1: ████████████████████████████ 4 seconds (yields to event loop)
Request 2: ████████████████████████████ 4 seconds (can process!)

Total for 2 requests: 4 seconds (parallel)
All other users affected: NO

WHY?
- setImmediate() is in CHECK phase (Phase 5)
- After CHECK phase, event loop goes back to TIMERS
- Meanwhile, other requests can be processed in between

PRODUCTION IMPACT:
- If 1000 users send /bad-calculation
- All 1000 users wait 3+ seconds
- Server appears frozen
- Database connections pile up
- Memory pressure increases
- Users see timeouts

With /good-calculation:
- 1000 users get response in ~4 seconds each
- Event loop efficiently shares CPU time
- Server remains responsive
*/
