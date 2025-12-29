import { Routes } from '@angular/router';
import { deanGuard } from './core/auth/dean.guard';
import { teacherGuard } from './core/auth/teacher.guard';
import { roleRedirectGuard } from './core/auth/role-redirect.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [roleRedirectGuard],
    children: []
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
  },
  {
    path: 'teacher',
    canActivate: [teacherGuard],
    loadComponent: () => import('./pages/teacher/teacher-layout/teacher-layout').then(m => m.TeacherLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/teacher/teacher-dashboard/teacher-dashboard').then(m => m.TeacherDashboard),
        title: 'Teacher Dashboard'
      },
      {
        path: 'exam-manager',
        loadComponent: () => import('./pages/teacher/teacher-exam-manager/teacher-exam-manager').then(m => m.TeacherExamManager),
        title: 'Exam Manager'
      },
      {
        path: 'sentiment-review',
        loadComponent: () => import('./pages/teacher/teacher-sentiment-review/teacher-sentiment-review').then(m => m.TeacherSentimentReview),
        title: 'Sentiment Review'
      },
      {
        path: 'question-bank',
        loadComponent: () => import('./pages/teacher/teacher-question-bank/teacher-question-bank').then(m => m.TeacherQuestionBank),
        title: 'Question Bank'
      },
      {
        path: 'mock-tests',
        loadComponent: () => import('./pages/teacher/teacher-mock-tests/teacher-mock-tests').then(m => m.TeacherMockTests),
        title: 'Mock Tests'
      },
      {
        path: 'statistics',
        loadComponent: () => import('./pages/teacher/teacher-statistics/teacher-statistics').then(m => m.TeacherStatistics),
        title: 'Statistics'
      },
      {
        path: 'create-exam',
        loadComponent: () => import('./pages/teacher/teacher-create-exam/teacher-create-exam').then(m => m.TeacherCreateExam),
        title: 'Create Exam - Step 1'
      },
      {
        path: 'create-exam/step2',
        loadComponent: () => import('./pages/teacher/teacher-create-exam-step2/teacher-create-exam-step2').then(m => m.TeacherCreateExamStep2),
        title: 'Create Exam - Step 2'
      },
      {
        path: 'create-exam/step3',
        loadComponent: () => import('./pages/teacher/teacher-create-exam-step3/teacher-create-exam-step3').then(m => m.TeacherCreateExamStep3),
        title: 'Create Exam - Step 3'
      },
      {
        path: 'create-exam/step4',
        loadComponent: () => import('./pages/teacher/teacher-create-exam-step4/teacher-create-exam-step4').then(m => m.TeacherCreateExamStep4),
        title: 'Create Exam - Step 4'
      },
    ]
  }
];
