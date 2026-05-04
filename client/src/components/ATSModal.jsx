import { X, FileText, Download, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUIStore, useResumeStore } from '../store';
import Button from './Button';

export default function ATSModal() {
  const { showATSModal, setShowATSModal } = useUIStore();
  const { token, resumeData } = useResumeStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingATS, setIsLoadingATS] = useState(false);
  const [atsAnalysis, setAtsAnalysis] = useState(null);

  useEffect(() => {
    if (showATSModal && token) {
      const fetchATSScore = async () => {
        setIsLoadingATS(true);
        try {
          const res = await fetch('http://localhost:5000/api/ai/ats-score', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ resumeData })
          });
          if (res.ok) {
            const result = await res.json();
            setAtsAnalysis(result.data);
          }
        } catch (e) {
          console.error('Failed to fetch ATS score', e);
        }
        setIsLoadingATS(false);
      };
      fetchATSScore();
    } else if (showATSModal && !token) {
      Promise.resolve().then(() => setAtsAnalysis({ score: 0, message: 'Please upload a resume first to get an ATS score.', improvements: [] }));
    }
  }, [showATSModal, token, resumeData]);

  if (!showATSModal) return null;

  const handleDownload = async () => {
    if (!token) return alert("Please upload a resume or start building one to authenticate.");
    setIsGenerating(true);
    try {
      const res = await fetch('http://localhost:5000/api/generate/ats-resume', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ resumeData })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ATS_Resume.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Failed to generate PDF. Make sure you have uploaded a resume first.");
      }
    } catch (e) { console.error(e); }
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-brand p-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6" />
            <h2 className="text-xl font-bold">ATS Resume Generator</h2>
          </div>
          <button onClick={() => setShowATSModal(false)} className="text-white/80 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-brand-dark">Resume Analysis</h3>
              <p className="text-sm text-gray-500">Analysis for {resumeData.personal?.fullName || 'User'}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-indigo-600 flex justify-center items-center h-9">
                {isLoadingATS ? <Loader2 className="w-6 h-6 animate-spin text-indigo-500" /> : <>{atsAnalysis?.score || 0}<span className="text-lg text-gray-400">/100</span></>}
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Estimated ATS Score</p>
            </div>
          </div>

          <div className="space-y-4">
            {isLoadingATS ? (
              <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-brand-dark" /></div>
            ) : atsAnalysis ? (
              <>
                <p className="text-sm text-gray-700 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  {atsAnalysis.message}
                </p>

                <h4 className="font-semibold text-brand-dark flex items-center gap-2 mt-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500" /> How to Improve the ATS Score:
                </h4>
                
                <ul className="space-y-3">
                  {atsAnalysis.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-gray-800">{improvement.title}:</span>
                        <p className="text-sm text-gray-600 mt-1">{improvement.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowATSModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDownload} disabled={isGenerating} className="flex items-center gap-2">
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
            {isGenerating ? 'Generating...' : 'Download ATS PDF'}
          </Button>
        </div>
      </div>
    </div>
  );
}
