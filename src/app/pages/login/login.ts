import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import {
  CardComponent,
  InputComponent,
  SelectComponent,
  CheckboxComponent,
  ButtonComponent,
  AlertComponent,
  ThemeToggleComponent,
  type DropdownOption
} from '../../components/ui';
import type { LoginRequest, Role } from '../../domain/dtos/login.dto';
import { AuthService } from '../../core/auth/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    CardComponent,
    InputComponent,
    SelectComponent,
    CheckboxComponent,
    ButtonComponent,
    AlertComponent,
    ThemeToggleComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  // Form state
  loginRequest: LoginRequest = {
    identifier: '',
    password: '',
    rememberMe: false,
    role: 'TEACHER'
  };

  // UI state
  isLoading = false;
  errorMessage = '';

  // Validation errors
  roleError = '';
  identifierError = '';
  passwordError = '';

  // Role options for the select dropdown
  roleOptions: DropdownOption<Role>[] = [
    { value: 'TEACHER', label: 'Teacher', icon: '👨‍🏫' },
    { value: 'SPECIALITY_HEAD', label: 'Speciality Head (Speciality Head)', icon: '📋' },
    { value: 'DEAN', label: 'Dean (Administrator)', icon: '🏛️' }
  ];

  // Current year for copyright
  currentYear = new Date().getFullYear();

  // Dynamic labels based on role
  get identifierLabel(): string {
    return this.loginRequest.role === 'STUDENT' ? 'Matricule' : 'Email Address';
  }

  get identifierPlaceholder(): string {
    return this.loginRequest.role === 'STUDENT'
      ? 'Enter your student matricule'
      : 'Enter your email address';
  }

  // Form validation
  private validateForm(): boolean {
    let isValid = true;

    // Reset errors
    this.roleError = '';
    this.identifierError = '';
    this.passwordError = '';

    if (!this.loginRequest.role) {
      this.roleError = 'Please select your role';
      isValid = false;
    }

    if (!this.loginRequest.identifier?.trim()) {
      this.identifierError = this.loginRequest.role === 'STUDENT'
        ? 'Please enter your matricule'
        : 'Please enter your email address';
      isValid = false;
    }

    if (!this.loginRequest.password) {
      this.passwordError = 'Please enter your password';
      isValid = false;
    } else if (this.loginRequest.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
      isValid = false;
    }

    return isValid;
  }

  // Form submission
  async onSubmit(): Promise<void> {
    this.errorMessage = '';

    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    try {
      const session = await firstValueFrom(this.authService.login(this.loginRequest));

      const targetUrl = this.getLandingUrlForRole(session.user.role);

      // NOTE: With lazy-loaded standalone components, a stale tab (or a dev-server restart)
      // can cause chunk URLs to change. Router navigation then fails with:
      // "Failed to fetch dynamically imported module: ...chunk-XXXX.js".
      // Falling back to a full-page navigation fixes it by reloading the latest index/chunks.
      try {
        await this.router.navigateByUrl(targetUrl);
      } catch (navErr: unknown) {
        const msg = navErr instanceof Error ? navErr.message : String(navErr);
        if (msg.includes('Failed to fetch dynamically imported module')) {
          window.location.assign(targetUrl);
          return;
        }
        throw navErr;
      }
    } catch (error: unknown) {
      this.errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred during sign in. Please try again.';
      this.cdr.markForCheck();
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  private getLandingUrlForRole(role: Role): string {
    switch (role) {
      case 'DEAN':
        return '/dean';
      case 'TEACHER':
        return '/teacher';
      case 'SPECIALITY_HEAD':
        // Mini-admin web routes not yet implemented
        return '/showcase';
      case 'STUDENT':
        // Student web routes not yet implemented
        return '/showcase';
      default:
        return '/showcase';
    }
  }
}
