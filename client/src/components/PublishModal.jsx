import { useState, useEffect } from 'react';
import { X, CheckCircle, Globe, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { useUIStore, useResumeStore } from '../store';
import Button from './Button';

export default function PublishModal() {
  const { showPublishModal, setShowPublishModal } = useUIStore();
  const { user, resumeData } = useResumeStore();
  const theme = useUIStore((state) => state.theme);
  const colorPalette = useUIStore((state) => state.colorPalette);
  const layoutStyle = useUIStore((state) => state.layoutStyle);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (showPublishModal) {
      setPublishing(false);
      setPublished(false);
      setCopied(false);
    }
  }, [showPublishModal]);

  if (!showPublishModal) return null;

  const handlePublish = () => {
    setPublishing(true);
    localStorage.setItem(`nextfolio_published_${usernameSlug}`, JSON.stringify({
      resumeData,
      theme,
      colorPalette,
      layoutStyle,
      publishedAt: new Date().toISOString(),
    }));

    setTimeout(() => {
      setPublishing(false);
      setPublished(true);
    }, 2000);
  };

  const usernameSlug = user ? user.name.toLowerCase().replace(/[^a-z0-9]/g, '') : 'demo';
  const liveUrl = `${window.location.origin}/portfolio/${usernameSlug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => !publishing && setShowPublishModal(false)}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-indigo-50">
        {!publishing && (
          <div className="absolute top-4 right-4">
            <button 
              onClick={() => setShowPublishModal(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="p-8 text-center">
          {publishing ? (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                <Globe className="absolute inset-0 m-auto text-indigo-600 w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Deploying your portfolio...</h3>
              <p className="text-sm text-gray-500">Optimizing assets and pushing to edge servers.</p>
            </div>
          ) : published ? (
            <div className="flex flex-col items-center py-4 animate-fade-in">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 relative">
                <CheckCircle className="w-8 h-8" />
                <div className="absolute -inset-1 bg-green-400 rounded-full animate-ping opacity-20"></div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                It's Live! <Sparkles className="w-6 h-6 text-yellow-500" />
              </h2>
              <p className="text-gray-500 mb-8">Your portfolio is ready at a working share link for this app.</p>
              
              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 flex flex-col items-center">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Live URL</span>
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-indigo-600 hover:underline flex items-center gap-2">
                  {liveUrl} <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="w-full space-y-3">
                <Button 
                  onClick={copyToClipboard}
                  variant="primary" 
                  className="w-full py-3 flex justify-center items-center gap-2"
                >
                  {copied ? <><CheckCircle className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </Button>
                <Button 
                  onClick={() => setShowPublishModal(false)}
                  variant="ghost" 
                  className="w-full text-gray-500"
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-4">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                <Globe className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Publish Portfolio</h2>
              <p className="text-gray-500 mb-8">
                Ready to share your work? We'll create a working portfolio link from your current resume data.
              </p>
              
              {!user && (
                <div className="w-full bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-sm mb-6 flex items-start text-left gap-2">
                  <span className="mt-0.5">⚠️</span> 
                  <span>You are not logged in. Your portfolio will be published to a local demo link on this browser.</span>
                </div>
              )}

              <Button 
                onClick={handlePublish}
                variant="primary" 
                className="w-full py-4 text-lg font-bold shadow-lg shadow-indigo-200 flex justify-center items-center gap-2 hover:-translate-y-0.5 transition-transform"
              >
                Publish Now <Globe className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
