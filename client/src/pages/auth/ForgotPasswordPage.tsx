import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import apiClient from '../../api/client'
import type { ApiResponse } from '../../types'
import { getApiError } from '../../lib/utils'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'

interface FormData { email: string }

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiClient.post<ApiResponse<{ message: string }>>('/auth/forgot-password', data)
      return res.data
    },
    onSuccess: () => setSuccess(true),
    onError: (err) => setApiError(getApiError(err)),
  })

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full"
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
            // recuperar contraseña
          </p>
        </div>

        <div className="card p-8">
          {success ? (
            <div className="text-center py-4">
              <p className="text-4xl mb-4">✉</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
                Si el email existe, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit((data) => { setApiError(''); mutate(data) })}
              className="flex flex-col gap-5">
              {apiError && <Alert type="error" message={apiError} />}
              <p className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
                Ingresa tu email y te enviaremos un link para restablecer tu contraseña.
              </p>
              <Input
                label="Email"
                type="email"
                placeholder="usuario@dominio.com"
                error={errors.email?.message}
                {...register('email', { required: 'Email requerido' })}
              />
              <Button type="submit" size="lg" loading={isPending} className="w-full mt-2">
                {isPending ? 'Enviando...' : 'Enviar link →'}
              </Button>
            </form>
          )}
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