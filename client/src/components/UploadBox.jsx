import { Upload, X } from 'lucide-react';
import { useState } from 'react';

export default function UploadBox({
  onFileSelect,
  accept = '.pdf,.doc,.docx',
  label = 'Upload Resume',
  description = 'Drag and drop or click to select',
  className = '',
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const selectedFile = files[0];
      setFile(selectedFile);
      onFileSelect?.(selectedFile);
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      const selectedFile = files[0];
      setFile(selectedFile);
      onFileSelect?.(selectedFile);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-brand-dark mb-3">
        {label}
      </label>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-8
          transition-all duration-300 cursor-pointer
          flex flex-col items-center justify-center gap-3
          ${isDragActive
            ? 'border-indigo-600 bg-indigo-50'
            : 'border-indigo-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50'
          }
        `}
      >
        <Upload className={`w-8 h-8 ${isDragActive ? 'text-indigo-600' : 'text-indigo-400'}`} />
        <div className="text-center">
          <p className="font-semibold text-brand-dark">{description}</p>
          <p className="text-sm text-gray-500">Supported: {accept}</p>
        </div>
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      {file && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium text-green-700">{file.name}</span>
          <button
            onClick={() => setFile(null)}
            className="text-green-600 hover:text-green-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
