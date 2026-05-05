const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const googleLoginEnabled = import.meta.env.VITE_ENABLE_GOOGLE_LOGIN === 'true';
const productionOrigin = 'https://next-folio-silk.vercel.app';

const hasUsableClientId = (
  typeof googleClientId === 'string'
  && googleClientId.trim()
  && !googleClientId.trim().startsWith('@')
  && googleClientId !== 'GOOGLE_OAUTH_CLIENT_ID_NOT_CONFIGURED'
);

export const GOOGLE_CLIENT_ID = hasUsableClientId ? googleClientId : '';
export const HAS_GOOGLE_OAUTH = hasUsableClientId && (import.meta.env.DEV || googleLoginEnabled);
export const GOOGLE_PRODUCTION_ORIGIN = productionOrigin;

export const getGoogleAuthErrorMessage = (error) => {
  const reason = error?.error || error?.type || error?.message;
  if (reason === 'popup_closed') return 'Google sign-in was closed before it finished.';
  if (reason === 'popup_failed_to_open') return 'Google sign-in popup was blocked. Allow popups and try again.';

  return `Google sign-in is not configured for this domain yet. In Google Cloud Console, add ${productionOrigin} to Authorized JavaScript origins for this OAuth client.`;
};
