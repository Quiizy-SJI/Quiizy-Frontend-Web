import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

type ChartType = any; // avoid dependency on chart.js types
type ChartInstance = any;

@Component({
  selector: 'ui-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-host">
      <canvas #canvas></canvas>
    </div>
  `,
  styleUrl: './chart-host.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartHostComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() type: ChartType = 'bar';
  @Input() data: any;
  @Input() options: any;

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: ChartInstance | null = null;

  async ngAfterViewInit(): Promise<void> {
    await this.ensureChartJs();
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart && (changes['data'] || changes['options'])) {
      this.chart.data = this.data;
      this.chart.options = this.options;
      if (typeof this.chart.update === 'function') this.chart.update();
    }
  }

  ngOnDestroy(): void {
    if (this.chart && typeof this.chart.destroy === 'function') this.chart.destroy();
    this.chart = null;
  }

  private async ensureChartJs(): Promise<void> {
    const w = window as any;
    if (w.Chart) return;
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.5/dist/chart.umd.min.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Chart.js'));
      document.head.appendChild(script);
    }).catch(() => {
      // fail silently to avoid breaking the page; charts just won't render
    });
  }

  private renderChart(): void {
    const w = window as any;
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx || !w.Chart) return;
    if (this.chart) this.chart.destroy();
    this.chart = new w.Chart(ctx, {
      type: this.type,
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
        ...this.options,
      },
    });
  }
}
