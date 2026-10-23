import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiRouter } from './routes/api';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', apiRouter);

// Serve static frontend assets when built
const clientDistPath = path.resolve(__dirname, '../../dist/client');
app.use(express.static(clientDistPath));

// Fallback to index.html for SPA routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // In dev mode or if client hasn't been built yet
      res.send(`
        <!DOCTYPE html>
        <html>
          <head><title>TruthGuard API Server</title></head>
          <body style="font-family: sans-serif; background: #0b0f19; color: #fff; padding: 40px; text-align: center;">
            <h1 style="color: #6366f1;">TruthGuard Server is Running</h1>
            <p style="color: #94a3b8;">API endpoints are live under <code>/api</code>.</p>
            <p>Run <code>npm run dev:client</code> to serve the interactive React frontend in development, or <code>npm run build</code> to produce production assets.</p>
            <p><a href="/api/health" style="color: #38bdf8;">Check /api/health</a></p>
          </body>
        </html>
      `);
    }
  });
});

app.listen(PORT, () => {
  console.log(`[TruthGuard] Server running on http://localhost:${PORT}`);
  console.log(`[TruthGuard] Mode: ${process.env.OPENAI_API_KEY ? 'LIVE_AI' : 'DEMO_DETERMINISTIC'}`);
});
