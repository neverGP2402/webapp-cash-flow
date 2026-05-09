import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viewDir = path.join(__dirname, '../view');

// 1️⃣ Serve static assets (JS / CSS / images)
app.use(express.static(viewDir));

// 2️⃣ SPA fallback — CHỈ cho route không có dấu "."
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();

  // nếu request là file (.js .css .svg .png ...) → bỏ qua
  if (req.path.includes('.')) return next();

  res.sendFile(path.join(viewDir, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
