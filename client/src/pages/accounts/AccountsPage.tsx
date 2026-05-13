import { useState } from 'react'
import { useAccounts, useDeleteAccount } from '../../hooks/useAccount'
import { useAccountSummary } from '../../hooks/useAccount'
import { formatCurrency } from '../../lib/utils'
import type { Account } from '../../types'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import AccountForm from '../../components/acconts/AccountForm'
import toast from 'react-hot-toast'

const typeConfig: Record<string, { label: string; icon: string }> = {
  DEBIT:  { label: 'Débito',   icon: '🏦' },
  CASH:   { label: 'Efectivo', icon: '💵' },
  CREDIT: { label: 'Crédito',  icon: '💳' },
}

function AccountCard({ account, onDelete }: { account: Account; onDelete: (id: string) => void }) {
  const config = typeConfig[account.type]
  const isCredit = account.type === 'CREDIT'
  const balance = Number(account.balance)
  const limit = Number(account.creditLimit)
  const available = limit - balance
  const usedPercent = limit > 0 ? (balance / limit) * 100 : 0

  return (
    <div className="card p-5 flex flex-col gap-4 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: `${account.color}20`, border: `1px solid ${account.color}40` }}>
            {config.icon}
          </div>
          <div>
            <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{account.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)',
              fontFamily: 'DM Mono, monospace' }}>
              {config.label} · {account.currency}
            </p>
          </div>
        </div>
        <button onClick={() => onDelete(account.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,68,102,0.1)'
            e.currentTarget.style.color = 'var(--danger)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}>
          ✕
        </button>
      </div>

      {/* Balance */}
      <div>
        <p className="text-xs uppercase tracking-widest mb-1"
          style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
          {isCredit ? 'Deuda actual' : 'Saldo disponible'}
        </p>
        <p className="text-2xl font-extrabold"
          style={{ color: isCredit ? 'var(--danger)' : account.color,
            fontFamily: 'DM Mono, monospace' }}>
          {formatCurrency(balance)}
        </p>
      </div>

      {/* Crédito disponible */}
      {isCredit && limit > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs"
            style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
            <span>Disponible: {formatCurrency(available)}</span>
            <span>Límite: {formatCurrency(limit)}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="h-full rounded-full transition-all"
              style={{
                width: `${usedPercent}%`,
                background: usedPercent > 80
                  ? 'var(--danger)'
                  : usedPercent > 50
                  ? 'var(--warning)'
                  : 'var(--accent)',
              }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function AccountsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: accounts, isLoading } = useAccounts()
  const { data: summary } = useAccountSummary()
  const { mutate: deleteAccount } = useDeleteAccount()

  const handleDelete = (id: string) => {
  toast((t) => (
    <div className="flex flex-col gap-3">
      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>
        ¿Archivar esta cuenta?
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => { deleteAccount(id); toast.dismiss(t.id) }}
          className="px-3 py-1.5 rounded-lg text-xs font-bold"
          style={{ background: 'rgba(255,68,102,0.2)', color: '#ff4466' }}>
          Archivar
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1.5 rounded-lg text-xs"
          style={{ background: 'rgba(0,255,200,0.1)', color: '#00ffc8' }}>
          Cancelar
        </button>
      </div>
    </div>
  ), { duration: 5000 })
}

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1"
            style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
            // gestión de cuentas
          </p>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            Cuentas<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          + Nueva cuenta
        </Button>
      </div>

      {/* Resumen rápido */}
      {summary && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Activos totales', value: formatCurrency(summary.totalAssets), color: 'var(--accent)' },
            { label: 'Deuda total',     value: formatCurrency(summary.totalDebt),   color: 'var(--danger)' },
            { label: 'Patrimonio neto', value: formatCurrency(summary.netWorth),    color: '#00d4aa' },
          ].map((item) => (
            <div key={item.label} className="card p-4 animate-fade-up">
              <p className="text-xs uppercase tracking-widest mb-2"
                style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
                {item.label}
              </p>
              <p className="text-xl font-extrabold" style={{ color: item.color,
                fontFamily: 'DM Mono, monospace' }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Grid de cuentas */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-5 h-40 animate-pulse"
              style={{ background: 'rgba(0,255,200,0.03)' }} />
          ))}
        </div>
      ) : accounts?.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-4xl mb-4">◎</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)',
            fontFamily: 'DM Mono, monospace' }}>
            // sin cuentas registradas
          </p>
          <Button onClick={() => setIsModalOpen(true)}>Crear primera cuenta</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts?.map((account) => (
            <AccountCard key={account.id} account={account} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="nueva cuenta">
        <AccountForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}