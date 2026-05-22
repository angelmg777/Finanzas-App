import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { loginApi } from '../../api/auth.api'
import { useAuthStore } from '../../store/auth.store'
import { getApiError } from '../../lib/utils'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [apiError, setApiError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

 const { mutate, isPending } = useMutation({
  mutationFn: ({ email, password }: LoginForm) => loginApi(email, password),
  onSuccess: ({ user, token }) => { setAuth(user, token); navigate('/app') },
  onError: (error) => {
    const err = getApiError(error)
    if (err.includes('verificar tu email')) {
      setApiError('Debes verificar tu email antes de continuar. Revisa tu bandeja de entrada.')
    } else {
      setApiError(err)
    }
  },
})

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}>

      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,255,200,0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,200,160,0.04) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)',
            backgroundSize: '60px 60px' }} />
      </div>

      <div className="w-full max-w-md animate-fade-up relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 relative"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-hover)' }}>
            <span className="text-3xl">◈</span>
            <div className="absolute inset-0 rounded-2xl"
              style={{ boxShadow: 'var(--accent-glow)' }} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight"
            style={{ color: 'var(--text-primary)' }}>
            FINANZAS<span style={{ color: 'var(--accent)' }}>.</span>APP
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
            // acceso al sistema
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form 
            onSubmit={(e) => {
                e.preventDefault()
                handleSubmit((data) => { 
                  setApiError('')
                  mutate(data) 
                })(e)
              }}
            className="flex flex-col gap-5"
            >
            {apiError && <Alert type="error" message={apiError} />}

            <Input label="Email" type="email" placeholder="usuario@dominio.com"
              error={errors.email?.message} {...register('email')} />

            <Input label="Contraseña" type="password" placeholder="••••••••"
              error={errors.password?.message} {...register('password')} />

            <div className="flex justify-end">
              <Link to="/forgot-password"
                className="text-xs hover:underline"
                style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
                ¿olvidaste tu contraseña?
              </Link>
            </div>

            <Button type="submit" size="lg" loading={isPending} className="mt-2 w-full">
              Iniciar sesión →
            </Button>
          </form>
        </div>

        <p className="text-center text-sm mt-6"
          style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
          ¿Sin cuenta?{' '}
          <Link to="/register" style={{ color: 'var(--accent)' }} className="hover:underline font-medium">
            REGISTRATE
          </Link>
        </p>
      </div>
    </div>
  )
}