// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { submitApplication } from './controllers/merchantController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 1. 中間件設定
app.use(cors());
app.use(express.json());

// 2. 建立專屬 Router
// 這樣所有底下的路由都會自動帶上 /api/prime 前綴
const primeRouter = express.Router();

// 測試路徑：對應 https://eats-api.goverce.com/api/prime
primeRouter.get('/', (req, res) => {
  res.send('GO PRIME 隔離伺服器運行中 🚀');
});

// 商家申請：對應 https://eats-api.goverce.com/api/prime/apply
primeRouter.post('/apply', submitApplication);

// 3. 註冊路由 (將 Router 掛載到 Nginx 轉發的路徑上)
app.use('/api/prime', primeRouter);

// 4. 啟動監聽
app.listen(PORT, () => {
  console.log(`
  ==========================================
  ✅ GO PRIME 後端已就緒 (隔離模式)
  📡 內網埠號: ${PORT}
  🔗 外網對接: https://eats-api.goverce.com/api/prime
  ==========================================
  `);
});