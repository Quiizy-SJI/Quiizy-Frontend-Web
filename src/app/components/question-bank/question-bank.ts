import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ThemeService } from '../../core/services';
import { QuestionBank } from '../../core/interfaces/semester';

@Component({
  selector: 'app-question-bank',
  imports: [CommonModule],
  templateUrl: './question-bank.html',
  styleUrl: './question-bank.scss',
})
export class QuestionBankComponent {
   @Input() banks: QuestionBank[] = [];

  constructor(public themeService: ThemeService) {}

  getBankStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}
