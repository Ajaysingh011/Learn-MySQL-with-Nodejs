# Phase 3: Backend Development - Complete Explanation

## Ye Phase Kya Sikhayega?

Phase 3 mein tum sikhoge:
1. **Node.js se MySQL connect karna**
2. **Complete REST API banano**
3. **User authentication (JWT tokens)**
4. **CRUD operations with database**
5. **Error handling aur validation**
6. **Project structure** (Industry standard)

---

## File Structure

```
phase3-backend/
├── config/
│   └── database.js                 ✅ MySQL connection
├── models/
│   ├── User.js                     ✅ User database queries
│   └── Post.js                     ✅ Post database queries
├── controllers/
│   ├── userController.js           ✅ User business logic
│   └── postController.js           ✅ Post business logic
├── routes/
│   ├── userRoutes.js               ✅ User endpoints
│   └── postRoutes.js               ✅ Post endpoints
├── middleware/
│   ├── authMiddleware.js           ✅ Authentication check
│   └── errorHandler.js             ✅ Error handling
├── .env                            ✅ Environment variables
├── package.json                    ✅ Dependencies
├── server.js                       ✅ Main server file
└── PHASE3_EXPLANATION.md           ✅ Ye file
```

---

## Architecture Explained

### MVC Architecture (Model-View-Controller)

```
Mobile App
    ↓
Request → Express Router
    ↓
Controller (Business Logic)
    ↓
Model (Database Queries)
    ↓
MySQL Database
    ↓
Response → Mobile App
```

**3-layer architecture:**

1. **Model** - Database mein kya queries run karengi
   ```javascript
   // models/User.js
   static async getAllUsers() {
     return await pool.query('SELECT * FROM users');
   }
   ```

2. **Controller** - Kaunsi logic run karengi
   ```javascript
   // controllers/userController.js
   static async getUsers(req, res) {
     const users = await User.getAllUsers();
     res.json(users);
   }
   ```

3. **Routes** - Kaunse endpoints expose karengi
   ```javascript
   // routes/userRoutes.js
   router.get('/users', userController.getUsers);
   ```

---

## Database Connection

### mysql2/promise Package

```javascript
// config/database.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',           // MySQL server address
  user: 'root',                // Username
  password: 'password',        // Password
  database: 'mobile_app',      // Database name
  waitForConnections: true,
  connectionLimit: 10,         // Max connections
  queueLimit: 0
});

module.exports = pool;
```

**Why connection pool?**
```
Single connection:
Request 1 → Connection ❌ (busy)
Request 2 → Wait... (slow)

Connection Pool (10 connections):
Request 1 → Connection 1 ✅
Request 2 → Connection 2 ✅
Request 3 → Connection 3 ✅
(All parallel = FAST!)
```

---

## Model Layer

### User Model Example

```javascript
// models/User.js
class User {
  // Get all users
  static async getAllUsers() {
    const [rows] = await pool.query(
      'SELECT id, username, email FROM users'
    );
    return rows;
  }

  // Get user by ID
  static async getUserById(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]  // Prevent SQL injection
    );
    return rows[0];
  }

  // Create user
  static async createUser(username, email, password) {
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    return result.insertId;  // Naya user ka ID
  }

  // Update user
  static async updateUser(userId, username, email) {
    await pool.query(
      'UPDATE users SET username = ?, email = ? WHERE id = ?',
      [username, email, userId]
    );
    return true;
  }

  // Delete user
  static async deleteUser(userId) {
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    return true;
  }
}
```

---

## Controller Layer

### User Controller

```javascript
// controllers/userController.js
const User = require('../models/User');

class UserController {
  // GET all users
  static async getAllUsers(req, res) {
    try {
      const users = await User.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET user by ID
  static async getUserById(req, res) {
    try {
      const { userId } = req.params;

      // Validation
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const user = await User.getUserById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST create user
  static async createUser(req, res) {
    try {
      const { username, email, password } = req.body;

      // Validation
      if (!username || !email || !password) {
        return res.status(400).json({
          error: 'Username, email, password required'
        });
      }

      // Hash password (in real project)
      // const hashed = await bcrypt.hash(password, 10);

      const userId = await User.createUser(username, email, password);

      res.status(201).json({
        success: true,
        message: 'User created',
        userId: userId
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

---

## Routes Layer

### Express Routes

```javascript
// routes/userRoutes.js
const express = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);

// Protected routes (token required)
router.put('/:id', authMiddleware, UserController.updateUser);
router.delete('/:id', authMiddleware, UserController.deleteUser);

module.exports = router;
```

---

## Authentication with JWT

### JWT Token Flow

```
1. Login
   Mobile: email + password → Server
   
2. Verify
   Server: Database mein check
   
3. Generate Token
   Server: JWT token create
   Token = header.payload.signature
   
4. Send Token
   Server: Token → Mobile
   
5. Use Token
   Mobile: Har request mein token bhejta
   Authorization: Bearer <token>
   
6. Verify Token
   Server: Token check
   
7. Process Request
   Server: Request process → Response
```

### JWT Implementation

```javascript
// Generate token after login
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: user.id, email: user.email },  // Payload
  'secret-key',                              // Secret
  { expiresIn: '24h' }                       // Options
);

// Verify token in middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, 'secret-key');
    req.userId = decoded.userId;  // Token mein userId store
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
```

---

## Validation & Error Handling

### Input Validation

```javascript
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
  // Min 6 characters
  return password && password.length >= 6;
};

const validateUsername = (username) => {
  // 3-20 characters, alphanumeric + underscore
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
};
```

### Error Handling

```javascript
// Try-catch in controller
try {
  const user = await User.getUserById(userId);
  res.json(user);
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: 'Database error'
  });
}

// Global error handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    success: false,
    error: error.message || 'Server error'
  });
});
```

---

## API Response Format

### Consistent Response Structure

```javascript
// Success response
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-05-04T10:30:00Z"
}

// Error response
{
  "success": false,
  "error": "Descriptive error message",
  "code": "ERROR_CODE",
  "timestamp": "2026-05-04T10:30:00Z"
}

// Paginated response
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "total": 100,
    "hasNextPage": true
  }
}
```

---

## Environment Variables

### .env File

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=mobile_app

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=24h
```

### Using .env

```javascript
require('dotenv').config();

const config = {
  PORT: process.env.PORT || 3000,
  DATABASE: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME
  },
  JWT_SECRET: process.env.JWT_SECRET
};
```

---

## Pagination Implementation

### Backend Query

```javascript
static async getPaginatedUsers(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    'SELECT * FROM users LIMIT ? OFFSET ?',
    [limit, offset]
  );

  const [countResult] = await pool.query(
    'SELECT COUNT(*) as total FROM users'
  );

  return {
    data: rows,
    pagination: {
      currentPage: page,
      limit: limit,
      total: countResult[0].total,
      totalPages: Math.ceil(countResult[0].total / limit),
      hasNextPage: page < Math.ceil(countResult[0].total / limit)
    }
  };
}
```

### API Usage

```
GET /api/users?page=1&limit=10
GET /api/users?page=2&limit=20
GET /api/posts?userId=1&page=1&limit=15
```

---

## Learning Checklist

✅ MySQL connection setup  
✅ Model layer (database queries)  
✅ Controller layer (business logic)  
✅ Routes layer (endpoints)  
✅ JWT authentication  
✅ Input validation  
✅ Error handling  
✅ Consistent response format  
✅ Pagination  
✅ Environment configuration  

**Next:** Phase 4 - Real-world project (Instagram-like backend)!

