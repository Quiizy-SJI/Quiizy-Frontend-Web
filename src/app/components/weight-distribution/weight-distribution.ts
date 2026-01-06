import { Component, Input } from '@angular/core';
import { Distribution } from '../../core/interfaces/mini-admin';
import { ThemeService } from '../../core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weight-distribution',
  imports: [CommonModule],
  templateUrl: './weight-distribution.html',
  styleUrl: './weight-distribution.scss',
})
export class WeightDistribution {
  @Input() distribution!: {
    label: string;
    percentage: number;
    color: string;
  }[]

  constructor(public themeService: ThemeService) {}

}
