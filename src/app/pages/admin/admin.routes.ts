import { Routes } from "@angular/router";

export const ADMIN_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import ('./dashboard/dashboard')
          .then(m => m.Dashboard)
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'subjects',
        loadComponent: () => import('./teaching-units/teaching-units')
            .then(m => m.TeachingUnits)
    },
    {
        path: 'departments',
        loadComponent: () => import('./departments/departments').then(m => m.Departments)
    },
    {
        path: 'exams',
        loadComponent: () => import('./exam-types-minis/exam-types-minis').then(m => m.ExamTypesMinis)
    },
    {
        path: 'academic-structure',
        loadComponent: () => import('./academic-overview/academic-overview').then(m => m.AcademicOverview)
    },
    {
        path: 'analysis',
        loadComponent: () => import('./sentiment-analysis/sentiment-analysis').then(m => m.SentimentAnalysis)
    }
]