import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { RepoCard } from '../../components/repo-card/repo-card';
import { ContributionHeatmap } from '../../components/contribution-heatmap/contribution-heatmap';
import { ContributionActivity } from '../../components/contribution-activity/contribution-activity';
import { Repository, GithubService } from '../../services/github-service';
import { USER_NAME } from '../../constants/user.constant';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [RepoCard, ContributionHeatmap, ContributionActivity],
  templateUrl: './overview-page.html',
  styleUrl: './overview-page.css',
})
export class OverviewPage implements OnInit {
  availableYears = [2026, 2025, 2024, 2023, 2022];
  selectedYear = signal<number>(2026);
  private readonly githubService = inject(GithubService);
  private readonly destroyRef = inject(DestroyRef);

  selectYear(year: number) {
    this.selectedYear.set(year);
  }

  repositories = signal<Repository[]>([]);
  repositoriesLoading = signal(true);

  ngOnInit(): void {
    this.loadRepositories();
  }

  private loadRepositories() {
    this.githubService
      .getRepositories(USER_NAME)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.repositories.set(response.nodes);
          this.repositoriesLoading.set(false);
        },
        error: (error) => {
          console.error('Failed to load popular repositories:', error);
          this.repositoriesLoading.set(false);
        },
      });
  }
}
