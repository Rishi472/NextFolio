export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-brand text-white hover:shadow-lg hover:scale-105 active:scale-95',
    secondary: 'bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50 active:bg-indigo-100',
    outline: 'border-2 border-indigo-400 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100',
    ghost: 'text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95',
    glass: 'glass text-slate-900 hover:shadow-glass active:scale-95',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
