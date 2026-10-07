import {
  Component,
  ElementRef,
  OnDestroy,
  effect,
  input,
  signal,
  viewChild,
  inject,
  DestroyRef,
} from '@angular/core';
import { formatDate } from '@angular/common';

import * as echarts from 'echarts';

import { GithubService } from '../../services/github-service';
import { ContributionCalendar } from '../../models/github.contribution.model';
import { USER_NAME } from '../../constants/user.constant';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-contribution-heatmap',
  standalone: true,
  templateUrl: './contribution-heatmap.html',
  styleUrl: './contribution-heatmap.css',
})
export class ContributionHeatmap implements OnDestroy {
  selectedYear = input.required<number>();

  chartElement = viewChild<ElementRef<HTMLDivElement>>('chart');

  calendar = signal<ContributionCalendar | null>(null);

  private readonly githubService = inject(GithubService);
  private readonly destroyRef = inject(DestroyRef);

  private chart = signal<echarts.ECharts | null>(null);

  constructor() {
    effect(() => {
      const year = this.selectedYear();
      const chartElement = this.chartElement();

      if (!year || !chartElement) {
        return;
      }

      this.githubService
        .getContributionsData(USER_NAME, year)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data) => {
            this.calendar.set(data);

            if (!this.chart()) {
              this.createChart();
            } else {
              this.updateChart();
            }
          },

          error: (error) => {
            console.error('Failed to fetch contributions:', error);
          },
        });
    });
  }

  toOrdinalDate(value: string | Date): string {
    const day = new Date(value).getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? 'st'
        : day % 10 === 2 && day !== 12
          ? 'nd'
          : day % 10 === 3 && day !== 13
            ? 'rd'
            : 'th';

    return `${formatDate(value, 'MMMM', 'en-US')} ${day}${suffix}`;
  }

  private getContributionData(): {
    value: [string, number];
    itemStyle: {
      color: string;
      borderColor: string;
      borderWidth: number;
      borderRadius: number;
    };
  }[] {
    const calendar = this.calendar();

    if (!calendar) {
      return [];
    }

    return calendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        value: [day.date, day.contributionCount],

        itemStyle: {
          color: day.contributionCount === 0 ? '#f2f5f7' : day.color,

          borderColor: '#e6e6e6',
          borderWidth: 0.5,
          borderRadius: 3,
        },
      })),
    );
  }

  private getDateRange(): [string, string] {
    const calendar = this.calendar();

    if (!calendar || !calendar.weeks.length) {
      return ['', ''];
    }

    const days = calendar.weeks.flatMap((week) => week.contributionDays);

    const startDate = days[0].date;

    const today = new Date().toISOString().split('T')[0];

    const currentYear = new Date().getFullYear();

    const endDate = this.selectedYear() === currentYear ? today : days[days.length - 1].date;

    return [startDate, endDate];
  }

  private createChart(): void {
    const chartElement = this.chartElement();

    if (!chartElement || !this.calendar()) {
      return;
    }

    this.chart.set(echarts.init(chartElement.nativeElement));

    this.chart()?.setOption({
      tooltip: {
        formatter: (params: any) => {
          const value = params.value;

          return `
            <div style="font-size: 0.8rem;">
              ${value[1]} contributions on ${this.toOrdinalDate(value[0])}
            </div>
          `;
        },
      },

      visualMap: {
        show: false,
        min: 0,
        max: 1,
        dimension: 1,
      },

      calendar: {
        range: this.getDateRange(),

        cellSize: [12, 12],

        top: 35,
        left: 45,
        right: 20,
        bottom: 20,

        yearLabel: {
          show: false,
        },

        monthLabel: {
          nameMap: 'en',
          color: '#57606a',
          fontSize: 12,
        },

        dayLabel: {
          firstDay: 1,
          nameMap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          color: '#57606a',
          fontSize: 12,
        },

        itemStyle: {
          borderRadius: 3,
        },

        splitLine: {
          show: false,
        },
      },

      series: [
        {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          calendarIndex: 0,

          data: this.getContributionData(),
        },
      ],
    });

    window.addEventListener('resize', this.handleResize);
  }

  private updateChart(): void {
    if (!this.chart()) {
      return;
    }

    this.chart()?.setOption({
      calendar: {
        range: this.getDateRange(),
      },

      series: [
        {
          data: this.getContributionData(),
        },
      ],
    });
  }

  private handleResize = (): void => {
    this.chart()?.resize();
  };

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize);

    this.chart()?.dispose();
    this.chart.set(null);
  }
}
