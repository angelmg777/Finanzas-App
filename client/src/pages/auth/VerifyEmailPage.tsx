import { useEffect, useState, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import apiClient from '../../api/client'
import { useAuthStore } from '../../store/auth.store'
import type { ApiResponse } from '../../types'

type Status = 'loading' | 'success' | 'error'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')
  const calledRef = useRef(false)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    // Cierra sesión para evitar redirects
    logout()

    const token = searchParams.get('token')
    if (!token) {
      setTimeout(() => {
        setStatus('error')
        setMessage('Token no válido')
      }, 0)
      return
    }

    apiClient
      .get<ApiResponse<{ message: string }>>(`/auth/verify-email?token=${token}`)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error')
        setMessage(err.response?.data?.message ?? 'Token inválido o expirado')
      })
  }, [searchParams, logout])

  const config = {
    loading: { icon: '⟳', title: 'Verificando',        color: 'var(--accent)',  text: 'Espera un momento.' },
    success: { icon: '✓',  title: '¡Email verificado!', color: 'var(--success)', text: 'Tu cuenta está activa. Ya puedes iniciar sesión.' },
    error:   { icon: '✕',  title: 'Error',              color: 'var(--danger)',  text: message || 'El link es inválido o ya expiró.' },
  }[status]

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,255,200,0.06) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)',
            backgroundSize: '60px 60px' }} />
      </div>
      <div className="w-full max-w-md animate-fade-up relative z-10 text-center">
        <div className="card p-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6"
            style={{
              background: `${config.color}20`,
              border: `1px solid ${config.color}40`,
              color: config.color,
              boxShadow: `0 0 20px ${config.color}30`,
            }}>
            {config.icon}
          </div>
          <h2 className="text-2xl font-extrabold mb-3" style={{ color: 'var(--text-primary)' }}>
            {config.title}<span style={{ color: config.color }}>.</span>
          </h2>
          <p className="text-sm mb-8"
            style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
            {config.text}
          </p>
          {status !== 'loading' && (
            <Link to="/login"
              className="inline-block px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)',
                border: '1px solid var(--border-hover)' }}>
              Ir al login →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}