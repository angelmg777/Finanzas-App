import { forwardRef } from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`input-glow w-full px-4 py-3 rounded-xl text-sm outline-none transition-all ${className}`}
          style={{
            background: 'rgba(0,255,200,0.03)',
            border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
            color: 'var(--text-primary)',
            fontFamily: 'DM Mono, monospace',
          }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}
              style={{ background: '#040f11', color: 'var(--text-primary)' }}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs" style={{ color: 'var(--danger)', fontFamily: 'DM Mono, monospace' }}>
            ⚠ {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
export default Select