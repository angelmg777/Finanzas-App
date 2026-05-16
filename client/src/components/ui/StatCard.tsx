interface StatCardProps {
  label: string
  value: string
  icon: string
  trend?: string
  trendUp?: boolean
  accent?: string
}

export default function StatCard({ label, value, icon, trend, trendUp, accent = 'var(--accent)' }: StatCardProps) {
  return (
    <div className="card p-4 flex flex-col gap-2 animate-fade-up">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest leading-tight"
          style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
          {label}
        </span>
        <span className="text-lg flex-shrink-0">{icon}</span>
      </div>
      <p className="font-extrabold tracking-tight break-all leading-tight"
        style={{
          color: accent,
          fontSize: 'clamp(0.95rem, 3.5vw, 1.5rem)',
        }}>
        {value}
      </p>
      {trend && (
        <p className="text-xs" style={{
          color: trendUp ? 'var(--success)' : 'var(--danger)',
          fontFamily: 'DM Mono, monospace'
        }}>
          {trendUp ? '↑' : '↓'} {trend}
        </p>
      )}
    </div>
  )
}