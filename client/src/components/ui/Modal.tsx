import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-end md:justify-center md:items-center md:p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-md flex flex-col"
        style={{
          background: '#040f11',
          border: '1px solid var(--border)',
          borderRadius: '20px 20px 0 0',
          // En móvil ocupa hasta 85% de la pantalla y deja espacio para el bottom nav
          maxHeight: 'calc(85vh - 70px)',
          // En desktop centrado normal
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar móvil */}
        <div className="flex justify-center pt-3 pb-1 md:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full"
            style={{ background: 'var(--border-hover)' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="font-bold text-sm uppercase tracking-widest"
            style={{ color: 'var(--text-primary)', fontFamily: 'DM Mono, monospace' }}>
            // {title}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,68,102,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            ✕
          </button>
        </div>

        {/* Body scrolleable */}
        <div
          className="overflow-y-auto flex-1"
          style={{
            padding: '20px 24px',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
          } as React.CSSProperties}
        >
          {children}
          {/* Espacio extra al final para que el botón no quede pegado */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  )
}