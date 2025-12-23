import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

// Import all UI components
import {
  ButtonComponent,
  ButtonGroupComponent,
  IconButtonComponent,
  BadgeComponent,
  LinkComponent,
  InputComponent,
  TextareaComponent,
  SelectComponent,
  CheckboxComponent,
  RadioComponent,
  ToggleComponent,
  CardComponent,
  StatCardComponent,
  ModalComponent,
  AlertComponent,
  ToastComponent,
  TableComponent,
  TabsComponent,
  BreadcrumbComponent,
  SpinnerComponent,
  SkeletonComponent,
  AvatarComponent,
  DividerComponent,
  TooltipDirective,
  TooltipContentComponent
} from '../../components/ui';

import type { TableColumn, DropdownOption, TabItem } from '../../components/ui';

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    ButtonComponent,
    ButtonGroupComponent,
    IconButtonComponent,
    BadgeComponent,
    LinkComponent,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    CheckboxComponent,
    RadioComponent,
    ToggleComponent,
    CardComponent,
    StatCardComponent,
    ModalComponent,
    AlertComponent,
    ToastComponent,
    TableComponent,
    TabsComponent,
    BreadcrumbComponent,
    SpinnerComponent,
    SkeletonComponent,
    AvatarComponent,
    DividerComponent,
    TooltipDirective,
    TooltipContentComponent
  ],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss'
})
export class ShowcaseComponent {
  // Form state
  inputValue = '';
  textareaValue = '';
  selectedOption = '';
  checkboxValue = false;
  radioValue = 'option1';
  toggleValue = false;
  passwordValue = '';

  // Modal state
  isModalOpen = signal(false);
  modalSize: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  // Toast state
  showToast = signal(false);
  toastColor: 'success' | 'danger' | 'warning' | 'info' = 'success';

  // Loading states
  isLoading = false;

  // Select options
  selectOptions: DropdownOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'nextjs', label: 'Next.js' }
  ];

  // Tab items - different sets for each variant
  tabItems: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'features', label: 'Features', icon: '✨' },
    { id: 'docs', label: 'Documentation', icon: '📚' },
    { id: 'examples', label: 'Examples', icon: '💡' }
  ];

  tabItems2: TabItem[] = [
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'develop', label: 'Develop', icon: '💻' },
    { id: 'deploy', label: 'Deploy', icon: '🚀' },
    { id: 'monitor', label: 'Monitor', icon: '📊' }
  ];

  tabItems3: TabItem[] = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

  tabItems4: TabItem[] = [
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'reports', label: 'Reports', icon: '📄' },
    { id: 'export', label: 'Export', icon: '💾' },
    { id: 'archive', label: 'Archive', icon: '📦' }
  ];

  activeTab = 'overview';

  // Breadcrumb items
  breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Components', href: '/components' },
    { label: 'Showcase', active: true }
  ];

  // Table data
  tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true, width: '80px' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status' }
  ];

  tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'Active' },
    { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'Admin', status: 'Active' }
  ];

  tablePagination = {
    page: 1,
    pageSize: 5,
    total: 5
  };

  // Colors and variants for demos
  colors = ['primary', 'secondary', 'accent', 'success', 'warning', 'danger', 'info', 'neutral'] as const;
  buttonVariants = ['solid', 'outline', 'ghost', 'soft', 'link'] as const;
  sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

  // Methods
  openModal(size: 'sm' | 'md' | 'lg' | 'xl' = 'md') {
    this.modalSize = size;
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  showToastNotification(color: 'success' | 'danger' | 'warning' | 'info') {
    this.toastColor = color;
    this.showToast.set(true);
  }

  hideToast() {
    this.showToast.set(false);
  }

  onTabChange(tabId: string | number) {
    this.activeTab = String(tabId);
  }

  onTableSort(event: { column: string; direction: 'asc' | 'desc' | null }) {
    console.log('Sort:', event);
  }

  onTableSelectionChange(selectedRows: unknown[]) {
    console.log('Selection:', selectedRows);
  }

  simulateLoading() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
