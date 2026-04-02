// backend/controllers/merchantController.ts
import type { Request, Response } from 'express'; // 🌟 匯入型別必須加 type
import pool from '../config/database.js';         // 🌟 本地檔案匯入必須加 .js
import bcrypt from 'bcrypt';

export const submitApplication = async (req: Request, res: Response) => {
  const { shopName, category, phone, email, lineId, igLink } = req.body;
  
  try {
    // 檢查必填
    if (!shopName || !phone || !email) {
      res.status(400).json({ message: '店名、電話與 Email 為必填項目' });
      return;
    }

    const [result] = await pool.execute(
      'INSERT INTO merchant_applications (shop_name, category, phone, email, line_id, ig_link) VALUES (?, ?, ?, ?, ?, ?)',
      [shopName, category, phone, email, lineId || null, igLink || null]
    );

    res.status(201).json({ message: 'Success', id: (result as any).insertId });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ message: 'Database Error', error });
  }
};