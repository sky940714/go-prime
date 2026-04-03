// backend/src/controllers/merchantController.ts
import type { Request, Response } from 'express';
import pool from '../config/database.js';

// ─── 1. 送出申請 (App 端呼叫) ────────────────────────────────
export const submitApplication = async (req: Request, res: Response) => {
  const { shopName, category, phone, lineId, igLink } = req.body;

  try {
    if (!shopName || !phone || !category) {
      res.status(400).json({ message: '店名、電話與類別為必填項目' });
      return;
    }

    const [result] = await pool.execute(
      `INSERT INTO merchant_applications 
        (shop_name, category, phone, line_id, ig_link) 
       VALUES (?, ?, ?, ?, ?)`,
      [shopName, category, phone, lineId || null, igLink || null]
    );

    res.status(201).json({
      message: '申請成功',
      id: (result as any).insertId,
    });
  } catch (error) {
    console.error('submitApplication Error:', error);
    res.status(500).json({ message: '伺服器錯誤', error });
  }
};

// ─── 2. 取得申請列表 (Admin 後台呼叫) ───────────────────────
export const getApplications = async (req: Request, res: Response) => {
  try {
    // 支援 ?status=pending / approved / rejected 過濾
    const { status } = req.query;

    let sql = `SELECT * FROM merchant_applications ORDER BY created_at DESC`;
    const params: string[] = [];

    if (status && ['pending', 'approved', 'rejected'].includes(status as string)) {
      sql = `SELECT * FROM merchant_applications WHERE status = ? ORDER BY created_at DESC`;
      params.push(status as string);
    }

    const [rows] = await pool.execute(sql, params);
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error('getApplications Error:', error);
    res.status(500).json({ message: '伺服器錯誤', error });
  }
};

// ─── 3. 審核申請：核准或拒絕 (Admin 後台呼叫) ───────────────
export const reviewApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { action } = req.body; // action: 'approve' | 'reject'

  try {
    if (!['approve', 'reject'].includes(action)) {
      res.status(400).json({ message: 'action 必須為 approve 或 reject' });
      return;
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    const [result] = await pool.execute(
      `UPDATE merchant_applications 
       SET status = ?, reviewed_at = NOW() 
       WHERE id = ?`,
      [newStatus, id]
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: '找不到此申請' });
      return;
    }

    res.status(200).json({ message: `已${action === 'approve' ? '核准' : '拒絕'}申請` });
  } catch (error) {
    console.error('reviewApplication Error:', error);
    res.status(500).json({ message: '伺服器錯誤', error });
  }
};