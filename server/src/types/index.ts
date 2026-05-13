import { Request } from 'express'

export interface AuthPayload {
  userId: string
  email: string
}

export interface AuthRequest extends Request {
  user?: AuthPayload
}

export interface ApiResponse<T = null> {
  success: boolean
  message: string
  data?: T
}