# 🚀 MySQL + Node.js Backend Development Guide
## Beginner से Advanced तक - Mobile App के लिए

**यह guide आपको सिखाएगी कि कैसे production-ready backend बनाते हैं!**

---

## 📋 Quick Links

- 📚 **Main Guide:** [MYSQL_NODEJS_BACKEND_GUIDE.md](../MYSQL_NODEJS_BACKEND_GUIDE.md)
- 📁 **Project Structure:** [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- 📊 **Database Schema:** [phase2-database/](./phase2-database/)
- 💻 **Code Examples:** [phase1-fundamentals/](./phase1-fundamentals/) → [phase5-production/](./phase5-production/)

---

## 🎯 Overview

```
This comprehensive guide teaches you:
✅ Node.js + Express fundamentals
✅ MySQL database design & queries
✅ Building REST APIs
✅ Authentication & Authorization
✅ Database optimization
✅ Production deployment
✅ Real-world Instagram-like backend
✅ 26+ interview questions
✅ Deployment checklist
```

---

## ⏱️ Timeline

```
Phase 1: Fundamentals      (Weeks 1-2)   → Node.js & Express
Phase 2: Database          (Weeks 3-4)   → MySQL & SQL
Phase 3: Backend Dev       (Weeks 5-8)   → REST API + Database
Phase 4: Real Project      (Weeks 9-12)  → Instagram Backend
Phase 5: Production Ready  (Advanced)    → Caching, Logging, Deployment

Total: 8-12 weeks (1-2 hours daily)
```

---

## 📂 Folder Structure

```
backend-project/
├── phase1-fundamentals/     ← Start here! (2 weeks)
│   ├── 1-first-server.js
│   ├── 2-routes-and-methods.js
│   ├── 3-middleware-explained.js
│   └── PHASE1_EXPLANATION.md
│
├── phase2-database/         ← (2 weeks)
│   ├── 1-mysql-basics.sql
│   ├── 2-create-tables.sql
│   ├── 3-crud-operations.sql
│   └── PHASE2_EXPLANATION.md
│
├── phase3-backend/          ← (4 weeks)
│   ├── config/database.js
│   ├── models/User.js
│   ├── controllers/userController.js
│   ├── routes/userRoutes.js
│   ├── server.js
│   └── PHASE3_EXPLANATION.md
│
├── phase4-project/          ← (4 weeks)
│   ├── Full Instagram backend
│   ├── Testing
│   ├── Documentation
│   └── PROJECT_DESCRIPTION.md
│
└── phase5-production/       ← Advanced
    ├── Caching (Redis)
    ├── Rate Limiting
    ├── Docker
    └── DEPLOYMENT_GUIDE.md

Plus:
📚 MYSQL_NODEJS_BACKEND_GUIDE.md (Complete 2000+ line guide)
📋 PROJECT_STRUCTURE.md (This structure explained)
📖 README.md (This file)
```

---

## 🚀 Getting Started

### Prerequisites

```powershell
# Check if installed
node --version       # v14+
npm --version        # v6+
mysql --version      # 8.0+
```

### Installation

```powershell
# Install Node.js
# https://nodejs.org/

# Install MySQL
# https://dev.mysql.com/downloads/mysql/

# Clone/Download this repo
git clone <repo-url>
cd backend-project

# Or start fresh
mkdir my-backend
cd my-backend
```

---

## 📖 How to Use This Guide

### Option 1: Follow Sequentially (Recommended)

```
Week 1-2: Phase 1
  ↓
Week 3-4: Phase 2
  ↓
Week 5-8: Phase 3
  ↓
Week 9-12: Phase 4
  ↓
Advanced: Phase 5
```

### Option 2: Skip to Phase You Need

- **Already know Node.js?** → Start Phase 2
- **Already know MySQL?** → Start Phase 3
- **Want full app fast?** → Jump to Phase 4
- **Going to production?** → Check Phase 5

---

## 🎓 Phase-by-Phase Guide

### Phase 1: Node.js & Express Fundamentals (Weeks 1-2)

**आप क्या सीखोगे:**
- Node.js server setup
- Express routing
- HTTP methods (GET, POST, PUT, DELETE)
- Middleware
- Request-Response handling
- Error handling

**फाइलें:**
```
phase1-fundamentals/
├── 1-first-server.js
│   └── Basic Express server with routes
├── 2-routes-and-methods.js
│   └── GET, POST, PUT, DELETE examples
├── 3-middleware-explained.js
│   └── Middleware flow and custom middleware
├── 4-request-response.js
│   └── req/res objects detailed
└── 5-error-handling.js
    └── Try-catch, 404, global error handlers
```

**शुरुआत करें:**
```powershell
cd phase1-fundamentals
npm install
node 1-first-server.js
# Browser: http://localhost:3000
```

---

### Phase 2: MySQL Database (Weeks 3-4)

**आप क्या सीखोगे:**
- Database design
- MySQL setup
- CREATE, INSERT, SELECT, UPDATE, DELETE
- Relationships (Foreign Keys)
- JOINs (INNER, LEFT, RIGHT)
- Indexing
- Transactions

**फाइलें:**
```
phase2-database/
├── 1-mysql-basics.sql
│   └── Installation & basic commands
├── 2-create-tables.sql
│   └── Database schema for Instagram-like app
├── 3-crud-operations.sql
│   └── All CRUD examples
├── 4-relationships-joins.sql
│   └── Foreign keys and JOIN types
└── 5-advanced-queries.sql
    └── Subqueries, aggregation, performance
```

**शुरुआत करें:**
```powershell
mysql -u root -p
USE mysql;
SOURCE phase2-database/1-mysql-basics.sql;
SOURCE phase2-database/2-create-tables.sql;
```

---

### Phase 3: Backend Development (Weeks 5-8)

**आप क्या सीखोगे:**
- MySQL connection with Node.js
- MVC Architecture (Model-View-Controller)
- CRUD API with database
- User authentication (JWT)
- Input validation
- Error handling
- Pagination & filtering
- Professional folder structure

**फाइलें:**
```
phase3-backend/
├── config/database.js
│   └── MySQL connection pool
├── models/
│   ├── User.js
│   └── Post.js
├── controllers/
│   ├── userController.js
│   └── postController.js
├── routes/
│   ├── userRoutes.js
│   └── postRoutes.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorHandler.js
├── server.js
├── .env.example
└── package.json
```

**शुरुआत करें:**
```powershell
cd phase3-backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npm run dev
# http://localhost:3000
```

**API Endpoints:**
```
GET    /api/users              - Get all users
GET    /api/users/:id          - Get user by ID
POST   /api/users              - Create user
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user

GET    /api/posts              - Get all posts
POST   /api/posts              - Create post
PUT    /api/posts/:id          - Update post
DELETE /api/posts/:id          - Delete post
```

---

### Phase 4: Real Project - Instagram Backend (Weeks 9-12)

**आप क्या सीखोगे:**
- Complete production-like application
- User authentication & profiles
- Posts, comments, likes
- Following system
- Feed generation
- Search functionality
- Testing
- API documentation

**Features:**
```
✅ User Management
   - Register/Login
   - Profile update
   - Follow/Unfollow

✅ Posts
   - Create/Edit/Delete
   - Like/Unlike
   - Comments

✅ Feed
   - Posts from followed users
   - Pagination

✅ Search
   - Find users
   - Find posts

✅ Testing & Docs
   - Unit tests
   - API documentation
```

**शुरुआत करें:**
```powershell
cd phase4-project
npm install
npm run setup    # Setup database
npm run seed     # Add sample data
npm run dev
```

---

### Phase 5: Production Ready (Advanced)

**आप क्या सीखोगे:**
- Caching (Redis)
- Rate limiting
- Advanced logging
- Security hardening
- Performance optimization
- Docker containerization
- Deployment strategies
- Monitoring & alerts

**फाइलें:**
```
phase5-production/
├── config/redis.js
├── middleware/rateLimiter.js
├── middleware/requestLogger.js
├── helpers/cache.js
├── docker/
├── DEPLOYMENT_GUIDE.md
└── README.md
```

---

## 🎯 Interview Preparation

**यह guide 26+ Interview Questions के साथ आता है:**

### Phase 1 Questions
- Node.js क्या है?
- Express.js क्यों use करते हैं?
- Middleware क्या होते हैं?
- HTTP methods explained
- async/await vs Promises

### Phase 2 Questions
- Database क्या है?
- SQL क्या है?
- PRIMARY KEY vs UNIQUE
- Foreign keys
- JOINs explained
- Normalization
- Transactions

### Phase 3+ Questions
- Authentication vs Authorization
- JWT tokens
- Password hashing
- Rate limiting
- Caching strategies
- API design
- Error handling

**सभी questions के साथ detailed answers हैं!**

---

## 💻 Testing with Postman

```
1. Postman download करो: https://www.postman.com/downloads/

2. नया Request बनाओ:
   - Method: GET
   - URL: http://localhost:3000/api/users
   - Send करो

3. POST example:
   - Method: POST
   - URL: http://localhost:3000/api/users
   - Headers: Content-Type: application/json
   - Body (raw JSON):
     {
       "name": "Raj Kumar",
       "email": "raj@example.com"
     }
```

---

## 📊 Database Diagram

```
Instagram-like App Structure:

users (1)
  │
  ├──→ (Many) posts
  │       │
  │       ├──→ (Many) comments
  │       │
  │       └──→ (Many) likes
  │
  ├──→ (Many) follows
  │
  └──→ (Many) user_groups

Relationships:
- users (1) : posts (Many)      [user_id in posts]
- posts (1) : comments (Many)   [post_id in comments]
- posts (1) : likes (Many)      [post_id in likes]
- users (1) : follows (Many)    [follower/following in follows]
```

---

## 🔒 Security Checklist

```
✅ Password Hashing
   - Use bcrypt
   - Never store plaintext

✅ JWT Tokens
   - Use strong secret
   - Set expiry
   - Validate on requests

✅ Input Validation
   - Email format
   - Password strength
   - Data types

✅ SQL Injection Prevention
   - Use parameterized queries (?)
   - Never concatenate strings

✅ CORS
   - Allow specific origins
   - Restrict methods

✅ Rate Limiting
   - Prevent brute force
   - DDoS protection

✅ HTTPS
   - Use in production
   - SSL certificates
```

---

## 📚 Learning Resources

### Official Documentation
- Node.js: https://nodejs.org/docs/
- Express: https://expressjs.com/
- MySQL: https://dev.mysql.com/docs/

### Tutorials
- YouTube: "Node.js Express MySQL Tutorial"
- Dev.to: Express + MySQL articles
- Medium: Backend development guides

### Practice
- LeetCode: SQL problems
- HackerRank: Database challenges
- Your own projects!

---

## 🚀 Deployment

### Local Development
```powershell
npm run dev
# http://localhost:3000
```

### Heroku Deployment
```powershell
heroku login
heroku create your-app-name
git push heroku main
heroku open
```

### Docker Deployment
```powershell
docker-compose up
# http://localhost:3000
```

### AWS/Digital Ocean
- See phase5-production/DEPLOYMENT_GUIDE.md

---

## 📝 Checklist for Completion

### Phase 1 ✅
- [ ] Node.js installed
- [ ] Express server working
- [ ] Routes created
- [ ] Middleware understood
- [ ] Error handling done

### Phase 2 ✅
- [ ] MySQL installed
- [ ] Database created
- [ ] Tables designed
- [ ] CRUD queries working
- [ ] JOINs understood

### Phase 3 ✅
- [ ] Connection pool setup
- [ ] Models created
- [ ] Controllers created
- [ ] Routes defined
- [ ] Authentication working
- [ ] Full API tested

### Phase 4 ✅
- [ ] Complete app working
- [ ] All features implemented
- [ ] Tests written
- [ ] Documentation done

### Phase 5 ✅
- [ ] Caching implemented
- [ ] Rate limiting added
- [ ] Logging configured
- [ ] Docker setup
- [ ] Deployment ready

---

## 🆘 Troubleshooting

### MySQL Connection Error
```
Error: connect ECONNREFUSED

Solution:
1. Check MySQL is running
2. Verify credentials in .env
3. Check host/port correct
4. Run: mysql -u root -p
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000

Solution:
1. Change PORT in .env
2. Or: npm run dev -- --port 3001
3. Or: kill process: lsof -i :3000
```

### Module Not Found
```
Error: Cannot find module 'express'

Solution:
1. npm install
2. Check package.json
3. Delete node_modules and reinstall
```

---

## 📞 Support

- Check MYSQL_NODEJS_BACKEND_GUIDE.md
- See phase-specific EXPLANATION.md files
- Review code comments
- Run examples

---

## 📄 License

This guide is for educational purposes.

---

## 🎉 Summary

```
🚀 You will learn:
   ✅ Node.js + Express
   ✅ MySQL database
   ✅ REST API design
   ✅ Authentication
   ✅ Professional code structure
   ✅ Real-world applications
   ✅ Production deployment

⏱️ Time investment:
   ✅ 8-12 weeks
   ✅ 1-2 hours daily
   ✅ Hands-on practice

💼 After completion:
   ✅ Build production backends
   ✅ Interview ready
   ✅ Mid-level developer skills
   ✅ Real-world projects

Happy Learning! 🚀🎯
```

---

**Created:** May 4, 2026  
**Status:** Complete & Ready to Learn  
**Support:** All phases explained with code examples

Start with Phase 1 today! 👉 [phase1-fundamentals/](./phase1-fundamentals/)

