import { test, expect } from '@playwright/test';
import { createBankCustomer, createBankAccount } from '../helpers/dataFactory';
import { Logger } from '../helpers/logger';
import { performance } from 'perf_hooks';
import {BankCustomer} from "../models/bankCustomer";
import {BankAccount} from "../models/bankAccount"; // Import for performance measurement

test.describe('Bank Account API Tests', () => {
    let logger: Logger;
    let customerData: BankCustomer;
    let bankAccountData: BankAccount;
    let customerId = 123; // Mock customer ID
    let startTime: number;

    test.beforeEach(({ }, testInfo) => {
        // Initialize the logger for the current test
        logger = new Logger(testInfo.title);
        customerData = createBankCustomer();
        bankAccountData = createBankAccount(customerId);
    });

    test('should create a bank customer and then create a bank account', async ({ page }) => {
        startTime = performance.now(); // Start measuring execution time

        // Mock bank customer creation
        await page.route('**/customers', (route) => {
            const jsonResponse = { id: customerId, ...customerData };
            route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify(jsonResponse),
            });
        });

        const requestStartTime = performance.now(); // Measure response time for customer creation

        // Send customer creation request
        const customerResponse = await page.request.post('/customers', {
            data: customerData,
        });

        const customerRequestEndTime = performance.now();
        const customerResponseTime = customerRequestEndTime - requestStartTime;

        expect(customerResponse.status()).toBe(201);
        const customerResponseBody = await customerResponse.json();
        logger.logTestData(customerResponseBody);

        // Log the customer request and response
        logger.logRequest({
            url: '/customers',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: customerData
        });
        logger.logResponse({
            status: customerResponse.status(),
            headers: customerResponse.headers(),
            body: customerResponseBody
        });

        // Generate TypeScript interface if flag is true
        if (process.env.GENERATETYPESCRIPTINTERFACES) {
            logger.generateInterfaceFromResponse(customerResponseBody, 'CustomerResponse', 'bankAccount');
        }

        // Mock bank account creation
        await page.route('**/accounts', (route) => {
            const jsonResponse = { ...bankAccountData };
            route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify(jsonResponse),
            });
        });

        const accountRequestStartTime = performance.now(); // Measure response time for account creation

        // Send bank account creation request
        const accountResponse = await page.request.post('/accounts', {
            data: bankAccountData,
        });

        const accountRequestEndTime = performance.now();
        const accountResponseTime = accountRequestEndTime - accountRequestStartTime;

        expect(accountResponse.status()).toBe(201);
        const accountResponseBody = await accountResponse.json();
        logger.logTestData(accountResponseBody);

        // Log the account request and response
        logger.logRequest({
            url: '/accounts',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: bankAccountData
        });
        logger.logResponse({
            status: accountResponse.status(),
            headers: accountResponse.headers(),
            body: accountResponseBody
        });

        // Generate TypeScript interface for bank account response
        if (process.env.GENERATETYPESCRIPTINTERFACES) {
            logger.generateInterfaceFromResponse(accountResponseBody, 'BankAccountResponse', 'bankAccount');
        }

        // Log performance data for both customer and account creation
        const totalTestExecutionTime = performance.now() - startTime;
        logger.logPerformanceData(totalTestExecutionTime, customerResponseTime + accountResponseTime);
    });

    test('should get an existing bank customer and create a bank account', async ({ page }) => {
        startTime = performance.now(); // Start measuring execution time

        // Mock getting an existing bank customer
        await page.route('**/customers/123', (route) => {
            const jsonResponse = { id: customerId, ...customerData };
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(jsonResponse),
            });
        });

        const customerRequestStartTime = performance.now(); // Measure response time for GET request

        // Send GET request to fetch customer
        const getCustomerResponse = await page.request.get('/customers/123');
        const customerRequestEndTime = performance.now();
        const customerResponseTime = customerRequestEndTime - customerRequestStartTime;

        expect(getCustomerResponse.status()).toBe(200);

        const existingCustomer = await getCustomerResponse.json();
        logger.logTestData(existingCustomer);

        // Log the GET request and response
        logger.logRequest({
            url: '/customers/123',
            method: 'GET',
            headers: getCustomerResponse.headers(),
            body: null
        });
        logger.logResponse({
            status: getCustomerResponse.status(),
            headers: getCustomerResponse.headers(),
            body: existingCustomer
        });

        // Generate TypeScript interface for customer response
        if (process.env.GENERATETYPESCRIPTINTERFACES) {
            logger.generateInterfaceFromResponse(existingCustomer, 'ExistingCustomerResponse', 'bankAccount');
        }

        // Mock creating a bank account for the fetched customer
        await page.route('**/accounts', (route) => {
            const jsonResponse = { ...bankAccountData, customerId: existingCustomer.id };
            route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify(jsonResponse),
            });
        });

        const accountRequestStartTime = performance.now(); // Measure response time for account creation

        // Send bank account creation request for existing customer
        const accountResponse = await page.request.post('/accounts', {
            data: createBankAccount(existingCustomer.id),
        });

        const accountRequestEndTime = performance.now();
        const accountResponseTime = accountRequestEndTime - accountRequestStartTime;

        expect(accountResponse.status()).toBe(201);
        const accountResponseBody = await accountResponse.json();
        logger.logTestData(accountResponseBody);

        // Log the account request and response
        logger.logRequest({
            url: '/accounts',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: createBankAccount(existingCustomer.id)
        });
        logger.logResponse({
            status: accountResponse.status(),
            headers: accountResponse.headers(),
            body: accountResponseBody
        });

        // Generate TypeScript interface for bank account response
        if (process.env.GENERATETYPESCRIPTINTERFACES) {
            logger.generateInterfaceFromResponse(accountResponseBody, 'BankAccountResponse', 'bankAccount');
        }

        // Log performance data for customer fetch and account creation
        const totalTestExecutionTime = performance.now() - startTime;
        logger.logPerformanceData(totalTestExecutionTime, customerResponseTime + accountResponseTime);
    });
});
