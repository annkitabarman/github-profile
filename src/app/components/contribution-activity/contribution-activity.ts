import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import { GithubService } from '../../services/github-service';

import {
  ContributionActivityResponse,
  CommitContribution,
  GithubRepository,
  RepositoryContribution,
} from '../../models/contribution-activity.model';

interface RepositoryCommitSummary {
  repository: GithubRepository;
  commits: number;
}

interface MonthCommitActivity {
  month: string;
  repositories: RepositoryCommitSummary[];
  totalCommits: number;
}

interface MonthRepositoryActivity {
  month: string;
  repositories: RepositoryContribution[];
}

@Component({
  selector: 'app-contribution-activity',
  standalone: true,
  templateUrl: './contribution-activity.html',
  styleUrl: './contribution-activity.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributionActivity {
  private readonly githubService = inject(GithubService);

  readonly selectedYear = input.required<number>();

  readonly activity = signal<ContributionActivityResponse | null>(null);

  readonly loading = signal(false);

  readonly error = signal(false);

  readonly showAll = signal(false);

  readonly commitMonths = computed<MonthCommitActivity[]>(() => {
    const data = this.activity();

    if (!data) {
      return [];
    }

    const commits = data.commitContributionsByRepository
      .flatMap((repo) =>
        repo.contributions.nodes.map((contribution) => ({
          ...contribution,
          repository: repo.repository,
        })),
      )
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

    const grouped = new Map<string, CommitContribution[]>();

    for (const commit of commits) {
      const month = this.getMonthKey(commit.occurredAt);

      if (!grouped.has(month)) {
        grouped.set(month, []);
      }

      grouped.get(month)!.push(commit);
    }

    return Array.from(grouped.entries())
      .map(([month, contributions]) => {
        const repositoryMap = new Map<string, RepositoryCommitSummary>();

        for (const contribution of contributions) {
          const key = contribution.repository.nameWithOwner;

          const existing = repositoryMap.get(key);

          if (existing) {
            existing.commits += contribution.commitCount;
          } else {
            repositoryMap.set(key, {
              repository: contribution.repository,
              commits: contribution.commitCount,
            });
          }
        }

        const repositories = Array.from(repositoryMap.values()).sort(
          (a, b) => b.commits - a.commits,
        );

        return {
          month,
          repositories,
          totalCommits: repositories.reduce((sum, repo) => sum + repo.commits, 0),
        };
      })
      .sort((a, b) => new Date(`${b.month}-01`).getTime() - new Date(`${a.month}-01`).getTime());
  });

  readonly repositoryMonths = computed<MonthRepositoryActivity[]>(() => {
    const data = this.activity();

    if (!data) {
      return [];
    }

    const repositories = [...data.repositoryContributions.nodes].sort(
      (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    );

    const grouped = new Map<string, RepositoryContribution[]>();

    for (const repo of repositories) {
      const month = this.getMonthKey(repo.occurredAt);

      if (!grouped.has(month)) {
        grouped.set(month, []);
      }

      grouped.get(month)!.push(repo);
    }

    return Array.from(grouped.entries())
      .map(([month, repositories]) => ({
        month,
        repositories,
      }))
      .sort((a, b) => new Date(`${b.month}-01`).getTime() - new Date(`${a.month}-01`).getTime());
  });

  readonly hasActivity = computed(() => {
    const data = this.activity();

    if (!data) {
      return false;
    }

    return (
      data.totalCommitContributions > 0 ||
      data.repositoryContributions.nodes.length > 0 ||
      data.issueContributions.nodes.length > 0 ||
      data.pullRequestContributions.nodes.length > 0
    );
  });

  constructor() {
    effect(() => {
      const year = this.selectedYear();

      this.loadActivity(year);
    });
  }

  private loadActivity(year: number): void {
    this.loading.set(true);
    this.error.set(false);
    this.showAll.set(false);

    this.githubService.getContributionActivity('annkitabarman', year).subscribe({
      next: (data) => {
        this.activity.set(data);
        this.loading.set(false);
      },

      error: (error) => {
        console.error('Failed to load contribution activity', error);

        this.activity.set(null);
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  toggleShowAll(): void {
    this.showAll.update((value) => !value);
  }

  getMonthName(month: string): string {
    const date = new Date(`${month}-01T00:00:00`);

    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }

  getCommitBarWidth(commits: number, repositories: RepositoryCommitSummary[]): number {
    const max = Math.max(...repositories.map((repository) => repository.commits));

    if (!max) {
      return 0;
    }

    return Math.max((commits / max) * 100, 8);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  private getMonthKey(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}`;
  }
}
