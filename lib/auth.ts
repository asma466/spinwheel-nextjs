import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'employee_dashboard',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function getConnection() {
  return pool.getConnection();
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function findEmployeeByEmail(email: string) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT id, email, password_hash, name, department FROM employees WHERE email = ?',
      [email]
    );
    const employees = rows as any[];
    return employees[0] || null;
  } finally {
    connection.release();
  }
}

export async function createSession(employeeId: number): Promise<string> {
  const connection = await getConnection();
  try {
    const sessionId = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    await connection.execute(
      'INSERT INTO sessions (id, employee_id, expires_at) VALUES (?, ?, ?)',
      [sessionId, employeeId, expiresAt]
    );
    
    return sessionId;
  } finally {
    connection.release();
  }
}

export async function getSessionEmployee(sessionId: string) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT e.id, e.email, e.name, e.department 
       FROM sessions s 
       JOIN employees e ON s.employee_id = e.id 
       WHERE s.id = ? AND s.expires_at > NOW()`,
      [sessionId]
    );
    const sessions = rows as any[];
    return sessions[0] || null;
  } finally {
    connection.release();
  }
}

export async function deleteSession(sessionId: string) {
  const connection = await getConnection();
  try {
    await connection.execute('DELETE FROM sessions WHERE id = ?', [sessionId]);
  } finally {
    connection.release();
  }
}
