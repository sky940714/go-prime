// backend/src/config/database.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// 建立與 MySQL 的連線池
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'go_prime',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;