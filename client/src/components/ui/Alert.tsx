interface AlertProps {
  type: 'error' | 'success' | 'warning'
  message: string
}

const config = {
  error:   { color: 'var(--danger)',  bg: 'rgba(255,68,102,0.08)',  border: 'rgba(255,68,102,0.2)',  icon: '✕' },
  success: { color: 'var(--success)', bg: 'rgba(0,255,200,0.08)',   border: 'rgba(0,255,200,0.2)',   icon: '✓' },
  warning: { color: 'var(--warning)', bg: 'rgba(255,170,0,0.08)',   border: 'rgba(255,170,0,0.2)',   icon: '!' },
}

export default function Alert({ type, message }: AlertProps) {
  const c = config[type]
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color,
        fontFamily: 'DM Mono, monospace' }}>
      <span className="font-bold">{c.icon}</span>
      {message}
    </div>
  )
}