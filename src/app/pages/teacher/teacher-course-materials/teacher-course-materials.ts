import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';

import { TeacherApiService } from '../../../services/teacher-api.service';
import type { CourseDto } from '../../../domain/dtos/teacher/teacher-quiz.dto';
import type {
  MaterialType,
  TeacherCourseMaterialDto,
} from '../../../domain/dtos/teacher/teacher-course-material.dto';

@Component({
  selector: 'app-teacher-course-materials',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <section class="materials-page">
      <header class="page-header">
        <h1>Course Materials</h1>
        <p>Upload PDF or DOCX resources to ground student AI chat answers.</p>
      </header>

      <div class="alert error" *ngIf="errorMessage">{{ errorMessage }}</div>
      <div class="alert success" *ngIf="successMessage">{{ successMessage }}</div>
      <div class="alert warning" *ngIf="warningMessage">{{ warningMessage }}</div>

      <section class="card controls-card">
        <div class="control-row">
          <label for="courseId">Course</label>
          <select
            id="courseId"
            [(ngModel)]="selectedCourseId"
            (ngModelChange)="onCourseChange()"
            [disabled]="isLoadingCourses || !courses.length"
          >
            <option value="" disabled>Select a course</option>
            <option *ngFor="let course of courses" [value]="course.id">
              {{ course.teachingUnit?.name || 'Untitled teaching unit' }}
            </option>
          </select>
        </div>
      </section>

      <section class="card upload-card">
        <h2>Upload Material</h2>

        <div class="grid">
          <label>
            Title
            <input
              type="text"
              [(ngModel)]="uploadTitle"
              maxlength="200"
              placeholder="Optional title"
            />
          </label>

          <label>
            Material Type
            <select [(ngModel)]="selectedMaterialType">
              <option *ngFor="let type of materialTypes" [value]="type">
                {{ formatMaterialType(type) }}
              </option>
            </select>
          </label>

          <label class="description-field">
            Description
            <textarea
              rows="3"
              [(ngModel)]="uploadDescription"
              maxlength="5000"
              placeholder="Optional description"
            ></textarea>
          </label>

          <label class="file-field">
            File (.pdf, .docx)
            <input
              type="file"
              accept=".pdf,.docx"
              (change)="onFileSelected($event)"
            />
          </label>
        </div>

        <div class="upload-footer">
          <p class="selected-file" *ngIf="selectedFile">
            Selected: {{ selectedFile.name }} ({{ formatBytes(selectedFile.size) }})
          </p>
          <p class="selected-file" *ngIf="!selectedFile">No file selected</p>

          <button
            type="button"
            class="primary"
            (click)="uploadMaterial()"
            [disabled]="isUploading || !selectedCourseId || !selectedFile"
          >
            <mat-icon>upload_file</mat-icon>
            <span>{{ isUploading ? 'Uploading...' : 'Upload Material' }}</span>
          </button>
        </div>
      </section>

      <section class="card list-card">
        <div class="list-header">
          <h2>Uploaded Materials</h2>
          <button
            type="button"
            class="secondary"
            (click)="loadMaterials()"
            [disabled]="isLoadingMaterials || !selectedCourseId"
          >
            <mat-icon>refresh</mat-icon>
            <span>Refresh</span>
          </button>
        </div>

        <p class="muted" *ngIf="isLoadingMaterials">Loading materials...</p>
        <p class="muted" *ngIf="!isLoadingMaterials && !materials.length">
          No materials uploaded for this course yet.
        </p>

        <div class="table-wrapper" *ngIf="materials.length">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>File</th>
                <th>Status</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let material of materials; trackBy: trackByMaterialId">
                <td>
                  <strong>{{ material.title }}</strong>
                  <p class="material-description" *ngIf="material.description">
                    {{ material.description }}
                  </p>
                </td>
                <td>{{ formatMaterialType(material.materialType) }}</td>
                <td>
                  {{ material.fileName }}
                  <span class="muted">({{ formatBytes(material.fileSize) }})</span>
                </td>
                <td>
                  <span class="status" [class.indexed]="material.isIndexed" [class.pending]="!material.isIndexed">
                    {{ material.isIndexed ? 'Indexed' : 'Pending' }}
                  </span>
                  <p class="index-error" *ngIf="material.indexError">{{ material.indexError }}</p>
                </td>
                <td>{{ material.createdAt | date: 'medium' }}</td>
                <td>
                  <button type="button" class="danger" (click)="deleteMaterial(material)">
                    <mat-icon>delete</mat-icon>
                    <span>Delete</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  `,
  styles: [
    `
      .materials-page {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        gap: 1rem;
      }

      .page-header h1 {
        margin: 0;
        font-size: 1.8rem;
      }

      .page-header p {
        margin: 0.35rem 0 0;
        color: var(--color-text-secondary);
      }

      .card {
        background: #fff;
        border-radius: 12px;
        padding: 1rem;
        border: 1px solid var(--color-border-muted, #e5e7eb);
      }

      .controls-card,
      .upload-card,
      .list-card {
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
      }

      .control-row {
        display: grid;
        gap: 0.35rem;
        max-width: 380px;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(240px, 1fr));
        gap: 0.9rem;
      }

      .description-field,
      .file-field {
        grid-column: 1 / -1;
      }

      label {
        display: grid;
        gap: 0.35rem;
        font-weight: 500;
      }

      input,
      select,
      textarea {
        border: 1px solid #d1d5db;
        border-radius: 8px;
        padding: 0.6rem 0.7rem;
        font: inherit;
      }

      .upload-footer {
        margin-top: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }

      .selected-file {
        margin: 0;
        color: var(--color-text-secondary);
      }

      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.8rem;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        text-align: left;
        padding: 0.7rem 0.5rem;
        border-bottom: 1px solid #edf0f3;
        vertical-align: top;
      }

      th {
        font-size: 0.83rem;
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.02em;
      }

      .material-description,
      .index-error {
        margin: 0.2rem 0 0;
        font-size: 0.82rem;
        color: var(--color-text-secondary);
      }

      .index-error {
        color: #b91c1c;
      }

      .status {
        display: inline-flex;
        padding: 0.22rem 0.5rem;
        border-radius: 999px;
        font-size: 0.78rem;
        font-weight: 600;
      }

      .status.indexed {
        background: #dcfce7;
        color: #166534;
      }

      .status.pending {
        background: #fef3c7;
        color: #92400e;
      }

      .muted {
        color: var(--color-text-secondary);
      }

      .alert {
        border-radius: 8px;
        padding: 0.6rem 0.8rem;
        font-weight: 500;
      }

      .alert.error {
        background: #fee2e2;
        color: #991b1b;
      }

      .alert.success {
        background: #dcfce7;
        color: #166534;
      }

      .alert.warning {
        background: #fef3c7;
        color: #92400e;
      }

      button {
        border: none;
        border-radius: 8px;
        padding: 0.45rem 0.75rem;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        cursor: pointer;
        font-weight: 600;
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .primary {
        background: #0f766e;
        color: #fff;
      }

      .secondary {
        background: #e2e8f0;
        color: #1e293b;
      }

      .danger {
        background: #fee2e2;
        color: #991b1b;
      }

      @media (max-width: 900px) {
        .grid {
          grid-template-columns: 1fr;
        }

        .upload-footer {
          flex-direction: column;
          align-items: stretch;
        }

        .table-wrapper {
          overflow-x: auto;
        }
      }
    `,
  ],
})
export class TeacherCourseMaterials implements OnInit {
  private readonly teacherApi = inject(TeacherApiService);

  readonly materialTypes: MaterialType[] = [
    'LECTURE_NOTES',
    'TIMETABLE',
    'ASSIGNMENT',
    'REFERENCE',
    'SYLLABUS',
    'OTHER',
  ];

  courses: CourseDto[] = [];
  materials: TeacherCourseMaterialDto[] = [];

  selectedCourseId = '';
  selectedMaterialType: MaterialType = 'LECTURE_NOTES';
  selectedFile: File | null = null;
  uploadTitle = '';
  uploadDescription = '';

  isLoadingCourses = false;
  isLoadingMaterials = false;
  isUploading = false;

  errorMessage = '';
  successMessage = '';
  warningMessage = '';

  async ngOnInit(): Promise<void> {
    await this.loadCourses();
  }

  async loadCourses(): Promise<void> {
    this.isLoadingCourses = true;
    this.clearMessages();

    try {
      this.courses = await firstValueFrom(this.teacherApi.getMyCourses());
      if (!this.courses.length) {
        this.selectedCourseId = '';
        this.materials = [];
        return;
      }

      this.selectedCourseId = this.courses[0].id;
      await this.loadMaterials();
    } catch (error) {
      this.errorMessage = this.extractErrorMessage(
        error,
        'Failed to load teacher courses.',
      );
    } finally {
      this.isLoadingCourses = false;
    }
  }

  async onCourseChange(): Promise<void> {
    this.clearMessages();
    await this.loadMaterials();
  }

  async loadMaterials(): Promise<void> {
    if (!this.selectedCourseId) {
      this.materials = [];
      return;
    }

    this.isLoadingMaterials = true;

    try {
      this.materials = await firstValueFrom(
        this.teacherApi.getCourseMaterials(this.selectedCourseId),
      );
    } catch (error) {
      this.errorMessage = this.extractErrorMessage(
        error,
        'Failed to load course materials.',
      );
    } finally {
      this.isLoadingMaterials = false;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.item(0) ?? null;
    this.warningMessage = '';
  }

  async uploadMaterial(): Promise<void> {
    if (!this.selectedCourseId || !this.selectedFile) {
      this.errorMessage = 'Please select a course and a file to upload.';
      return;
    }

    this.isUploading = true;
    this.clearMessages();

    try {
      const response = await firstValueFrom(
        this.teacherApi.uploadCourseMaterial(this.selectedCourseId, {
          file: this.selectedFile,
          title: this.uploadTitle,
          description: this.uploadDescription,
          materialType: this.selectedMaterialType,
        }),
      );

      this.successMessage = 'Material uploaded successfully.';
      this.warningMessage = response.warning ?? '';
      this.resetUploadForm();
      await this.loadMaterials();
    } catch (error) {
      this.errorMessage = this.extractErrorMessage(
        error,
        'Material upload failed.',
      );
    } finally {
      this.isUploading = false;
    }
  }

  async deleteMaterial(material: TeacherCourseMaterialDto): Promise<void> {
    const confirmed = window.confirm(
      `Delete "${material.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    this.clearMessages();

    try {
      await firstValueFrom(this.teacherApi.deleteCourseMaterial(material.id));
      this.successMessage = 'Material deleted successfully.';
      await this.loadMaterials();
    } catch (error) {
      this.errorMessage = this.extractErrorMessage(
        error,
        'Failed to delete material.',
      );
    }
  }

  formatMaterialType(type: MaterialType): string {
    return type
      .split('_')
      .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
      .join(' ');
  }

  formatBytes(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  readonly trackByMaterialId = (_: number, material: TeacherCourseMaterialDto) =>
    material.id;

  private resetUploadForm(): void {
    this.selectedFile = null;
    this.uploadTitle = '';
    this.uploadDescription = '';
    this.selectedMaterialType = 'LECTURE_NOTES';
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.warningMessage = '';
  }

  private extractErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === 'object') {
      const apiError = error as {
        error?: {
          message?: string | string[];
        };
      };

      if (Array.isArray(apiError.error?.message)) {
        return apiError.error.message.join(', ');
      }

      if (typeof apiError.error?.message === 'string') {
        return apiError.error.message;
      }
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return fallback;
  }
}
