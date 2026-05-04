export default function Textarea({
  label,
  error,
  helperText,
  maxLength,
  maxWords,
  showCount = false,
  value = '',
  className = '',
  onChange,
  ...props
}) {
  const charCount = value?.length || 0;
  const wordCount = value?.trim() ? value.trim().split(/\s+/).length : 0;
  
  const handleChange = (e) => {
    if (maxWords) {
      const words = e.target.value.trim().split(/\s+/);
      if (words.length > maxWords && e.target.value.length > value.length) {
        // Prevent typing more words if limit is reached, but allow deletion
        // Only prevent if the new input adds a word
        if (e.nativeEvent?.inputType !== 'deleteContentBackward') {
            const currentWords = value.trim().split(/\s+/);
            if(currentWords.length >= maxWords && e.target.value.endsWith(' ')) {
                return; // don't allow space after max words
            }
        }
      }
    }
    if (onChange) onChange(e);
  };
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          className={`
            w-full px-4 py-3 rounded-lg
            border-2 border-indigo-200
            focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-30
            transition-all duration-300
            placeholder-gray-400
            resize-vertical
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-600' : ''}
            ${className}
          `}
          value={value}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
      </div>
      <div className="flex justify-between items-start mt-2">
        <div>
          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}
          {helperText && !error && (
            <p className="text-gray-500 text-sm">{helperText}</p>
          )}
        </div>
        {showCount && maxWords && (
          <p className={`text-sm font-medium ${wordCount > maxWords * 0.9 ? 'text-yellow-600' : 'text-gray-500'} ${wordCount > maxWords ? 'text-red-500' : ''}`}>
            {wordCount}/{maxWords} words
          </p>
        )}
        {showCount && maxLength && !maxWords && (
          <p className={`text-sm font-medium ${charCount > maxLength * 0.9 ? 'text-yellow-600' : 'text-gray-500'}`}>
            {charCount}/{maxLength} characters
          </p>
        )}
      </div>
    </div>
  );
}
