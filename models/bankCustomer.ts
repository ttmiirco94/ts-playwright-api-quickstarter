import { Address } from './address';

export interface BankCustomer {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: Address;
    dateOfBirth: string;
    accountType: 'savings' | 'current';
    balance: number;
}