// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { submitApplication } from './controllers/merchantController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 🌟 1. 加入一個簡單的 Request Logger (Debug 用)
// 這會在你的 PM2 日誌裡顯示 Node.js 到底收到了什麼路徑
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 🌟 2. 終極兼容路由：不管 Nginx 怎麼丟，這三個路徑我們都接住
const statusHandler = (req: any, res: any) => {
  res.send('GO PRIME 隔離伺服器運行中 🚀 (v1.0.1)');
};

// 同時接住 /、/api/prime 與 /api/prime/
app.get('/', statusHandler);
app.get('/api/prime', statusHandler);
app.get('/api/prime/', statusHandler);

// 🌟 3. API 路由設定 (同樣採全路徑寫法，避免 Router 匹配失敗)
app.post('/api/prime/apply', submitApplication);

app.listen(PORT, () => {
  console.log(`
  ==========================================
  ✅ GO PRIME 後端已啟動
  📡 內網埠號: ${PORT}
  🔗 外網對接: https://eats-api.goverce.com/api/prime
  ==========================================
  `);
});