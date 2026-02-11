-- Create employees table for login
CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  date_of_birth DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create sessions table for session management
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(255) PRIMARY KEY,
  employee_id INT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  INDEX idx_employee_id (employee_id),
  INDEX idx_expires_at (expires_at)
);

-- Insert sample employees (passwords are hashed with bcrypt)
-- Email: john@company.com, Password: password123
-- Email: jane@company.com, Password: password123
INSERT INTO employees (email, password_hash, name, department, date_of_birth) VALUES
('john@company.com', '$2b$10$Zl4hfnk/dAqBLqF/rKzFGO7qlDEyM5KKz7fxO7w/dw/KzFzO/bEVq', 'John Doe', 'Engineering', '1990-05-15'),
('jane@company.com', '$2b$10$Zl4hfnk/dAqBLqF/rKzFGO7qlDEyM5KKz7fxO7w/dw/KzFzO/bEVq', 'Jane Smith', 'Marketing', '1992-08-22')
ON DUPLICATE KEY UPDATE updated_at = NOW();
