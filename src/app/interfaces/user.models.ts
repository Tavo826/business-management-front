import { BankAccount } from "./bank.models"
import { Business } from "./business.model"
import { SocialMedia } from "./media.models"

export interface User {
    documentId: string
    name: string
    surname: string
    email: string
    documentType: string
    password: string
    birthdate: string
    createdAt?: string
    updatedAt?: string
}

export interface CompleteRegistration {
  personalInfo: User | null;
  businessInfo: Business | null;
  socialMedia: SocialMedia[];
  bankAccounts: BankAccount[];
}