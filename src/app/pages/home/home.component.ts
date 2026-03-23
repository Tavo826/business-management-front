import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LoginRequest } from '../../interfaces/auth.models';
import { HttpAuthProviderService } from '../../services/http-auth-provider.service';
import { ErrorComponent } from '../../components/error/error.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  mode = signal<'signin' | 'register'>('signin');

  private readonly formBuilder = inject(FormBuilder)
  private readonly httpAuthProvider = inject(HttpAuthProviderService);

  showPassword = signal(false);
  showErrorModal = signal(false);
  isSubmitted: boolean = false

  errorMessage: string = '';
  errorTitle: string = "Error al ingresar al sistema";

  constructor(private router: Router) {}

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  })

  login(e: Event) {
    e.preventDefault();

    this.isSubmitted = true;

    if (this.loginForm.valid) {
      const login: LoginRequest = {
        email: this.loginForm.value.email!,
        password: btoa(this.loginForm.value.password!),
      }

      this.loginUser(login);
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }

    this.router.navigate(['/app/dashboard']);
  }

  loginUser(login: LoginRequest) {
    this.httpAuthProvider.logUser(login).subscribe({
      next: () => {
        this.isSubmitted = false;
        this.router.navigate(['/app/dashboard']);
      },
      error: (error) => {
        this.showError(error);
        this.isSubmitted = false;
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.showErrorModal.set(true);
  }

  closeErrorModal(): void {
    this.showErrorModal.set(false);
    this.errorMessage = '';
  }

}
