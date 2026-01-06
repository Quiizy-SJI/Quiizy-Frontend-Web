import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-evaluation-pipeline',
  imports: [CommonModule],
  templateUrl: './evaluation-pipeline.html',
  styleUrl: './evaluation-pipeline.scss',
})
export class EvaluationPipeline {
  metrics = [
    {
      label: 'Submission Throughput',
      value: '220 ms',
      percentage: '75%',
      color: '#10b981'
    },
    {
      label: 'Notification Delivery',
      value: '99.95%',
      percentage: '99.95%',
      color: '#10b981'
    },
    {
      label: 'Offline Sync Queue',
      value: '120 devices',
      percentage: '40%',
      color: '#f59e0b'
    }
  ];
}
