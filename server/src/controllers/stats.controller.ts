import { Response } from 'express'
import { AuthRequest } from '../types'
import { sendSuccess, sendError } from '../utils/response'
import {
  getExpensesByCategory,
  getMonthlyFlow,
  getNetWorthHistory,
  getSummaryStats,
} from '../services/stats.service'

export const expensesByCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query
    const data = await getExpensesByCategory(
      req.user!.userId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    )
    sendSuccess(res, data)
  } catch {
    sendError(res, 'Error al obtener estadísticas')
  }
}

export const monthlyFlow = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const months = req.query.months ? parseInt(req.query.months as string) : 6
    const data = await getMonthlyFlow(req.user!.userId, months)
    sendSuccess(res, data)
  } catch {
    sendError(res, 'Error al obtener flujo mensual')
  }
}

export const netWorthHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const months = req.query.months ? parseInt(req.query.months as string) : 6
    const data = await getNetWorthHistory(req.user!.userId, months)
    sendSuccess(res, data)
  } catch {
    sendError(res, 'Error al obtener historial')
  }
}

export const summaryStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query
    const data = await getSummaryStats(
      req.user!.userId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    )
    sendSuccess(res, data)
  } catch {
    sendError(res, 'Error al obtener resumen')
  }
}