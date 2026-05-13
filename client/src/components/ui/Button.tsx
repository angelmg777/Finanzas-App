interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = `inline-flex items-center justify-center gap-2 font-semibold rounded-xl
    transition-all cursor-pointer disabled:cursor-not-allowed tracking-wide`

  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3.5 text-sm' }

  const variants = {
    primary: '',
    secondary: '',
    danger: '',
    ghost: '',
  }

  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: loading || disabled
        ? 'rgba(0,255,200,0.2)'
        : 'linear-gradient(135deg, #00ffc8, #00c8a0)',
      color: '#020809',
      boxShadow: loading || disabled ? 'none' : '0 0 20px rgba(0,255,200,0.3)',
    },
    secondary: {
      background: 'rgba(0,255,200,0.05)',
      border: '1px solid var(--border)',
      color: 'var(--accent)',
    },
    danger: {
      background: 'rgba(255,68,102,0.1)',
      border: '1px solid rgba(255,68,102,0.3)',
      color: 'var(--danger)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
    },
  }

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      style={styles[variant]}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  )
}