import { Component } from '@angular/core';
import { ThemeService } from '../../core/services';

@Component({
  selector: 'app-bulk-actions',
  imports: [],
  templateUrl: './bulk-actions.html',
  styleUrl: './bulk-actions.scss',
})
export class BulkActions {

  constructor(public themeService: ThemeService) {}
   onArchive() {
    console.log('Archive selected items');
  }

  onImport() {
    console.log('Import Excel');
  }

  onExport() {
    console.log('Export Excel');
  }
}
