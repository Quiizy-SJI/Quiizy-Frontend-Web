import { Routes } from '@angular/router';
import { deanGuard } from './core/auth/dean.guard';
import { teacherGuard } from './core/auth/teacher.guard';
import { roleRedirectGuard } from './core/auth/role-redirect.guard';
import { headGuard } from './core/auth/head.guard';

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
        path: 'specialities',
        loadComponent: () => import('./pages/dean/dean-specialities/dean-specialities').then(m => m.DeanSpecialities),
        title: 'Specialities'
      },
      {
        path: 'mini-admins',
        loadComponent: () => import('./pages/dean/dean-mini-admins/dean-mini-admins').then(m => m.DeanMiniAdmins),
        title: 'Speciality Head Accounts'
      },
      {
        path: 'ai-analytics',
        loadComponent: () => import('./pages/dean/dean-ai-analytics/dean-ai-analytics').then(m => m.DeanAiAnalytics),
        title: 'AI Analytics'
      },
      {
        path: 'sentiment-analysis',
        loadComponent: () => import('./pages/shared/sentiment-analysis-page/sentiment-analysis-page').then(m => m.SentimentAnalysisPage),
        title: 'Sentiment Analysis'
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
        loadComponent: () => import('./pages/shared/sentiment-analysis-page/sentiment-analysis-page').then(m => m.SentimentAnalysisPage),
        title: 'Sentiment Analysis'
      },
      {
        path: 'question-bank',
        loadComponent: () => import('./pages/teacher/teacher-question-bank/teacher-question-bank').then(m => m.TeacherQuestionBank),
        title: 'Question Bank'
      },
      {
        path: 'statistics',
        loadComponent: () => import('./pages/teacher/teacher-statistics/teacher-statistics').then(m => m.TeacherStatistics),
        title: 'Statistics'
      },
      {
        path: 'create-exam',
        loadComponent: () => import('./pages/teacher/teacher-create-exam/teacher-create-exam').then(m => m.TeacherCreateExam),
        title: 'Create Quiz - Details'
      },
      {
        path: 'create-exam/step2',
        loadComponent: () => import('./pages/teacher/teacher-create-exam-step2/teacher-create-exam-step2').then(m => m.TeacherCreateExamStep2),
        title: 'Create Quiz - Questions'
      },
      {
        path: 'create-exam/step3',
        loadComponent: () => import('./pages/teacher/teacher-create-exam-step3/teacher-create-exam-step3').then(m => m.TeacherCreateExamStep3),
        title: 'Create Quiz - Review & Publish'
      },
      {
        // Legacy route redirect - step4 is no longer used
        path: 'create-exam/step4',
        redirectTo: 'create-exam/step3',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: 'head',
    canActivate: [headGuard],
    loadComponent: () => import("./pages/mini-admin/head-layout/head-layout").then(m => m.HeadLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/mini-admin/head-dashboard/head-dashboard').then(m => m.HeadDashboard),
        title: 'Specialty Head Dashboard'
      },
      {
        path: 'classes',
        loadComponent: () => import('./pages/mini-admin/head-classes/head-classes').then(m => m.HeadClasses),
        title: 'Class Management'
     },
      {
        path: 'students',
        loadComponent: () => import('./pages/mini-admin/head-students/head-students').then(m => m.HeadStudents),
        title: 'Students'
      },
      {
        path: 'courses',
        loadComponent: () => import('./pages/mini-admin/head-courses/head-courses').then(m => m.HeadCourses),
        title: 'Courses'
      },
      {
        path: 'teachers',
        loadComponent: () => import('./pages/mini-admin/head-teachers/head-teachers').then(m => m.HeadTeachers),
        title: 'Teachers'
      },
      // {
      //   path: 'sentiment-analysis',
      //   loadComponent: () => import('./pages/shared/sentiment-analysis-page/sentiment-analysis-page').then(m => m.SentimentAnalysisPage),
      //   title: 'Sentiment Analysis'
      // },
    ]
  }
];
