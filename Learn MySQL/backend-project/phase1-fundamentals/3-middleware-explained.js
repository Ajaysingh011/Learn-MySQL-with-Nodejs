/**
 * PHASE 1: File 3 - Middleware Detailed Explanation
 *
 * Ye file sikhati hai:
 * ✅ Middleware kya hote hain
 * ✅ Middleware ka flow/order
 * ✅ next() function ki importance
 * ✅ Error-handling middleware
 * ✅ Real-world examples
 */

const express = require('express');
const app = express();

// ====== IMPORTANT: Middleware ke liye SOLID ======
// M = Modular (reusable)
// W = Wrapping (request ko wrap karta hai)
// A = All requests (har request se pehle chalta hai)
// R = Request processor (request process karta hai)
// E = End-to-end (start se end tak)

/**
 * ====================================
 * MIDDLEWARE ORDER MATTERS!
 * ====================================
 *
 * Flow:
 * Request ata → Middleware 1 → Middleware 2 → Route Handler → Response
 *
 * ⚠️ Agar middleware order galat, to unpredictable behavior hogi!
 */

// ====== MIDDLEWARE 1: Built-in Parser ======
// Ye PEHLE aana chahiye!
// JSON data ko parse karti hai
app.use(express.json());

console.log('[MIDDLEWARE 1] JSON Parser loaded');

// ====== MIDDLEWARE 2: Custom Logger ======
// Sab requests log karta hai
app.use((req, res, next) => {
  console.log(`
    ┌─────────────────────────────────────┐
    │ 📨 ${req.method} ${req.path}
    │ 🕐 ${new Date().toLocaleTimeString()}
    │ 👤 IP: ${req.ip}
    └─────────────────────────────────────┘
  `);

  // ⚠️ IMPORTANT: next() na likha to request hang ho jayega!
  next();
});

console.log('[MIDDLEWARE 2] Logger loaded');

// ====== MIDDLEWARE 3: Request Time Tracker ======
// Har request ke liye kitna time laga, ye measure karta hai
app.use((req, res, next) => {
  // Start time record karo
  const startTime = Date.now();

  // Response ko modify karo taaki timing track kar ske
  // res.on('finish') = response bhejne ke baad ye chalega
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`⏱️  Response time: ${duration}ms`);
  });

  next();
});

console.log('[MIDDLEWARE 3] Time Tracker loaded');

// ====== MIDDLEWARE 4: Authentication Middleware ======
// Kuch routes protected hai (token required)
const authMiddleware = (req, res, next) => {
  // Authorization header se token lao
  const token = req.headers.authorization;

  console.log('[AUTH] Checking token...');

  if (!token) {
    console.log('[AUTH] ❌ No token provided');
    return res.status(401).json({
      success: false,
      error: 'Authorization token required',
      hint: 'Add header: Authorization: Bearer <token>'
    });
  }

  // Token format: "Bearer xxxxx"
  const tokenValue = token.split(' ')[1];

  // Simple validation (real production mein JWT verify hota)
  if (tokenValue === 'valid-secret-token-123') {
    console.log('[AUTH] ✅ Token valid');
    next();
  } else {
    console.log('[AUTH] ❌ Token invalid');
    res.status(403).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

console.log('[MIDDLEWARE 4] Auth Middleware loaded');

// ====== MIDDLEWARE 5: Request Validation ======
// POST/PUT requests ko validate karta hai
const validateUserData = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required',
        received: req.body
      });
    }

    console.log('[VALIDATION] ✅ Data valid');
  }

  next();
};

// Specific routes mein validation apply karte hain
// app.post('/api/users', validateUserData, (req, res) => { ... });

console.log('[MIDDLEWARE 5] Validation Middleware loaded');

// ====================================
// ROUTES - Middleware ke baad likhe
// ====================================

// PUBLIC Route (No middleware required)
app.get('/api/public', (req, res) => {
  res.json({
    message: 'Ye public data hai, koi bhi dekh sakta hai',
    timestamp: new Date()
  });
});

// PROTECTED Route (Requires authentication)
// authMiddleware = ye middleware sirf is route mein chalega
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Ye secret data hai! 🔐',
    data: {
      userId: 1,
      secretKey: 'super-secret-value'
    }
  });
});

