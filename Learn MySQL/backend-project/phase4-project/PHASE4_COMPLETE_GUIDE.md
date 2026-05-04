# Phase 4: Complete Implementation Guide

## 📚 What You'll Build in Phase 4

यह phase एक **production-like Instagram backend** है जिसमें:
- User management (registration, login, profiles)
- Posts creation & management
- Comments system
- Like/Unlike feature
- User follow/unfollow
- Feed generation
- Search functionality

---

## 🎯 Week-by-Week Implementation

### Week 1: User Management & Authentication

#### Day 1-2: Setup & Database
```
✅ Clone/create phase4-project folder
✅ Run: migrations/create-schema.sql
✅ Create .env file with database credentials
✅ npm install (express, mysql2, bcrypt, jsonwebtoken, dotenv)
```

#### Day 3-4: User Model & Authentication
```javascript
// models/User.js - Database queries

class User {
  // Register new user
  static async createUser(username, email, passwordHash) {
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );
    return result.insertId;
  }

  // Login - Get user by email
  static async getUserByEmail(email) {
    const [rows] = await pool.query(
      'SELECT id, username, email, password_hash FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  // Get user profile
  static async getUserProfile(userId) {
    const [rows] = await pool.query(
      'SELECT id, username, bio, profile_picture_url, followers_count, following_count FROM users WHERE id = ?',
      [userId]
    );
    return rows[0];
  }

  // Update profile
  static async updateProfile(userId, data) {
    const { bio, location, website_url } = data;
    await pool.query(
      'UPDATE users SET bio = ?, location = ?, website_url = ? WHERE id = ?',
      [bio, location, website_url, userId]
    );
  }
}
```

#### Day 5-7: Auth Controller & Routes
```javascript
// controllers/authController.js

class AuthController {
  // Register
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Validation
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields required' });
      }

      // Check if user exists
      const existingUser = await User.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const userId = await User.createUser(username, email, passwordHash);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        userId: userId
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Get user
      const user = await User.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

---

### Week 2: Posts & Comments System

#### Day 1-2: Post Model & CRUD
```javascript
// models/Post.js

class Post {
  // Create post
  static async createPost(userId, caption, imageUrl, location) {
    const [result] = await pool.query(
      'INSERT INTO posts (user_id, caption, image_url, location) VALUES (?, ?, ?, ?)',
      [userId, caption, imageUrl, location]
    );

    // Update user's posts count
    await pool.query(
      'UPDATE users SET posts_count = posts_count + 1 WHERE id = ?',
      [userId]
    );

    return result.insertId;
  }

