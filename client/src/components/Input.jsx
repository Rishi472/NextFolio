export default function Input({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
        )}
        <input
          className={`
            w-full px-4 py-2.5 rounded-lg
            border-2 border-indigo-200
            focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-30
            transition-all duration-300
            placeholder-gray-400
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-600' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
}
