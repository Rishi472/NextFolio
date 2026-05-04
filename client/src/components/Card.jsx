export default function Card({
  children,
  className = '',
  glassy = false,
  interactive = false,
  ...props
}) {
  const baseStyles = 'rounded-2xl overflow-hidden';
  
  const glassyClass = glassy
    ? 'glass'
    : 'bg-white border border-indigo-100 shadow-soft-md';
  
  const interactiveClass = interactive
    ? 'hover:shadow-soft-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer'
    : '';
  
  return (
    <div
      className={`${baseStyles} ${glassyClass} ${interactiveClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