// POST with validation
app.post('/api/users', validateUserData, (req, res) => {
  const { name, email } = req.body;

  res.status(201).json({
    success: true,
    message: `User ${name} created successfully`,
    data: {
      id: 1,
      name: name,
      email: email
    }
  });
});

// ====================================
// MIDDLEWARE CHAINING EXAMPLE
// ====================================

// Multiple middleware ek saath use kar sakte hain
app.get('/api/admin', authMiddleware, (req, res, next) => {
  // Ye middleware chain hai:
  // authMiddleware → is function
  res.json({
    message: 'Admin panel',
    admin: true
  });
});

// ====================================
// ERROR HANDLING MIDDLEWARE
// ====================================

// 404 Handler - Jab koi route match nahi hota
// ⚠️ Ye SARE routes ke baad likha hona chahiye!
app.use((req, res) => {
  console.log(`[404] Route not found: ${req.method} ${req.path}`);

  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
    method: req.method,
    availableRoutes: [
      'GET /api/public',
      'GET /api/protected (requires token)',
      'POST /api/users',
      'GET /api/admin (requires token)'
    ]
  });
});

// Global Error Handler
// ⚠️ Sabse AAKHIR mein likha hona chahiye!
// Parameters: (error, req, res, next) - isme error pehle parameter hai
app.use((error, req, res, next) => {
  console.error(`[ERROR] ${error.message}`);

  res.status(500).json({
    success: false,
    error: 'Server error',
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

console.log('[MIDDLEWARE 6] Error Handlers loaded');

// ====================================
// REAL-WORLD MIDDLEWARE EXAMPLES
// ====================================

/**
 * Example 1: Rate Limiting Middleware
 * (Har user sirf X requests kar sakta hai)
 */
const requests = {}; // Simple counter

const rateLimitMiddleware = (req, res, next) => {
  const ip = req.ip;
  const limit = 10; // 10 requests per minute

  if (!requests[ip]) {
    requests[ip] = 0;
  }

  requests[ip]++;

  if (requests[ip] > limit) {
    return res.status(429).json({
      error: 'Too many requests. Try again later.'
    });
  }

  // Reset after 1 minute
  setTimeout(() => {
    requests[ip] = 0;
  }, 60000);

  next();
};

/**
 * Example 2: CORS Middleware
 * (Dusri domains se requests allow karna)
 */
const corsMiddleware = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
};

/**
 * Example 3: Request Body Size Limit
 */
app.use(express.json({ limit: '1mb' })); // 1MB se zyada body accept nahi

// ====================================
// Server Start
// ====================================

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`
    🚀 Server running on http://localhost:${PORT}

    📝 Routes:

    Public Routes (No token needed):
    • GET /api/public           - Public data

    Protected Routes (Token needed):
    • GET /api/protected        - Secret data
    • GET /api/admin            - Admin panel

    Data Creation:
    • POST /api/users           - Create user
      Header: Authorization: Bearer valid-secret-token-123
      Body: { "name": "...", "email": "..." }

    ⚙️  Middleware Order:
    1️⃣  JSON Parser
    2️⃣  Logger
    3️⃣  Time Tracker
    4️⃣  Auth Middleware (specific routes)
    5️⃣  Route Handlers
    6️⃣  404 Handler
    7️⃣  Error Handler

    🔑 Test Token: valid-secret-token-123
  `);
});

/**
 * ====== Testing ======
 *
 * 1. GET /api/public
 *    Response: Public data (no token)
 *
 * 2. GET /api/protected (without token)
 *    Response: 401 error (token required)
 *
 * 3. GET /api/protected
 *    Header: Authorization: Bearer valid-secret-token-123
 *    Response: Secret data
 *
 * 4. POST /api/users
 *    Body: { "name": "Raj", "email": "raj@gmail.com" }
 *    Response: User created
 *
 * 5. GET /api/invalid-route
 *    Response: 404 error (route not found)
 *
 * ⚠️ Middleware Sequence:
 * Request ata
 *   ↓
 * JSON Parser (parse body)
 *   ↓
 * Logger (log request)
 *   ↓
 * Time Tracker (start timing)
 *   ↓
 * Auth Middleware (if required)
 *   ↓
 * Route Handler (process request)
 *   ↓
 * Response send
 *   ↓
 * Time Tracker (log duration)
 */

module.exports = app;
