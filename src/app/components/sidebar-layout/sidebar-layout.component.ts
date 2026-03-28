import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BusinessContextService } from '../../services/business-context.service';
import { SessionService } from '../../shared/session/session.service';
import { Business } from '../../interfaces/business.model';

@Component({
  selector: 'app-sidebar-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar-layout.component.html',
  styleUrl: './sidebar-layout.component.css',
})
export class SidebarLayoutComponent implements OnInit {

  private sessionService = inject(SessionService);
  businessContext = inject(BusinessContextService);

  mobileMenuOpen = false;
  businessDropdownOpen = signal(false);

  ngOnInit() {
    const user = this.sessionService.getCurrentUserValue();
    if (user?.documentId) {
      this.businessContext.loadBusinesses(user.documentId);
    }
  }

  toggleMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenu() {
    this.mobileMenuOpen = false;
  }

  toggleBusinessDropdown() {
    this.businessDropdownOpen.update(v => !v);
  }

  selectBusiness(business: Business) {
    this.businessContext.setActiveBusiness(business);
    this.businessDropdownOpen.set(false);
  }

  logOut() {
    this.sessionService.logout();
  }
}
