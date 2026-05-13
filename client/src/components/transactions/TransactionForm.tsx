import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateTransaction } from '../../hooks/useTransactions'
import { useAccounts } from '../../hooks/useAccount'
import { useCategories } from '../../hooks/useCategories'
import { getApiError } from '../../lib/utils'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import Alert from '../ui/Alert'

type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER'

interface FormData {
  type: TransactionType
  amount: string
  description: string
  date: string
  accountId: string
  destinationAccountId: string
  categoryId: string
}

interface TransactionFormProps {
  onSuccess: () => void
}

export default function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [apiError, setApiError] = useState('')
  const { mutate, isPending } = useCreateTransaction()
  const { data: accounts } = useAccounts()
  const { data: categories } = useCategories()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      type: 'EXPENSE',
      date: new Date().toISOString().split('T')[0],
    },
  })

  const selectedType = watch('type')

  const accountOptions = accounts?.map((a) => ({
    value: a.id,
    label: `${a.type === 'DEBIT' ? '🏦' : a.type === 'CASH' ? '💵' : '💳'} ${a.name}`,
  })) ?? []

  const categoryOptions = [
    { value: '', label: '— Sin categoría —' },
    ...(categories?.map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` })) ?? []),
  ]

  const destinationOptions = accounts?.map((a) => ({
    value: a.id,
    label: `${a.type === 'DEBIT' ? '🏦' : a.type === 'CASH' ? '💵' : '💳'} ${a.name}`,
  })) ?? []

  const onSubmit = (data: FormData) => {
    setApiError('')
    mutate(
      {
        type: data.type,
        amount: parseFloat(data.amount),
        description: data.description || undefined,
        date: data.date ? new Date(data.date).toISOString() : undefined,
        accountId: data.accountId,
        destinationAccountId: data.type === 'TRANSFER' ? data.destinationAccountId : undefined,
        categoryId: data.categoryId || undefined,
      },
      {
        onSuccess,
        onError: (err) => setApiError(getApiError(err)),
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {apiError && <Alert type="error" message={apiError} />}

      {/* Tipo */}
      <div className="grid grid-cols-3 gap-2">
        {(['EXPENSE', 'INCOME', 'TRANSFER'] as TransactionType[]).map((type) => {
          const config = {
            EXPENSE:  { label: 'Gasto',        icon: '↑', color: 'var(--danger)' },
            INCOME:   { label: 'Ingreso',       icon: '↓', color: 'var(--success)' },
            TRANSFER: { label: 'Transferencia', icon: '⇄', color: 'var(--accent)' },
          }[type]

          return (
            <label key={type} className="cursor-pointer">
              <input type="radio" value={type} className="sr-only" {...register('type')} />
              <div className="flex flex-col items-center gap-1 p-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: selectedType === type ? `${config.color}15` : 'rgba(0,255,200,0.03)',
                  border: `1px solid ${selectedType === type ? config.color : 'var(--border)'}`,
                  color: selectedType === type ? config.color : 'var(--text-secondary)',
                  boxShadow: selectedType === type ? `0 0 12px ${config.color}30` : 'none',
                }}>
                <span className="text-lg">{config.icon}</span>
                <span className="text-xs">{config.label}</span>
              </div>
            </label>
          )
        })}
      </div>

      {/* Monto */}
      <Input
        label="Monto"
        type="number"
        placeholder="0.00"
        error={errors.amount?.message}
        {...register('amount', {
          required: 'El monto es requerido',
          min: { value: 0.01, message: 'Debe ser mayor a 0' },
        })}
      />

      {/* Cuenta origen */}
      <Select
        label={selectedType === 'TRANSFER' ? 'Cuenta origen' : 'Cuenta'}
        options={accountOptions}
        error={errors.accountId?.message}
        {...register('accountId', { required: 'Selecciona una cuenta' })}
      />

      {/* Cuenta destino (solo transfer) */}
      {selectedType === 'TRANSFER' && (
        <Select
          label="Cuenta destino"
          options={destinationOptions}
          error={errors.destinationAccountId?.message}
          {...register('destinationAccountId', { required: 'Selecciona cuenta destino' })}
        />
      )}

      {/* Categoría (no en transfer) */}
      {selectedType !== 'TRANSFER' && (
        <Select
          label="Categoría"
          options={categoryOptions}
          {...register('categoryId')}
        />
      )}

      {/* Descripción */}
      <Input
        label="Descripción (opcional)"
        placeholder="Ej: Supermercado"
        {...register('description')}
      />

      {/* Fecha */}
      <Input
        label="Fecha"
        type="date"
        {...register('date')}
      />

      <Button type="submit" size="lg" loading={isPending} className="w-full mt-2">
        {isPending ? 'Registrando...' : 'Registrar movimiento →'}
      </Button>
    </form>
  )
}