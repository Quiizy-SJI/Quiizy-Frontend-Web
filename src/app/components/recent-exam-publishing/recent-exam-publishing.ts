import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ThemeService } from '../../core/services';

@Component({
  selector: 'app-recent-exam-publishing',
  imports: [CommonModule],
  templateUrl: './recent-exam-publishing.html',
  styleUrl: './recent-exam-publishing.scss',
})
export class RecentExamPublishing {
   exams = [
    { name: 'AI Ethics Mock', teacher: 'S. Noumba', published: '08:45' },
    { name: 'Systems Security Final', teacher: 'G. Moukouri', published: '07:10' },
    { name: 'Networks CC', teacher: 'F. Tchamba', published: 'Yesterday' }
  ];

  constructor(public themeService: ThemeService) {}
}
