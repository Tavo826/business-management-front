import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user.models';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private userKey = 'user_info';
  private businessKey = 'business_info';
  private socialMediaKey = 'social_media_info';
  private bankAccountsKey = 'bank_accounts_info';

  constructor() { }

  getUserFromStorage(): User | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) as User : null;
  }

  setUserInfo(data: User) {
    const encryptedPassword = btoa(data.password);
    const userDataToStore = { ...data, password: encryptedPassword };
    localStorage.setItem(this.userKey, JSON.stringify(userDataToStore));
  }

  getBusinessFromStorage(): any | null {
    const businessData = localStorage.getItem(this.businessKey);
    return businessData ? JSON.parse(businessData) : null;
  }

  setBusinessInfo(data: any) {
    localStorage.setItem(this.businessKey, JSON.stringify(data));
  }

  getSocialMediaFromStorage(): any[] {
    const socialMediaData = localStorage.getItem(this.socialMediaKey);
    return socialMediaData ? JSON.parse(socialMediaData) as any[] : [];
  }

  setSocialMediaInfo(data: any[]) {
    localStorage.setItem(this.socialMediaKey, JSON.stringify(data));
  }

  getBankAccountsFromStorage(): any[] {
    const bankAccountsData = localStorage.getItem(this.bankAccountsKey);
    return bankAccountsData ? JSON.parse(bankAccountsData) as any[] : [];
  }

  setBankAccountsInfo(data: any[]) {
    localStorage.setItem(this.bankAccountsKey, JSON.stringify(data));
  }

  isStepOneComplete(): boolean {
    return this.getUserFromStorage() !== null;
  }

  clearRegistrationData() {
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.businessKey);
    localStorage.removeItem(this.socialMediaKey);
    localStorage.removeItem(this.bankAccountsKey);
  }
}
