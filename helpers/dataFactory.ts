import {Address} from '../models/address';
import {BankCustomer} from '../models/bankCustomer';
import {BankAccount} from "../models/bankAccount";

export function createBankCustomer(data?: Partial<BankCustomer>): BankCustomer {
    return {
        firstName: data?.firstName || 'John',
        lastName: data?.lastName || 'Doe',
        email: data?.email || 'john.doe@example.com',
        phone: data?.phone || '1234567890',
        address: data?.address || {
            street: '123 Main St',
            city: 'Cityville',
            postalCode: '12345',
            country: 'Countryland',
        },
        dateOfBirth: data?.dateOfBirth || '1990-01-01',
        accountType: data?.accountType || 'savings',
        balance: data?.balance || 1000,
    };
}

export function createBankAccount(customerId: number, data?: Partial<BankAccount>): BankAccount {
    return {
        accountType: data?.accountType || 'savings',
        accountNumber: data?.accountNumber || 'ACC123456789',
        balance: data?.balance || 0,
        customerId: customerId // Required customer ID for the account
    };
}
