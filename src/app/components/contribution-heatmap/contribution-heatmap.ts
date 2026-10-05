import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import * as echarts from 'echarts';

import { GithubService } from '../../services/github-service';
import { ContributionCalendar } from '../../models/github.contribution.model';

@Component({
  selector: 'app-contribution-heatmap',
  standalone: true,
  templateUrl: './contribution-heatmap.html',
  styleUrl: './contribution-heatmap.css',
})
export class ContributionHeatmap implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chart')
  chartElement!: ElementRef<HTMLDivElement>;

  @Input()
  selectedYear!: number;

  private chart: echarts.ECharts | null = null;

  calendar: ContributionCalendar | null = null;

  constructor(private githubService: GithubService) {}

  // ============================================
  // Initial chart setup
  // ============================================

  ngAfterViewInit(): void {
    this.fetchContributions();
  }

  // ============================================
  // React to year changes from parent
  // ============================================

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedYear'] && !changes['selectedYear'].firstChange) {
      this.fetchContributions();
    }
  }

  // ============================================
  // Fetch GitHub contribution data
  // ============================================

  private fetchContributions(): void {
    this.githubService.getContributionsData('annkitabarman', this.selectedYear).subscribe({
      next: (data) => {
        this.calendar = data;

        if (this.chart) {
          this.updateChart();
        } else {
          this.createChart();
        }
      },

      error: (error) => {
        console.error('Failed to fetch contributions:', error);
      },
    });
  }

  // ============================================
  // Flatten contribution data
  // ============================================

  private getContributionData(): [string, number][] {
    if (!this.calendar) {
      return [];
    }

    return this.calendar.weeks.flatMap((week) =>
      week.contributionDays.map((day): [string, number] => [day.date, day.contributionCount]),
    );
  }

  // ============================================
  // Maximum contribution count
  // ============================================

  private getMaxContributions(): number {
    const values = this.getContributionData().map((item) => item[1]);

    return Math.max(...values, 1);
  }

  // ============================================
  // Date range
  // ============================================

  private getDateRange(): [string, string] {
    if (!this.calendar || !this.calendar.weeks.length) {
      return ['', ''];
    }

    const days = this.calendar.weeks.flatMap((week) => week.contributionDays);

    const startDate = days[0].date;

    const today = new Date().toISOString().split('T')[0];

    const currentYear = new Date().getFullYear();

    const endDate = this.selectedYear === currentYear ? today : days[days.length - 1].date;

    return [startDate, endDate];
  }

  // ============================================
  // Create ECharts instance
  // ============================================

  private createChart(): void {
    if (!this.calendar || !this.chartElement) {
      return;
    }

    this.chart = echarts.init(this.chartElement.nativeElement);

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

      // Discrete GitHub-style contribution levels
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
            color: '#bbf7d0',
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

      calendar: {
        range: this.getDateRange(),

        // Actual calendar cell size
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
            color: '#bbf7d0',
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
