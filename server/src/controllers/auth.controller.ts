import { Request, Response } from 'express'
import { registerUser, loginUser } from '../services/auth.service'
import { sendSuccess, sendError } from '../utils/response'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, password } = req.body

    if (!email || !name || !password) {
      sendError(res, 'Todos los campos son requeridos', 400)
      return
    }

    if (password.length < 8) {
      sendError(res, 'La contraseña debe tener al menos 8 caracteres', 400)
      return
    }

    const result = await registerUser({ email, name, password })
    sendSuccess(res, result, 'Usuario registrado exitosamente', 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al registrar'
    const status = message.includes('registrado') ? 409 : 500
    sendError(res, message, status)
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      sendError(res, 'Email y contraseña son requeridos', 400)
      return
    }

    const result = await loginUser({ email, password })
    sendSuccess(res, result, 'Login exitoso')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al iniciar sesión'
    const status = message.includes('inválidas') ? 401 : 500
    sendError(res, message, status)
  }
}