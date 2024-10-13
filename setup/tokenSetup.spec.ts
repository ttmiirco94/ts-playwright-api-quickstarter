import { test } from '@playwright/test';
import { getAuthToken } from '../helpers/auth';
import fs from 'fs';

test('get OAuth token and store it', async () => {
    const token = await getAuthToken();
    fs.writeFileSync('token.txt', token);
});
