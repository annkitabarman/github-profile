import { Component, Input } from '@angular/core';

export interface Repository {
  name: string;
  visibility: string;
  forkedFrom?: string;
  description?: string;
  language?: string;
  languageColor?: string;
}

@Component({
  selector: 'app-repository-card',
  standalone: true,
  templateUrl: './repo-card.html',
  styleUrl: './repo-card.css',
})
export class RepoCard {
  @Input({ required: true })
  repository!: Repository;
}
