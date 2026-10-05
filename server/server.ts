import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const url = 'https://api.github.com';
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    message: 'Server is working',
  });
});

const query = `
  query {
    user(login: "annkitabarman") {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
              weekday
            }
          }
        }
      }
    }
  }
`;

app.get('/api/github/contributions', async (req, res) => {
  try {
    const response = await fetch(`${url}/graphql`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    const calendar = data.data.user.contributionsCollection.contributionCalendar;
    res.json(calendar);
  } catch (err) {
    console.error('Failed to fetch contributions.', err);
    return res.status(500).json({ message: 'Failed to fetch contributions' });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
