export interface GithubRepository {
  name: string;
  nameWithOwner: string;
  url: string;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
}

export interface CommitContribution {
  occurredAt: string;
  commitCount: number;
  repository: GithubRepository;
}

export interface CommitRepositoryContribution {
  repository: GithubRepository;
  contributions: {
    nodes: CommitContribution[];
  };
}

export interface RepositoryContribution {
  occurredAt: string;
  repository: GithubRepository;
}

export interface IssueContribution {
  occurredAt: string;
  issue: {
    title: string;
    url: string;
    repository: GithubRepository;
  };
}

export interface PullRequestContribution {
  occurredAt: string;
  pullRequest: {
    title: string;
    url: string;
    repository: GithubRepository;
  };
}

export interface ContributionActivityResponse {
  totalCommitContributions: number;

  commitContributionsByRepository: CommitRepositoryContribution[];

  repositoryContributions: {
    nodes: RepositoryContribution[];
  };

  issueContributions: {
    nodes: IssueContribution[];
  };

  pullRequestContributions: {
    nodes: PullRequestContribution[];
  };
}
