import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

const features = [
  {
    icon: '◈',
    title: 'Múltiples cuentas',
    desc: 'Administra débito, crédito y efectivo desde un solo lugar con balances en tiempo real.',
    color: '#00ffc8',
  },
  {
    icon: '💳',
    title: 'Tarjetas de crédito',
    desc: 'Controla tu deuda, límite disponible y pagos pendientes de forma visual e intuitiva.',
    color: '#ff4466',
  },
  {
    icon: '📊',
    title: 'Dashboard inteligente',
    desc: 'Gráficas de ingresos vs gastos, categorías y evolución de tu patrimonio por período.',
    color: '#f59e0b',
  },
  {
    icon: '⇄',
    title: 'Transferencias',
    desc: 'Mueve dinero entre cuentas y el sistema actualiza los saldos automáticamente.',
    color: '#6366f1',
  },
  {
    icon: '🏷️',
    title: 'Categorías',
    desc: 'Clasifica tus movimientos por categoría y descubre en qué gastas más cada mes.',
    color: '#ec4899',
  },
  {
    icon: '🔐',
    title: 'Seguridad',
    desc: 'JWT, bcrypt, verificación de email y rate limiting para proteger tus datos.',
    color: '#14b8a6',
  },
]

const stack = [
  { name: 'React', color: '#61dafb' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'Node.js', color: '#68a063' },
  { name: 'Express', color: '#ffffff' },
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'Prisma', color: '#5a67d8' },
  { name: 'TailwindCSS', color: '#38bdf8' },
  { name: 'TanStack Query', color: '#ff4154' },
  { name: 'Zustand', color: '#f97316' },
  { name: 'Recharts', color: '#22d3ee' },
  { name: 'Vercel', color: '#ffffff' },
  { name: 'Railway', color: '#7c3aed' },
]

const mockTransactions = [
  { type: 'INCOME', desc: 'Salario quincenal', account: 'BBVA Débito', amount: '+$18,500.00', color: '#00ffc8', icon: '↓' },
  { type: 'EXPENSE', desc: 'Supermercado', account: 'Efectivo', amount: '-$1,240.00', color: '#ff4466', icon: '↑' },
  { type: 'EXPENSE', desc: 'Netflix', account: 'Mercado Pago', amount: '-$199.00', color: '#ff4466', icon: '↑' },
  { type: 'TRANSFER', desc: 'Ahorro mensual', account: 'BBVA → Efectivo', amount: '$3,000.00', color: '#00ffc8', icon: '⇄' },
  { type: 'EXPENSE', desc: 'Gasolina', account: 'BBVA Débito', amount: '-$850.00', color: '#ff4466', icon: '↑' },
]

const mockAccounts = [
  { name: 'BBVA Débito', type: 'DEBIT', balance: '$42,350.00', color: '#00ffc8', icon: '🏦' },
  { name: 'Mercado Pago', type: 'CREDIT', balance: '$1,850.00', color: '#ff4466', icon: '💳', limit: '$10,000.00', used: 18 },
  { name: 'Efectivo', type: 'CASH', balance: '$3,500.00', color: '#f59e0b', icon: '💵' },
]

