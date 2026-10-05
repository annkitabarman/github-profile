import { Component, input, signal } from '@angular/core';
import {
  BookMarked,
  BookOpen,
  LayoutGrid,
  LucideAngularModule,
  Menu,
  Package,
  Search,
  Star,
} from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly Menu = Menu;
  readonly Search = Search;
  readonly BookOpen = BookOpen;
  readonly BookMarked = BookMarked;
  readonly LayoutGrid = LayoutGrid;
  readonly Package = Package;
  readonly Star = Star;
  navMenu = [
    {
      title: 'Overview',
      icon: BookOpen,
      route: '/',
    },
    {
      title: 'Repositories',
      icon: BookMarked,
      route: '/repositories',
      count: true,
    },
    {
      title: 'Projects',
      icon: LayoutGrid,
      route: '/projects',
    },
    {
      title: 'Packages',
      icon: Package,
      route: '/package',
    },
    {
      title: 'Stars',
      icon: Star,
      route: '/stars',
    },
  ];

  repoCount = input<number | null>(null);
  username = input<string>('');
  avatar_url = input<string | null>(null);
  selectedMenu = signal<string>('Overview');

  selectMenu(title: string) {
    this.selectedMenu.set(title);
  }
}
