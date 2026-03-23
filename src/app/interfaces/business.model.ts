import { BankAccount } from "./bank.models";
import { SocialMedia } from "./media.models";

export interface Business {
  name: string;
  nit: string;
  phone: string;
  address: string;
  email: string;
  description: string;
  ownerDocumentId?: string;
  socialMediaList?: SocialMedia[];
  bankAccountList?: BankAccount[];
  createdAt?: Date;
  updatedAt?: Date;
}