import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
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
  // Form state
  loginRequest: LoginRequest = {
    identifier: '',
    password: '',
    rememberMe: false,
    role: 'STUDENT'
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
    { value: 'STUDENT', label: 'Student', icon: '🎓' },
    { value: 'TEACHER', label: 'Teacher', icon: '👨‍🏫' },
    { value: 'SPECIALITY_HEAD', label: 'Speciality Head (Mini Admin)', icon: '📋' },
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
      // TODO: Implement actual authentication service call
      // const response = await this.authService.login(this.loginRequest);

      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // TODO: Handle successful login - navigate to appropriate dashboard
      console.log('Login attempt:', this.loginRequest);

    } catch (error: any) {
      this.errorMessage = error?.message || 'An error occurred during sign in. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
