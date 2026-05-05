import { useState } from 'react';
import { Upload, Loader, CheckCircle, AlertCircle, LockKeyhole } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useResumeStore, useUIStore } from '../store';

export default function ResumeUploadPanel() {
  const { parseResume, resumeData, token, user } = useResumeStore();
  const isAuthenticated = Boolean(token && user);
  const setShowAuthModal = useUIStore((state) => state.setShowAuthModal);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    if (!isAuthenticated) {
      setError('Log in or sign up before uploading a resume.');
      setShowAuthModal(true);
      e.target.value = '';
      return;
    }

    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf' && selectedFile.type !== 'text/plain') {
        setError('Please select a PDF or text resume file');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Log in or sign up before uploading a resume.');
      setShowAuthModal(true);
      return;
    }

    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const success = await parseResume(file);
      if (!success) {
        throw new Error(useResumeStore.getState().parseResumeError || 'Failed to parse resume');
      }

      setParsedData(useResumeStore.getState().resumeData);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to parse resume');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 border-2 border-dashed border-indigo-200 bg-indigo-50/50">
        <div className="text-center space-y-4">
          {isAuthenticated ? (
            <Upload className="w-12 h-12 mx-auto text-indigo-600" />
          ) : (
            <LockKeyhole className="w-12 h-12 mx-auto text-indigo-600" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-brand-dark">Upload Your Resume</h3>
            <p className="text-sm text-gray-600 mt-1">
              {isAuthenticated ? 'PDF or text format, max 5MB' : 'Log in or sign up to upload a resume'}
            </p>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="flex items-center justify-center">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading || !isAuthenticated}
                />
                <span className={`inline-block px-6 py-3 rounded-lg transition-colors ${isAuthenticated ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}>
                  Choose PDF
                </span>
              </label>
            </div>

            {fileName && (
              <div className="text-sm text-gray-700 font-medium">
                Selected: {fileName}
              </div>
            )}

            <Button
              type="submit"
              disabled={!isAuthenticated || !file || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Parsing Resume...
                </>
              ) : (
                'Parse Resume'
              )}
            </Button>
          </form>
        </div>
      </Card>

      {error && (
        <Card className="p-4 bg-red-50 border border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Error</p>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {success && parsedData && (
        <Card className="p-4 bg-green-50 border border-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Resume Parsed Successfully!</p>
              <p className="text-sm text-green-800 mt-1">
                Extracted {Object.keys(parsedData).length} sections
              </p>
              {(parsedData.personal || resumeData.personal) && (
                <p className="text-sm font-semibold text-green-800 mt-2">
                  Name: {(parsedData.personal || resumeData.personal).fullName}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
