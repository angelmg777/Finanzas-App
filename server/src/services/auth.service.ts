import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/database'
import { AuthPayload } from '../types'

interface RegisterInput {
  email: string
  name: string
  password: string
}

interface LoginInput {
  email: string
  password: string
}

interface AuthResult {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
}

const generateToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions)
}

export const registerUser = async (input: RegisterInput): Promise<AuthResult> => {
  const { email, name, password } = input

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new Error('El email ya está registrado')
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: { email, name, password: hashedPassword },
  })

  const token = generateToken({ userId: user.id, email: user.email })

  return {
    token,
    user: { id: user.id, email: user.email, name: user.name },
  }
}

export const loginUser = async (input: LoginInput): Promise<AuthResult> => {
  const { email, password } = input

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error('Credenciales inválidas')
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw new Error('Credenciales inválidas')
  }

  const token = generateToken({ userId: user.id, email: user.email })

  return {
    token,
    user: { id: user.id, email: user.email, name: user.name },
  }
}