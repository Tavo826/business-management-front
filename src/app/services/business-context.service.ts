import { computed, inject, Injectable, signal } from '@angular/core';
import { Business } from '../interfaces/business.model';
import { HttpBusinessProviderService } from './http-business-provider.service';

const ACTIVE_BUSINESS_KEY = 'active_business_nit';

@Injectable({
  providedIn: 'root'
})
export class BusinessContextService {

  private httpBusiness = inject(HttpBusinessProviderService);

  businesses = signal<Business[]>([]);
  activeBusiness = signal<Business | null>(null);
  isLoading = signal(false);

  activeBusinessName = computed(() => this.activeBusiness()?.name ?? '');

  loadBusinesses(userId: string): void {
    this.isLoading.set(true);
    this.httpBusiness.getBusinessListByUserId(userId).subscribe({
      next: (list) => {
        this.businesses.set(list);
        const savedNit = localStorage.getItem(ACTIVE_BUSINESS_KEY);
        const restored = savedNit ? list.find(b => b.nit === savedNit) : null;
        this.activeBusiness.set(restored ?? list[0] ?? null);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  setActiveBusiness(business: Business): void {
    this.activeBusiness.set(business);
    localStorage.setItem(ACTIVE_BUSINESS_KEY, business.nit);
  }
}
