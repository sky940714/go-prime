// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  submitApplication,
  getApplications,
  reviewApplication,
} from './controllers/merchantController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ─── Health Check ────────────────────────────────────────────
const statusHandler = (req: any, res: any) => {
  res.send('GO PRIME 隔離伺服器運行中 🚀 (v1.1.0)');
};
app.get('/', statusHandler);

// ─── 商家申請 API ────────────────────────────────────────────
app.post('/apply', submitApplication);
app.get('/applications', getApplications);
app.put('/applications/:id/review', reviewApplication);

// ─── 啟動 ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ==========================================
  ✅ GO PRIME 後端已啟動
  📡 內網埠號: ${PORT}
  🔗 API Base: https://prime-api.goverce.com
  
  路由清單:
  POST   /apply
  GET    /applications?status=pending
  PUT    /applications/:id/review
  ==========================================
  `);
});