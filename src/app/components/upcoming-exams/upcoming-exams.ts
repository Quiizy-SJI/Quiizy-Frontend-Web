import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-upcoming-exams',
  imports: [CommonModule],
  templateUrl: './upcoming-exams.html',
  styleUrl: './upcoming-exams.scss',
})
export class UpcomingExams {
  weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  exams = [
    {
      name: 'ISI 4 • Web Dev Final',
      time: 'Nov 10 • 10:00 - 11:30',
      color: '#93c5fd'
    },
    {
      name: 'ISI 5 • AI Midterm',
      time: 'Nov 12 • 14:00 - 15:30',
      color: '#86efac'
    },
    {
      name: 'ISI 3 • DB Mock',
      time: '9:00',
      color: '#fde68a'
    }
  ];
}
