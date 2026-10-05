import { Component, input, signal, inject } from '@angular/core';
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly router = inject(Router);
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

  selectMenu(item: { title: string; route: string }) {
    this.selectedMenu.set(item.title);
    this.router.navigate([item.route]);
  }
}
