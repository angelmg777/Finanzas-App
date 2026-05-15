import { Response } from 'express'
import { AuthRequest } from '../types'
import { sendSuccess, sendError } from '../utils/response'
import {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountSummary,
} from '../services/account.service'
import { AccountType } from '@prisma/client'

const VALID_TYPES: AccountType[] = ['DEBIT', 'CREDIT', 'CASH']

export const index = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const accounts = await getAccounts(req.user!.userId)
    sendSuccess(res, accounts)
  } catch (error) {
    sendError(res, 'Error al obtener cuentas')
  }
}

export const summary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await getAccountSummary(req.user!.userId)
    sendSuccess(res, data)
  } catch (error) {
    sendError(res, 'Error al obtener resumen')
  }
}

export const show = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string 
    const account = await getAccountById(id, req.user!.userId)
    sendSuccess(res, account)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener cuenta'
    sendError(res, message, 404)
  }
}

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, type, balance, currency, color, creditLimit } = req.body

    if (!name || !type) {
      sendError(res, 'Nombre y tipo son requeridos', 400)
      return
    }

    if (!VALID_TYPES.includes(type)) {
      sendError(res, 'Tipo inválido. Use: DEBIT, CREDIT o CASH', 400)
      return
    }

    const account = await createAccount(req.user!.userId, {
      name,
      type,
      balance,
      creditLimit, 
      currency,
      color,
    })

    sendSuccess(res, account, 'Cuenta creada exitosamente', 201)
  } catch (error) {
    sendError(res, 'Error al crear cuenta')
  }
}

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string 
    const { name, color, isArchived } = req.body
    const account = await updateAccount(id, req.user!.userId, {
      name,
      color,
      isArchived,
    })
    sendSuccess(res, account, 'Cuenta actualizada')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar'
    sendError(res, message, 404)
  }
}

export const remove = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string 
    await deleteAccount(id, req.user!.userId)
    sendSuccess(res, null, 'Cuenta archivada')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar'
    sendError(res, message, 404)
  }
}