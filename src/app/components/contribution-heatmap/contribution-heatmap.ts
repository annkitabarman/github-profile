import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  signal,
  input,
  inject,
  effect,
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
export class ContributionHeatmap implements AfterViewInit, OnDestroy {
  @ViewChild('chart')
  chartElement!: ElementRef<HTMLDivElement>;
  private readonly githubService = inject(GithubService);
  private chart: echarts.ECharts | null = null;

  calendar = signal<ContributionCalendar | null>(null);

  selectedYear = input<number>(2026);

  // Years available in the dropdown
  availableYears = input<number[]>([]);
  contributionData = computed<[string, number][]>(() => {
    const calendar = this.calendar();

    if (!calendar) {
      return [];
    }

    const today = new Date().toISOString().split('T')[0];

    return calendar.weeks
      .flatMap((week) =>
        week.contributionDays.map((day): [string, number] => [day.date, day.contributionCount]),
      )
      .filter(([date]) => date <= today);
  });

  maxContributions = computed(() => {
    const values = this.contributionData().map((item) => item[1]);

    return Math.max(...values, 1);
  });

  constructor() {
    effect(() => {
      const year = this.selectedYear();

      if (this.chart) {
        this.fetchContributions();
      }
    });
  }

  ngAfterViewInit(): void {
    this.fetchContributions();
  }

  private fetchContributions(): void {
    this.githubService.getContributionsData('annkitabarman', this.selectedYear()).subscribe({
      next: (data) => {
        this.calendar.set(data);

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
  private getDateRange(): [string, string] {
    const calendar = this.calendar();

    if (!calendar || !calendar.weeks.length) {
      return ['', ''];
    }

    const days = calendar.weeks.flatMap((week) => week.contributionDays);

    const startDate = days[0].date;

    const today = new Date().toISOString().split('T')[0];

    // Don't allow the calendar to extend beyond today
    const endDate =
      this.selectedYear() === new Date().getFullYear() ? today : days[days.length - 1].date;

    return [startDate, endDate];
  }

  private createChart(): void {
    const calendar = this.calendar();

    if (!calendar || !this.chartElement) {
      return;
    }

    this.chart = echarts.init(this.chartElement.nativeElement);

    this.chart.setOption({
      tooltip: {
        formatter: (params: any) => {
          return `${params.value[0]}: ${params.value[1]} contributions`;
        },
      },

      visualMap: {
        min: 0,
        max: this.maxContributions(),
        calculable: false,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        show: false,

        inRange: {
          color: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
        },
      },

      calendar: {
        range: this.getDateRange(),
        cellSize: ['auto', 12],
        top: 20,
        left: 40,
        right: 20,
        bottom: 10,
        splitLine: {
          show: false,
        },
        itemStyle: {
          borderWidth: 2,
          borderColor: '#fff',
        },
        yearLabel: {
          show: false,
        },
        monthLabel: {
          nameMap: 'en',
        },
        dayLabel: {
          firstDay: 1,
          nameMap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        },
      },

      series: [
        {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          calendarIndex: 0,
          data: this.contributionData(),
        },
      ],
    });

    window.addEventListener('resize', this.handleResize);
  }

  private updateChart(): void {
    if (!this.chart) {
      return;
    }

    this.chart.setOption({
      visualMap: {
        min: 0,
        max: this.maxContributions(),
      },

      calendar: {
        range: this.getDateRange(),
      },

      series: [
        {
          data: this.contributionData(),
        },
      ],
    });
  }

  private handleResize = (): void => {
    this.chart?.resize();
  };

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize);

    this.chart?.dispose();
  }
}
