import { Component, input } from '@angular/core';
import { GithubUser } from '../../services/github-service';

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
export class ProfileSidebar {
  readonly Users = Users;
  readonly Building2 = Building2;
  readonly MapPin = MapPin;
  readonly Mail = Mail;
  readonly Link = Link;
  readonly Clock = Clock;
  readonly User = User;

  user = input<GithubUser | null>(null);
}
