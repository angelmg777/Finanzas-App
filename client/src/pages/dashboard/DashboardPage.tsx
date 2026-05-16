import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts'
import { useAccountSummary } from '../../hooks/useAccount'
import { useTransactions } from '../../hooks/useTransactions'
import { useExpensesByCategory, useMonthlyFlow, useNetWorthHistory, useSummaryStats } from '../../hooks/useStats'
import { formatCurrency, formatDate } from '../../lib/utils'
import { useAuthStore } from '../../store/auth.store'
import StatCard from '../../components/ui/StatCard'

const typeConfig: Record<string, { label: string; color: string; icon: string }> = {
  INCOME:   { label: 'Ingreso',       color: 'var(--success)', icon: '↓' },
  EXPENSE:  { label: 'Gasto',         color: 'var(--danger)',  icon: '↑' },
  TRANSFER: { label: 'Transferencia', color: 'var(--accent)',  icon: '⇄' },
}

interface TooltipPayload {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card px-3 py-2 text-xs" style={{ fontFamily: 'DM Mono, monospace' }}>
      <p className="mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [months, setMonths] = useState(6)

  const { data: summary, isLoading: loadingSummary } = useAccountSummary()
  const { data: txData, isLoading: loadingTx } = useTransactions({ limit: 6 })
  const { data: categoryStats } = useExpensesByCategory()
  const { data: monthlyFlow } = useMonthlyFlow(months)
  const { data: netWorth } = useNetWorthHistory(months)
  const { data: statsData } = useSummaryStats()

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="mb-6 animate-fade-up">
        <p className="text-xs uppercase tracking-widest mb-1"
          style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
          // panel de control
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight"
          style={{ color: 'var(--text-primary)' }}>
          {user?.name}<span style={{ color: 'var(--accent)' }}>.</span>
        </h1>
      </div>

      {/* Stats principales */}
      {loadingSummary ? (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-4 h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard label="Patrimonio neto"    value={formatCurrency(summary?.netWorth ?? 0)}        icon="◈" accent="var(--accent)" />
          <StatCard label="Total activos"      value={formatCurrency(summary?.totalAssets ?? 0)}     icon="▲" accent="#00d4aa" />
          <StatCard label="Deuda total"        value={formatCurrency(summary?.totalDebt ?? 0)}       icon="▼" accent="var(--danger)" />
          <StatCard label="Crédito disponible" value={formatCurrency(summary?.availableCredit ?? 0)} icon="◇" accent="var(--warning)" />
        </div>
      )}

      {/* Stats del período */}
      {statsData && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard label="Ingresos" value={formatCurrency(statsData.totalIncome)}  icon="↓" accent="var(--success)" />
          <StatCard label="Gastos"   value={formatCurrency(statsData.totalExpense)} icon="↑" accent="var(--danger)" />
          <StatCard label="Balance"  value={formatCurrency(statsData.balance)}      icon="=" accent="var(--accent)" />
          <StatCard label="Ahorro"   value={`${statsData.savingsRate.toFixed(1)}%`} icon="%" accent="#f59e0b" />
        </div>
      )}

      {/* Selector de meses */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs uppercase tracking-widest"
          style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
          Período:
        </span>
        {[3, 6, 12].map((m) => (
          <button key={m} onClick={() => setMonths(m)}
            className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: months === m ? 'var(--accent-dim)' : 'transparent',
              border: `1px solid ${months === m ? 'var(--border-hover)' : 'var(--border)'}`,
              color: months === m ? 'var(--accent)' : 'var(--text-secondary)',
            }}>
            {m}m
          </button>
        ))}
      </div>

      {/* Gráfica Ingresos vs Gastos */}
      <div className="card p-4 mb-4 animate-fade-up">
        <h2 className="text-xs uppercase tracking-widest mb-4"
          style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
          // ingresos vs gastos
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyFlow} barGap={4} margin={{ left: -10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,200,0.05)" />
            <XAxis dataKey="month"
              tick={{ fill: '#5a8a82', fontSize: 10, fontFamily: 'DM Mono' }}
              axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: '#5a8a82', fontSize: 10, fontFamily: 'DM Mono' }}
              axisLine={false} tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income"  name="Ingresos" fill="#00ffc8" radius={[4,4,0,0]} />
            <Bar dataKey="expense" name="Gastos"   fill="#ff4466" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica Gastos por categoría */}
      <div className="card p-4 mb-4 animate-fade-up">
        <h2 className="text-xs uppercase tracking-widest mb-4"
          style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
          // gastos por categoría
        </h2>
        {!categoryStats?.length ? (
          <div className="flex items-center justify-center h-32"
            style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace', fontSize: 12 }}>
            sin datos
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryStats} dataKey="total" nameKey="name"
                  cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {categoryStats.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => formatCurrency(Number(v))}
                  contentStyle={{
                    background: '#040f11',
                    border: '1px solid rgba(0,255,200,0.1)',
                    borderRadius: 12,
                    fontFamily: 'DM Mono',
                    fontSize: 12,
                  }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Leyenda */}
            <div className="grid grid-cols-2 gap-2">
              {categoryStats.slice(0, 6).map((cat) => (
                <div key={cat.name} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg"
                  style={{ background: `${cat.color}10`, border: `1px solid ${cat.color}30` }}>
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                    <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                      {cat.icon} {cat.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold flex-shrink-0"
                    style={{ color: cat.color, fontFamily: 'DM Mono, monospace' }}>
                    {formatCurrency(cat.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gráfica Patrimonio */}
      <div className="card p-4 mb-4 animate-fade-up">
        <h2 className="text-xs uppercase tracking-widest mb-4"
          style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
          // evolución del patrimonio
        </h2>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={netWorth} margin={{ left: -10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,200,0.05)" />
            <XAxis dataKey="month"
              tick={{ fill: '#5a8a82', fontSize: 10, fontFamily: 'DM Mono' }}
              axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: '#5a8a82', fontSize: 10, fontFamily: 'DM Mono' }}
              axisLine={false} tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="netWorth" name="Patrimonio"
              stroke="#00ffc8" strokeWidth={2}
              dot={{ fill: '#00ffc8', r: 4 }}
              activeDot={{ r: 6, fill: '#00ffc8' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Últimos movimientos */}
      <div className="card p-4 animate-fade-up">
        <h2 className="text-xs uppercase tracking-widest mb-4"
          style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
          // últimos movimientos
        </h2>
        <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
          {loadingTx ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-12 rounded-xl animate-pulse my-2"
                style={{ background: 'rgba(0,255,200,0.03)' }} />
            ))
          ) : txData?.transactions.length === 0 ? (
            <div className="text-center py-8"
              style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace', fontSize: 12 }}>
              sin movimientos
            </div>
          ) : txData?.transactions.map((tx) => {
            const meta = typeConfig[tx.type]
            return (
              <div key={tx.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: `${meta.color}15`, color: meta.color }}>
                    {meta.icon}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {tx.description || meta.label}
                    </p>
                    <p className="text-xs truncate"
                      style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
                      {tx.account.name} · {formatDate(tx.date)}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold flex-shrink-0"
                  style={{ color: meta.color, fontFamily: 'DM Mono, monospace' }}>
                  {tx.type === 'INCOME' ? '+' : tx.type === 'EXPENSE' ? '-' : ''}
                  {formatCurrency(tx.amount)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}