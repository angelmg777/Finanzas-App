import { prisma } from '../config/database'
import { TransactionType } from '@prisma/client'
import { PrismaClient } from '@prisma/client'



interface CreateTransactionInput {
  type: TransactionType
  amount: number
  description?: string
  date?: Date
  accountId: string
  destinationAccountId?: string
  categoryId?: string
}

interface GetTransactionsFilter {
  accountId?: string
  categoryId?: string
  type?: TransactionType
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

type PrismaTx = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>

const updateBalance = async (
  tx: PrismaTx,
  accountId: string,
  amount: number,
  operation: 'add' | 'subtract'
) => {
  const account = await tx.account.findUnique({ where: { id: accountId } })
  if (!account) throw new Error('Cuenta no encontrada')

  const current = Number(account.balance)
  const isCredit = account.type === 'CREDIT'
  const limit = Number(account.creditLimit ?? 0)

  let newBalance: number

  if (isCredit) {
    // Crédito: balance = deuda acumulada
    // add = más deuda (gasto), subtract = menos deuda (pago)
    newBalance = operation === 'add' ? current + amount : current - amount
    if (newBalance < 0) newBalance = 0
    if (operation === 'add' && limit > 0 && newBalance > limit) {
      throw new Error(`Límite excedido. Crédito disponible: $${limit - current}`)
    }
  } else {
    // Débito/Efectivo: balance = saldo disponible
    // add = más saldo (ingreso/transferencia entrada)
    // subtract = menos saldo (gasto/transferencia salida)
    newBalance = operation === 'add' ? current + amount : current - amount
    if (newBalance < 0) throw new Error('Saldo insuficiente')
  }

  return tx.account.update({
    where: { id: accountId },
    data: { balance: newBalance },
  })
}

export const getTransactions = async (
  userId: string,
  filters: GetTransactionsFilter = {}
) => {
  const { accountId, categoryId, type, startDate, endDate, limit = 20, offset = 0 } = filters

  const where: Record<string, unknown> = { userId }
  if (accountId) where.accountId = accountId
  if (categoryId) where.categoryId = categoryId
  if (type) where.type = type
  if (startDate || endDate) {
    where.date = {
      ...(startDate && { gte: startDate }),
      ...(endDate && { lte: endDate }),
    }
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        account: { select: { id: true, name: true, type: true, color: true } },
        destinationAccount: { select: { id: true, name: true, type: true, color: true } },
        category: { select: { id: true, name: true, icon: true, color: true } },
      },
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.transaction.count({ where }),
  ])

  return { transactions, total, limit, offset }
}

export const createTransaction = async (userId: string, input: CreateTransactionInput) => {
  const { type, amount, description, date, accountId, destinationAccountId, categoryId } = input

  if (amount <= 0) throw new Error('El monto debe ser mayor a 0')

  const account = await prisma.account.findFirst({ where: { id: accountId, userId } })
  if (!account) throw new Error('Cuenta no encontrada')

  if (type === 'TRANSFER') {
    if (!destinationAccountId) throw new Error('Se requiere cuenta destino')
    if (accountId === destinationAccountId) throw new Error('Las cuentas deben ser diferentes')
    const dest = await prisma.account.findFirst({ where: { id: destinationAccountId, userId } })
    if (!dest) throw new Error('Cuenta destino no encontrada')
  }

  return prisma.$transaction(async (tx: PrismaTx) => {
    const transaction = await tx.transaction.create({
      data: {
        type,
        amount,
        description,
        date: date ?? new Date(),
        accountId,
        destinationAccountId: type === 'TRANSFER' ? destinationAccountId : null,
        categoryId: categoryId ?? null,
        userId,
      },
      include: {
        account: { select: { id: true, name: true, type: true, color: true } },
        destinationAccount: { select: { id: true, name: true, type: true, color: true } },
        category: { select: { id: true, name: true, icon: true, color: true } },
      },
    })

    if (type === 'INCOME') {
      await updateBalance(tx, accountId, amount, 'add')
    } else if (type === 'EXPENSE') {
      if (account.type === 'CREDIT') {
        // Gasto en crédito = aumenta deuda
        await updateBalance(tx, accountId, amount, 'add')
      } else {
        // Gasto en débito/efectivo = resta saldo
        await updateBalance(tx, accountId, amount, 'subtract')
      }
    } else if (type === 'TRANSFER') {
      await updateBalance(tx, accountId, amount, 'subtract')
      await updateBalance(tx, destinationAccountId!, amount, 'add')
    }

    return transaction
  })
}

export const deleteTransaction = async (id: string, userId: string) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id, userId },
    include: { account: true },
  })

  if (!transaction) throw new Error('Transacción no encontrada')

  return prisma.$transaction(async (tx: PrismaTx) => {
    if (transaction.type === 'INCOME') {
      await updateBalance(tx, transaction.accountId, Number(transaction.amount), 'subtract')
    } else if (transaction.type === 'EXPENSE') {
      if (transaction.account.type === 'CREDIT') {
        await updateBalance(tx, transaction.accountId, Number(transaction.amount), 'subtract')
      } else {
        await updateBalance(tx, transaction.accountId, Number(transaction.amount), 'add')
      }
    } else if (transaction.type === 'TRANSFER' && transaction.destinationAccountId) {
      await updateBalance(tx, transaction.accountId, Number(transaction.amount), 'add')
      await updateBalance(tx, transaction.destinationAccountId, Number(transaction.amount), 'subtract')
    }

    return tx.transaction.delete({ where: { id } })
  })
}