import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { ThemeToggleComponent, ButtonComponent } from "../ui";
import { ThemeService } from '../../core/services';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ThemeToggleComponent, ButtonComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input({required: true}) title: string = '';
  @Input() subtitle: string =''
  @Input() buttonText!: string;
  @Output() buttonClick = new EventEmitter<void>();

  constructor(public themeService: ThemeService){}
}
