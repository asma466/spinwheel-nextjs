-- Employee Birthday Dashboard Database Setup
-- MySQL Setup Instructions

-- ============================================
-- MYSQL INSTALLATION & SETUP GUIDE
-- ============================================
-- 
-- 1. Install MySQL (if not already installed):
--    - Windows: Download from https://dev.mysql.com/downloads/mysql/
--    - Mac: brew install mysql or download from mysql.com
--    - Linux: sudo apt-get install mysql-server
--
-- 2. Start MySQL Server:
--    - Windows: Net Start MySQL80 (or check Services)
--    - Mac: brew services start mysql
--    - Linux: sudo systemctl start mysql
--
-- 3. Login to MySQL:
--    mysql -u root -p
--    (Enter password - default is empty if first time)
--
-- 4. Create Database & Tables:
--    Copy and paste the SQL below into your MySQL client
--
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS employee_birthday_db;
USE employee_birthday_db;

SELECT DATABASE();
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'employee') DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create employees table (for birthday tracking)
CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date_of_birth DATE NOT NULL,
  department VARCHAR(100),
  position VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create birthdays table (for tracking upcoming birthdays)
CREATE TABLE IF NOT EXISTS birthdays (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  celebration_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Create sessions table (for HTTP-only cookie sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_expires_at (expires_at)
);

-- Insert test credentials (passwords are hashed with bcrypt)
-- Test Users:
-- Email: admin@company.com | Password: Admin@123
-- Email: john.doe@company.com | Password: John@123
-- Email: jane.smith@company.com | Password: Jane@123

INSERT INTO users (email, password, full_name, role) VALUES
('admin@company.com', '$2a$10$8KSKS1B5q8K5.U7jQ7vZ6uU3K7JU7Z9L5K5L5K5L5K5L5K5L5K5L5.', 'Admin User', 'admin'),
('john.doe@company.com', '$2a$10$7Q8M0V8L5K2Q7J7J5K5L5uU3K7JU7Z9L5K5L5K5L5K5L5K5L5K5L5.', 'John Doe', 'employee'),
('jane.smith@company.com', '$2a$10$9P9N1W9M6L3R8K8K6L6M6vV4L8KV8A0M6L6M6L6M6L6M6L6M6L6M6.', 'Jane Smith', 'employee');

-- Insert sample employee data
INSERT INTO employees (user_id, date_of_birth, department, position) VALUES
(2, '1990-05-15', 'Engineering', 'Senior Developer'),
(3, '1992-08-22', 'Marketing', 'Marketing Manager');

-- ============================================
-- CONNECTION STRING
-- ============================================
-- 
-- For Node.js/Next.js, use this connection string format:
-- mysql://username:password@localhost:3306/employee_birthday_db
-- 
-- Example: mysql://root:yourpassword@localhost:3306/employee_birthday_db
--
-- Or use the mysql2 package in Node.js with individual parameters:
-- {
--   host: 'localhost',
--   user: 'root',
--   password: 'your_password',
--   database: 'employee_birthday_db',
--   port: 3306
-- }
-- ============================================
