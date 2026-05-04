# Phase 1: Fundamentals - Complete Explanation

## What Sikhenge Is Phase Mein?

Phase 1 mein tum sikhoge:
1. **Node.js kya hai** aur kaise setup karte hain
2. **Express.js** ke saath pehla server banana
3. **HTTP Methods** (GET, POST, PUT, DELETE)
4. **Routes** aur **Middleware**
5. **Request-Response cycle** samjhna
6. **Error handling** basics

---

## File Structure

```
phase1-fundamentals/
├── 1-first-server.js          ✅ Pehla server
├── 2-routes-and-methods.js    ✅ HTTP methods ka use
├── 3-middleware-explained.js  ✅ Middleware flow
├── 4-request-response.js      ✅ req aur res objects
├── 5-error-handling.js        ✅ Error handling
├── package.json               ✅ Project dependencies
└── PHASE1_EXPLANATION.md      ✅ Ye file (explanation)
```

---

## Detailed Explanation - Line by Line

### File 1: first-server.js

**Kya karte hain:**
- Node.js se express import karte hain
- Ek simple server banate hain
- Server port 3000 par listen karta hai
- Client ko response bhejte hain

**Real-world analogy:**
```
Restaurant = Node.js Server
Manager = Express
Customer = Mobile App
Request = "5 chai do"
Response = "5 chai ready hai"
```

**Steps:**

```javascript
// Step 1: Express import
const express = require('express');
// Ye line Node.js mein express library ko load karti hai
// require() = iska matlab "ye package use kro"

// Step 2: App banao
const app = express();
// app = ek object jo Express server control karta hai

// Step 3: Route banao
app.get('/', (req, res) => {
  // req = request object (client se data)
  // res = response object (client ko data)
  res.send('Namaste! Server running!');
});

// Step 4: Server listen karao
app.listen(3000, () => {
  console.log('Server on port 3000');
});
```

**Kab Run Karey:**
```powershell
node 1-first-server.js
# Browser mein: http://localhost:3000
```

---

### File 2: routes-and-methods.js

**Kya karte hain:**
- Different HTTP methods use karte hain
- Different routes banate hain
- Har route ke liye different logic

**Example - Instagram-like:**
```
GET /api/posts       → Timeline dekho
POST /api/posts      → Post upload karo
PUT /api/posts/1     → Post edit karo
DELETE /api/posts/1  → Post delete karo
```

**Code Explanation:**

```javascript
// ====== GET: Data request karna ======
app.get('/api/users', (req, res) => {
  // User ko users list bhejo
  res.json({
    users: [
      { id: 1, name: 'Raj' },
      { id: 2, name: 'Priya' }
    ]
  });
});

// ====== POST: Naya data create karna ======
app.post('/api/users', (req, res) => {
  // req.body = client ne jo data bheja (JSON format)
  const { name } = req.body;
  
  res.status(201).json({
    success: true,
    message: `${name} user created!`
  });
});

// ====== PUT: Data update karna ======
app.put('/api/users/:id', (req, res) => {
  // :id = dynamic parameter
  const userId = req.params.id;
  const { name } = req.body;
  
  res.json({
    success: true,
    message: `User ${userId} updated to ${name}`
  });
});

// ====== DELETE: Data delete karna ======
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  
  res.json({
    success: true,
    message: `User ${userId} deleted`
  });
});
```

**Key Points:**

| Method | Purpose | Body | Example |
|--------|---------|------|---------|
| GET | Read data | ❌ | /api/users |
| POST | Create data | ✅ | /api/users (+ {name, email}) |
| PUT | Update completely | ✅ | /api/users/1 (+ new data) |
| DELETE | Remove data | ❌ | /api/users/1 |

---

### File 3: middleware-explained.js

**Middleware Kya Hai?**

Middleware = Request ke beech mein function jो data process kare

**Flow:**
```
Request ata → Middleware 1 → Middleware 2 → Route Handler → Response
```

**Real-world:**
```
Airport:
Passenger (Request)
  ↓
Security Check (Middleware 1)
  ↓
Passport Check (Middleware 2)
  ↓
Board Flight (Route Handler)
  ↓
Passenger on Flight (Response)
```

**Code Explanation:**

