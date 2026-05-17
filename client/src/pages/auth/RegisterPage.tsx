import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { registerApi } from '../../api/auth.api'
import { getApiError } from '../../lib/utils'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'

const registerSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: ({ name, email, password }: RegisterForm) =>
      registerApi(name, email, password),
    onSuccess: () => setSuccess(true),
    onError: (error) => setApiError(getApiError(error)),
  })

  if (success) {
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
        <div className="w-full max-w-md animate-fade-up relative z-10 text-center">
          <div className="card p-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6"
              style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-hover)',
                boxShadow: 'var(--accent-glow)', color: 'var(--accent)' }}>
              ✉
            </div>
            <h2 className="text-2xl font-extrabold mb-3" style={{ color: 'var(--text-primary)' }}>
              Revisa tu email<span style={{ color: 'var(--accent)' }}>.</span>
            </h2>
            <p className="text-sm mb-6"
              style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
              Te enviamos un link de verificación. Haz clic en él para activar tu cuenta.
            </p>
            <Link to="/login"
              className="text-sm font-medium hover:underline"
              style={{ color: 'var(--accent)' }}>
              ← Volver al login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}>

      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,255,200,0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,200,160,0.04) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)',
            backgroundSize: '60px 60px' }} />
      </div>

      <div className="w-full max-w-md animate-fade-up relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 relative"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-hover)' }}>
            <span className="text-3xl">◈</span>
            <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: 'var(--accent-glow)' }} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            FINANZAS<span style={{ color: 'var(--accent)' }}>.</span>APP
          </h1>
          <p className="mt-2 text-sm"
            style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
            // crear nueva cuenta
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit((data) => { setApiError(''); mutate(data) })}
            className="flex flex-col gap-5">
            {apiError && <Alert type="error" message={apiError} />}

            <Input
              label="Nombre"
              placeholder="Tu nombre completo"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="usuario@dominio.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" size="lg" loading={isPending} className="mt-2 w-full">
              {isPending ? 'Creando cuenta...' : 'Crear cuenta →'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm mt-6"
          style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
          ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--accent)' }} className="hover:underline font-medium">
            iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}