import { Component, input } from '@angular/core';
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

  showMore = false;
  repoCount = input<number | null>(null);
  username = input<string>('');
  avatar_url = input<string | null>(null);

  toggleMore(): void {
    this.showMore = !this.showMore;
  }
}
