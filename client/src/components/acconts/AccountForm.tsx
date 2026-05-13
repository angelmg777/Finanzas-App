import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateAccount } from '../../hooks/useAccount'
import { getApiError } from '../../lib/utils'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import Alert from '../ui/Alert'

type AccountType = 'DEBIT' | 'CREDIT' | 'CASH'

interface FormData {
  name: string
  type: AccountType
  balance: string
  creditLimit: string
  color: string
}

const COLORS = [
  '#00ffc8', '#6366f1', '#f59e0b', '#ef4444',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
]

interface AccountFormProps {
  onSuccess: () => void
}

export default function AccountForm({ onSuccess }: AccountFormProps) {
  const [apiError, setApiError] = useState('')
  const { mutate, isPending } = useCreateAccount()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { type: 'DEBIT', color: '#00ffc8', balance: '', creditLimit: '' },
  })

  const selectedType = watch('type')
  const selectedColor = watch('color')

  const onSubmit = (data: FormData) => {
    setApiError('')
    mutate(
      {
        name: data.name,
        type: data.type,
        balance: data.balance ? parseFloat(data.balance) : 0,
        creditLimit: data.creditLimit ? parseFloat(data.creditLimit) : 0,
        color: data.color,
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

      <Input
        label="Nombre de la cuenta"
        placeholder="Ej: BBVA Débito"
        error={errors.name?.message}
        {...register('name', { required: 'El nombre es requerido', minLength: { value: 2, message: 'Mínimo 2 caracteres' } })}
      />

      <Select
        label="Tipo de cuenta"
        options={[
          { value: 'DEBIT',  label: '🏦 Débito' },
          { value: 'CASH',   label: '💵 Efectivo' },
          { value: 'CREDIT', label: '💳 Crédito' },
        ]}
        {...register('type')}
      />

      {selectedType !== 'CREDIT' && (
        <Input
          label="Saldo inicial"
          type="number"
          placeholder="0.00"
          {...register('balance')}
        />
      )}

      {selectedType === 'CREDIT' && (
        <Input
          label="Límite de crédito"
          type="number"
          placeholder="0.00"
          {...register('creditLimit')}
        />
      )}

      {/* Color picker */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest"
          style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
          Color
        </label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map((color) => (
            <label key={color} className="cursor-pointer">
              <input type="radio" value={color} className="sr-only" {...register('color')} />
              <div className="w-8 h-8 rounded-lg transition-all"
                style={{
                  background: color,
                  border: selectedColor === color ? '2px solid white' : '2px solid transparent',
                  boxShadow: selectedColor === color ? `0 0 10px ${color}` : 'none',
                  transform: selectedColor === color ? 'scale(1.15)' : 'scale(1)',
                }} />
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" size="lg" loading={isPending} className="w-full mt-2">
        {isPending ? 'Creando...' : 'Crear cuenta →'}
      </Button>
    </form>
  )
}