import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { cn, sizeClass } from '../../utils/class-utils';
import type { Size, TableColumn } from '../../types/component.types';
import { InputComponent } from '../../forms/input/input.component';

export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc' | null;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  pageSizes?: number[];
}

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, InputComponent],
  template: `
    <div [class]="wrapperClasses">
      <!-- Search Input -->
      @if (searchable) {
        <div class="table-search">
          <ui-input
            type="search"
            [placeholder]="searchPlaceholder"
            [(ngModel)]="searchQuery"
            (valueChange)="onSearchChange()"
            [clearable]="true"
            (cleared)="clearSearch()"
            [iconLeft]="true"
            size="sm"
          >
            <mat-icon slot="icon-left">search</mat-icon>
          </ui-input>
        </div>
      }

      <!-- Table Header Actions -->
      @if (showHeader) {
        <div class="table-header">
          <div class="table-header__left">
            <ng-content select="[slot=header-left]"></ng-content>
          </div>
          <div class="table-header__right">
            <ng-content select="[slot=header-right]"></ng-content>
          </div>
        </div>
      }

      <!-- Table Container -->
      <div class="table-container" [class.table-container--loading]="loading">
        <table [class]="tableClasses">
          <!-- Table Head -->
          <thead class="table__head">
            <tr>
              @if (selectable) {
                <th class="table__th table__th--checkbox">
                  <input
                    type="checkbox"
                    [checked]="allSelected"
                    [indeterminate]="someSelected && !allSelected"
                    (change)="toggleSelectAll()"
                    aria-label="Select all rows"
                  />
                </th>
              }
              @for (column of columns; track column.key) {
                <th
                  [class]="getHeaderClasses(column)"
                  [style.width]="column.width"
                  (click)="column.sortable ? toggleSort(getColumnKey(column)) : null"
                >
                  <div class="table__th-content">
                    <span>{{ column.label }}</span>
                    @if (column.sortable) {
                      <span class="table__sort-icon" [class.table__sort-icon--active]="sortColumn === column.key">
                        @if (sortColumn === column.key && sortDirection === 'asc') {
                          <svg viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 4l4 4H4l4-4z"/>
                          </svg>
                        } @else if (sortColumn === column.key && sortDirection === 'desc') {
                          <svg viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 12l-4-4h8l-4 4z"/>
                          </svg>
                        } @else {
                          <svg viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 4l3 3H5l3-3zm0 8l-3-3h6l-3 3z"/>
                          </svg>
                        }
                      </span>
                    }
                  </div>
                </th>
              }
              @if (showActions) {
                <th class="table__th table__th--actions">Actions</th>
              }
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="table__body">
            @if (filteredData.length === 0 && !loading) {
              <tr>
                <td [attr.colspan]="totalColumns" class="table__empty">
                  <ng-content select="[slot=empty]"></ng-content>
                  @if (!hasEmptySlot) {
                    <div class="table__empty-default">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                      </svg>
                      <span>{{ searchQuery ? noResultsMessage : emptyMessage }}</span>
                    </div>
                  }
                </td>
              </tr>
            } @else {
              @for (row of filteredData; track trackByFn(row); let i = $index) {
                <tr
                  class="table__row"
                  [class.table__row--selected]="isSelected(row)"
                  [class.table__row--clickable]="rowClickable"
                  (click)="onRowClick(row, i)"
                >
                  @if (selectable) {
                    <td class="table__td table__td--checkbox" (click)="$event.stopPropagation()">
                      <input
                        type="checkbox"
                        [checked]="isSelected(row)"
                        (change)="toggleSelect(row)"
                        aria-label="Select row"
                      />
                    </td>
                  }
                  @for (column of columns; track column.key) {
                    <td [class]="getCellClasses(column)">
                      @if (cellTemplate) {
                        <ng-container *ngTemplateOutlet="cellTemplate; context: { $implicit: row, row: row, column: column, index: i }"></ng-container>
                      } @else {
                        {{ getCellValue(row, getColumnKey(column)) }}
                      }
                    </td>
                  }
                  @if (showActions) {
                    <td class="table__td table__td--actions" (click)="$event.stopPropagation()">
                      <ng-content select="[slot=actions]"></ng-content>
                    </td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>

        <!-- Loading Overlay -->
        @if (loading) {
          <div class="table__loading">
            <div class="table__loading-spinner"></div>
          </div>
        }
      </div>

      <!-- Pagination -->
      @if (showPagination && pagination) {
        <div class="table-pagination">
          <div class="table-pagination__info">
            Showing {{ paginationStart }} to {{ paginationEnd }} of {{ pagination.total }} results
          </div>
          <div class="table-pagination__controls">
            @if (pagination.pageSizes) {
              <select
                class="table-pagination__size"
                [value]="pagination.pageSize"
                (change)="onPageSizeChange($event)"
              >
                @for (size of pagination.pageSizes; track size) {
                  <option [value]="size">{{ size }} per page</option>
                }
              </select>
            }
            <div class="table-pagination__buttons">
              <button
                type="button"
                class="table-pagination__btn"
                [disabled]="pagination.page <= 1"
                (click)="goToPage(pagination.page - 1)"
                aria-label="Previous page"
              >
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M11.354 4.646a.5.5 0 0 1 0 .708L8.207 8.5l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0z"/>
                </svg>
              </button>
              @for (page of visiblePages; track page) {
                @if (page === '...') {
                  <span class="table-pagination__ellipsis">...</span>
                } @else {
                  <button
                    type="button"
                    class="table-pagination__btn"
                    [class.table-pagination__btn--active]="page === pagination.page"
                    (click)="goToPage(+page)"
                  >
                    {{ page }}
                  </button>
                }
              }
              <button
                type="button"
                class="table-pagination__btn"
                [disabled]="pagination.page >= totalPages"
                (click)="goToPage(pagination.page + 1)"
                aria-label="Next page"
              >
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4.646 11.354a.5.5 0 0 1 0-.708L7.793 7.5 4.646 4.354a.5.5 0 1 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708 0z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T = any> {
  @ContentChild('empty') emptyTemplate?: TemplateRef<any>;
  @ContentChild('cell') cellTemplate?: TemplateRef<any>;

  @Input() columns: TableColumn[] = [];
  @Input() data: T[] = [];
  @Input() size: Size = 'md';
  @Input() variant: 'default' | 'striped' | 'bordered' = 'default';
  @Input() loading = false;
  @Input() selectable = false;
  @Input() rowClickable = false;
  @Input() showHeader = false;
  @Input() showActions = false;
  @Input() showPagination = false;
  @Input() pagination?: PaginationConfig;
  @Input() emptyMessage = 'No data available';
  @Input() stickyHeader = false;
  @Input() compact = false;
  @Input() trackByKey = 'id';
  @Input() customClass?: string;
  @Input() sortColumn: string | null = null;
  @Input() sortDirection: 'asc' | 'desc' | null = null;
  @Input() searchable = true;
  @Input() searchPlaceholder = 'Search...';
  @Input() noResultsMessage = 'No matching results found';

  @Output() sortChange = new EventEmitter<SortEvent>();
  @Output() selectionChange = new EventEmitter<T[]>();
  @Output() rowClick = new EventEmitter<{ row: T; index: number }>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() searchChange = new EventEmitter<string>();

  selectedRows = new Set<T>();
  searchQuery = '';

  get wrapperClasses(): string {
    return cn(
      'table-wrapper',
      this.customClass
    );
  }

  get tableClasses(): string {
    return cn(
      'table',
      sizeClass('table', this.size),
      `table--${this.variant}`,
      this.stickyHeader && 'table--sticky-header',
      this.compact && 'table--compact'
    );
  }

  get totalColumns(): number {
    let count = this.columns.length;
    if (this.selectable) count++;
    if (this.showActions) count++;
    return count;
  }

  get hasEmptySlot(): boolean {
    return !!this.emptyTemplate;
  }

  get allSelected(): boolean {
    return this.data.length > 0 && this.selectedRows.size === this.data.length;
  }

  get someSelected(): boolean {
    return this.selectedRows.size > 0;
  }

  get filteredData(): T[] {
    if (!this.searchQuery.trim()) return this.data;
    const query = this.searchQuery.toLowerCase().trim();
    return this.data.filter(row => this.rowMatchesSearch(row, query));
  }

  get totalPages(): number {
    if (!this.pagination) return 0;
    return Math.ceil(this.pagination.total / this.pagination.pageSize);
  }

  get paginationStart(): number {
    if (!this.pagination) return 0;
    return (this.pagination.page - 1) * this.pagination.pageSize + 1;
  }

  get paginationEnd(): number {
    if (!this.pagination) return 0;
    return Math.min(this.pagination.page * this.pagination.pageSize, this.pagination.total);
  }

  get visiblePages(): (number | string)[] {
    if (!this.pagination) return [];
    const total = this.totalPages;
    const current = this.pagination.page;
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, '...', total);
      } else if (current >= total - 2) {
        pages.push(1, '...', total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
      }
    }

    return pages;
  }

  trackByFn(item: T): any {
    return (item as any)[this.trackByKey] ?? item;
  }

  getHeaderClasses(column: TableColumn): string {
    return cn(
      'table__th',
      column.sortable && 'table__th--sortable',
      column.align && `table__th--${column.align}`,
      this.sortColumn === column.key && 'table__th--sorted'
    );
  }

  getCellClasses(column: TableColumn): string {
    return cn(
      'table__td',
      column.align && `table__td--${column.align}`
    );
  }

  getCellValue(row: T, key: string): any {
    return key.split('.').reduce((obj: any, k) => obj?.[k], row);
  }

  getColumnKey(column: TableColumn): string {
    return String(column.key);
  }

  toggleSort(columnKey: string): void {
    let newColumn: string | null = columnKey;
    let newDirection: 'asc' | 'desc' | null = 'asc';

    if (this.sortColumn === columnKey) {
      // Cycle through: asc -> desc -> null
      if (this.sortDirection === 'asc') {
        newDirection = 'desc';
      } else if (this.sortDirection === 'desc') {
        newDirection = null;
        newColumn = null;
      }
    }

    this.sortChange.emit({
      column: newColumn ?? '',
      direction: newDirection
    });
  }

  isSelected(row: T): boolean {
    return this.selectedRows.has(row);
  }

  toggleSelect(row: T): void {
    if (this.selectedRows.has(row)) {
      this.selectedRows.delete(row);
    } else {
      this.selectedRows.add(row);
    }
    this.selectionChange.emit(Array.from(this.selectedRows));
  }

  toggleSelectAll(): void {
    if (this.allSelected) {
      this.selectedRows.clear();
    } else {
      this.data.forEach(row => this.selectedRows.add(row));
    }
    this.selectionChange.emit(Array.from(this.selectedRows));
  }

  onRowClick(row: T, index: number): void {
    if (this.rowClickable) {
      this.rowClick.emit({ row, index });
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSizeChange.emit(+target.value);
  }

  onSearchChange(): void {
    this.searchChange.emit(this.searchQuery);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchChange.emit('');
  }

  private rowMatchesSearch(row: T, query: string): boolean {
    // Search through all column keys
    for (const column of this.columns) {
      const value = this.getCellValue(row, this.getColumnKey(column));
      if (value !== null && value !== undefined) {
        const stringValue = String(value).toLowerCase();
        if (stringValue.includes(query)) {
          return true;
        }
      }
    }
    // Also search through all object properties for nested values
    return this.deepSearchObject(row, query);
  }

  private deepSearchObject(obj: any, query: string, visited = new WeakSet()): boolean {
    if (obj === null || obj === undefined) return false;
    if (typeof obj !== 'object') {
      return String(obj).toLowerCase().includes(query);
    }
    if (visited.has(obj)) return false;
    visited.add(obj);

    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (value === null || value === undefined) continue;
      if (typeof value === 'object') {
        if (this.deepSearchObject(value, query, visited)) return true;
      } else {
        if (String(value).toLowerCase().includes(query)) return true;
      }
    }
    return false;
  }
}
