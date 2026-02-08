import { BankAccount } from "./bank.models";
import { SocialMedia } from "./media.models";

export interface Business {
  businessName: string;
  nit: string;
  businessPhone: string;
  businessAddress: string;
  businessEmail: string;
  businessDescription: string;
  socialMediaList?: SocialMedia[];
  bankAccountList?: BankAccount[];
  createdAt?: Date;
  updatedAt?: Date;
}