import { Component, ElementRef, OnDestroy, effect, input, signal, viewChild } from '@angular/core';

import * as echarts from 'echarts';

import { GithubService } from '../../services/github-service';
import { ContributionCalendar } from '../../models/github.contribution.model';

@Component({
  selector: 'app-contribution-heatmap',
  standalone: true,
  templateUrl: './contribution-heatmap.html',
  styleUrl: './contribution-heatmap.css',
})
export class ContributionHeatmap implements OnDestroy {
  // ============================================
  // Signal input
  // ============================================

  selectedYear = input.required<number>();

  // ============================================
  // Signal view query
  // ============================================

  chartElement = viewChild<ElementRef<HTMLDivElement>>('chart');

  // ============================================
  // Contribution data
  // ============================================

  calendar = signal<ContributionCalendar | null>(null);

  // ============================================
  // ECharts instance
  // ============================================

  private chart: echarts.ECharts | null = null;

  constructor(private githubService: GithubService) {
    effect((onCleanup) => {
      const year = this.selectedYear();
      const chartElement = this.chartElement();

      // Don't do anything until both exist
      if (!year || !chartElement) {
        return;
      }

      // Fetch contributions whenever selectedYear changes
      const subscription = this.githubService
        .getContributionsData('annkitabarman', year)
        .subscribe({
          next: (data) => {
            this.calendar.set(data);

            if (!this.chart) {
              this.createChart();
            } else {
              this.updateChart();
            }
          },

          error: (error) => {
            console.error('Failed to fetch contributions:', error);
          },
        });

      // Cancel previous request when selectedYear changes
      onCleanup(() => {
        subscription.unsubscribe();
      });
    });
  }

  // ============================================
  // Flatten contribution data
  // ============================================

  private getContributionData(): [string, number][] {
    const calendar = this.calendar();

    if (!calendar) {
      return [];
    }

    return calendar.weeks.flatMap((week) =>
      week.contributionDays.map((day): [string, number] => [day.date, day.contributionCount]),
    );
  }

  // ============================================
  // Date range
  // ============================================

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

  // ============================================
  // Create ECharts instance
  // ============================================

  private createChart(): void {
    const chartElement = this.chartElement();

    if (!chartElement || !this.calendar()) {
      return;
    }

    this.chart = echarts.init(chartElement.nativeElement);

    this.chart.setOption({
      tooltip: {
        formatter: (params: any) => {
          const value = params.value;

          return `
            <div style="font-size: 12px;">
              <strong>${value[0]}</strong><br/>
              ${value[1]} contributions
            </div>
          `;
        },
      },

      // ==========================================
      // Contribution colors
      // ==========================================

      visualMap: {
        type: 'piecewise',
        show: false,

        pieces: [
          {
            value: 0,
            color: '#f0fdf4',
          },
          {
            value: 1,
            color: '#86efac',
          },
          {
            min: 2,
            max: 3,
            color: '#4ade80',
          },
          {
            min: 4,
            max: 6,
            color: '#16a34a',
          },
          {
            min: 7,
            color: '#166534',
          },
        ],
      },

      // ==========================================
      // Calendar
      // ==========================================

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

      // ==========================================
      // Heatmap
      // ==========================================

      series: [
        {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          calendarIndex: 0,

          itemStyle: {
            borderRadius: 3,
          },

          data: this.getContributionData(),
        },
      ],
    });

    window.addEventListener('resize', this.handleResize);
  }

  // ============================================
  // Update existing chart
  // ============================================

  private updateChart(): void {
    if (!this.chart) {
      return;
    }

    this.chart.setOption({
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

  // ============================================
  // Resize
  // ============================================

  private handleResize = (): void => {
    this.chart?.resize();
  };

  // ============================================
  // Cleanup
  // ============================================

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize);

    this.chart?.dispose();
    this.chart = null;
  }
}
