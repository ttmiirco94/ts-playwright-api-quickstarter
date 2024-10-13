export interface BankAccount {
    accountType: 'savings' | 'current';
    accountNumber: string;
    balance: number;
    customerId: number; // Reference to an existing BankCustomer
}
