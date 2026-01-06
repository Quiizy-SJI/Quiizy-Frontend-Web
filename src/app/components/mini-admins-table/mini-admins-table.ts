import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MiniAdmin } from '../../core/interfaces/mini-admin';
import { ThemeService } from '../../core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mini-admins-table',
  imports: [CommonModule],
  templateUrl: './mini-admins-table.html',
  styleUrl: './mini-admins-table.scss',
})
export class MiniAdminsTable {
    @Input() miniAdmins: MiniAdmin[] = [];
  @Output() manageAdmin = new EventEmitter<MiniAdmin>();
  @Output() remindAdmin = new EventEmitter<MiniAdmin>();
  @Output() inviteAdmin = new EventEmitter<void>();

  constructor(public themeService: ThemeService) {}

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}
