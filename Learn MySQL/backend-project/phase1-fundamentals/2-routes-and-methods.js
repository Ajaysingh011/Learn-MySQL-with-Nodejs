/**
 * PHASE 1: File 2 - HTTP Methods aur Routes
 *
 * Ye file sikhati hai:
 * ✅ GET method (data request)
 * ✅ POST method (data create)
 * ✅ PUT method (data update)
 * ✅ DELETE method (data remove)
 * ✅ Parameters: body, params, query
 */

const express = require('express');
const app = express();

// ====== Middleware ======
app.use(express.json());

// ====== SIMULATED DATABASE ======
// Real project mein ye database hota, abhi sirf array mein store kar rahe
let users = [
  { id: 1, name: 'Raj Kumar', email: 'raj@gmail.com', phone: '9876543210' },
  { id: 2, name: 'Priya Singh', email: 'priya@gmail.com', phone: '9876543211' },
  { id: 3, name: 'Amit Patel', email: 'amit@gmail.com', phone: '9876543212' }
];

// ====== Counter for new IDs ======
let nextId = 4;

// ====================================
// GET METHODS - Data lena (Read-only)
// ====================================

// GET 1: Sab users lao
// URL: http://localhost:3000/api/users
app.get('/api/users', (req, res) => {
  console.log('✅ GET /api/users - Sab users request kiye');

  // Response with metadata
  res.json({
    success: true,
    message: 'All users fetched',
    total: users.length,
    data: users
  });
});

// GET 2: Specific user ID se lao
// URL: http://localhost:3000/api/users/1
// :id = URL parameter (dynamic)
app.get('/api/users/:id', (req, res) => {
  // req.params.id = URL mein jo number likha
  const userId = parseInt(req.params.id);

  console.log(`✅ GET /api/users/${userId} - User details request`);

  // User find karo
  const user = users.find(u => u.id === userId);

  if (!user) {
    // User nahi mila
    return res.status(404).json({
      success: false,
      error: `User with id ${userId} not found`,
      code: 'USER_NOT_FOUND'
    });
  }

  // User mil gaya
  res.json({
    success: true,
    message: 'User found',
    data: user
  });
});

// GET 3: Query parameters ke saath
// URL: http://localhost:3000/api/users/search?name=Raj
// req.query = ? ke baad ka data
app.get('/api/users/search/by-name', (req, res) => {
  const searchName = req.query.name;

  console.log(`✅ GET /api/users/search/by-name?name=${searchName}`);

  if (!searchName) {
    return res.status(400).json({
      success: false,
      error: 'Name parameter required',
      example: '/api/users/search/by-name?name=Raj'
    });
  }

  // Filter users by name (case-insensitive)
  const results = users.filter(u =>
    u.name.toLowerCase().includes(searchName.toLowerCase())
  );

  res.json({
    success: true,
    query: searchName,
    total: results.length,
    data: results
  });
});

// ====================================
// POST METHOD - Naya data create karna
// ====================================

// POST: Naya user add karo
// URL: http://localhost:3000/api/users
// Body: { "name": "...", "email": "...", "phone": "..." }
app.post('/api/users', (req, res) => {
  console.log('✅ POST /api/users - Naya user create request');

  // req.body = POST request mein jo data bheja
  const { name, email, phone } = req.body;

  // ====== VALIDATION ======
  // Data sahi hai ya nahi check karna zaroori hai

  if (!name) {
    return res.status(400).json({
      success: false,
      error: 'Name is required',
      received: { name, email, phone }
    });
  }

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email is required'
    });
  }

  // Email format check (simple validation)
  if (!email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format'
    });
  }

  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({
      success: false,
      error: 'Email already registered'
    });
  }

  // ====== Create naya user ======
  const newUser = {
    id: nextId++,
    name: name,
    email: email,
    phone: phone || 'Not provided'
  };

  // Add to array
  users.push(newUser);

  console.log(`✅ New user created: ${newUser.name} (ID: ${newUser.id})`);

  // ====== Response ======
  // 201 = Created (naya resource successfully create hua)
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

