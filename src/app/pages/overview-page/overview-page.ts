import { Component, signal } from '@angular/core';
import { RepoCard, Repository } from '../../components/repo-card/repo-card';
import { ContributionHeatmap } from '../../components/contribution-heatmap/contribution-heatmap';
import { ContributionActivity } from '../../components/contribution-activity/contribution-activity';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [RepoCard, ContributionHeatmap, ContributionActivity],
  templateUrl: './overview-page.html',
  styleUrl: './overview-page.css',
})
export class OverviewPage {
  availableYears = [2026, 2025, 2024, 2023, 2022];
  selectedYear = signal<number>(2026);

  selectYear(year: number) {
    this.selectedYear.set(year);
  }
  repositories: Repository[] = [
    {
      name: 'Complete-Python-3-Bootcamp',
      visibility: 'Public',
      forkedFrom: 'Pierian-Data/Complete-Python-3-Bootcamp',
      description: 'Course Files for Complete Python 3 Bootcamp Course on Udemy',
      language: 'Jupyter Notebook',
      languageColor: '#DA5B0B',
    },

    {
      name: 'flutter_login_ui',
      visibility: 'Public',
      forkedFrom: 'MarcusNg/flutter_login_ui',
      description: 'https://youtu.be/6kaETbf444',
      language: 'Dart',
      languageColor: '#00B4AB',
    },

    {
      name: 'gitignore',
      visibility: 'Public',
      forkedFrom: 'github/gitignore',
      description: 'A collection of useful .gitignore templates',
      language: undefined,
    },

    {
      name: 'node-opcua-logger',
      visibility: 'Public',
      forkedFrom: 'coussej/node-opcua-logger',
      description: 'An OPCUA Client for logging data to InfluxDB! 📡🎂',
      language: 'JavaScript',
      languageColor: '#F1E05A',
    },

    {
      name: 'kafkajs',
      visibility: 'Public',
      forkedFrom: 'tulios/kafkajs',
      description: 'A modern Apache Kafka client for node.js',
      language: 'JavaScript',
      languageColor: '#F1E05A',
    },

    {
      name: 'node-opcua-1',
      visibility: 'Public',
      forkedFrom: 'node-opcua/node-opcua',
      description:
        'an implementation of a OPC UA stack fully written in javascript and nodejs - http://node-opcua.github.io/',
      language: 'TypeScript',
      languageColor: '#3178C6',
    },
  ];
}
