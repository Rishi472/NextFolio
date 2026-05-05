const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const googleLoginEnabled = import.meta.env.VITE_ENABLE_GOOGLE_LOGIN === 'true';

const hasUsableClientId = (
  typeof googleClientId === 'string'
  && googleClientId.trim()
  && !googleClientId.trim().startsWith('@')
  && googleClientId !== 'GOOGLE_OAUTH_CLIENT_ID_NOT_CONFIGURED'
);

export const GOOGLE_CLIENT_ID = hasUsableClientId ? googleClientId : '';
export const HAS_GOOGLE_OAUTH = hasUsableClientId && (import.meta.env.DEV || googleLoginEnabled);
