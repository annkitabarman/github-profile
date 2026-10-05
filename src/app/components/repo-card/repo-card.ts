import { Component, input } from '@angular/core';
import { Repository } from '../../services/github-service';

@Component({
  selector: 'app-repo-card',
  standalone: true,
  templateUrl: './repo-card.html',
  styleUrl: './repo-card.css',
})
export class RepoCard {
  repository = input.required<Repository>();
}
