import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SentimentAlert } from '../../core/interfaces/sentiment-alert';
import { ThemeService } from '../../core/services';

@Component({
  selector: 'app-critical-alerts-table',
  imports: [CommonModule],
  templateUrl: './critical-alerts-table.html',
  styleUrl: './critical-alerts-table.scss',
})
export class CriticalAlertsTable {
  @Input() alerts!: SentimentAlert[];

  constructor(public themeService: ThemeService){}
}
