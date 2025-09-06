import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/Auth/auth.service';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private authService: AuthService,
    private firestore: Firestore
  ) {
    this.signupForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(128)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  async onSignup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const usernameValue = this.username?.value ?? '';
    const emailValue = this.email?.value ?? '';
    const passwordValue = this.password?.value ?? '';

    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await this.authService.register(emailValue, passwordValue);
      const uid = userCredential.user.uid;

      // 2. Guardar datos extra en Firestore con UID como id
      await setDoc(doc(this.firestore, 'users', uid), {
        usernameValue,
        emailValue
      });

      console.log('Signup successful:', userCredential.user);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error in signup:', error);
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      this.isLoading = false;
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Try with another email.';
      case 'auth/invalid-email':
        return 'The email format is invalid.';
      case 'auth/weak-password':
        return 'The password is too weak. Choose a more secure password.';
      case 'auth/missing-password':
        return 'Please enter a password.';
      case 'auth/operation-not-allowed':
        return 'This registration method is not allowed. Contact support.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Try again later.';
      case 'auth/network-request-failed':
        return 'Connection error. Check your internet connection.';
      case 'auth/requires-recent-login':
        return 'Please log in again to perform this action.';
      case 'auth/credential-already-in-use':
        return 'This credential is already linked to another account.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with a different sign-in method.';
      case 'auth/popup-closed-by-user':
        return 'The registration popup was closed before completing the process.';
      case 'auth/cancelled-popup-request':
        return 'Multiple popups were opened. Try again.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for OAuth operations.';
      case 'auth/invalid-verification-code':
        return 'The verification code is invalid or has expired.';
      case 'auth/invalid-verification-id':
        return 'The verification ID is invalid.';
      default:
        return 'An unexpected error occurred. Try again.';
    }
  }

  onCancel() {
    this.location.back();
  }

  get username() {
    return this.signupForm.get('username');
  }
  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }
}
