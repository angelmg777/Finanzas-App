import { Response } from 'express'
import { AuthRequest } from '../types'
import { sendSuccess, sendError } from '../utils/response'
import { getTransactions, createTransaction, deleteTransaction } from '../services/transaction.service'
import { TransactionType } from '../generated/prisma'

const VALID_TYPES: TransactionType[] = ['INCOME', 'EXPENSE', 'TRANSFER']

export const index = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { accountId, categoryId, type, startDate, endDate, limit, offset } = req.query

    const result = await getTransactions(req.user!.userId, {
      accountId: accountId as string,
      categoryId: categoryId as string,
      type: type as TransactionType,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      limit: limit ? parseInt(limit as string) : 20,
      offset: offset ? parseInt(offset as string) : 0,
    })

    sendSuccess(res, result)
  } catch (error) {
    sendError(res, 'Error al obtener transacciones')
  }
}

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, amount, description, date, accountId, destinationAccountId, categoryId } = req.body

    if (!type || !amount || !accountId) {
      sendError(res, 'Tipo, monto y cuenta son requeridos', 400)
      return
    }

    if (!VALID_TYPES.includes(type)) {
      sendError(res, 'Tipo inválido. Use: INCOME, EXPENSE o TRANSFER', 400)
      return
    }

    const transaction = await createTransaction(req.user!.userId, {
      type,
      amount: parseFloat(amount),
      description,
      date: date ? new Date(date) : undefined,
      accountId,
      destinationAccountId,
      categoryId,
    })

    sendSuccess(res, transaction, 'Transacción registrada', 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear transacción'
    const status = message.includes('insuficiente') || message.includes('excedido') ? 400 : 500
    sendError(res, message, status)
  }
}

export const remove = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string
    await deleteTransaction(id, req.user!.userId)
    sendSuccess(res, null, 'Transacción eliminada')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar'
    sendError(res, message, 404)
  }
}