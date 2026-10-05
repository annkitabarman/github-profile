import { Router, Request, Response } from 'express';

const router = Router();

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

const CONTRIBUTION_ACTIVITY_QUERY = `
  query ContributionActivity(
    $login: String!
    $from: DateTime!
    $to: DateTime!
  ) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {

        totalCommitContributions

        commitContributionsByRepository(maxRepositories: 100) {
          repository {
            name
            nameWithOwner
            url
            primaryLanguage {
              name
              color
            }
          }

          contributions(
            first: 100
            orderBy: {
              field: OCCURRED_AT
              direction: DESC
            }
          ) {
            nodes {
              occurredAt
              commitCount
              repository {
                name
                nameWithOwner
                url
              }
            }
          }
        }

        repositoryContributions(first: 100) {
          nodes {
            occurredAt
            repository {
              name
              nameWithOwner
              url
              primaryLanguage {
                name
                color
              }
            }
          }
        }

        issueContributions(first: 100) {
          nodes {
            occurredAt
            issue {
              title
              url
              repository {
                name
                nameWithOwner
                url
              }
            }
          }
        }

        pullRequestContributions(first: 100) {
          nodes {
            occurredAt
            pullRequest {
              title
              url
              repository {
                name
                nameWithOwner
                url
              }
            }
          }
        }
      }
    }
  }
`;

router.get('/contribution-activity/:username/:year', async (req: Request, res: Response) => {
  try {
    const { username, year } = req.params;

    const numericYear = Number(year);

    if (!username || !Number.isInteger(numericYear)) {
      return res.status(400).json({
        message: 'Username and valid year are required',
      });
    }

    const from = `${numericYear}-01-01T00:00:00Z`;
    const to = `${numericYear}-12-31T23:59:59Z`;

    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github+json',
      },

      body: JSON.stringify({
        query: CONTRIBUTION_ACTIVITY_QUERY,

        variables: {
          login: username,
          from,
          to,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok || result.errors) {
      console.error('GitHub GraphQL error:', result.errors);

      return res.status(500).json({
        message: 'Failed to fetch GitHub contribution activity',
        errors: result.errors,
      });
    }

    const collection = result.data.user.contributionsCollection;

    return res.json(collection);
  } catch (error) {
    console.error('Contribution activity error:', error);

    return res.status(500).json({
      message: 'Failed to fetch contribution activity',
    });
  }
});

router.get('/contributions/:username/:year', async (req: Request, res: Response) => {
  try {
    const { username, year: yearParam } = req.params;

    const year = Number(yearParam);

    if (!username || !Number.isInteger(year)) {
      return res.status(400).json({
        message: 'Username and valid year are required',
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

    const response = await fetch(GITHUB_GRAPHQL_URL, {
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

const REPOSITORIES_QUERY = `
  query PopularRepositories($login: String!, $first: Int!) {
    user(login: $login) {
      topRepositories(
        first: $first
        orderBy: {
          field: STARGAZERS
          direction: DESC
        }
      ) {
        totalCount

        nodes {
          id
          name
          nameWithOwner
          description
          url
          isPrivate
          isFork
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
          parent {
            nameWithOwner
            url
          }
        }
      }
    }
  }
`;
router.get('/repositories/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        message: 'Username is required',
      });
    }

    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github+json',
      },

      body: JSON.stringify({
        query: REPOSITORIES_QUERY,
        variables: {
          login: username,
          first: 6,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok || result.errors) {
      console.error('GitHub GraphQL error:', result.errors);

      return res.status(500).json({
        message: 'Failed to fetch popular repositories',
        errors: result.errors,
      });
    }

    return res.json(result.data?.user?.topRepositories);
  } catch (error) {
    console.error('Popular repositories error:', error);

    return res.status(500).json({
      message: 'Failed to fetch popular repositories',
    });
  }
});

export default router;
