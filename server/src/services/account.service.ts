import { prisma } from '../config/database'
import { AccountType } from '../generated/prisma'

interface CreateAccountInput {
  name: string
  type: AccountType
  balance?: number
  creditLimit?: number
  currency?: string
  color?: string
}

interface UpdateAccountInput {
  name?: string
  color?: string
  isArchived?: boolean
}

export const getAccounts = async (userId: string) => {
  return prisma.account.findMany({
    where: { userId, isArchived: false },
    orderBy: { createdAt: 'asc' },
  })
}

export const getAccountById = async (id: string, userId: string) => {
  const account = await prisma.account.findFirst({
    where: { id, userId },
  })

  if (!account) throw new Error('Cuenta no encontrada')
  return account
}

export const createAccount = async (userId: string, input: CreateAccountInput) => {
  const { name, type, balance = 0, creditLimit = 0, currency = 'MXN', color = '#6366f1' } = input

  const initialBalance = type === 'CREDIT' ? 0 : balance

  return prisma.account.create({
    data: {
      name,
      type,
      balance: initialBalance,
      creditLimit: type === 'CREDIT' ? creditLimit : null,
      currency,
      color,
      userId,
    },
  })
}

export const updateAccount = async (
  id: string,
  userId: string,
  input: UpdateAccountInput
) => {
  await getAccountById(id, userId)

  return prisma.account.update({
    where: { id },
    data: input,
  })
}

export const deleteAccount = async (id: string, userId: string) => {
  await getAccountById(id, userId)

  // Soft delete — archivamos en lugar de borrar
  return prisma.account.update({
    where: { id },
    data: { isArchived: true },
  })
}

export const getAccountSummary = async (userId: string) => {
  const accounts = await prisma.account.findMany({
    where: { userId, isArchived: false },
  })

  const totalAssets = accounts
    .filter((a) => a.type !== 'CREDIT')
    .reduce((sum, a) => sum + Number(a.balance), 0)

  const totalDebt = accounts
    .filter((a) => a.type === 'CREDIT')
    .reduce((sum, a) => sum + Number(a.balance), 0)

  const totalCreditLimit = accounts
    .filter((a) => a.type === 'CREDIT')
    .reduce((sum, a) => sum + Number(a.creditLimit ?? 0), 0)

  const availableCredit = totalCreditLimit - totalDebt
  const netWorth = totalAssets - totalDebt

  return { accounts, totalAssets, totalDebt, totalCreditLimit, availableCredit, netWorth }
}