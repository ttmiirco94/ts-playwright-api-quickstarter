import { test, expect } from '@playwright/test';
import { createBankCustomer } from '../helpers/dataFactory';
import { Logger } from '../helpers/logger';
import { performance } from 'perf_hooks';
import {BankCustomer} from "../models/bankCustomer"; // Keep this import for performance measurements

test.describe('Bank Customer API Tests', () => {
    let logger: Logger;
    let customerData: BankCustomer;
    let startTime: number;

    test.beforeEach(({ }, testInfo) => {
        // Initialize the logger for the current test
        logger = new Logger(testInfo.title);
        customerData = createBankCustomer();
    });

    test('should create a new bank customer and log details', async ({ page }) => {
        startTime = performance.now(); // Start measuring execution time

        // Log the test data
        logger.logTestData(customerData);

        // Mock API request
        await page.route('**/customers', (route) => {
            const jsonResponse = {
                id: 123,
                ...customerData
            };
            route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify(jsonResponse),
            });
        });

        const requestStartTime = performance.now(); // Measure response time

        // Send request
        const response = await page.request.post('/customers', {
            data: customerData,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer some-token'
            }
        });

        const requestEndTime = performance.now();
        const responseTime = requestEndTime - requestStartTime;

        // Log the request
        logger.logRequest({
            url: '/customers',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer some-token'
            },
            body: customerData
        });

        // Log the response
        const responseBody = await response.json();
        logger.logResponse({
            status: response.status(),
            headers: response.headers(),
            body: responseBody
        });

        // Generate TypeScript interface if enabled
        if (process.env.GENERATETYPESCRIPTINTERFACES) {
            logger.generateInterfaceFromResponse(responseBody, 'CustomerResponse', 'bankCustomer');
        }

        expect(response.status()).toBe(201);

        // Log performance data
        const testExecutionTime = performance.now() - startTime;
        logger.logPerformanceData(testExecutionTime, responseTime);
    });
});
