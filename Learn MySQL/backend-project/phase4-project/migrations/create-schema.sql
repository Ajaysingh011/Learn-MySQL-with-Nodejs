/**
 * PHASE 4: Database Schema - Instagram-like Social Backend
 *
 * यह file complete database schema create करती है
 * सभी tables, relationships, indexes के साथ
 */

-- ====================================
-- Step 1: Database Create
-- ====================================

CREATE DATABASE IF NOT EXISTS socialconnect;
USE socialconnect;

-- ====================================
-- Step 2: Users Table
-- ====================================

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- Unique identification
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,

  -- Password (hashed with bcrypt)
  password_hash VARCHAR(255) NOT NULL,

  -- Profile information
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  bio TEXT,
  profile_picture_url VARCHAR(255),

  -- Location & contact
  location VARCHAR(100),
  website_url VARCHAR(255),
  phone VARCHAR(15),

  -- User status
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  is_private BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,

  -- Counters (denormalized for performance)
  followers_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  posts_count INT DEFAULT 0,

  -- Timestamps
  last_login DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Indexes
  KEY idx_username (username),
  KEY idx_email (email),
  KEY idx_status (status)
);

-- ====================================
-- Step 3: Posts Table
-- ====================================

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- Relationship
  user_id INT NOT NULL,

  -- Content
  caption TEXT,
  image_url VARCHAR(255) NOT NULL,

  -- Meta information
  location VARCHAR(100),
  hashtags VARCHAR(500),  -- Comma-separated for simplicity

  -- Counters (denormalized)
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,

  -- Status
  status ENUM('published', 'draft', 'archived', 'deleted') DEFAULT 'published',

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME DEFAULT NULL,  -- Soft delete timestamp

  -- Constraints & Indexes
  CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_user_id (user_id),
  KEY idx_status (status),
  KEY idx_created_at (created_at)
);

-- ====================================
-- Step 4: Comments Table
-- ====================================

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- Relationships
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  parent_comment_id INT DEFAULT NULL,  -- For nested comments/replies

  -- Content
  text TEXT NOT NULL,

  -- Counters
  likes_count INT DEFAULT 0,
  replies_count INT DEFAULT 0,

  -- Status
  status ENUM('active', 'deleted') DEFAULT 'active',

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Constraints & Indexes
  CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_parent FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  KEY idx_post_id (post_id),
  KEY idx_user_id (user_id),
  KEY idx_created_at (created_at)
);

-- ====================================
-- Step 5: Likes Table
-- ====================================

CREATE TABLE likes (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- Relationships
  post_id INT NOT NULL,
  user_id INT NOT NULL,

  -- Optional: Like type (for future features)
  like_type ENUM('post', 'comment') DEFAULT 'post',
  comment_id INT DEFAULT NULL,

  -- Timestamp
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraints & Indexes
  UNIQUE KEY unique_like (post_id, user_id),  -- One user can like post once
  CONSTRAINT fk_likes_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_post_id (post_id),
  KEY idx_user_id (user_id)
);

-- ====================================
-- Step 6: Follows Table
-- ====================================

CREATE TABLE follows (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- Relationships
  follower_id INT NOT NULL,      -- Who is following
  following_id INT NOT NULL,     -- Whom are they following

  -- Status
  status ENUM('active', 'blocked') DEFAULT 'active',

  -- Timestamp
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraints & Indexes
  UNIQUE KEY unique_follow (follower_id, following_id),
  CONSTRAINT fk_follows_follower FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_follows_following FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_follower_id (follower_id),
  KEY idx_following_id (following_id)
);

-- ====================================
-- Step 7: Notifications Table (Optional)
-- ====================================

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- Recipient
  user_id INT NOT NULL,

  -- Source (who caused notification)
  from_user_id INT,

  -- Notification type
  type ENUM('follow', 'like', 'comment', 'tag', 'message') NOT NULL,

  -- Related entities
  post_id INT DEFAULT NULL,
  comment_id INT DEFAULT NULL,

  -- Status
  is_read BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME DEFAULT NULL,

  -- Constraints & Indexes
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_notif_from_user FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_user_id (user_id),
  KEY idx_is_read (is_read),
  KEY idx_created_at (created_at)
);

