import { Component, OnInit, inject, signal } from '@angular/core';
import { GithubService, GithubUser } from '../../services/github-service';

import {
  Building2,
  Clock,
  Link,
  LucideAngularModule,
  Mail,
  MapPin,
  Users,
  User,
} from 'lucide-angular';

@Component({
  selector: 'app-profile-sidebar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './profile-sidebar.html',
  styleUrl: './profile-sidebar.css',
})
export class ProfileSidebar implements OnInit {
  readonly Users = Users;
  readonly Building2 = Building2;
  readonly MapPin = MapPin;
  readonly Mail = Mail;
  readonly Link = Link;
  readonly Clock = Clock;
  readonly User = User;

  user = signal<GithubUser | null>(null);
  private readonly githubService = inject(GithubService);

  ngOnInit(): void {
    this.githubService.getUserDetails('annkitabarman').subscribe({
      next: (user) => {
        this.user.set(user);
        console.log(user);
      },

      error: (err) => {
        console.log('Failed to fetch github profile.', err);
      },
    });
  }
}
