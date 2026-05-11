/**
 * CODE 4: Event Loop Pitfalls - Memory Leaks & Common Mistakes
 * 
 * Real production problems and how to fix them
 */

const EventEmitter = require('events');

console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║   EVENT LOOP PITFALLS & MEMORY LEAKS                ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

// ============================================
// PITFALL 1: Unresolved Promises (Memory Leak)
// ============================================

console.log('❌ PITFALL 1: Unresolved Promises\n');

function demonstrateLeak1() {
    console.log('Creating 5 unresolved promises...');
    let promiseCount = 0;
    
    for (let i = 0; i < 5; i++) {
        new Promise((resolve, reject) => {
            // PROBLEM: Never resolved or rejected!
            // Promise stays in memory forever
            console.log(`  Created promise ${i + 1} (will NEVER resolve)`);
            
            // In production, this happens thousands of times
            // Eventually: memory exhaustion, crashes
        });
    }
    
    console.log('\nThese promises will hang in memory until process exits.');
    console.log('With 1000s of unresolved promises: Out of memory!\n');
}

function fixLeak1() {
    console.log('✅ FIX 1: Always resolve or reject promises\n');
    console.log('Creating 5 properly resolved promises...');
    
    const promises = [];
    for (let i = 0; i < 5; i++) {
        const p = new Promise((resolve) => {
            setTimeout(() => {
                console.log(`  Promise ${i + 1} resolved properly`);
                resolve();
            }, 100 * (i + 1));
        });
        promises.push(p);
    }
    
    Promise.all(promises).then(() => {
        console.log('All promises cleaned up properly!\n');
    });
}

demonstrateLeak1();
setTimeout(() => fixLeak1(), 1000);

// ============================================
// PITFALL 2: Event Listeners Not Removed (Memory Leak)
// ============================================

setTimeout(() => {
    console.log('❌ PITFALL 2: Event Listeners Not Removed\n');
    
    const emitter = new EventEmitter();
    let listenerCount = 0;
    
    function demonstrateLeak2() {
        console.log('Simulating 5 requests that attach listeners...');
        
        for (let i = 0; i < 5; i++) {
            // PROBLEM: Listener never removed!
            emitter.on('data', (data) => {
                console.log(`  Request ${i + 1} received data`);
            });
            listenerCount++;
        }
        
        console.log(`Total listeners: ${listenerCount}`);
        console.log('Each request adds new listener without removing old ones.');
        console.log('In production with 10,000 requests: 10,000 listeners!\\n');
    }
    
    demonstrateLeak2();
    
    // ============================================
    // FIX 2: Remove Event Listeners
    // ============================================
    
    setTimeout(() => {
        console.log('✅ FIX 2: Remove event listeners after use\n');
        
        const emitter2 = new EventEmitter();
        let cleanListenerCount = 0;
        
        function fixLeak2() {
            console.log('Simulating 5 requests with proper cleanup...');
            
            for (let i = 0; i < 5; i++) {
                const handler = (data) => {
                    console.log(`  Request ${i + 1} received data`);
                    
                    // SOLUTION: Remove listener after handling
                    emitter2.off('data', handler);
                    console.log(`  Request ${i + 1} cleaned up listener`);
                };
                
                emitter2.on('data', handler);
                cleanListenerCount++;
            }
            
            // Emit once
            emitter2.emit('data', 'test');
            
            console.log(`\\nActive listeners after cleanup: ${emitter2.listenerCount('data')}`);
            console.log('Each request properly cleans up!\\n');
        }
        
        fixLeak2();
    }, 500);
}, 1500);

// ============================================
// PITFALL 3: Callbacks with Unhandled Errors
// ============================================

