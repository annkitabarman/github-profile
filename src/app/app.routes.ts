import { Routes } from '@angular/router';
import { OverviewPage } from './pages/overview-page/overview-page';
import { PlaceholderPage } from './pages/placeholder-page/placeholder-page';

export const routes: Routes = [
  {
    path: '',
    component: OverviewPage,
  },
  {
    path: 'repositories',
    component: PlaceholderPage,
  },
  {
    path: 'projects',
    component: PlaceholderPage,
  },
  {
    path: 'package',
    component: PlaceholderPage,
  },
  {
    path: 'stars',
    component: PlaceholderPage,
  },
];
