/**
 * PHASE 2: File 1 - MySQL Basics
 *
 * Ye file sikhati hai:
 * ✅ MySQL installation
 * ✅ Database creation
 * ✅ Basic SQL commands
 * ✅ Data types
 * ✅ Constraints
 */

-- ====================================
-- STEP 1: Database Creation
-- ====================================

-- Database banao
-- Agar pehle se exist karti hai to skip kar dega
CREATE DATABASE IF NOT EXISTS mobile_app;

-- Database ko use karo (select karo)
-- Saare subsequent commands is database mein chalenge
USE mobile_app;

-- ====================================
-- STEP 2: CREATE TABLE - Users
-- ====================================

/**
 * Users Table Structure:
 * - id: Unique identifier (Primary key)
 * - username: User ka unique username
 * - email: User ka email (unique, ek user ek email)
 * - password: Hashed password (plaintext nahi)
 * - phone: Mobile number (optional)
 * - bio: User biography (optional)
 * - profile_picture_url: Photo ka URL (optional)
 * - status: active/inactive/suspended
 * - created_at: Account creation date (automatic)
 * - updated_at: Last update (automatic on update)
 */

CREATE TABLE users (
  -- PRIMARY KEY: Har user unique ho
  -- AUTO_INCREMENT: Automatically 1, 2, 3...
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- UNIQUE: Duplicate usernames nahi ho sakte
  -- NOT NULL: Username zaroor dena padta
  username VARCHAR(50) UNIQUE NOT NULL,

  -- UNIQUE: Ek email, ek user
  -- VARCHAR(100): Upto 100 characters
  email VARCHAR(100) UNIQUE NOT NULL,

  -- Password hashed hoga (255 characters for hashing)
  -- bcrypt hash = ~60 characters, but 255 safe
  password VARCHAR(255) NOT NULL,

  -- NULLABLE fields (DEFAULT NULL)
  -- Phone number (optional)
  phone VARCHAR(15) DEFAULT NULL,

  -- Bio (user ke baare mein text)
  bio TEXT DEFAULT NULL,

  -- Profile picture URL
  profile_picture_url VARCHAR(255) DEFAULT NULL,

  -- Status: active, inactive, suspended
  -- DEFAULT 'active': By default naye users active
  status VARCHAR(20) DEFAULT 'active',

  -- TIMESTAMP: Automatic date-time
  -- DEFAULT CURRENT_TIMESTAMP: Jab insert hota, automatically current time
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- ON UPDATE: Jab row update hota, automatically update
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ====================================
-- STEP 3: CREATE TABLE - Posts
-- ====================================

/**
 * Posts Table:
 * - id: Unique post ID
 * - user_id: FOREIGN KEY (kis user ne post kiya)
 * - title: Post title
 * - content: Post content
 * - image_url: Post image
 * - likes_count: Like count (denormalization for speed)
 * - views_count: View count
 * - status: published/draft
 * - created_at: Posting time
 * - updated_at: Last edit
 */

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- FOREIGN KEY: posts.user_id ko users.id se link karo
  -- NOT NULL: Post zaroor kisi user ka hona chahiye
  -- ON DELETE CASCADE: Agar user delete, posts bhi delete
  user_id INT NOT NULL,

  -- Post title
  title VARCHAR(200) NOT NULL,

  -- Post content (text)
  content TEXT,

  -- Post image URL
  image_url VARCHAR(255),

  -- Likes count (denormalization - direct count store)
  -- Ye performance ke liye hai (har bar COUNT query nahi)
  likes_count INT DEFAULT 0,

  -- Views count
  views_count INT DEFAULT 0,

  -- Post status: published, draft, deleted
  status VARCHAR(20) DEFAULT 'published',

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- CONSTRAINT: Foreign key relationship
  -- fk_posts_user = constraint ka name (optional par helpful)
  -- ON DELETE CASCADE = Agar user delete, posts bhi auto delete
  CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ====================================
-- STEP 4: CREATE TABLE - Comments
-- ====================================

/**
 * Comments Table:
 * - id: Unique comment ID
 * - post_id: FOREIGN KEY (kis post par comment)
 * - user_id: FOREIGN KEY (kis user ne comment kiya)
 * - text: Comment text
 * - likes_count: Comment likes
 * - created_at: Comment time
 * - updated_at: Edit time
 */

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- Kis post par comment
  post_id INT NOT NULL,

  -- Kis user ne likha
  user_id INT NOT NULL,

  -- Comment text
  text TEXT NOT NULL,

  -- Comment ke likes
  likes_count INT DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Foreign keys
  CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ====================================
-- STEP 5: CREATE TABLE - Likes
-- ====================================

/**
 * Likes Table:
 * - post_id: FOREIGN KEY
 * - user_id: FOREIGN KEY
 * - created_at: When liked
 *
 * UNIQUE: (post_id, user_id) = Ek user ek post ko ek bar like kar sakta
 */

CREATE TABLE likes (
  id INT AUTO_INCREMENT PRIMARY KEY,

  post_id INT NOT NULL,
  user_id INT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- UNIQUE CONSTRAINT: post aur user ka combination unique
  -- Ek user ek post ko ek bar hi like kar sakta
  UNIQUE KEY unique_like (post_id, user_id),

  CONSTRAINT fk_likes_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ====================================
-- STEP 6: CREATE TABLE - Follows
-- ====================================

/**
 * Follows Table (Many-to-Many):
 * - follower_id: User jo follow kar raha
 * - following_id: User ko follow kar raha
 * - created_at: When follow
 *
 * Example:
 * Raj (1) → Following → Priya (2)
 * Raj (1) → Following → Amit (3)
 */

CREATE TABLE follows (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- Jo user follow kar raha
  follower_id INT NOT NULL,

  -- Jo user ko follow kar raha
  following_id INT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Ek user ek dusre user ko ek bar hi follow kar sakta
  UNIQUE KEY unique_follow (follower_id, following_id),

  CONSTRAINT fk_follows_follower FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_follows_following FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ====================================
-- STEP 7: Create INDEXES for Performance
-- ====================================

/**
 * INDEX = Fast lookup ke liye
 * Jab queries frequently hoti hain usi column par index banao
 */

-- Email par frequently search hota (login ke time)
CREATE INDEX idx_email ON users(email);

-- Username search
CREATE INDEX idx_username ON users(username);

-- Posts ke user_id par frequently filter hota
CREATE INDEX idx_posts_user ON posts(user_id);

-- Comments ke post_id par
CREATE INDEX idx_comments_post ON comments(post_id);

-- Comments ke user_id par
CREATE INDEX idx_comments_user ON comments(user_id);

-- Likes ke post_id par
CREATE INDEX idx_likes_post ON likes(post_id);

-- Follows ke follower par
CREATE INDEX idx_follows_follower ON follows(follower_id);

-- ====================================
-- Verify Tables Created
-- ====================================

-- Sab tables dekho
SHOW TABLES;

-- Specific table structure dekho
DESCRIBE users;
-- Ya
SHOW COLUMNS FROM users;

-- ====================================
-- Summary
-- ====================================

/**
 * ✅ Created Tables:
 * 1. users - User accounts
 * 2. posts - User posts
 * 3. comments - Comments on posts
 * 4. likes - Post likes (like count)
 * 5. follows - User follows (for feed)
 *
 * ✅ Relationships:
 * - users (1) ← → (Many) posts
 * - users (1) ← → (Many) comments
 * - users (1) ← → (Many) likes
 * - users (1) ← → (Many) follows
 * - posts (1) ← → (Many) comments
 * - posts (1) ← → (Many) likes
 *
 * ✅ Constraints:
 * - PRIMARY KEYs on all tables
 * - UNIQUE on important fields
 * - FOREIGN KEYs for relationships
 * - ON DELETE CASCADE for data integrity
 *
 * ✅ Indexes:
 * - Fast email/username lookup
 * - Fast post/comment/like filtering
 *
 * ⚠️ Next Steps (Phase2-3):
 * - Insert sample data
 * - Write SQL queries (SELECT, JOIN, etc.)
 * - Integrate with Node.js
 */
