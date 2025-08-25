export const config = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://foodlaw-production-e1f3.up.railway.app',
  apiBaseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://foodlaw-production-e1f3.up.railway.app',
} as const;

export const getBackendUrl = (endpoint: string = '') => {
  return `${config.backendUrl}${endpoint}`;
};

export const getApiUrl = (endpoint: string = '') => {
  return `${config.apiBaseUrl}/api${endpoint}`;
};
