import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { ProfileSidebar } from './components/profile-sidebar/profile-sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, ProfileSidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('github-profile');
}
