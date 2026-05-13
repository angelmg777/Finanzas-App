import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { Express } from 'express'

export const applySecurityMiddlewares = (app: Express) => {
  // Headers de seguridad
  app.use(helmet())

  // Rate limiting global
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
    message: { success: false, message: 'Demasiadas solicitudes, intenta más tarde' },
    standardHeaders: true,
    legacyHeaders: false,
  }))

  // Rate limiting estricto para auth
  app.use('/api/auth', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: 'Demasiados intentos, intenta en 15 minutos' },
  }))
}