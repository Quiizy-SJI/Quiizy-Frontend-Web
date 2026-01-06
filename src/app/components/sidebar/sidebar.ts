import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../core/services';

export type MenuItem = {
  label: string,
  link: string
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private router = inject(Router)

  @Input({required: true}) role!: 'teacher' |  'admin' | 'mini-admin'
  mainMenuItems: MenuItem[] = [{ label: 'Dashboard', link: 'dashboard' }]
  
  constructor(public themeService: ThemeService) {}

  ngOnInit(){
    if(this.role === 'admin') {
      this.mainMenuItems = [
        ...this.mainMenuItems,
        { label: 'Academic Structure', link: 'academic-structure'},
        { label: 'Subjects', link: 'subjects' },
        { label: 'Exam Types & Mini-admins', link: 'exams' },
        { label: 'Departments', link: 'departments' },
        { label: 'Statistics', link: 'stats' },
        { label: 'AI Analysis', link: 'analysis' },
        { label: 'Settings', link: 'settings' }
      ];
    } else if(this.role === 'mini-admin'){
      this.mainMenuItems = [
        ...this.mainMenuItems,
        { label: 'Classes', link: 'classes'},
        { label: 'Students', link: 'students' },
        { label: 'Teachers', link: 'teachers' },
        { label: 'Exams', link: 'exams' },
        { label: 'Analytics', link: 'analytics' },
      ];

    } else{
      this.mainMenuItems =[
        ...this.mainMenuItems,
        {label: 'My exams', link: 'my-exams'},
        { label: 'Question Bank', link: 'quesiton-bank'},
        {label: 'Sentiment Review', link: 'ai-review'},
        {label: 'Statistics', link: 'stats'}
      ]
    }
  }
 
  
  supportMenuItems = [
    { label: 'Help Center' },
    { label: 'Logout' }
  ];

  @Input({required: true}) menuItem = ''

  handleClick(s: string){
    this.router.navigate([this.role, s])
  }
}
