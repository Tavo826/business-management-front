import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegistrationService } from '../../../shared/registration/registration.service';
import { User } from '../../../interfaces/user.models';

@Component({
  selector: 'app-register-step-one',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './register-step-one.component.html',
  styleUrl: './register-step-one.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterStepOneComponent {

  private readonly formBuilder = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly registrationService = inject(RegistrationService)

  isSubmitted: boolean = false

  ngOnInit() {
    
    const savedData = this.registrationService.getUserFromStorage();
    if (savedData) {
      this.registrationFormOne.patchValue({
        name: savedData.name,
        surname: savedData.surname,
        documentNumber: savedData.documentId,
        email: savedData.email,
      });
    }
  }

  registrationFormOne = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    surname: ['', [Validators.required, Validators.minLength(3)]],
    documentType: ['', [Validators.required]],
    documentNumber: ['', [Validators.required, Validators.minLength(8)]],
    birthdate: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
  }, {
    validators: this.passwordMatchValidation
  })

  public continueRegistration() {
    this.isSubmitted = true;

    if (this.registrationFormOne.valid) {
      
      const user: User = {
        name: this.registrationFormOne.value.name!,
        surname: this.registrationFormOne.value.surname!,
        documentType: this.registrationFormOne.value.documentType!,
        documentId: this.registrationFormOne.value.documentNumber!,
        email: this.registrationFormOne.value.email!,
        password: this.registrationFormOne.value.password!,
        birthdate: this.registrationFormOne.value.birthdate!
      }

      this.registrationService.setUserInfo(user);
      
      this.router.navigate(['/register/step-2']);
    } else {
      Object.keys(this.registrationFormOne.controls).forEach(key => {
        this.registrationFormOne.get(key)?.markAsTouched();
      });
    }
  }

  private passwordMatchValidation(group: any) {
    const password = group.get('password')?.value
    const confirmPassword = group.get('confirmPassword')?.value

    if (password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      group.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }

}
