import { Response } from 'express'
import { AuthRequest } from '../types'
import { sendSuccess, sendError } from '../utils/response'
import { getCategories, createCategory, seedDefaultCategories } from '../services/category.service'

export const index = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = await getCategories(req.user!.userId)
    sendSuccess(res, categories)
  } catch (error) {
    sendError(res, 'Error al obtener categorías')
  }
}

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, icon, color } = req.body
    if (!name) { sendError(res, 'El nombre es requerido', 400); return }
    const category = await createCategory(req.user!.userId, { name, icon, color })
    sendSuccess(res, category, 'Categoría creada', 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear categoría'
    sendError(res, message, 400)
  }
}

export const seed = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await seedDefaultCategories(req.user!.userId)
    const categories = await getCategories(req.user!.userId)
    sendSuccess(res, categories, 'Categorías creadas')
  } catch (error) {
    sendError(res, 'Error al crear categorías')
  }
}