-- ====================================
-- Step 8: Hashtags Table (Optional)
-- ====================================

CREATE TABLE hashtags (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- Hashtag
  tag VARCHAR(100) UNIQUE NOT NULL,

  -- Statistics
  usage_count INT DEFAULT 0,
  trending_score INT DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Indexes
  KEY idx_tag (tag),
  KEY idx_usage_count (usage_count)
);

-- ====================================
-- Step 9: Post-Hashtag Junction Table
-- ====================================

CREATE TABLE post_hashtags (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- Relationships
  post_id INT NOT NULL,
  hashtag_id INT NOT NULL,

  -- Timestamp
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraints & Indexes
  UNIQUE KEY unique_post_hashtag (post_id, hashtag_id),
  CONSTRAINT fk_ph_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_ph_hashtag FOREIGN KEY (hashtag_id) REFERENCES hashtags(id) ON DELETE CASCADE,
  KEY idx_post_id (post_id),
  KEY idx_hashtag_id (hashtag_id)
);

-- ====================================
-- Step 10: Create Indexes for Performance
-- ====================================

-- Users table indexes
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_status ON users(status);

-- Posts table indexes
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at);
CREATE INDEX idx_posts_status_created ON posts(status, created_at);

-- Comments table indexes
CREATE INDEX idx_comments_post_created ON comments(post_id, created_at);
CREATE INDEX idx_comments_user ON comments(user_id);

-- Likes table indexes
CREATE INDEX idx_likes_user ON likes(user_id);

-- Follows table indexes
CREATE INDEX idx_follows_both ON follows(follower_id, following_id);

-- Notifications table indexes
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- Hashtags table indexes
CREATE INDEX idx_hashtags_trending ON hashtags(trending_score, usage_count);

-- ====================================
-- Step 11: Create Views (Optional)
-- ====================================

-- View: User Statistics
CREATE VIEW user_stats AS
SELECT
  u.id,
  u.username,
  u.followers_count,
  u.following_count,
  u.posts_count,
  COUNT(DISTINCT p.id) as actual_posts,
  COUNT(DISTINCT f.id) as actual_followers
FROM users u
LEFT JOIN posts p ON u.id = p.user_id AND p.status = 'published'
LEFT JOIN follows f ON u.id = f.following_id
GROUP BY u.id;

-- View: Trending Posts
CREATE VIEW trending_posts AS
SELECT
  p.id,
  p.user_id,
  u.username,
  p.caption,
  p.likes_count,
  p.comments_count,
  (p.likes_count + p.comments_count * 2) as engagement_score,
  p.created_at
FROM posts p
INNER JOIN users u ON p.user_id = u.id
WHERE p.status = 'published'
ORDER BY engagement_score DESC
LIMIT 100;

-- ====================================
-- Step 12: Summary
-- ====================================

/**
 * Created Tables:
 * 1. users - User accounts
 * 2. posts - User posts
 * 3. comments - Comments on posts
 * 4. likes - Likes on posts/comments
 * 5. follows - User follows
 * 6. notifications - System notifications
 * 7. hashtags - Hashtag tracking
 * 8. post_hashtags - Post-hashtag relationships
 *
 * Relationships:
 * - users (1) : posts (Many)
 * - users (1) : comments (Many)
 * - users (1) : likes (Many)
 * - users (1) : follows (Many)
 * - posts (1) : comments (Many)
 * - posts (1) : likes (Many)
 * - comments (1) : likes (Many)
 * - hashtags (Many) : posts (Many)
 *
 * Constraints:
 * - ON DELETE CASCADE for data integrity
 * - UNIQUE constraints to prevent duplicates
 * - Foreign keys for relationships
 * - Proper indexes for performance
 *
 * Performance Features:
 * - Denormalized counters (followers_count, likes_count)
 * - Strategic indexes on frequently queried columns
 * - Views for complex queries
 * - Soft delete support (status column)
 *
 * Ready for Phase 4 implementation!
 */
