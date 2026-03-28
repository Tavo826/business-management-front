import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BankAccount } from '../../../interfaces/bank.models';
import { SocialMedia } from '../../../interfaces/media.models';
import { Business } from '../../../interfaces/business.model';
import { HttpBusinessProviderService } from '../../../services/http-business-provider.service';
import { BusinessContextService } from '../../../services/business-context.service';
import { SessionService } from '../../../shared/session/session.service';
import { ErrorComponent } from '../../../components/error/error.component';

@Component({
  selector: 'app-create-business',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ErrorComponent],
  templateUrl: './create-business.component.html',
  styleUrl: './create-business.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateBusinessComponent {

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly httpBusinessProvider = inject(HttpBusinessProviderService);
  private readonly businessContext = inject(BusinessContextService);
  private readonly sessionService = inject(SessionService);

  showSocialModal = signal(false);
  showBankModal = signal(false);
  showErrorModal = signal(false);
  isSubmitted = signal(false);

  errorMessage = '';
  errorTitle = 'Error creando el negocio';

  socialMediaList = signal<SocialMedia[]>([]);
  bankAccountList = signal<BankAccount[]>([]);

  businessForm = this.formBuilder.group({
    businessName: ['', [Validators.required, Validators.minLength(3)]],
    nit: ['', [Validators.required, Validators.minLength(9)]],
    businessPhone: ['', [Validators.required, Validators.minLength(10)]],
    businessAddress: ['', [Validators.required, Validators.minLength(10)]],
    businessEmail: ['', [Validators.required, Validators.email]],
    businessDescription: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
  });

  socialMediaForm = this.formBuilder.group({
    platformName: ['', [Validators.required, Validators.minLength(3)]],
    url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
  });

  bankAccountForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    accountHolder: ['', [Validators.required, Validators.minLength(5)]],
    accountNumber: ['', [Validators.required, Validators.minLength(10)]],
    accountType: ['', [Validators.required]],
  });

  // Social Media
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
        platformName: this.socialMediaForm.value.platformName!,
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

  removeSocialMedia(index: number) {
    this.socialMediaList.update(list => list.filter((_, i) => i !== index));
  }

  // Bank Accounts
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
        name: this.bankAccountForm.value.name!,
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

  // Submit
  saveBusiness() {
    this.isSubmitted.set(true);

    if (this.businessForm.valid) {
      const user = this.sessionService.getCurrentUserValue();

      const business: Business = {
        name: this.businessForm.value.businessName!,
        nit: this.businessForm.value.nit!,
        phone: this.businessForm.value.businessPhone!,
        address: this.businessForm.value.businessAddress!,
        email: this.businessForm.value.businessEmail!,
        description: this.businessForm.value.businessDescription!,
        ownerDocumentId: user?.documentId,
        socialMediaList: this.socialMediaList(),
        bankAccountList: this.bankAccountList(),
      };

      this.httpBusinessProvider.registerBusiness(business).subscribe({
        next: (created) => {
          this.businessContext.setActiveBusiness(created);
          this.isSubmitted.set(false);
          if (user?.documentId) {
            this.businessContext.loadBusinesses(user.documentId);
          }
          this.router.navigate(['/app/businesses']);
        },
        error: (error) => {
          this.showError(error);
          this.isSubmitted.set(false);
        }
      });
    } else {
      Object.keys(this.businessForm.controls).forEach(key => {
        this.businessForm.get(key)?.markAsTouched();
      });
    }
  }

  goBack() {
    this.router.navigate(['/app/businesses']);
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
