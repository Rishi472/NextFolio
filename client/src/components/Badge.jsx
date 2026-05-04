export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  closable = false,
  onClose,
  className = '',
}) {
  const variants = {
    primary: 'bg-indigo-100 text-indigo-700',
    secondary: 'bg-purple-100 text-purple-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    glass: 'glass text-indigo-600',
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  
  return (
    <span
      className={`
        inline-flex items-center gap-2
        rounded-full font-semibold
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
      {closable && (
        <button
          onClick={onClose}
          className="ml-1 hover:opacity-70 transition-opacity"
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
}
