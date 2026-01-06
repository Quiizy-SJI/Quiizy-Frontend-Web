import { Component, Input } from '@angular/core';
import { Keyword } from '../../core/interfaces/sentiment-alert';
import { ThemeService } from '../../core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-keywords',
  imports: [CommonModule],
  templateUrl: './keywords.html',
  styleUrl: './keywords.scss',
})
export class Keywords {
 @Input() keywords: Keyword[] = [];

  constructor(public themeService: ThemeService) {}

  getKeywordSize(count: number): number {
    // Scale font size based on count (18-28px range)
    const minSize = 18;
    const maxSize = 28;
    const maxCount = Math.max(...this.keywords.map(k => k.count));
    return minSize + ((count / maxCount) * (maxSize - minSize));
  }
}