  // Get user's posts
  static async getUserPosts(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [posts] = await pool.query(
      'SELECT id, caption, image_url, likes_count, comments_count, created_at FROM posts WHERE user_id = ? AND status = "published" ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );

    return posts;
  }

  // Get feed - Posts from followed users
  static async getFeed(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [posts] = await pool.query(
      `SELECT p.id, p.user_id, u.username, p.caption, p.image_url, 
              p.likes_count, p.comments_count, p.created_at
       FROM posts p
       INNER JOIN users u ON p.user_id = u.id
       WHERE p.user_id IN (
         SELECT following_id FROM follows WHERE follower_id = ?
       )
       AND p.status = 'published'
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    return posts;
  }

  // Delete post
  static async deletePost(postId) {
    await pool.query(
      'UPDATE posts SET status = "deleted" WHERE id = ?',
      [postId]
    );
  }
}
```

#### Day 3-4: Post Routes & Controller
```javascript
// routes/postRoutes.js
const router = require('express').Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, postController.createPost);
router.get('/feed/personal', authMiddleware, postController.getFeed);
router.get('/:postId', postController.getPostById);
router.put('/:postId', authMiddleware, postController.updatePost);
router.delete('/:postId', authMiddleware, postController.deletePost);

module.exports = router;
```

#### Day 5-7: Comments Implementation
```javascript
// models/Comment.js

class Comment {
  // Add comment
  static async createComment(postId, userId, text) {
    const [result] = await pool.query(
      'INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)',
      [postId, userId, text]
    );

    // Update post's comments count
    await pool.query(
      'UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?',
      [postId]
    );

    return result.insertId;
  }

  // Get post comments
  static async getPostComments(postId, page = 1) {
    const offset = (page - 1) * 10;

    const [comments] = await pool.query(
      `SELECT c.id, c.user_id, u.username, c.text, 
              c.likes_count, c.created_at
       FROM comments c
       INNER JOIN users u ON c.user_id = u.id
       WHERE c.post_id = ? AND c.status = 'active'
       ORDER BY c.created_at DESC
       LIMIT 10 OFFSET ?`,
      [postId, offset]
    );

    return comments;
  }

  // Delete comment
  static async deleteComment(commentId) {
    await pool.query(
      'UPDATE comments SET status = "deleted" WHERE id = ?',
      [commentId]
    );
  }
}
```

---

### Week 3: Likes & Following System

#### Day 1-2: Like System
```javascript
// models/Like.js

class Like {
  // Like post
  static async likePost(postId, userId) {
    // Check if already liked
    const [existing] = await pool.query(
      'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    if (existing.length > 0) {
      throw new Error('Already liked');
    }

    // Add like
    await pool.query(
      'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
      [postId, userId]
    );

    // Update likes count
    await pool.query(
      'UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?',
      [postId]
    );
  }

  // Unlike post
  static async unlikePost(postId, userId) {
    // Delete like
    await pool.query(
      'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    // Update likes count
    await pool.query(
      'UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?',
      [postId]
    );
  }

  // Get post likes
  static async getPostLikes(postId) {
    const [likes] = await pool.query(
      'SELECT COUNT(*) as total FROM likes WHERE post_id = ?',
      [postId]
    );

    return likes[0].total;
  }
}
```

#### Day 3-4: Follow System
```javascript
// models/Follow.js

class Follow {
  // Follow user
  static async followUser(followerId, followingId) {
    // Check if already following
    const [existing] = await pool.query(
      'SELECT id FROM follows WHERE follower_id = ? AND following_id = ?',
      [followerId, followingId]
    );

    if (existing.length > 0) {
      throw new Error('Already following');
    }

    // Add follow
    await pool.query(
      'INSERT INTO follows (follower_id, following_id) VALUES (?, ?)',
      [followerId, followingId]
    );

    // Update counts
    await Promise.all([
      pool.query(
        'UPDATE users SET followers_count = followers_count + 1 WHERE id = ?',
        [followingId]
      ),
      pool.query(
        'UPDATE users SET following_count = following_count + 1 WHERE id = ?',
        [followerId]
      )
    ]);
  }

  // Unfollow user
  static async unfollowUser(followerId, followingId) {
    await pool.query(
      'DELETE FROM follows WHERE follower_id = ? AND following_id = ?',
      [followerId, followingId]
    );

    // Update counts
    await Promise.all([
      pool.query(
        'UPDATE users SET followers_count = followers_count - 1 WHERE id = ?',
        [followingId]
      ),
      pool.query(
        'UPDATE users SET following_count = following_count - 1 WHERE id = ?',
        [followerId]
      )
    ]);
  }

  // Get followers
  static async getFollowers(userId) {
    const [followers] = await pool.query(
      `SELECT u.id, u.username, u.profile_picture_url
       FROM users u
       INNER JOIN follows f ON u.id = f.follower_id
       WHERE f.following_id = ?`,
      [userId]
    );

    return followers;
  }
}
```

#### Day 5-7: Follow Routes & Testing
```javascript
// routes/followRoutes.js
const router = require('express').Router();
const followController = require('../controllers/followController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:userId/follow', authMiddleware, followController.followUser);
router.delete('/:userId/follow', authMiddleware, followController.unfollowUser);
router.get('/:userId/followers', followController.getFollowers);
router.get('/:userId/following', followController.getFollowing);

module.exports = router;
```

---

### Week 4: Search & Polish

#### Day 1-2: Search Functionality
```javascript
// controllers/searchController.js

class SearchController {
  // Search users
  static async searchUsers(req, res) {
    try {
      const { q, page = 1, limit = 10 } = req.query;

      if (!q) {
        return res.status(400).json({ error: 'Query required' });
      }

      const offset = (page - 1) * limit;
      const searchPattern = `%${q}%`;

      const [users] = await pool.query(
        'SELECT id, username, profile_picture_url FROM users WHERE username LIKE ? OR bio LIKE ? LIMIT ? OFFSET ?',
        [searchPattern, searchPattern, limit, offset]
      );

      res.json({
        success: true,
        data: users,
        total: users.length
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Search posts
  static async searchPosts(req, res) {
    try {
      const { q, filter = 'caption', page = 1, limit = 10 } = req.query;

      const offset = (page - 1) * limit;
      const searchPattern = `%${q}%`;

      let query = 'SELECT * FROM posts WHERE status = "published" AND ';

      if (filter === 'caption') {
        query += 'caption LIKE ?';
      } else if (filter === 'hashtag') {
        query += 'hashtags LIKE ?';
      } else if (filter === 'location') {
        query += 'location LIKE ?';
      }

      query += ' LIMIT ? OFFSET ?';

      const [posts] = await pool.query(
        query,
        [searchPattern, limit, offset]
      );

      res.json({
        success: true,
        data: posts
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

#### Day 3-4: API Documentation
```markdown
## API Documentation

### Authentication Endpoints

POST /api/v1/auth/register
  Body: { username, email, password }
  Response: { success, userId }

POST /api/v1/auth/login
  Body: { email, password }
  Response: { success, token, user }

### User Endpoints

GET /api/v1/users/:userId
  Headers: Authorization: Bearer <token>
  Response: { success, data: user }

PUT /api/v1/users/profile
  Headers: Authorization: Bearer <token>
  Body: { bio, location, website_url }
  Response: { success }

### Post Endpoints

POST /api/v1/posts
  Headers: Authorization: Bearer <token>
  Body: { caption, image_url, location }
  Response: { success, postId }

GET /api/v1/posts/feed/personal
  Headers: Authorization: Bearer <token>
  Query: page=1&limit=10
  Response: { success, data: [posts] }

GET /api/v1/posts/:postId
  Response: { success, data: post }

DELETE /api/v1/posts/:postId
  Headers: Authorization: Bearer <token>
  Response: { success }

### Comment Endpoints

POST /api/v1/posts/:postId/comments
  Headers: Authorization: Bearer <token>
  Body: { text }
  Response: { success, commentId }

GET /api/v1/posts/:postId/comments
  Query: page=1
  Response: { success, data: [comments] }

### Like Endpoints

POST /api/v1/posts/:postId/like
  Headers: Authorization: Bearer <token>
  Response: { success }

DELETE /api/v1/posts/:postId/like
  Headers: Authorization: Bearer <token>
  Response: { success }

### Follow Endpoints

POST /api/v1/users/:userId/follow
  Headers: Authorization: Bearer <token>
  Response: { success }

DELETE /api/v1/users/:userId/follow
  Headers: Authorization: Bearer <token>
  Response: { success }

GET /api/v1/users/:userId/followers
  Response: { success, data: [followers] }

### Search Endpoints

GET /api/v1/search/users
  Query: q=query&page=1&limit=10
  Response: { success, data: [users] }

GET /api/v1/search/posts
  Query: q=query&filter=caption|hashtag|location&page=1
  Response: { success, data: [posts] }
```

#### Day 5-7: Testing & Deployment
```
✅ Test all endpoints with Postman
✅ Test authentication flow
✅ Test feed generation
✅ Test search functionality
✅ Fix any bugs
✅ Add error handling
✅ Complete documentation
✅ Deploy locally or to server
```

---

## 🧪 Testing Checklist

```
Authentication:
  ✅ Register new user
  ✅ Login with correct credentials
  ✅ Login with wrong credentials
  ✅ Token validation

Posts:
  ✅ Create post
  ✅ Get user posts
  ✅ Get feed
  ✅ Update post
  ✅ Delete post

Comments:
  ✅ Add comment
  ✅ Get comments
  ✅ Delete comment

Likes:
  ✅ Like post
  ✅ Unlike post
  ✅ Get likes count

Follow:
  ✅ Follow user
  ✅ Unfollow user
  ✅ Get followers
  ✅ Get following

Search:
  ✅ Search users
  ✅ Search posts
  ✅ Pagination works
```

---

## 🎓 Key Concepts Covered

✅ Complete REST API design
✅ Database relationships
✅ Transaction handling (follow/unfollow)
✅ Denormalized counters for performance
✅ Feed algorithm
✅ Search optimization
✅ Error handling at scale
✅ API documentation
✅ Testing strategies

---

## 🚀 Next: Phase 5 - Production Ready

After Phase 4, you'll move to Phase 5 for:
- Caching (Redis)
- Rate limiting
- Advanced logging
- Docker deployment
- Performance optimization
- Monitoring & alerts

---

**Duration:** 4 weeks
**Difficulty:** Intermediate-Advanced
**Status:** Ready to implement!

Let's build! 💻🚀

