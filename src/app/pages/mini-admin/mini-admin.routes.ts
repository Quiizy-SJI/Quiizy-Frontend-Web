import { Routes } from "@angular/router";

export const MINI_ADMIN_ROUTES: Routes = [
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
        path: 'classes',
        loadComponent: () => import ('./classes/classes')
          .then(m => m.Classes)
    },
    {
        path: 'students',
        loadComponent: () => import ('./students/students')
          .then(m => m.Students)
    },
    {
        path: 'teachers',
        loadComponent: () => import ('./teachers/teachers')
          .then(m => m.Teachers)
    },
    
]