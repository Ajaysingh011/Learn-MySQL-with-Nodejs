# Phase 2: Database Mastery - Complete Explanation

## Ye Phase Kya Sikhayega?

Phase 2 mein tum sikhoge:
1. **MySQL setup aur basics**
2. **Database aur Table creation**
3. **CRUD operations** (Create, Read, Update, Delete)
4. **SQL Queries** (SELECT, INSERT, UPDATE, DELETE)
5. **Relationships** (Foreign Keys, Joins)
6. **Indexing aur Performance**
7. **Transactions**

---

## File Structure

```
phase2-database/
├── 1-mysql-basics.sql              ✅ MySQL installation guide
├── 2-create-tables.sql             ✅ Database schema
├── 3-crud-operations.sql           ✅ CRUD queries
├── 4-relationships-joins.sql       ✅ Joins aur relationships
├── 5-advanced-queries.sql          ✅ Complex queries
├── database-schema.png             ✅ Visual diagram
└── PHASE2_EXPLANATION.md           ✅ Ye file
```

---

## Detailed Explanation

### What is Database?

```
Database = Organized data storage

Real-world analogy:
File Cabinet = Old way (unorganized, slow)
Database = New way (organized, fast, relationships)

Excel file mein:
- Sheet 1: Users
- Sheet 2: Posts
- Links: Nahi hote (manual search)

Database mein:
- Table 1: Users
- Table 2: Posts
- Relationships: Automatic linking

Benefits:
✅ Fast retrieval (indexing ke through)
✅ Data consistency (ACID properties)
✅ Security (access control)
✅ Scalability (millions of records)
✅ Relationships (data linking)
```

### MySQL vs Excel

```
Excel                          MySQL
─────────────────────────────────────────
Limited rows (1M)              Unlimited rows
Manual sorting                 Automatic indexing
No relationships               Foreign keys
Slow for large data            Fast (indexes)
Single user access             Multi-user
No security                    User authentication
Manual backup                  Automated backup
```

### Data Types in MySQL

```
STRING TYPES:
  VARCHAR(50)     - Variable text (email, name)
  CHAR(10)        - Fixed text (country code)
  TEXT            - Large text (description)

NUMBER TYPES:
  INT             - Integer (-2^31 to 2^31)
  BIGINT          - Large integer
  FLOAT           - Decimal (price: 99.99)
  DECIMAL(10,2)   - Precise decimal

DATE/TIME:
  DATE            - YYYY-MM-DD
  DATETIME        - YYYY-MM-DD HH:MM:SS
  TIMESTAMP       - Automatic timestamp

BOOLEAN:
  BOOLEAN (or TINYINT(1))  - TRUE/FALSE

JSON (MySQL 5.7+):
  JSON            - JSON objects
```

### Constraints - Data Rules

```
PRIMARY KEY:
  - Unique aur NOT NULL
  - Har table mein ek
  - Auto-indexed
  Example: id INT PRIMARY KEY

UNIQUE:
  - Duplicate nahi
  - NULL allowed (multiple)
  Example: email VARCHAR(100) UNIQUE

NOT NULL:
  - Empty nahi ho sakta
  Example: name VARCHAR(100) NOT NULL

DEFAULT:
  - Default value if not provided
  Example: status VARCHAR(20) DEFAULT 'active'

CHECK:
  - Value range validation
  Example: age INT CHECK (age >= 18)

FOREIGN KEY:
  - Reference to another table
  Example: user_id INT REFERENCES users(id)
```

---

## Database Design Steps

### Step 1: Identify Tables

```
Instagram-like app:
Tables needed:
1. users - User accounts
2. posts - User posts
3. comments - Comments on posts
4. likes - Post likes
5. follows - User following relationships
```

### Step 2: Identify Columns

```
Users Table:
- id (PRIMARY KEY)
- username (UNIQUE)
- email (UNIQUE)
- password (hashed)
- bio
- created_at
```

### Step 3: Define Relationships

```
One-to-Many:
- 1 user → Many posts
- 1 post → Many comments
- 1 post → Many likes

Many-to-Many:
- Users follow Users (Through 'follows' table)
- Users can join Groups (Through 'user_groups' table)
```

### Step 4: Create Schema

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## SQL Queries Explained

### CREATE - Table banao

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### INSERT - Data add karo

```sql
-- Single insert
INSERT INTO users (name, email) 
VALUES ('Raj', 'raj@gmail.com');

-- Multiple inserts
INSERT INTO users (name, email) VALUES
('Priya', 'priya@gmail.com'),
('Amit', 'amit@gmail.com');
```

### SELECT - Data lao

```sql
-- All data
SELECT * FROM users;

-- Specific columns
SELECT name, email FROM users;

-- With condition
SELECT * FROM users WHERE name = 'Raj';

-- With filtering
SELECT * FROM users 
WHERE created_at > '2026-01-01'
ORDER BY created_at DESC
LIMIT 10;
```

### UPDATE - Data change karo

```sql
-- Single field
UPDATE users SET email = 'newemail@gmail.com' 
WHERE id = 1;

-- Multiple fields
UPDATE users 
SET name = 'Raj Kumar', email = 'raj@example.com'
WHERE id = 1;
```

### DELETE - Data remove karo

```sql
-- Single delete
DELETE FROM users WHERE id = 1;

-- Multiple delete
DELETE FROM users WHERE created_at < '2025-01-01';
```

