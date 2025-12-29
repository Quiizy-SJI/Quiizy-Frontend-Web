import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-sentiment-review',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="sentiment-review">
      <div class="page-header">
        <h1>Sentiment Review</h1>
        <p>Analyze student emotions and engagement during exams using AI-powered sentiment analysis.</p>
      </div>

      <div class="overview-cards">
        <div class="sentiment-card positive">
          <div class="card-icon">
            <mat-icon>sentiment_very_satisfied</mat-icon>
          </div>
          <div class="card-content">
            <h3>Positive Sentiment</h3>
            <p class="percentage">68%</p>
            <span class="change">+5% from last week</span>
          </div>
        </div>

        <div class="sentiment-card neutral">
          <div class="card-icon">
            <mat-icon>sentiment_neutral</mat-icon>
          </div>
          <div class="card-content">
            <h3>Neutral Sentiment</h3>
            <p class="percentage">22%</p>
            <span class="change">-2% from last week</span>
          </div>
        </div>

        <div class="sentiment-card negative">
          <div class="card-icon">
            <mat-icon>sentiment_very_dissatisfied</mat-icon>
          </div>
          <div class="card-content">
            <h3>Negative Sentiment</h3>
            <p class="percentage">10%</p>
            <span class="change">-3% from last week</span>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="recent-analysis">
          <h2>Recent Sentiment Analysis</h2>
          <div class="analysis-list">
            <div class="analysis-item">
              <div class="exam-info">
                <h4>Mathematics Midterm</h4>
                <span class="exam-date">Completed 2 hours ago</span>
              </div>
              <div class="sentiment-breakdown">
                <div class="sentiment-bar">
                  <div class="positive" style="width: 65%"></div>
                  <div class="neutral" style="width: 25%"></div>
                  <div class="negative" style="width: 10%"></div>
                </div>
                <div class="sentiment-labels">
                  <span class="positive">65% Positive</span>
                  <span class="neutral">25% Neutral</span>
                  <span class="negative">10% Negative</span>
                </div>
              </div>
              <button class="view-details-btn" (click)="viewDetails('math-midterm')">
                <mat-icon>visibility</mat-icon>
                View Details
              </button>
            </div>

            <div class="analysis-item">
              <div class="exam-info">
                <h4>Physics Quiz #3</h4>
                <span class="exam-date">Completed 1 day ago</span>
              </div>
              <div class="sentiment-breakdown">
                <div class="sentiment-bar">
                  <div class="positive" style="width: 72%"></div>
                  <div class="neutral" style="width: 18%"></div>
                  <div class="negative" style="width: 10%"></div>
                </div>
                <div class="sentiment-labels">
                  <span class="positive">72% Positive</span>
                  <span class="neutral">18% Neutral</span>
                  <span class="negative">10% Negative</span>
                </div>
              </div>
              <button class="view-details-btn" (click)="viewDetails('physics-quiz-3')">
                <mat-icon>visibility</mat-icon>
                View Details
              </button>
            </div>

            <div class="analysis-item">
              <div class="exam-info">
                <h4>Chemistry Lab Test</h4>
                <span class="exam-date">Completed 3 days ago</span>
              </div>
              <div class="sentiment-breakdown">
                <div class="sentiment-bar">
                  <div class="positive" style="width: 58%"></div>
                  <div class="neutral" style="width: 27%"></div>
                  <div class="negative" style="width: 15%"></div>
                </div>
                <div class="sentiment-labels">
                  <span class="positive">58% Positive</span>
                  <span class="neutral">27% Neutral</span>
                  <span class="negative">15% Negative</span>
                </div>
              </div>
              <button class="view-details-btn" (click)="viewDetails('chemistry-lab-test')">
                <mat-icon>visibility</mat-icon>
                View Details
              </button>
            </div>
          </div>
        </div>

        <div class="insights-panel">
          <h2>AI Insights</h2>
          <div class="insights-list">
            <div class="insight-item">
              <div class="insight-icon positive">
                <mat-icon>trending_up</mat-icon>
              </div>
              <div class="insight-content">
                <h4>Improved Engagement</h4>
                <p>Students show 15% higher positive sentiment in shorter exams (≤60 minutes).</p>
              </div>
            </div>

            <div class="insight-item">
              <div class="insight-icon warning">
                <mat-icon>warning</mat-icon>
              </div>
              <div class="insight-content">
                <h4>Stress Indicators</h4>
                <p>Higher negative sentiment detected during complex calculation questions.</p>
              </div>
            </div>

            <div class="insight-item">
              <div class="insight-icon info">
                <mat-icon>lightbulb</mat-icon>
              </div>
              <div class="insight-content">
                <h4>Recommendation</h4>
                <p>Consider adding more practice questions for topics with high stress indicators.</p>
              </div>
            </div>
          </div>

          <div class="sentiment-trends">
            <h3>Sentiment Trends</h3>
            <div class="trend-chart">
              <div class="chart-placeholder">
                <mat-icon>show_chart</mat-icon>
                <p>Sentiment trend visualization would appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sentiment-review {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
      
      h1 {
        font-size: 2rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--color-text-primary);
      }
      
      p {
        color: var(--color-text-secondary);
        font-size: 1rem;
      }
    }

    .overview-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .sentiment-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      
      .card-icon {
        padding: 1rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        mat-icon {
          font-size: 2rem;
          width: 2rem;
          height: 2rem;
        }
      }
      
      &.positive .card-icon {
        background: var(--color-success-100);
        mat-icon { color: var(--color-success-600); }
      }
      
      &.neutral .card-icon {
        background: var(--color-warning-100);
        mat-icon { color: var(--color-warning-600); }
      }
      
      &.negative .card-icon {
        background: var(--color-error-100);
        mat-icon { color: var(--color-error-600); }
      }
      
      .card-content {
        flex: 1;
        
        h3 {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          margin-bottom: 0.25rem;
        }
        
        .percentage {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 0.25rem;
        }
        
        .change {
          font-size: 0.75rem;
          color: var(--color-success-600);
        }
      }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .recent-analysis, .insights-panel {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      
      h2 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: var(--color-text-primary);
      }
    }

    .analysis-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .analysis-item {
      border: 1px solid var(--color-border);
      border-radius: 8px;
      padding: 1rem;
      
      .exam-info {
        margin-bottom: 1rem;
        
        h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--color-text-primary);
        }
        
        .exam-date {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }
      }
      
      .sentiment-breakdown {
        margin-bottom: 1rem;
      }
      
      .sentiment-bar {
        height: 8px;
        border-radius: 4px;
        overflow: hidden;
        display: flex;
        margin-bottom: 0.5rem;
        
        .positive { background: var(--color-success-500); }
        .neutral { background: var(--color-warning-500); }
        .negative { background: var(--color-error-500); }
      }
      
      .sentiment-labels {
        display: flex;
        gap: 1rem;
        font-size: 0.75rem;
        
        .positive { color: var(--color-success-600); }
        .neutral { color: var(--color-warning-600); }
        .negative { color: var(--color-error-600); }
      }
      
      .view-details-btn {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.5rem 0.75rem;
        background: var(--color-primary-600);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 0.875rem;
        cursor: pointer;
        transition: background 0.2s;
        
        &:hover {
          background: var(--color-primary-700);
        }
        
        mat-icon {
          font-size: 1rem;
          width: 1rem;
          height: 1rem;
        }
      }
    }

    .insights-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .insight-item {
      display: flex;
      gap: 0.75rem;
      
      .insight-icon {
        padding: 0.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        
        mat-icon {
          font-size: 1.25rem;
          width: 1.25rem;
          height: 1.25rem;
        }
        
        &.positive {
          background: var(--color-success-100);
          mat-icon { color: var(--color-success-600); }
        }
        
        &.warning {
          background: var(--color-warning-100);
          mat-icon { color: var(--color-warning-600); }
        }
        
        &.info {
          background: var(--color-primary-100);
          mat-icon { color: var(--color-primary-600); }
        }
      }
      
      .insight-content {
        h4 {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--color-text-primary);
        }
        
        p {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          line-height: 1.4;
        }
      }
    }

    .sentiment-trends {
      h3 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--color-text-primary);
      }
      
      .chart-placeholder {
        height: 200px;
        border: 2px dashed var(--color-border);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--color-text-secondary);
        
        mat-icon {
          font-size: 3rem;
          width: 3rem;
          height: 3rem;
          margin-bottom: 0.5rem;
        }
        
        p {
          font-size: 0.875rem;
        }
      }
    }
  `]
})
export class TeacherSentimentReview {
  constructor(private router: Router) {}

  viewDetails(examId: string): void {
    console.log('Viewing sentiment details for exam:', examId);
    this.router.navigate(['/teacher/statistics'], { queryParams: { exam: examId, view: 'sentiment' } });
  }
}