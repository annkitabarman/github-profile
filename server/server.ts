import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import githubRoutes from './routes/github.routes';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);
app.use(express.json());
app.use('/api/github', githubRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
