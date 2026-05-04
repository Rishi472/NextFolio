import { useUIStore, useResumeStore } from '../store';
import Button from './Button';
import { Download, LogOut, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TopNavbar() {
  const { setShowATSModal, setShowPublishModal } = useUIStore();
  const { user, token, logout } = useResumeStore();
  const navigate = useNavigate();
  const isAuthenticated = Boolean(token || user);

  return (
    <div className="h-16 bg-gradient-brand flex items-center justify-between px-6 shadow-md z-50">
      {/* Left: Logo */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-white tracking-wide">Nextfolio</h1>
      </div>

      {/* Center: Buttons */}
      <div className="hidden md:flex items-center gap-4">
        <button className="text-white/80 hover:text-white font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
          About
        </button>
        <button className="text-white/80 hover:text-white font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
          Contact
        </button>
        {!isAuthenticated && (
          <button 
            onClick={() => navigate('/login')}
            className="bg-white/10 text-white font-medium px-6 py-2 rounded-full hover:bg-white/20 transition-colors border border-white/20"
          >
            Log In / Sign Up
          </button>
        )}
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3">
        <Button 
          variant="secondary" 
          size="sm" 
          className="bg-white/10 text-white hover:bg-white/20 border border-white/20 shadow-sm flex items-center gap-2 backdrop-blur-sm"
          onClick={() => setShowATSModal(true)}
        >
          <Download className="w-4 h-4" /> ATS Resume
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          className="bg-white text-indigo-600 hover:bg-indigo-50 border-none shadow-lg shadow-indigo-500/30 flex items-center gap-2 font-bold px-5"
          onClick={() => setShowPublishModal(true)}
        >
          <Globe className="w-4 h-4" /> Publish
        </Button>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-2 ml-2">
            <div className="w-10 h-10 rounded-full bg-indigo-200 border-2 border-white overflow-hidden flex items-center justify-center shadow-sm cursor-pointer" title={user?.name || 'Account'}>
              <img 
                src={user?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Nextfolio'}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button onClick={logout} className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors" title="Log Out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="md:hidden">
            <button 
              onClick={() => navigate('/login')}
              className="bg-white/10 text-white font-medium px-4 py-2 rounded-full hover:bg-white/20 transition-colors border border-white/20 text-sm"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
