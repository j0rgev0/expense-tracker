import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/Auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(128)]]
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const emailValue = this.email?.value ?? '';
    const passwordValue = this.password?.value ?? '';

    try {
      const userCredential = await this.authService.login(emailValue, passwordValue);
      console.log('Login exitoso:', userCredential.user);

      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error en login:', error);
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      this.isLoading = false;
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/invalid-email':
        return 'The email format is invalid.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/email-already-in-use':
        return 'This email is already associated with another account.';
      case 'auth/weak-password':
        return 'The password is too weak. Please choose a stronger one.';
      case 'auth/missing-password':
        return 'Please enter a password.';
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not allowed. Please contact support.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Connection error. Check your internet connection.';
      case 'auth/requires-recent-login':
        return 'Please log in again to perform this action.';
      case 'auth/credential-already-in-use':
        return 'This credential is already linked to another account.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with a different sign-in method.';
      case 'auth/popup-closed-by-user':
        return 'The sign-in popup was closed before completing the process.';
      case 'auth/cancelled-popup-request':
        return 'Multiple popups opened. Please try again.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for OAuth operations.';
      case 'auth/invalid-verification-code':
        return 'The verification code is invalid or expired.';
      case 'auth/invalid-verification-id':
        return 'The verification ID is invalid.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  onCancel() {
    this.location.back();
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
