import { useState } from 'react'
import { useTransactions, useDeleteTransaction } from '../../hooks/useTransactions'
import { useAccounts } from '../../hooks/useAccount'
import { formatCurrency, formatDate } from '../../lib/utils'
import type { TransactionType } from '../../types'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import TransactionForm from '../../components/transactions/TransactionForm'
import toast from 'react-hot-toast'

const typeConfig: Record<string, { label: string; icon: string; color: string }> = {
  INCOME:   { label: 'Ingreso',       icon: '↓', color: 'var(--success)' },
  EXPENSE:  { label: 'Gasto',         icon: '↑', color: 'var(--danger)'  },
  TRANSFER: { label: 'Transferencia', icon: '⇄', color: 'var(--accent)'  },
}

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterType, setFilterType] = useState<TransactionType | ''>('')
  const [filterAccount, setFilterAccount] = useState('')
  const [offset, setOffset] = useState(0)
  const LIMIT = 10

  const { data, isLoading } = useTransactions({
    type: filterType || undefined,
    accountId: filterAccount || undefined,
    limit: LIMIT,
    offset,
  })

  const { data: accounts } = useAccounts()
  const { mutate: deleteTransaction } = useDeleteTransaction()

  const accountOptions = [
    { value: '', label: 'Todas las cuentas' },
    ...(accounts?.map((a) => ({ value: a.id, label: a.name })) ?? []),
  ]

  const handleDelete = (id: string) => {
  toast((t) => (
    <div className="flex flex-col gap-3">
      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>
        ¿Eliminar movimiento? Se revertirá el balance.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => { deleteTransaction(id); toast.dismiss(t.id) }}
          className="px-3 py-1.5 rounded-lg text-xs font-bold"
          style={{ background: 'rgba(255,68,102,0.2)', color: '#ff4466' }}>
          Eliminar
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

  const totalPages = Math.ceil((data?.total ?? 0) / LIMIT)
  const currentPage = Math.floor(offset / LIMIT) + 1

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1"
            style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
            // historial de movimientos
          </p>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            Movimientos<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Nuevo movimiento</Button>
      </div>

      {/* Filtros */}
      <div className="card p-4 mb-6 animate-fade-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tipo */}
          <div className="flex gap-2">
            {(['', 'INCOME', 'EXPENSE', 'TRANSFER'] as const).map((type) => {
              const labels: Record<string, string> = {
                '': 'Todos', INCOME: 'Ingresos', EXPENSE: 'Gastos', TRANSFER: 'Transferencias',
              }
              const colors: Record<string, string> = {
                '': 'var(--accent)', INCOME: 'var(--success)',
                EXPENSE: 'var(--danger)', TRANSFER: 'var(--accent)',
              }
              return (
                <button key={type} onClick={() => { setFilterType(type); setOffset(0) }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: filterType === type ? `${colors[type]}20` : 'transparent',
                    border: `1px solid ${filterType === type ? colors[type] : 'var(--border)'}`,
                    color: filterType === type ? colors[type] : 'var(--text-secondary)',
                  }}>
                  {labels[type]}
                </button>
              )
            })}
          </div>

          {/* Cuenta */}
          <Select
            options={accountOptions}
            value={filterAccount}
            onChange={(e) => { setFilterAccount(e.target.value); setOffset(0) }}
          />

          {/* Total */}
          <div className="flex items-center justify-end">
            <p className="text-xs" style={{ color: 'var(--text-secondary)',
              fontFamily: 'DM Mono, monospace' }}>
              {data?.total ?? 0} movimientos
            </p>
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="card overflow-hidden animate-fade-up">
        {isLoading ? (
          <div className="flex flex-col gap-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse m-4 rounded-xl"
                style={{ background: 'rgba(0,255,200,0.03)' }} />
            ))}
          </div>
        ) : data?.transactions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">◎</p>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)',
              fontFamily: 'DM Mono, monospace' }}>
              // sin movimientos
            </p>
            <Button onClick={() => setIsModalOpen(true)}>Registrar primero</Button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Tipo', 'Descripción', 'Cuenta', 'Categoría', 'Fecha', 'Monto', ''].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-widest"
                    style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.transactions.map((tx) => {
                const meta = typeConfig[tx.type]
                return (
                  <tr key={tx.id}
                    className="transition-all"
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,255,200,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-5 py-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                        style={{ background: `${meta.color}15`, color: meta.color }}>
                        {meta.icon}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {tx.description || meta.label}
                      </p>
                      {tx.destinationAccount && (
                        <p className="text-xs" style={{ color: 'var(--text-secondary)',
                          fontFamily: 'DM Mono, monospace' }}>
                          → {tx.destinationAccount.name}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: tx.account.color }} />
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {tx.account.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {tx.category ? (
                        <span className="text-xs px-2 py-1 rounded-lg"
                          style={{ background: `${tx.category.color}20`,
                            color: tx.category.color, fontFamily: 'DM Mono, monospace' }}>
                          {tx.category.icon} {tx.category.name}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs" style={{ color: 'var(--text-secondary)',
                        fontFamily: 'DM Mono, monospace' }}>
                        {formatDate(tx.date)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold"
                        style={{ color: meta.color, fontFamily: 'DM Mono, monospace' }}>
                        {tx.type === 'INCOME' ? '+' : tx.type === 'EXPENSE' ? '-' : ''}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleDelete(tx.id)}
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
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {/* Paginación */}
        {(data?.total ?? 0) > LIMIT && (
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs" style={{ color: 'var(--text-secondary)',
              fontFamily: 'DM Mono, monospace' }}>
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm"
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - LIMIT))}>
                ← Anterior
              </Button>
              <Button variant="secondary" size="sm"
                disabled={offset + LIMIT >= (data?.total ?? 0)}
                onClick={() => setOffset(offset + LIMIT)}>
                Siguiente →
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="nuevo movimiento">
        <TransactionForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}