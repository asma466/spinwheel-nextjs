const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

async function setupDatabase() {
  let connection;

  try {
    console.log('🔌 Connecting to MySQL...');
    connection = await mysql.createConnection(config);

    // Create database
    console.log('📦 Creating database...');
    await connection.execute('CREATE DATABASE IF NOT EXISTS employee_dashboard');
    await connection.execute('USE employee_dashboard');

    // Create employees table
    console.log('👥 Creating employees table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        department VARCHAR(255),
        date_of_birth DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create sessions table
    console.log('🔐 Creating sessions table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        employee_id INT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
        INDEX idx_employee_id (employee_id),
        INDEX idx_expires_at (expires_at)
      )
    `);

    // Insert demo employees
    console.log('📝 Inserting demo employees...');
    await connection.execute(`
      INSERT INTO employees (email, password_hash, name, department, date_of_birth) 
      VALUES 
        ('john@company.com', '$2b$10$Zl4hfnk/dAqBLqF/rKzFGO7qlDEyM5KKz7fxO7w/dw/KzFzO/bEVq', 'John Doe', 'Engineering', '1990-05-15'),
        ('jane@company.com', '$2b$10$Zl4hfnk/dAqBLqF/rKzFGO7qlDEyM5KKz7fxO7w/dw/KzFzO/bEVq', 'Jane Smith', 'Marketing', '1992-08-22')
      ON DUPLICATE KEY UPDATE updated_at = NOW()
    `);

    console.log('\n✅ Database setup completed successfully!\n');
    console.log('📧 Demo Credentials:');
    console.log('   Account 1:');
    console.log('   - Email: john@company.com');
    console.log('   - Password: password123\n');
    console.log('   Account 2:');
    console.log('   - Email: jane@company.com');
    console.log('   - Password: password123\n');
    console.log('🚀 Start your dev server with: npm run dev');

    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
