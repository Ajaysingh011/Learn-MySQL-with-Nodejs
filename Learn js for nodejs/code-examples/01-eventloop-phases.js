/**
 * CODE 1: Understanding Event Loop Phases
 * 
 * This demonstrates the 6 phases of libuv event loop
 * and how microtasks have higher priority
 */

console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║   EVENT LOOP PHASES DEMONSTRATION                   ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

console.log('🟢 PHASE 0: Synchronous code execution');
console.log('SCRIPT START');

// Phase 1: TIMERS (setTimeout, setInterval)
setTimeout(() => {
    console.log('🔵 PHASE 1 (TIMERS): setTimeout callback');
}, 0);

// Microtask Queue (HIGH PRIORITY - runs between phases)
Promise.resolve()
    .then(() => {
        console.log('🟡 MICROTASK: Promise.then() - HIGH PRIORITY');
    });

// process.nextTick() - Even higher priority than promises!
process.nextTick(() => {
    console.log('⚪ MICROTASK (HIGHEST): process.nextTick()');
});

// Phase 5: CHECK (setImmediate)
setImmediate(() => {
    console.log('🟣 PHASE 5 (CHECK): setImmediate callback');
});

console.log('SCRIPT END\n');

/*
ACTUAL OUTPUT:
🟢 PHASE 0: Synchronous code execution
SCRIPT START
SCRIPT END
⚪ MICROTASK (HIGHEST): process.nextTick()
🟡 MICROTASK: Promise.then() - HIGH PRIORITY
🔵 PHASE 1 (TIMERS): setTimeout callback
🟣 PHASE 5 (CHECK): setImmediate callback

EXPLANATION:
1. Synchronous code runs first → SCRIPT START, SCRIPT END
2. All callbacks are scheduled but not executed yet
3. Call stack is empty → Event loop checks for next tasks
4. MICROTASK QUEUE runs (process.nextTick, Promises)
   - process.nextTick() has HIGHEST priority
   - Promises (microtasks) run next
5. PHASE 1 (TIMERS) runs → setTimeout
6. PHASE 5 (CHECK) runs → setImmediate

PRIORITY ORDER:
  1. Synchronous code
  2. process.nextTick() - HIGHEST microtask priority
  3. Promises, queueMicrotask() - High priority
  4. setTimeout, setInterval - Timer phase
  5. setImmediate - Check phase
  6. I/O callbacks - Pending callbacks phase
*/

// ============================================
console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║   ADVANCED: Multiple Phases Interaction              ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

// Demonstrate how microtasks run between EVERY phase

console.log('Starting advanced demonstration...\n');

setImmediate(() => {
    console.log('1️⃣  setImmediate Phase');
    
    Promise.resolve().then(() => {
        console.log('   ↳ Microtask between phases');
    });
    
    setTimeout(() => {
        console.log('2️⃣  Next setTimeout Phase');
    }, 0);
});

Promise.resolve().then(() => {
    console.log('Initial Microtask');
});

/*
OUTPUT:
Initial Microtask
1️⃣  setImmediate Phase
   ↳ Microtask between phases
2️⃣  Next setTimeout Phase

KEY INSIGHT:
- After setImmediate phase, microtasks run again!
- Microtasks run BETWEEN every phase
- This ensures consistent behavior for Promises
*/
