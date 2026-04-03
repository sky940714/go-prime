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
app.get('/api/prime', statusHandler);
app.get('/api/prime/', statusHandler);

// ─── 商家申請 API ────────────────────────────────────────────
// App 端：送出申請
app.post('/api/prime/apply', submitApplication);

// Admin 端：查詢列表（支援 ?status=pending）
app.get('/api/prime/applications', getApplications);

// Admin 端：審核（核准 or 拒絕）
app.put('/api/prime/applications/:id/review', reviewApplication);

// ─── 啟動 ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ==========================================
  ✅ GO PRIME 後端已啟動
  📡 內網埠號: ${PORT}
  🔗 API Base: https://eats-api.goverce.com/api/prime
  
  路由清單:
  POST   /api/prime/apply
  GET    /api/prime/applications?status=pending
  PUT    /api/prime/applications/:id/review
  ==========================================
  `);
});