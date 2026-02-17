import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wheel_db',
  port: Number.parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function checkStringExists(generatedString: string): Promise<boolean> {
  const [rows] = await pool.execute('SELECT 1 FROM active WHERE tenstringid = ? LIMIT 1', [
    generatedString,
  ]);
  return Array.isArray(rows) && rows.length > 0;
}

export async function insertActiveRecord(data: {
  name: string;
  email: string;
  tenstringid: string;
  expirydate: string | Date;
  prize: string;
}): Promise<number> {
  const [result] = await pool.execute(
    'INSERT INTO active (name, email, tenstringid, expirydate, prize, status) VALUES (?, ?, ?, ?, ?, ?)',
    [data.name, data.email, data.tenstringid, data.expirydate, data.prize, 'active']
  );
  return (result as mysql.ResultSetHeader).insertId;
}

export async function checkActiveRecord(tenstringid: string) {
  const [rows] = await pool.execute(
    "SELECT * FROM active WHERE tenstringid = ? AND status = 'active' LIMIT 1",
    [tenstringid]
  );
  if (Array.isArray(rows) && rows.length > 0) {
    return rows[0];
  }
  return false;
}

export async function updateStatusToFinished(tenstringid: string): Promise<string> {
  await pool.execute(
    "UPDATE active SET status = 'finish' WHERE tenstringid = ? AND status = 'active'",
    [tenstringid]
  );
  return 'Record status updated to finished.';
}

export async function addperson(data: { name: string; email: string; date_of_birth: string | Date }) {
  const [result] = await pool.execute(
    'INSERT INTO employees (name, email, date_of_birth) VALUES (?, ?, ?)',
    [data.name, data.email, data.date_of_birth]
  );
  return (result as mysql.ResultSetHeader).insertId;
}

export async function checkbday() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;

  const [rows] = await pool.execute(
    'SELECT name, email, date_of_birth FROM employees WHERE DAY(date_of_birth) = ? AND MONTH(date_of_birth) = ?',
    [day, month]
  );
  return rows;
}

export default pool;
