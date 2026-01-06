import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-quick-actions',
  imports: [CommonModule],
  templateUrl: './quick-actions.html',
  styleUrl: './quick-actions.scss',
})
export class QuickActions {
   actions = [
    { label: 'Schedule Midterm Quiz', color: '#818cf8' },
    { label: 'Import Question Bank (Excel)', color: '#34d399' },
    { label: 'Send Participation Reminder', color: '#fbbf24' }
  ];
}
