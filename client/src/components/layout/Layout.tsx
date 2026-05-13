import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'

const navItems = [
  { path: '/',            label: 'Dashboard',     icon: '▦' },
  { path: '/accounts',   label: 'Cuentas',        icon: '◈' },
  { path: '/transactions', label: 'Movimientos',  icon: '⇄' },
]

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* Sidebar */}
      <aside
        className="flex flex-col relative transition-all duration-300"
        style={{
          width: collapsed ? '64px' : '220px',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-6 overflow-hidden"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-hover)',
              boxShadow: 'var(--accent-glow)', color: 'var(--accent)' }}>
            ◈
          </div>
          {!collapsed && (
            <span className="font-extrabold text-sm tracking-widest whitespace-nowrap"
              style={{ color: 'var(--text-primary)' }}>
              FINANZAS<span style={{ color: 'var(--accent)' }}>.</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={({ isActive }) => ({
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--border-hover)' : '1px solid transparent',
                boxShadow: isActive ? 'var(--accent-glow)' : 'none',
              })}
            >
              <span className="flex-shrink-0 text-base w-5 text-center">{item.icon}</span>
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
          {!collapsed && (
            <div className="px-3 py-2 mb-2 rounded-xl overflow-hidden"
              style={{ background: 'rgba(0,255,200,0.03)' }}>
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {user?.name}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--text-secondary)',
                fontFamily: 'DM Mono, monospace' }}>
                {user?.email}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{ color: 'var(--danger)', background: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,68,102,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <span className="flex-shrink-0 text-base w-5 text-center">⏻</span>
            {!collapsed && <span>Salir</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            color: 'var(--accent)', zIndex: 10 }}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}