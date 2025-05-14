import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'page/:slug',
    loadComponent: () => import('../page/page.component'),
  },
  {
    path: 'page',
    redirectTo: 'page/example-page',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'page/example-page',
    pathMatch: 'full',
  },
];
