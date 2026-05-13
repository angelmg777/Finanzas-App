import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import accountRoutes from './routes/account.routes'
import transactionRoutes from './routes/transaction.routes'
import categoryRoutes from './routes/category.routes'
import statsRoutes from './routes/stats.routes'
import { authenticate } from './middlewares/authenticate'
import { applySecurityMiddlewares } from './middlewares/security'
import { notFound, errorHandler } from './middlewares/errorHandler'
import { AuthRequest } from './types'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Seguridad
applySecurityMiddlewares(app)

// Middlewares base
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '10kb' })) // límite de payload

// Rutas públicas
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})
app.use('/api/auth', authRoutes)

// Rutas protegidas
app.get('/api/me', authenticate, (req: AuthRequest, res) => {
  res.json({ success: true, data: req.user })
})
app.use('/api/accounts', accountRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/stats', statsRoutes)

// Manejo de errores (siempre al final)
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

export default app