export default function LandingPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(2,8,9,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-hover)', color: 'var(--accent)', boxShadow: 'var(--accent-glow)' }}>
            ◈
          </div>
          <span className="font-extrabold text-sm tracking-widest" style={{ color: 'var(--text-primary)' }}>
            FINANZAS<span style={{ color: 'var(--accent)' }}>.</span>APP
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/"
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #00ffc8, #00c8a0)', color: '#020809' }}>
              Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                Iniciar sesión
              </Link>
              <Link to="/register"
                className="px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: 'linear-gradient(135deg, #00ffc8, #00c8a0)', color: '#020809', boxShadow: '0 0 20px rgba(0,255,200,0.3)' }}>
                Registrarse →
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,255,200,0.08) 0%, transparent 70%)' }} />
          <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,200,160,0.05) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs mb-8"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-hover)', color: 'var(--accent)', fontFamily: 'DM Mono, monospace' }}>
            ◈ Gestión financiera personal
          </div>

          <h1 className="font-extrabold tracking-tight mb-6 leading-none"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}>
            Controla tus<br />
            <span style={{ color: 'var(--accent)' }}>finanzas</span> con<br />
            precisión<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-10"
            style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace', lineHeight: 1.8 }}>
            Registra ingresos, gastos y transferencias. Visualiza tu patrimonio en tiempo real.
            Toma decisiones financieras con datos reales.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register"
              className="px-8 py-4 rounded-xl text-base font-bold transition-all"
              style={{ background: 'linear-gradient(135deg, #00ffc8, #00c8a0)', color: '#020809', boxShadow: '0 0 30px rgba(0,255,200,0.4)' }}>
              Empezar gratis →
            </Link>
            <Link to="/login"
              className="px-8 py-4 rounded-xl text-base font-medium transition-all"
              style={{ border: '1px solid var(--border-hover)', color: 'var(--accent)', background: 'var(--accent-dim)' }}>
              Ya tengo cuenta
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-16 max-w-lg mx-auto">
            {[
              { value: '100%', label: 'Open source' },
              { value: '0$', label: 'Costo mensual' },
              { value: '∞', label: 'Transacciones' },
            ].map((s) => (
              <div key={s.label} className="card p-4 text-center">
                <p className="text-2xl font-extrabold" style={{ color: 'var(--accent)', fontFamily: 'DM Mono, monospace' }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOCKUPS */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>// preview</p>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
              Todo lo que necesitas<span style={{ color: 'var(--accent)' }}>.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Dashboard mockup */}
            <div className="lg:col-span-2 card p-5 overflow-hidden">
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>// dashboard</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Patrimonio neto', value: '$44,350.00', color: 'var(--accent)' },
                  { label: 'Total activos', value: '$46,200.00', color: '#00d4aa' },
                  { label: 'Deuda total', value: '$1,850.00', color: 'var(--danger)' },
                  { label: 'Tasa de ahorro', value: '38.2%', color: '#f59e0b' },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-xl" style={{ background: 'rgba(0,255,200,0.03)', border: '1px solid var(--border)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>{s.label}</p>
                    <p className="text-lg font-extrabold" style={{ color: s.color, fontFamily: 'DM Mono, monospace' }}>{s.value}</p>
                  </div>
                ))}
              </div>
              {/* Mini bar chart */}
              <div className="p-3 rounded-xl" style={{ background: 'rgba(0,255,200,0.03)', border: '1px solid var(--border)' }}>
                <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>// ingresos vs gastos</p>
                <div className="flex items-end gap-2 h-20">
                  {[
                    { inc: 65, exp: 40 },
                    { inc: 70, exp: 45 },
                    { inc: 60, exp: 55 },
                    { inc: 80, exp: 50 },
                    { inc: 75, exp: 48 },
                    { inc: 90, exp: 52 },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex items-end gap-0.5">
                      <div className="flex-1 rounded-t-sm" style={{ height: `${bar.inc}%`, background: '#00ffc8', opacity: 0.8 }} />
                      <div className="flex-1 rounded-t-sm" style={{ height: `${bar.exp}%`, background: '#ff4466', opacity: 0.8 }} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#00ffc8' }} />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>Ingresos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#ff4466' }} />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>Gastos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cuentas mockup */}
            <div className="card p-5">
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>// cuentas</p>
              <div className="flex flex-col gap-3">
                {mockAccounts.map((acc) => (
                  <div key={acc.name} className="p-3 rounded-xl" style={{ background: 'rgba(0,255,200,0.03)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                          style={{ background: `${acc.color}20` }}>
                          {acc.icon}
                        </div>
                        <div>
                          <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{acc.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>{acc.type}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold" style={{ color: acc.color, fontFamily: 'DM Mono, monospace' }}>{acc.balance}</p>
                    </div>
                    {acc.used !== undefined && (
                      <div>
                        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
                          <span>Usado {acc.used}%</span>
                          <span>Límite {acc.limit}</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <div className="h-full rounded-full" style={{ width: `${acc.used}%`, background: acc.color }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Transacciones mockup */}
            <div className="lg:col-span-3 card p-5">
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>// movimientos recientes</p>
              <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
                {mockTransactions.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                        style={{ background: `${tx.color}15`, color: tx.color }}>
                        {tx.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{tx.desc}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>{tx.account}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold" style={{ color: tx.color, fontFamily: 'DM Mono, monospace' }}>{tx.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>// funcionalidades</p>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
              Diseñado para el control total<span style={{ color: 'var(--accent)' }}>.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="card p-6 transition-all"
                onMouseEnter={e => (e.currentTarget.style.borderColor = f.color + '60')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}30`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STACK */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>// stack tecnológico</p>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
              Construido con tecnología moderna<span style={{ color: 'var(--accent)' }}>.</span>
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {stack.map((tech) => (
              <div key={tech.name}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: `${tech.color}10`,
                  border: `1px solid ${tech.color}30`,
                  color: tech.color === '#ffffff' ? 'var(--text-primary)' : tech.color,
                  fontFamily: 'DM Mono, monospace',
                }}>
                {tech.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEVELOPER */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="card p-8 md:p-8">
            <p className="text-xs uppercase tracking-widest mb-6" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>// desarrollador</p>
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl font-extrabold"
                style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-hover)', color: 'var(--accent)', boxShadow: 'var(--accent-glow)' }}>
                AG
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Angel Munguia<span style={{ color: 'var(--accent)' }}>.</span>
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--accent)', fontFamily: 'DM Mono, monospace' }}>
                  Ingeniero en Desarrollo de Software
                </p>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Apasionado por crear experiencias digitales que impacten. Especializado en desarrollo
                  móvil y web moderno, con enfoque en código limpio y soluciones escalables.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <a href="https://github.com/angelmg777"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-hover)', color: 'var(--accent)' }}>
                    GitHub →
                  </a>
                  <a href="https://www.linkedin.com/in/angel-munguia-gonzalez-7a277a2b2/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: 'rgba(0,119,181,0.1)', border: '1px solid rgba(0,119,181,0.3)', color: '#0077b5' }}>
                    LinkedIn →
                  </a>
                  <a href="https://portafolio-personal-mu-hazel.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    Portafolio →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-8 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[-50%] left-[-20%] w-[400px] h-[400px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(0,255,200,0.08) 0%, transparent 70%)' }} />
            </div>
            <p className="text-xs uppercase tracking-widest mb-4 relative z-10"
              style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
              // empieza hoy
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 relative z-10" style={{ color: 'var(--text-primary)' }}>
              Toma el control de<br />tu dinero<span style={{ color: 'var(--accent)' }}>.</span>
            </h2>
            <p className="text-sm mb-8 relative z-10" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
              Gratis, sin límites, sin tarjeta de crédito.
            </p>
            <Link to="/register"
              className="inline-block px-10 py-4 rounded-xl text-base font-bold relative z-10"
              style={{ background: 'linear-gradient(135deg, #00ffc8, #00c8a0)', color: '#020809', boxShadow: '0 0 30px rgba(0,255,200,0.4)' }}>
              Crear cuenta gratis →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 px-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-sm"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
              ◈
            </div>
            <span className="font-extrabold text-xs tracking-widest" style={{ color: 'var(--text-primary)' }}>
              FINANZAS<span style={{ color: 'var(--accent)' }}>.</span>APP
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
            © 2026 Angel Munguia — Construido con ♥ y TypeScript
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="text-xs hover:underline" style={{ color: 'var(--text-secondary)' }}>Login</Link>
            <Link to="/register" className="text-xs hover:underline" style={{ color: 'var(--text-secondary)' }}>Registro</Link>
            <a href="https://github.com/angelmg777" target="_blank" rel="noopener noreferrer"
              className="text-xs hover:underline" style={{ color: 'var(--text-secondary)' }}>GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}