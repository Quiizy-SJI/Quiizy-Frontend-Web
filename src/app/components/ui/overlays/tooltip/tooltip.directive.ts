import { Directive, Input, ElementRef, HostListener, OnDestroy, ComponentRef, ApplicationRef, createComponent, EnvironmentInjector } from '@angular/core';
import { TooltipContentComponent } from './tooltip-content.component';
import type { Position } from '../../types/component.types';

@Directive({
  selector: '[uiTooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  @Input('uiTooltip') content!: string;
  @Input() tooltipPosition: Position = 'top';
  @Input() tooltipDelay = 200;
  @Input() tooltipDisabled = false;

  private tooltipRef: ComponentRef<TooltipContentComponent> | null = null;
  private showTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private elementRef: ElementRef,
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.tooltipDisabled || !this.content) return;

    this.showTimeout = setTimeout(() => {
      this.show();
    }, this.tooltipDelay);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.hide();
  }

  @HostListener('click')
  onClick(): void {
    this.hide();
  }

  private show(): void {
    if (this.tooltipRef) return;

    this.tooltipRef = createComponent(TooltipContentComponent, {
      environmentInjector: this.injector
    });

    this.tooltipRef.instance.content = this.content;
    this.tooltipRef.instance.position = this.tooltipPosition;
    this.tooltipRef.instance.hostElement = this.elementRef.nativeElement;

    document.body.appendChild(this.tooltipRef.location.nativeElement);
    this.appRef.attachView(this.tooltipRef.hostView);

    this.tooltipRef.instance.updatePosition();
  }

  private hide(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    if (this.tooltipRef) {
      this.appRef.detachView(this.tooltipRef.hostView);
      this.tooltipRef.destroy();
      this.tooltipRef = null;
    }
  }

  ngOnDestroy(): void {
    this.hide();
  }
}
