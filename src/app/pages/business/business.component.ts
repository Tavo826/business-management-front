import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject,signal } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessContextService } from '../../services/business-context.service';
import { SessionService } from '../../shared/session/session.service';
import { HttpBusinessProviderService } from '../../services/http-business-provider.service';
import { ErrorComponent } from '../../components/error/error.component';
import { ConfirmComponent } from '../../components/confirm/confirm.component';

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [CommonModule, ErrorComponent, ConfirmComponent],
  templateUrl: './business.component.html',
  styleUrl: './business.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessComponent {

  businessContext = inject(BusinessContextService);
  businessProvider = inject(HttpBusinessProviderService);
  private sessionService = inject(SessionService);
  private router = inject(Router);

  showErrorModal = signal(false);
  showConfirmModal = signal(false);
  businessToDelete: string | null = null;

  errorMessage: string = '';
  errorTitle: string = "Error eliminando el negocio";

  constructor() {
    this.loadBusinesses();
  }

  createBusiness() {
    this.router.navigate(['/app/businesses/create']);
  }

  editBusiness(nit: string) {
    this.router.navigate(['/app/businesses/edit', nit]);
  }

  loadBusinesses() {
    const user = this.sessionService.getCurrentUserValue();
    if (user?.documentId) {
      this.businessContext.loadBusinesses(user.documentId);
    }
  }

  requestDeleteBusiness(nit: string) {
    this.businessToDelete = nit;
    this.showConfirmModal.set(true);
  }

  confirmDeleteBusiness() {
    this.showConfirmModal.set(false);
    if (this.businessToDelete) {
      this.businessProvider.deleteBusiness(this.businessToDelete).subscribe({
        next: () => {
          this.businessToDelete = null;
          this.loadBusinesses();
        },
        error: (error) => {
          this.businessToDelete = null;
          this.showError(error);
        }
      })
    }
  }

  cancelDelete() {
    this.showConfirmModal.set(false);
    this.businessToDelete = null;
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
