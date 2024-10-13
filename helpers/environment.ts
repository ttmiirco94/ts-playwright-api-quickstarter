export const environment = {
    dev: 'https://api-dev.example.com',
    staging: 'https://api-staging.example.com',
    prod: 'https://api.example.com'
};

export function getApiUrl(env: 'dev' | 'staging' | 'prod'): string {
    return environment[env];
}
