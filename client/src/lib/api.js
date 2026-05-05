const configuredApiUrl = import.meta.env.VITE_API_URL;

const isUsableApiUrl = (value) => (
  typeof value === 'string'
  && value.trim()
  && !value.trim().startsWith('@')
  && (import.meta.env.DEV || !value.includes('localhost'))
);

const getDefaultApiBaseUrl = () => {
  if (import.meta.env.DEV) return 'http://localhost:5000';
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin;
  return '';
};

const API_BASE_URL = (isUsableApiUrl(configuredApiUrl) ? configuredApiUrl : getDefaultApiBaseUrl()).replace(/\/$/, '');

export const API_URL = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;

export function getApiErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error || '');

  if (/failed to fetch|networkerror|load failed/i.test(message)) {
    return `Cannot reach the backend API at ${API_URL}. Start the server with "cd server && npm run dev" or set VITE_API_URL to your deployed API URL.`;
  }

  return message || 'Request failed. Please try again.';
}
