import { Component } from '@angular/core';

import {
  Building2,
  Clock,
  Link,
  Linkedin,
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
  readonly Linkedin = Linkedin;
  readonly Clock = Clock;
  readonly User = User;
}
