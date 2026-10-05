import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { ProfileSidebar } from './components/profile-sidebar/profile-sidebar';
import { GithubService, GithubUser } from './services/github-service';
import { USER_NAME } from './constants/user.constant';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, ProfileSidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('github-profile');
  private readonly githubService = inject(GithubService);
  user = signal<GithubUser | null>(null);

  ngOnInit(): void {
    this.githubService.getUserDetails(USER_NAME).subscribe({
      next: (user) => {
        this.user.set(user);
      },

      error: (err) => {
        console.log('Failed to fetch github profile.', err);
      },
    });
  }
}