setTimeout(() => {
    console.log('❌ PITFALL 3: Unhandled Promise Rejections\n');
    
    function demonstrateLeak3() {
        // PROBLEM: Promise rejected but not handled
        new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Database connection failed'));
            }, 100);
        });
        // No .catch() = UnhandledPromiseRejectionWarning
        
        console.log('Promise created and rejected, but no error handler!');
        console.log('Node.js shows: \"UnhandledPromiseRejectionWarning\"\n');
    }
    
    demonstrateLeak3();
    
    // ============================================
    // FIX 3: Always Handle Rejections
    // ============================================
    
    setTimeout(() => {
        console.log('✅ FIX 3: Always handle promise rejections\n');
        
        function fixLeak3() {
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('Database connection failed'));
                }, 100);
            }).catch((error) => {\n                console.log(`  Caught error: ${error.message}`);\n                // Properly handled\n            });\n        }\n        \n        fixLeak3();\n        console.log('  Error handled gracefully!\\n');\n    }, 200);\n}, 3000);\n\n// ============================================\n// PITFALL 4: Tight Loops (Blocking Event Loop)\n// ============================================\n\nsetTimeout(() => {\n    console.log('❌ PITFALL 4: Tight Loops Block Event Loop\n');\n    \n    function demonstrateLeak4() {\n        console.log('Starting tight loop (blocks for 2 seconds)...');\n        const start = Date.now();\n        \n        // PROBLEM: Tight loop blocks everything\n        let sum = 0;\n        for (let i = 0; i < 5000000000; i++) {\n            sum += i;\n        }\n        \n        const duration = (Date.now() - start) / 1000;\n        console.log(`  Completed in ${duration.toFixed(1)}s`);\n        console.log('During this time: NO other operations possible!');\n        console.log('Users experience total freeze!\\n');\n    }\n    \n    demonstrateLeak4();\n    \n    // ============================================\n    // FIX 4: Yield to Event Loop\n    // ============================================\n    \n    setTimeout(() => {\n        console.log('✅ FIX 4: Yield to event loop periodically\n');\n        \n        async function fixLeak4() {\n            console.log('Starting non-blocking loop (yields control)...');\n            const start = Date.now();\n            \n            let sum = 0;\n            let i = 0;\n            const chunkSize = 1000000000;\n            \n            while (i < 5000000000) {\n                const end = Math.min(i + chunkSize, 5000000000);\n                for (; i < end; i++) {\n                    sum += i;\n                }\n                \n                // Yield to event loop\n                await new Promise(resolve => setImmediate(resolve));\n            }\n            \n            const duration = (Date.now() - start) / 1000;\n            console.log(`  Completed in ${duration.toFixed(1)}s`);\n            console.log('Event loop remained responsive throughout!\\n');\n        }\n        \n        fixLeak4();\n    }, 500);\n}, 5000);\n\n// ============================================\n// PITFALL 5: Callback Hell (Not a Memory Leak, but Horror)\n// ============================================\n\nsetTimeout(() => {\n    console.log('❌ PITFALL 5: Callback Hell (Hard to Debug)\n');\n    \n    function demonstrateLeak5() {\n        console.log('Callback pyramid of doom:');\n        console.log(`\nfs.readFile('file1', (err1, data1) => {\n    db.query('SELECT...', (err2, data2) => {\n        http.get('https://...', (res) => {\n            res.on('data', (chunk) => {\n                // HELP! 4 levels deep!\n                // Hard to handle errors\n                // Hard to refactor\n            });\n        });\n    });\n});\n`);\n        console.log('Problems:');\n        console.log('  - Error handling scattered');\n        console.log('  - Hard to read');\n        console.log('  - Hard to test');\n        console.log('  - Easy to make mistakes\\n');\n    }\n    \n    demonstrateLeak5();\n    \n    // ============================================\n    // FIX 5: Use Promises or Async/Await\n    // ============================================\n    \n    setTimeout(() => {\n        console.log('✅ FIX 5: Use async/await (Clean and Readable)\n');\n        \n        function fixLeak5() {\n            console.log(`async function getData() {\n    try {\n        const data1 = await fs.promises.readFile('file1');\n        const data2 = await db.query('SELECT...');\n        const res = await http.get('https://...');\n        \n        // Clean, linear flow!\n        return { data1, data2, res };\n    } catch (error) {\n        // All errors handled in ONE place\n        console.error('Error:', error.message);\n    }\n}\n`);\n            console.log('Benefits:');\n            console.log('  - Reads like synchronous code');\n            console.log('  - Error handling centralized');\n            console.log('  - Much easier to debug');\n            console.log('  - Preferred in modern Node.js\\n');\n        }\n        \n        fixLeak5();\n    }, 500);\n}, 7000);\n\n// ============================================\n// SUMMARY\n// ============================================\n\nsetTimeout(() => {\n    console.log('\\n╔══════════════════════════════════════════════════════╗');\n    console.log('║   SUMMARY - PREVENTION CHECKLIST                     ║');\n    console.log('╚══════════════════════════════════════════════════════╝\\n');\n    \n    console.log('✅ DO:');\n    console.log('  1. Always resolve or reject promises');\n    console.log('  2. Remove event listeners after use');\n    console.log('  3. Handle all promise rejections');\n    console.log('  4. Yield to event loop periodically');\n    console.log('  5. Use async/await instead of callbacks');\n    console.log('  6. Monitor event loop lag in production');\n    console.log('  7. Use connection pools');\n    console.log('  8. Run independent queries in parallel\\n');\n    \n    console.log('❌ DON\\'T:');\n    console.log('  1. Leave promises unresolved');\n    console.log('  2. Accumulate event listeners');\n    console.log('  3. Ignore promise rejections');\n    console.log('  4. Block event loop with tight loops');\n    console.log('  5. Use nested callbacks (callback hell)');\n    console.log('  6. Serial queries when parallel possible');\n    console.log('  7. Unlimited concurrent connections');\n    console.log('  8. Synchronous file/database operations\\n');\n}, 9000);\n