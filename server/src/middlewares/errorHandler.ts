import { Request, Response, NextFunction } from 'express'
import { sendError } from '../utils/response'

export const notFound = (_req: Request, res: Response): void => {
  sendError(res, 'Ruta no encontrada', 404)
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('❌ Error no manejado:', err)
  sendError(res, 'Error interno del servidor', 500)
}