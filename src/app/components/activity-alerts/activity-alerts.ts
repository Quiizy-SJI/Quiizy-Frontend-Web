import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivityAlert } from '../../core/interfaces/semester';
import { ThemeService } from '../../core/services';

@Component({
  selector: 'app-activity-alerts',
  imports: [CommonModule],
  templateUrl: './activity-alerts.html',
  styleUrl: './activity-alerts.scss',
})
export class ActivityAlerts {
   @Input() alerts: ActivityAlert[] = [];

  constructor(public themeService: ThemeService) {}

}
