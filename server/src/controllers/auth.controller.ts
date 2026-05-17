import { Request, Response } from 'express'
import {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from '../services/auth.service'
import { sendSuccess, sendError } from '../utils/response'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, password } = req.body
    if (!email || !name || !password) { sendError(res, 'Todos los campos son requeridos', 400); return }
    if (password.length < 8) { sendError(res, 'La contraseña debe tener al menos 8 caracteres', 400); return }
    const result = await registerUser({ email, name, password })
    sendSuccess(res, result, result.message, 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al registrar'
    const status = message.includes('registrado') ? 409 : 500
    sendError(res, message, status)
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body
    if (!email || !password) { sendError(res, 'Email y contraseña son requeridos', 400); return }
    const result = await loginUser({ email, password })
    sendSuccess(res, result, 'Login exitoso')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al iniciar sesión'
    if (message === 'EMAIL_NOT_VERIFIED') {
      sendError(res, 'Debes verificar tu email antes de iniciar sesión', 403)
      return
    }
    const status = message.includes('inválidas') ? 401 : 500
    sendError(res, message, status)
  }
}

export const verifyEmailController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query
    if (!token) { sendError(res, 'Token requerido', 400); return }
    const result = await verifyEmail(token as string)
    sendSuccess(res, result, result.message)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al verificar'
    sendError(res, message, 400)
  }
}

export const forgotPasswordController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body
    if (!email) { sendError(res, 'Email requerido', 400); return }
    const result = await forgotPassword(email)
    sendSuccess(res, result, result.message)
  } catch (error) {
    sendError(res, 'Error al procesar solicitud')
  }
}

export const resetPasswordController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body
    if (!token || !password) { sendError(res, 'Token y contraseña requeridos', 400); return }
    if (password.length < 8) { sendError(res, 'Mínimo 8 caracteres', 400); return }
    const result = await resetPassword(token, password)
    sendSuccess(res, result, result.message)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al restablecer'
    sendError(res, message, 400)
  }
}