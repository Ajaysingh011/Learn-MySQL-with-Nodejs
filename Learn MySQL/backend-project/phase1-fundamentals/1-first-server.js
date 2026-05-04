/**
 * PHASE 1: File 1 - First Node.js Server
 *
 * Ye file sikhati hai:
 * ✅ Node.js server banana
 * ✅ Express setup karna
 * ✅ Basic routing
 * ✅ Server ko port par listen karna
 */

// ====== Step 1: Express import ======
// require() = Node.js ka built-in function jo packages load karta hai
const express = require('express');

// ====== Step 2: Express app create ======
// express() = ek function jo server object return karta hai
// app = server object jo routes aur requests handle karega
const app = express();

// ====== Step 3: Middleware setup ======
// JSON data ko parse karne ke liye
// Iska matlab: POST/PUT request mein jo JSON ata, usko JavaScript object mein convert karega
app.use(express.json());

// ====== Step 4: Port define ======
// Port = ek unique number jis par server request sunenge
// Port 3000 = http://localhost:3000
// Ports 1-1024 = System ports (admin permission chahiye)
// Ports 1024+ = User ports (safe)
const PORT = 3000;

// ====== Step 5: Simple GET route ======
// Route = URL path aur uske liye handler function
// GET = HTTP method (data sirf lena, nahi dena)
// '/' = root path (http://localhost:3000/)
app.get('/', (req, res) => {
  // req = Request object (client se data)
  // res = Response object (client ko reply dena)

  // res.send() = client ko text/HTML send karna
  res.send('Namaste! Ye mera first server hai! 🚀');
});

// ====== Step 6: JSON response ======
// /api/hello par request aaye to JSON respond dena
app.get('/api/hello', (req, res) => {
  // res.json() = JSON format mein data send karna
  res.json({
    message: 'Hello World!',
    timestamp: new Date(),
    status: 'success'
  });
});

// ====== Step 7: Dynamic route ======
// :name = URL parameter (dynamic value)
// URL: /greet/Raj → req.params.name = "Raj"
app.get('/greet/:name', (req, res) => {
  // req.params = URL mein jo variables hain
  const name = req.params.name;

  res.json({
    message: `Namaste ${name}!`,
    greeting: `Welcome to our server, ${name}.`
  });
});

// ====== Step 8: Server listen ======
// app.listen() = server ko start karna
// PORT = kis port par listen karega
// Callback function = server start hone par ye function chalega
app.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════════╗
    ║  🚀 Server successfully running!       ║
    ║  📍 http://localhost:${PORT}               ║
    ║  🔗 Routes:                            ║
    ║     GET http://localhost:${PORT}/              ║
    ║     GET http://localhost:${PORT}/api/hello    ║
    ║     GET http://localhost:${PORT}/greet/:name ║
    ╚════════════════════════════════════════╝
  `);
});

// ====== ERROR HANDLING ======
// 404 handler - jab koi route match nahi hota
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

/**
 * ====== Testing ======
 *
 * Terminal mein chalao:
 * node 1-first-server.js
 *
 * Browser mein jao:
 * http://localhost:3000/
 * http://localhost:3000/api/hello
 * http://localhost:3000/greet/Raj
 *
 * Real-world server analogy:
 * =============================
 * Express = Restaurant
 * app = Manager
 * Routes = Menu items
 * Requests = Customer orders
 * Response = Food service
 *
 * Customer: "Mujhe chai do" (Request)
 * ↓
 * Manager check: "Ye order hamara menu mein hai?" (Route matching)
 * ↓
 * Kitchen: Chai banate hain (Processing)
 * ↓
 * Manager: Chai table mein rakhte hain (Response)
 */
