import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type ChartType = any; // avoid dependency on chart.js types
type ChartInstance = any;

@Component({
  selector: 'ui-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-host" [class.chart-ready]="isReady">
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
  /** Disable animations for instant updates (reduces flickering) */
  @Input() disableAnimations = false;

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  protected isReady = false;
  private chart: ChartInstance | null = null;
  private chartJsLoaded = false;
  private pendingUpdate = false;
  private updateDebounceId: ReturnType<typeof setTimeout> | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private ngZone = inject(NgZone);

  async ngAfterViewInit(): Promise<void> {
    await this.ensureChartJs();
    this.chartJsLoaded = true;
    this.renderChart();
    this.setupResizeObserver();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Skip if chart.js isn't loaded yet - renderChart will handle initial render
    if (!this.chartJsLoaded) {
      this.pendingUpdate = true;
      return;
    }

    if (changes['type'] && !changes['type'].firstChange) {
      // Type changed - need to recreate chart
      this.renderChart();
      return;
    }

    if (changes['data'] || changes['options']) {
      this.debouncedUpdate();
    }
  }

  ngOnDestroy(): void {
    if (this.updateDebounceId) {
      clearTimeout(this.updateDebounceId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.destroyChart();
  }

  private destroyChart(): void {
    if (this.chart && typeof this.chart.destroy === 'function') {
      this.chart.destroy();
    }
    this.chart = null;
  }

  /** Debounce rapid updates to prevent flickering */
  private debouncedUpdate(): void {
    if (this.updateDebounceId) {
      clearTimeout(this.updateDebounceId);
    }
    this.updateDebounceId = setTimeout(() => {
      this.updateChart();
      this.updateDebounceId = null;
    }, 250); // ~1 frame at 60fps
  }

  private updateChart(): void {
    if (!this.chart) {
      this.renderChart();
      return;
    }

    // Deep clone data to avoid reference issues causing flickering
    this.chart.data = this.deepClone(this.data);

    // Merge options carefully
    const mergedOptions = this.getMergedOptions();
    Object.assign(this.chart.options, mergedOptions);

    if (typeof this.chart.update === 'function') {
      // Use 'none' mode to skip animations on updates (prevents flickering)
      this.chart.update(this.disableAnimations ? 'none' : undefined);
    }
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

  private getMergedOptions(): any {
    return {
      responsive: true,
      maintainAspectRatio: false,
      // Reduce animation duration for smoother feel, or disable entirely
      animation: this.disableAnimations
        ? false
        : {
            duration: 300,
            easing: 'easeOutQuart',
          },
      // Disable resize animation to prevent flicker during container resizing
      resizeDelay: 0,
      plugins: {
        legend: { display: true },
      },
      ...this.options,
    };
  }

  private renderChart(): void {
    const w = window as any;
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx || !w.Chart) return;

    // Destroy existing chart before creating new one
    this.destroyChart();

    // Set explicit canvas dimensions to prevent resize flickering
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    this.ngZone.runOutsideAngular(() => {
      this.chart = new w.Chart(ctx, {
        type: this.type,
        data: this.deepClone(this.data),
        options: this.getMergedOptions(),
      });
    });

    // Mark as ready for CSS transition
    this.isReady = true;

    // Handle any pending updates that came in before chart.js loaded
    if (this.pendingUpdate) {
      this.pendingUpdate = false;
      this.updateChart();
    }
  }

  /** Setup resize observer with debouncing to prevent flicker on resize */
  private setupResizeObserver(): void {
    const container = this.canvasRef.nativeElement.parentElement;
    if (!container || typeof ResizeObserver === 'undefined') return;

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    this.resizeObserver = new ResizeObserver(() => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (this.chart && typeof this.chart.resize === 'function') {
          this.ngZone.runOutsideAngular(() => {
            this.chart.resize();
          });
        }
      }, 250); // Debounce resize events
    });

    this.resizeObserver.observe(container);
  }

  /** Deep clone data to avoid mutation issues */
  private deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch {
      return obj;
    }
  }
}
