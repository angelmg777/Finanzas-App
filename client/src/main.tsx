import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { queryClient } from './lib/queryClient'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ui/ErrorBoundary'

import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <ErrorBoundary>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#040f11',
              color: '#e8f5f3',
              border: '1px solid rgba(0,255,200,0.2)',
              fontFamily: 'DM Mono, monospace',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#00ffc8', secondary: '#020809' } },
            error:   { iconTheme: { primary: '#ff4466', secondary: '#020809' } },
          }}
        />
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)