import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject,signal } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessContextService } from '../../services/business-context.service';
import { SessionService } from '../../shared/session/session.service';
import { HttpBusinessProviderService } from '../../services/http-business-provider.service';
import { ErrorComponent } from '../../components/error/error.component';

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [CommonModule, ErrorComponent],
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

  deleteBusiness(nit: string) {
    this.businessProvider.deleteBusiness(nit).subscribe({
      next: () => {
        this.loadBusinesses();
      },
      error: (error) => {
        this.showError(error);
      }
    })
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
