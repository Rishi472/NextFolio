import { GoogleOAuthProvider } from '@react-oauth/google';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PublishedPortfolioPage from './pages/PublishedPortfolioPage';
import { GOOGLE_CLIENT_ID } from './lib/googleAuth';

const googleClientId = GOOGLE_CLIENT_ID || 'GOOGLE_OAUTH_CLIENT_ID_NOT_CONFIGURED';

export default function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/portfolio/:slug" element={<PublishedPortfolioPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}
