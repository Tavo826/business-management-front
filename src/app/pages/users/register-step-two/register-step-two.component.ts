import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BankAccount } from '../../../interfaces/bank.models';
import { SocialMedia } from '../../../interfaces/media.models';
import { RegistrationService } from '../../../shared/registration/registration.service';
import { Business } from '../../../interfaces/business.model';
import { HttpAuthProviderService } from '../../../services/http-auth-provider.service';
import { User } from '../../../interfaces/user.models';
import { ErrorComponent } from '../../../components/error/error.component';
import { HttpBusinessProviderService } from '../../../services/http-business-provider.service';

@Component({
  selector: 'app-register-step-two',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, ErrorComponent],
  templateUrl: './register-step-two.component.html',
  styleUrl: './register-step-two.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterStepTwoComponent {

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly registrationService = inject(RegistrationService);
  private readonly httpAuthProvider = inject(HttpAuthProviderService);
  private readonly httpBusinessProvider = inject(HttpBusinessProviderService)

  showSocialModal = signal(false);
  showBankModal = signal(false);
  showErrorModal = signal(false);
  isSubmitted = signal(false);

  errorMessage: string = '';
  errorTitle: string = "Error registrando el usuario";

  socialMediaList = signal<SocialMedia[]>([]);
  bankAccountList = signal<BankAccount[]>([]);

  ngOnInit() {

    if (!this.registrationService.isStepOneComplete()) {
      this.router.navigate(['/register/step-one']);
      return;
    }

    const savedBusiness = this.registrationService.getBusinessFromStorage();
    if (savedBusiness) {
      this.registrationFormTwo.patchValue(savedBusiness);
    }

    const savedSocialMedia = this.registrationService.getSocialMediaFromStorage();
    if (savedSocialMedia) {
      this.socialMediaList.set(savedSocialMedia);
    }

    const savedBankAccounts = this.registrationService.getBankAccountsFromStorage();
    if (savedBankAccounts) {
      this.bankAccountList.set(savedBankAccounts);
    }
  }
  
  registrationFormTwo = this.formBuilder.group({
    businessName: ['', [Validators.required, Validators.minLength(3)]],
    nit: ['', [Validators.required, Validators.minLength(9)]],
    businessPhone: ['', [Validators.required, Validators.minLength(10)]],
    businessAddress: ['', [Validators.required, Validators.minLength(10)]],
    businessEmail: ['', [Validators.required, Validators.email]],
    businessDescription: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
  });

  socialMediaForm = this.formBuilder.group({
    platform: ['', [Validators.required, Validators.minLength(3)]],
    url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
  });

  bankAccountForm = this.formBuilder.group({
    bankName: ['', [Validators.required, Validators.minLength(3)]],
    accountHolder: ['', [Validators.required, Validators.minLength(5)]],
    accountNumber: ['', [Validators.required, Validators.minLength(10)]],
    accountType: ['', [Validators.required]],
  });

  removeSocialMedia(index: number) {
    this.socialMediaList.update(list => list.filter((_, i) => i !== index));
  }

  openSocialModal() {
    this.showSocialModal.set(true);
    this.socialMediaForm.reset();
  }

  closeSocialModal() {
    this.showSocialModal.set(false);
    this.socialMediaForm.reset();
  }

  addSocialMedia() {
    if (this.socialMediaForm.valid) {
      const newSocial: SocialMedia = {
        platform: this.socialMediaForm.value.platform!,
        url: this.socialMediaForm.value.url!,
      };
      
      this.socialMediaList.update(list => [...list, newSocial]);
      this.closeSocialModal();
    } else {
      Object.keys(this.socialMediaForm.controls).forEach(key => {
        this.socialMediaForm.get(key)?.markAsTouched();
      });
    }
  }

  openBankModal() {
    this.showBankModal.set(true);
    this.bankAccountForm.reset();
  }

  closeBankModal() {
    this.showBankModal.set(false);
    this.bankAccountForm.reset();
  }

  addBankAccount() {
    if (this.bankAccountForm.valid) {
      const newAccount: BankAccount = {
        bankName: this.bankAccountForm.value.bankName!,
        accountHolder: this.bankAccountForm.value.accountHolder!,
        accountNumber: this.bankAccountForm.value.accountNumber!,
        accountType: this.bankAccountForm.value.accountType!,
      };
      
      this.bankAccountList.update(list => [...list, newAccount]);
      this.closeBankModal();
    } else {
      Object.keys(this.bankAccountForm.controls).forEach(key => {
        this.bankAccountForm.get(key)?.markAsTouched();
      });
    }
  }

  removeBankAccount(index: number) {
    this.bankAccountList.update(list => list.filter((_, i) => i !== index));
  }

  completeRegistration() {
    this.isSubmitted.set(true);

    if (this.registrationFormTwo.valid) {
      
      const business: Business = {
        businessName: this.registrationFormTwo.value.businessName!,
        nit: this.registrationFormTwo.value.nit!,
        businessPhone: this.registrationFormTwo.value.businessPhone!,
        businessAddress: this.registrationFormTwo.value.businessAddress!,
        businessEmail: this.registrationFormTwo.value.businessEmail!,
        businessDescription: this.registrationFormTwo.value.businessDescription!,
      };

      business.socialMediaList = this.socialMediaList();
      business.bankAccountList = this.bankAccountList();

      this.registrationService.setBusinessInfo(business);
      this.registrationService.setSocialMediaInfo(this.socialMediaList());
      this.registrationService.setBankAccountsInfo(this.bankAccountList());

      this.saveUserRegistration(this.registrationService.getUserFromStorage()!)
      this.saveBusinessRegistration(business)
      
      this.router.navigate(['/app/dashboard']);
    } else {
      Object.keys(this.registrationFormTwo.controls).forEach(key => {
        this.registrationFormTwo.get(key)?.markAsTouched();
      });
    }
  }

  saveUserRegistration(user: User) {

    this.httpAuthProvider.registerUser(user).subscribe({
      next: () => {
        this.isSubmitted.set(false);
      },
      error: (error) => {
        this.showError(error)
        this.isSubmitted.set(false);
      }
    });
  }

  saveBusinessRegistration(business: Business) {
    this.httpBusinessProvider.registerBusiness(business).subscribe({
      next: () => {
        this.isSubmitted.set(false);
      },
      error: (error) => {
        this.showError(error)
        this.isSubmitted.set(false);
      }
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
