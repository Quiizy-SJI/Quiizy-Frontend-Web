import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'showcase',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
    title: 'Login'
  },
  {
    path: 'showcase',
    loadComponent: () => import('./pages/showcase/showcase.component').then(m => m.ShowcaseComponent),
    title: 'UI Component Showcase'
  }
];
