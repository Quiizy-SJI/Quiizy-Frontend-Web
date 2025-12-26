import { Routes } from '@angular/router';
import { deanGuard } from './core/auth/dean.guard';

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
  },
  {
    path: 'dean',
    canActivate: [deanGuard],
    loadComponent: () => import('./pages/dean/dean-layout/dean-layout').then(m => m.DeanLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dean/dean-dashboard/dean-dashboard').then(m => m.DeanDashboard),
        title: 'Dean Dashboard'
      },
      {
        path: 'academic-years',
        loadComponent: () => import('./pages/dean/dean-academic-years/dean-academic-years').then(m => m.DeanAcademicYears),
        title: 'Academic Years'
      },
      {
        path: 'semesters',
        loadComponent: () => import('./pages/dean/dean-semesters/dean-semesters').then(m => m.DeanSemesters),
        title: 'Semesters'
      },
      {
        path: 'exam-types',
        loadComponent: () => import('./pages/dean/dean-exam-types/dean-exam-types').then(m => m.DeanExamTypes),
        title: 'Exam Types'
      },
      {
        path: 'teaching-units',
        loadComponent: () => import('./pages/dean/dean-teaching-units/dean-teaching-units').then(m => m.DeanTeachingUnits),
        title: 'Teaching Units'
      },
      {
        path: 'mini-admins',
        loadComponent: () => import('./pages/dean/dean-mini-admins/dean-mini-admins').then(m => m.DeanMiniAdmins),
        title: 'Mini Admin Accounts'
      },
      {
        path: 'ai-analytics',
        loadComponent: () => import('./pages/dean/dean-ai-analytics/dean-ai-analytics').then(m => m.DeanAiAnalytics),
        title: 'AI Analytics'
      },
    ]
  }
];
