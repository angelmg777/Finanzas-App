import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { prisma } from '../config/database'
import { AuthPayload } from '../types'
import { seedDefaultCategories } from './category.service' // <- agrega este import
import { sendVerificationEmail, sendPasswordResetEmail } from './email.service'

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

const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString('hex')
}

export const registerUser = async (input: RegisterInput): Promise<{ message: string }> => {
  const { email, name, password } = input

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('El email ya está registrado')

  const hashedPassword = await bcrypt.hash(password, 12)
  const verifyToken = generateRandomToken()

  const user = await prisma.user.create({
  data: {
    email,
    name,
    password: hashedPassword,
    verifyToken,
    isVerified: false,
  },
})

await seedDefaultCategories(user.id)

await sendVerificationEmail(email, name, verifyToken)

  return { message: 'Registro exitoso. Revisa tu email para verificar tu cuenta.' }
}

export const loginUser = async (input: LoginInput): Promise<AuthResult> => {
  const { email, password } = input

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('Credenciales inválidas')

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new Error('Credenciales inválidas')

  if (!user.isVerified) throw new Error('EMAIL_NOT_VERIFIED')

  const token = generateToken({ userId: user.id, email: user.email })

  return {
    token,
    user: { id: user.id, email: user.email, name: user.name },
  }
}

export const verifyEmail = async (token: string): Promise<{ message: string }> => {
  const user = await prisma.user.findUnique({ where: { verifyToken: token } })
  if (!user) throw new Error('Token inválido o expirado')

  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true, verifyToken: null },
  })

  return { message: 'Email verificado exitosamente' }
}

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const user = await prisma.user.findUnique({ where: { email } })

  // Siempre respondemos lo mismo para no revelar si el email existe
  if (!user) return { message: 'Si el email existe, recibirás un enlace de recuperación.' }

  const resetToken = generateRandomToken()
  const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  })

  await sendPasswordResetEmail(email, user.name, resetToken)

  return { message: 'Si el email existe, recibirás un enlace de recuperación.' }
}

export const resetPassword = async (token: string, newPassword: string): Promise<{ message: string }> => {
  const user = await prisma.user.findUnique({ where: { resetToken: token } })

  if (!user || !user.resetTokenExpiry) throw new Error('Token inválido o expirado')

  if (user.resetTokenExpiry < new Date()) throw new Error('Token expirado. Solicita uno nuevo.')

  const hashedPassword = await bcrypt.hash(newPassword, 12)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  })

  return { message: 'Contraseña actualizada exitosamente' }
}