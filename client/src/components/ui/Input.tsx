import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}
            className="text-xs uppercase tracking-widest">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`input-glow w-full px-4 py-3 rounded-xl text-sm outline-none transition-all ${className}`}
          style={{
            background: 'rgba(0,255,200,0.03)',
            border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
            color: 'var(--text-primary)',
            fontFamily: 'DM Mono, monospace',
          }}
          {...props}
        />
        {error && (
          <p className="text-xs" style={{ color: 'var(--danger)', fontFamily: 'DM Mono, monospace' }}>
            ⚠ {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input