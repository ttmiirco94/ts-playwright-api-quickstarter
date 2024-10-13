import {PlaywrightTestConfig} from '@playwright/test';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const config: PlaywrightTestConfig = {
    timeout: 60000,
    retries: 0,
    use: {
        headless: true,
        viewport: {width: 1280, height: 720},
        actionTimeout: 15000,
        ignoreHTTPSErrors: true,
        video: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'setup',
            testDir: './setup',
            testMatch: '**/tokenSetup.spec.ts',
            use: {
                baseURL: process.env.BASE_URL || 'https://api-dev.example.com',
            },
        },
        {
            name: 'tests',
            testDir: './tests',
            dependencies: ['setup'],
            use: {
                baseURL: process.env.BASE_URL || 'https://api-dev.example.com',
                extraHTTPHeaders: {
                    Authorization: `Bearer ${fs.readFileSync('token.txt', 'utf8')}`,
                },
            },
        },
    ]
}

export default config