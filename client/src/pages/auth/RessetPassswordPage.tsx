import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import apiClient from '../../api/client'
import type { ApiResponse } from '../../types'
import { getApiError } from '../../lib/utils'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'

interface FormData {
  password: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const token = searchParams.get('token')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiClient.post<ApiResponse<{ message: string }>>('/auth/reset-password', {
        token,
        password: data.password,
      })
      return res.data
    },
    onSuccess: () => {
      setTimeout(() => navigate('/login'), 2000)
    },
    onError: (err) => setApiError(getApiError(err)),
  })

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg-primary)' }}>
        <div className="card p-10 text-center">
          <p className="text-4xl mb-4">✕</p>
          <p style={{ color: 'var(--danger)' }}>Token inválido</p>
          <Link to="/login" className="text-sm mt-4 block" style={{ color: 'var(--accent)' }}>
            ← Volver al login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,255,200,0.06) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)',
            backgroundSize: '60px 60px' }} />
      </div>

      <div className="w-full max-w-md animate-fade-up relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 relative"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-hover)' }}>
            <span className="text-3xl">◈</span>
            <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: 'var(--accent-glow)' }} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            FINANZAS<span style={{ color: 'var(--accent)' }}>.</span>APP
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
            // nueva contraseña
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit((data) => {
            if (data.password !== data.confirmPassword) {
              setApiError('Las contraseñas no coinciden')
              return
            }
            setApiError('')
            mutate(data)
          })} className="flex flex-col gap-5">
            {apiError && <Alert type="error" message={apiError} />}

            <Input
              label="Nueva contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', {
                required: 'Contraseña requerida',
                minLength: { value: 8, message: 'Mínimo 8 caracteres' }
              })}
            />
            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', { required: 'Confirma tu contraseña' })}
            />
            <Button type="submit" size="lg" loading={isPending} className="w-full mt-2">
              {isPending ? 'Actualizando...' : 'Actualizar contraseña →'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm mt-6"
          style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
          <Link to="/login" style={{ color: 'var(--accent)' }} className="hover:underline">
            ← volver al login
          </Link>
        </p>
      </div>
    </div>
  )
}