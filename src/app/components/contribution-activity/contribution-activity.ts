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
  GithubRepository,
  RepositoryContribution,
} from '../../models/contribution-activity.model';
import {
  GitCommitHorizontal,
  GitPullRequest,
  FolderGit2,
  GitBranch,
  LucideAngularModule,
} from 'lucide-angular';

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
  imports: [LucideAngularModule],
})
export class ContributionActivity {
  readonly GitCommitHorizontal = GitCommitHorizontal;
  readonly FolderGit2 = FolderGit2;
  private readonly githubService = inject(GithubService);

  readonly selectedYear = input.required<number>();

  readonly activity = signal<ContributionActivityResponse | null>(null);

  readonly loading = signal(false);

  readonly error = signal(false);

  readonly showAll = signal(false);

  readonly targetMonth = computed(() => {
    const year = this.selectedYear();

    const now = new Date();

    if (year === now.getFullYear()) {
      return now.getMonth();
    }

    return 11; // December
  });

  readonly targetMonthKey = computed(() => {
    const year = this.selectedYear();

    const month = this.targetMonth() + 1;

    return `${year}-${String(month).padStart(2, '0')}`;
  });

  // =====================================================
  // Commit activity
  // =====================================================

  readonly commitMonths = computed<MonthCommitActivity[]>(() => {
    const data = this.activity();

    if (!data) {
      return [];
    }

    const selectedYear = this.selectedYear();

    const targetMonth = this.targetMonth();

    // -----------------------------------------------------
    // Get commits only for the target month
    // -----------------------------------------------------

    const commits = data.commitContributionsByRepository
      .flatMap((repo) =>
        repo.contributions.nodes.map((contribution) => ({
          ...contribution,
          repository: repo.repository,
        })),
      )
      .filter((commit) => {
        const date = new Date(commit.occurredAt);

        return date.getFullYear() === selectedYear && date.getMonth() === targetMonth;
      })
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

    if (commits.length === 0) {
      return [];
    }

    // -----------------------------------------------------
    // Group by repository
    // -----------------------------------------------------

    const repositoryMap = new Map<string, RepositoryCommitSummary>();

    for (const commit of commits) {
      const key = commit.repository.nameWithOwner;

      const existing = repositoryMap.get(key);

      if (existing) {
        existing.commits += commit.commitCount;
      } else {
        repositoryMap.set(key, {
          repository: commit.repository,

          commits: commit.commitCount,
        });
      }
    }

    // -----------------------------------------------------
    // Sort repositories by commit count
    // -----------------------------------------------------

    const repositories = Array.from(repositoryMap.values()).sort((a, b) => b.commits - a.commits);

    // -----------------------------------------------------
    // Return one month
    // -----------------------------------------------------

    return [
      {
        month: this.targetMonthKey(),

        repositories,

        totalCommits: repositories.reduce(
          (total, repository) => total + repository.commits,

          0,
        ),
      },
    ];
  });

  // =====================================================
  // Repository creation activity
  // =====================================================

  readonly repositoryMonths = computed<MonthRepositoryActivity[]>(() => {
    const data = this.activity();

    if (!data) {
      return [];
    }

    const selectedYear = this.selectedYear();

    const targetMonth = this.targetMonth();

    // -----------------------------------------------------
    // Only repositories created during target month
    // -----------------------------------------------------

    const repositories = data.repositoryContributions.nodes
      .filter((repository) => {
        const date = new Date(repository.occurredAt);

        return date.getFullYear() === selectedYear && date.getMonth() === targetMonth;
      })
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

    if (repositories.length === 0) {
      return [];
    }

    return [
      {
        month: this.targetMonthKey(),

        repositories,
      },
    ];
  });

  // =====================================================
  // Has activity
  // =====================================================

  readonly hasActivity = computed(() => {
    return this.commitMonths().length > 0 || this.repositoryMonths().length > 0;
  });

  // =====================================================
  // Load data whenever selected year changes
  // =====================================================

  constructor() {
    effect(() => {
      const year = this.selectedYear();

      this.loadActivity(year);
    });
  }

  // =====================================================
  // API
  // =====================================================

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
        console.error('Failed to load contribution activity:', error);

        this.activity.set(null);

        this.loading.set(false);

        this.error.set(true);
      },
    });
  }

  // =====================================================
  // Show more / less
  // =====================================================

  toggleShowAll(): void {
    this.showAll.update((value) => !value);
  }

  // =====================================================
  // Month name
  // =====================================================

  getMonthName(month: string): string {
    const date = new Date(`${month}-01T00:00:00`);

    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }

  // =====================================================
  // Commit bar width
  // =====================================================

  getCommitBarWidth(commits: number, repositories: RepositoryCommitSummary[]): number {
    const max = Math.max(...repositories.map((repository) => repository.commits));

    if (!max) {
      return 0;
    }

    return Math.max((commits / max) * 100, 8);
  }

  // =====================================================
  // Date formatting
  // =====================================================

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
}
