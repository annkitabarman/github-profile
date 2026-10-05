import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import githubRoutes from './routes/github.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/github', githubRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
