import { Component } from '@angular/core';
import { Department, ExamStats, Teacher } from '../../../core/interfaces/stat';
import { CommonModule } from '@angular/common';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { DepartmentDetail } from '../../../components/department-detail/department-detail';
import { DepartmentsCatalog } from '../../../components/departments-catalog/departments-catalog';
import { ExamStatistics } from '../../../components/exam-statistics/exam-statistics';
import { ThemeService } from '../../../core/services';
import { ActiveQuizzes } from "../../../components/active-quizzes/active-quizzes";

@Component({
  selector: 'app-departments',
  imports: [
    CommonModule,
    Sidebar,
    Header,
    DepartmentsCatalog,
    DepartmentDetail,
    ExamStatistics,
    ActiveQuizzes
],
  templateUrl: './departments.html',
  styleUrl: './departments.scss',
})
export class Departments {
  selectedDepartment: Department | null = null;
  
  departments: Department[] = [
    {
      name: 'Information Systems & Innovation',
      head: 'S. Noumba',
      teachingUnits: 18,
      students: 450,
      status: 'BALANCED'
    },
    {
      name: 'Cybersecurity & Networks',
      head: 'Prof. T. Fobang',
      teachingUnits: 21,
      students: 380,
      status: 'OVER'
    },
    {
      name: 'Software Engineering',
      head: 'Assign head',
      teachingUnits: 15,
      students: 290,
      status: 'UNDER'
    }
  ];

  teachers: Teacher[] = [
    {
      name: 'Sarah Moukouri',
      subjects: ['Networks, Cloud'],
      classes: 4,
      examCompletion: 115,
      status: 'Review',
      email: 'sarah.moukouri@example.com'
    },
    {
      name: 'Joel Tchagna',
      subjects: ['Security'],
      classes: 3,
      examCompletion: 90,
      status: 'Healthy',
      email: 'joel.tchagna@example.com'
    },
    {
      name: 'External TBD',
      subjects: ['Unassigned'],
      classes: 0,
      examCompletion: 0,
      status: 'Action',
      email: ''
    }
  ];

  examStats: ExamStats = {
    published: 34,
    draft: 12,
    scheduled: 8
  };

  activeQuizzes = [
    {
      name: 'Networks Fundamentals - Final',
      department: 'Cybersecurity & Networks',
      participants: 45,
      timeRemaining: '2h 15m'
    },
    {
      name: 'Database Systems - Midterm',
      department: 'Information Systems',
      participants: 38,
      timeRemaining: '45m'
    },
    {
      name: 'Cloud Architecture - Quiz',
      department: 'Software Engineering',
      participants: 22,
      timeRemaining: '1h 30m'
    }
  ];

    constructor(public themeService: ThemeService) {}
  

  onDepartmentSelect(department: Department) {
    this.selectedDepartment = department;
  }
}
