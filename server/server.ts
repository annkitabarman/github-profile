import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

const url = 'https://api.github.com';

app.use(cors());
app.use(express.json());

app.get('/api/github/contributions', async (req, res) => {
  try {
    const username = req.query.username as string;
    const year = Number(req.query.year);

    if (!username || !year) {
      return res.status(400).json({
        message: 'Username and year are required',
      });
    }

    const from = `${year}-01-01T00:00:00Z`;
    const to = `${year}-12-31T23:59:59Z`;

    const query = `
      query(
        $username: String!
        $from: DateTime!
        $to: DateTime!
      ) {
        user(login: $username) {
          contributionsCollection(
            from: $from
            to: $to
          ) {
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

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          username,
          from,
          to,
        },
      }),
    });

    const data = await response.json();

    console.log('GitHub response:', JSON.stringify(data, null, 2));

    if (data.errors) {
      return res.status(500).json({
        message: 'GitHub GraphQL error',
        errors: data.errors,
      });
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar;

    return res.json(calendar);
  } catch (error) {
    console.error('Failed to fetch contributions:', error);

    return res.status(500).json({
      message: 'Failed to fetch contributions',
    });
  }
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