// ====================================
// PUT METHOD - Existing data update
// ====================================

// PUT: User ko update karo
// URL: http://localhost:3000/api/users/1
// Body: { "name": "...", "email": "..." }
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, phone } = req.body;

  console.log(`✅ PUT /api/users/${userId} - Update request`);

  // User find karo
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: `User with id ${userId} not found`
    });
  }

  // ====== Update only provided fields ======
  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;

  console.log(`✅ User ${userId} updated:`, user);

  res.json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

// ====================================
// DELETE METHOD - Data remove karna
// ====================================

// DELETE: User delete karo
// URL: http://localhost:3000/api/users/1
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);

  console.log(`✅ DELETE /api/users/${userId} - Delete request`);

  // Find index of user
  const index = users.findIndex(u => u.id === userId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `User with id ${userId} not found`
    });
  }

  // Delete user
  const deletedUser = users.splice(index, 1)[0];

  console.log(`✅ User ${userId} deleted:`, deletedUser);

  res.json({
    success: true,
    message: 'User deleted successfully',
    data: deletedUser
  });
});

// ====================================
// BONUS: Instagram-like API Example
// ====================================

// Simulated posts
let posts = [
  { id: 1, userId: 1, caption: 'First post', likes: 100 },
  { id: 2, userId: 2, caption: 'Nice weather', likes: 50 }
];

// Get user ki sab posts
// URL: /api/users/1/posts
app.get('/api/users/:userId/posts', (req, res) => {
  const userId = parseInt(req.params.userId);

  // Check if user exists
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Get user's posts
  const userPosts = posts.filter(p => p.userId === userId);

  res.json({
    user: user.name,
    totalPosts: userPosts.length,
    posts: userPosts
  });
});

// Like a post
// URL: /api/posts/1/like (PUT request)
app.put('/api/posts/:postId/like', (req, res) => {
  const postId = parseInt(req.params.postId);

  const post = posts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  post.likes += 1;

  res.json({
    success: true,
    message: 'Post liked! ❤️',
    likes: post.likes
  });
});

// ====================================
// Server Start
// ====================================

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`
    🚀 Server running on http://localhost:${PORT}

    📝 Available Routes:

    GET Methods:
    • GET /api/users              - Get all users
    • GET /api/users/:id          - Get specific user
    • GET /api/users/search/by-name?name=Raj - Search user

    POST Method:
    • POST /api/users             - Create new user
      Body: { "name": "...", "email": "...", "phone": "..." }

    PUT Methods:
    • PUT /api/users/:id          - Update user
      Body: { "name": "...", "email": "..." }
    • PUT /api/posts/:postId/like - Like a post

    DELETE Method:
    • DELETE /api/users/:id       - Delete user

    Instagram-like:
    • GET /api/users/:userId/posts - Get user's posts
  `);
});

/**
 * ====== Testing with Postman ======
 *
 * 1. GET http://localhost:3000/api/users
 *    Response: Sab users
 *
 * 2. POST http://localhost:3000/api/users
 *    Body: {
 *      "name": "Neha Gupta",
 *      "email": "neha@gmail.com",
 *      "phone": "9876543213"
 *    }
 *    Response: Naya user created
 *
 * 3. GET http://localhost:3000/api/users/1
 *    Response: User 1 ki details
 *
 * 4. PUT http://localhost:3000/api/users/1
 *    Body: { "name": "Raj Kumar Updated" }
 *    Response: Updated user
 *
 * 5. DELETE http://localhost:3000/api/users/1
 *    Response: User deleted
 *
 * 6. GET http://localhost:3000/api/users/search/by-name?name=Raj
 *    Response: Sab users jinke naam mein "Raj" hai
 */
