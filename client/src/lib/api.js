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
