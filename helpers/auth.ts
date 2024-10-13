import { request } from '@playwright/test';

export async function getAuthToken(): Promise<string> {
    const requestContext = await request.newContext();

    const response = await requestContext.post('https://auth.example.com/oauth/token', {
        data: {
            client_id: 'your-client-id',
            client_secret: 'your-client-secret',
            grant_type: 'client_credentials'
        }
    });

    if (response.ok()) {
        const responseBody = await response.json();
        return responseBody.access_token;
    } else {
        throw new Error(`Failed to get OAuth token: ${response.status()}`);
    }
}