---

## JOIN Explained

### INNER JOIN

```sql
SELECT u.name, p.caption
FROM users u
INNER JOIN posts p ON u.id = p.user_id;

Result: Sirf jo users ne posts kiye
Users with no posts: Nahi ayenge
```

### LEFT JOIN

```sql
SELECT u.name, p.caption
FROM users u
LEFT JOIN posts p ON u.id = p.user_id;

Result: Sab users + unka posts (agar ho)
Users with no posts: NULL posts dikhai denge
```

### RIGHT JOIN

```sql
SELECT u.name, p.caption
FROM users u
RIGHT JOIN posts p ON u.id = p.user_id;

Result: Sab posts + unka users
```

### FULL OUTER JOIN

```sql
MySQL mein nahi hota directly
Workaround:
SELECT * FROM users
LEFT JOIN posts ON ...
UNION
SELECT * FROM users
RIGHT JOIN posts ON ...
```

---

## Relationships Visualized

### One-to-Many

```
Users Table:
id | name
1  | Raj
2  | Priya

Posts Table:
id | user_id | caption
1  | 1       | Post 1
2  | 1       | Post 2
3  | 2       | Post 3

Relationship:
Raj (1 user) → Post 1, Post 2 (2 posts)
Priya (1 user) → Post 3 (1 post)

Foreign Key: posts.user_id → users.id
```

### Many-to-Many

```
Users Table:
id | name
1  | Raj
2  | Priya

Groups Table:
id | name
1  | Developers
2  | Designers

UserGroups Table (Bridge):
user_id | group_id
1       | 1
1       | 2
2       | 1

Relationship:
Raj → Developers, Designers
Priya → Developers

Foreign Keys:
user_groups.user_id → users.id
user_groups.group_id → groups.id
```

---

## Indexing for Performance

### Without Index

```sql
SELECT * FROM users WHERE email = 'raj@gmail.com';

Database check: Row 1, Row 2, Row 3, ..., Row 1000000
(Slow! Linear search)
```

### With Index

```sql
CREATE INDEX idx_email ON users(email);

SELECT * FROM users WHERE email = 'raj@gmail.com';

Database check: Direct lookup (Fast! Hash lookup)
```

### When to Index

```
✅ Index on:
- Primary keys (automatic)
- Foreign keys (relationships)
- Frequently searched columns (email, username)
- Sort columns

❌ Don't index:
- Low cardinality (few unique values)
- Columns in SELECT only
- Large text columns
```

---

## Transactions - ACID

### What is Transaction?

```
Transaction = Group of operations that all happen or none happen

Example: Money transfer
Account A: -100 rupees
Account B: +100 rupees

Dono operations MUST hone chahiye
Agar ek fail, dono undo ho jayenge
```

### Transaction Syntax

```sql
START TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT; -- Sab save karo
-- Ya
ROLLBACK; -- Sab undo karo
```

### ACID Properties

```
A - Atomicity:    All or Nothing
C - Consistency:  Database consistent rahe
I - Isolation:    Other transactions interfere nahi kren
D - Durability:   Once committed, permanent
```

---

## Common Queries Patterns

### Pagination

```sql
SELECT * FROM users
LIMIT 10 OFFSET 0;   -- Page 1

LIMIT 10 OFFSET 10;  -- Page 2

LIMIT 10 OFFSET 20;  -- Page 3

-- Formula: OFFSET = (page - 1) * limit
```

### Filtering

```sql
SELECT * FROM posts
WHERE user_id = 1 
AND created_at > '2026-01-01'
ORDER BY created_at DESC;
```

### Searching

```sql
SELECT * FROM users
WHERE name LIKE 'Raj%'  -- Starts with Raj
OR email LIKE '%@gmail.com';  -- Ends with @gmail.com
```

### Counting

```sql
SELECT COUNT(*) as total FROM users;
SELECT COUNT(*) as total FROM posts WHERE user_id = 1;
```

### Grouping

```sql
SELECT user_id, COUNT(*) as total_posts
FROM posts
GROUP BY user_id
HAVING COUNT(*) > 5;  -- Only users with 5+ posts
```

---

## Best Practices

```
1. Use appropriate data types
   ✅ INT for ages, not VARCHAR
   ✅ DECIMAL for money, not FLOAT

2. Add constraints
   ✅ PRIMARY KEY on every table
   ✅ NOT NULL where required
   ✅ UNIQUE for non-duplicate fields
   ✅ FOREIGN KEY for relationships

3. Index wisely
   ✅ Index primary keys (automatic)
   ✅ Index foreign keys
   ✅ Index frequently searched columns
   ❌ Don't index everything

4. Normalize tables
   ✅ Reduce data duplication
   ✅ Make updates easier
   ✅ Improve consistency

5. Backup regularly
   ✅ Daily backups
   ✅ Test restore process
   ✅ Keep backup copies

6. Use transactions
   ✅ For related operations
   ✅ To ensure consistency

7. Security
   ✅ Use parameterized queries (prevent SQL injection)
   ✅ Hash passwords
   ✅ Limit user permissions
```

---

## Learning Checklist

✅ MySQL installation  
✅ Database creation  
✅ Table design  
✅ Data types and constraints  
✅ CRUD operations  
✅ SELECT queries  
✅ Relationships and joins  
✅ Indexing  
✅ Transactions  

**Next:** Phase 3 - Backend Development with Node.js + MySQL!

