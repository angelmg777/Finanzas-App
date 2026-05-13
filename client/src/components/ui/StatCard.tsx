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
    <div className="card p-5 flex flex-col gap-3 animate-fade-up">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest"
          style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
          {label}
        </span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-2xl font-extrabold tracking-tight" style={{ color: accent }}>
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