```javascript
const express = require('express');
const app = express();

// ====== MIDDLEWARE 1: JSON Parser ======
app.use(express.json());
// Ye middleware POST data ko automatically parse karti hai
// Iska matlab: JSON string → JavaScript object

// ====== MIDDLEWARE 2: Logger ======
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  // Ye sab requests log karti hai
  
  next(); // ⚠️ Important! Ye bolna zaroori hai:
          // "Ab next middleware/route ko chala"
          // Agar next() nahi likha, request hang ho jayega!
});

// ====== MIDDLEWARE 3: Authentication ======
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
    // return = aage ke code nahi chalega
  }
  
  if (token === 'valid-token') {
    next(); // ✅ Token valid, aage badhao
  } else {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// ====== Route - Middleware ke saath ======
app.get('/public', (req, res) => {
  // Ye public route hai, koi bhi access kar sakta hai
  res.json({ message: 'Public data' });
});

app.get('/protected', authMiddleware, (req, res) => {
  // Ye protected route hai
  // Pehle authMiddleware chalega, phir ye function
  res.json({ message: 'Private data' });
});

// ====== MIDDLEWARE 4: Error Handler ======
app.use((error, req, res, next) => {
  // Ye sirf error catch karta hai
  console.error(error);
  res.status(500).json({ error: 'Server error' });
});

app.listen(3000);
```

**Middleware Order Matters!**

```javascript
// ❌ Wrong Order:
app.get('/users', authMiddleware, (req, res) => { });
app.use(express.json()); // Ye baad mein ata hai

// ✅ Correct Order:
app.use(express.json()); // Pehle middleware
app.use(authMiddleware);
app.get('/users', (req, res) => { }); // Phir routes
```

---

### File 4: request-response.js

**req Object - Client se Data**

```javascript
app.post('/api/example', (req, res) => {
  // ====== req Properties ======
  
  // req.body = POST/PUT data
  const { name, email } = req.body;
  
  // req.params = URL path mein variable
  // URL: /users/:id → req.params.id
  
  // req.query = Query parameters
  // URL: /search?q=nodejs → req.query.q
  
  // req.headers = HTTP headers
  const token = req.headers.authorization;
  
  // req.method = HTTP method
  console.log(req.method); // 'POST'
  
  // req.path = URL path
  console.log(req.path); // '/api/example'
  
  // req.ip = Client ka IP
  console.log(req.ip); // '127.0.0.1'
});
```

**res Object - Client ko Data**

```javascript
app.get('/api/example', (req, res) => {
  // ====== res Methods ======
  
  // 1. res.send() = Text/HTML bhejo
  res.send('Hello World');
  
  // 2. res.json() = JSON format mein data
  res.json({ name: 'Raj', email: 'raj@gmail.com' });
  
  // 3. res.status() = HTTP status code set karo
  res.status(200).json({ success: true });
  res.status(404).json({ error: 'Not found' });
  res.status(500).json({ error: 'Server error' });
  
  // 4. res.setHeader() = Custom header
  res.setHeader('X-Custom', 'Value');
  
  // 5. res.redirect() = Dusri URL par bhejo
  res.redirect('/login');
});
```

**Real-world API Response:**

```javascript
// ❌ Bad Response:
res.send('User created');

// ✅ Good Response:
res.status(201).json({
  success: true,
  message: 'User created successfully',
  data: {
    id: 1,
    name: 'Raj',
    email: 'raj@gmail.com'
  },
  timestamp: new Date()
});
```

---

### File 5: error-handling.js

**Error Handling Techniques**

```javascript
// ====== Technique 1: Try-Catch ======
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email required'
      });
    }
    
    // Database operation (simulated)
    // const user = await db.create({ name, email });
    
    res.status(201).json({
      success: true,
      data: { id: 1, name, email }
    });
    
  } catch (error) {
    // Agar koi error aaye
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ====== Technique 2: 404 Handler ======
app.use((req, res) => {
  // Ye route match nahi hua to iska chalega
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// ====== Technique 3: Global Error Handler ======
app.use((error, req, res, next) => {
  // Ye aakhir mein
  console.error(error);
  res.status(500).json({
    success: false,
    error: error.message || 'Server error'
  });
});
```

**Status Codes Summary**

```
2xx = Success ✅
  200 OK
  201 Created
  204 No Content

4xx = Client Error ❌
  400 Bad Request (validation fail)
  401 Unauthorized (token invalid)
  403 Forbidden (permission denied)
  404 Not Found
  429 Too Many Requests

5xx = Server Error 💥
  500 Internal Server Error
```

---

## How to Run Phase 1 Files

```powershell
# Install dependencies
npm install express

# Run each file
node 1-first-server.js
node 2-routes-and-methods.js
node 3-middleware-explained.js
node 4-request-response.js
node 5-error-handling.js

# Test with Postman or curl
# GET http://localhost:3000/api/users
# POST http://localhost:3000/api/users
```

---

## Learning Checklist

✅ Express server setup  
✅ Routes and HTTP methods  
✅ Middleware concept  
✅ Request-response handling  
✅ Error handling  

**Next:** Phase 2 - Database fundamentals!

