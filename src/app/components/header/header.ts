import { Component, input, computed, inject, signal } from '@angular/core';
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
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

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

  currentUrl = signal(this.router.url);
  repoCount = input<number | null>(null);
  username = input<string>('');
  avatar_url = input<string | null>(null);

  selectedMenu = computed(() => {
    const currentUrl = this.currentUrl();

    return this.navMenu.find((item) => item.route === currentUrl)?.title ?? 'Overview';
  });

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navigation = event as NavigationEnd;

        this.currentUrl.set(navigation.urlAfterRedirects);
      });
  }

  selectMenu(item: { title: string; route: string }) {
    this.router.navigate([item.route]);
  }
}
