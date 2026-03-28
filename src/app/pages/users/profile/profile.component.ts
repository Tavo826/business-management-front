import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionService } from '../../../shared/session/session.service';
import { CommonModule, NgIf } from '@angular/common';
import { HttpAuthProviderService } from '../../../services/http-auth-provider.service';
import { User } from '../../../interfaces/user.models';
import { ErrorComponent } from '../../../components/error/error.component';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf, ErrorComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  
  private readonly formBuilder = inject(FormBuilder);
  private sessionService = inject(SessionService);
  private registrationService = inject(HttpAuthProviderService)

  isSubmitted: boolean = false
  showErrorModal = signal(false);
  user: User | null = null;

  errorMessage: string = '';
  errorTitle: string = "Error actualizando el usuario";

  constructor() {
    this.loadActualUser();
  }

  userForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    surname: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]]
  });

  updateUserInfo() {

    this.isSubmitted = true;

    if (this.userForm.valid) {

      const updatedUser: User = {
        documentId: this.user?.documentId!,
        name: this.userForm.value.name!,
        surname: this.userForm.value.surname!,
        email: this.userForm.value.email!,
        documentType: this.user?.documentType!,
        password: this.user?.password!,
        birthdate: this.user?.birthdate!,
      };
    
      this.updateUser(updatedUser.documentId, updatedUser);
    } else {
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
    }
  }

  updateUser(id: string, user: User) {

    this.registrationService.updateUser(id, user).subscribe({
      next: () => {
        this.loadActualUser();
      },
      error: (error) => {
        this.showError(error);
        this.isSubmitted = false;
      }
    })
  }

  deleteAccount() {
    this.registrationService.deleteUser(this.user?.documentId!).subscribe({
      next: () => {
        this.sessionService.logout();
      },
      error: (error) => {
        this.showError(error);
        this.isSubmitted = false;
      }
    })
  }

  loadActualUser() {
    this.user = this.sessionService.getCurrentUserValue();
    this.userForm.patchValue({
      name: this.user?.name,
      surname: this.user?.surname,
      email: this.user?.email,
    });
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
