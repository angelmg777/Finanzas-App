import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center"
          style={{ background: 'var(--bg-primary)' }}>
          <div className="card p-10 text-center max-w-md">
            <p className="text-4xl mb-4">⚠</p>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Algo salió mal
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)',
              fontFamily: 'DM Mono, monospace' }}>
              {this.state.error?.message ?? 'Error inesperado'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)',
                border: '1px solid var(--border-hover)' }}>
              Recargar página
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}