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
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group(
      {
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

    const emailValue = this.email?.value ?? '';
    const passwordValue = this.password?.value ?? '';

    try {
      const userCredential = await this.authService.register(emailValue, passwordValue);
      console.log('Signup exitoso:', userCredential.user);

      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error en signup:', error);
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      this.isLoading = false;
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Este email ya está registrado. Intenta con otro email.';
      case 'auth/invalid-email':
        return 'El formato del email es inválido.';
      case 'auth/weak-password':
        return 'La contraseña es muy débil. Elige una contraseña más segura.';
      case 'auth/missing-password':
        return 'Por favor ingresa una contraseña.';
      case 'auth/operation-not-allowed':
        return 'Este método de registro no está permitido. Contacta al soporte.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Intenta más tarde.';
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu conexión a internet.';
      case 'auth/requires-recent-login':
        return 'Por favor inicia sesión nuevamente para realizar esta acción.';
      case 'auth/credential-already-in-use':
        return 'Esta credencial ya está vinculada a otra cuenta.';
      case 'auth/account-exists-with-different-credential':
        return 'Ya existe una cuenta con un método de inicio de sesión diferente.';
      case 'auth/popup-closed-by-user':
        return 'El popup de registro fue cerrado antes de completar el proceso.';
      case 'auth/cancelled-popup-request':
        return 'Se abrieron múltiples popups. Intenta nuevamente.';
      case 'auth/unauthorized-domain':
        return 'Este dominio no está autorizado para operaciones OAuth.';
      case 'auth/invalid-verification-code':
        return 'El código de verificación es inválido o ha expirado.';
      case 'auth/invalid-verification-id':
        return 'El ID de verificación es inválido.';
      default:
        return 'Ocurrió un error inesperado. Intenta nuevamente.';
    }
  }

  onCancel() {
    this.location.back();
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
