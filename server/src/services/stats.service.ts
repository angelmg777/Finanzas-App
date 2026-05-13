import { prisma } from '../config/database'

export const getExpensesByCategory = async (userId: string, startDate?: Date, endDate?: Date) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: 'EXPENSE',
      ...(startDate || endDate ? {
        date: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        }
      } : {}),
    },
    include: {
      category: { select: { name: true, color: true, icon: true } },
    },
  })

  const map = new Map<string, { name: string; color: string; icon: string; total: number }>()

  for (const tx of transactions) {
    const key = tx.category?.name ?? 'Sin categoría'
    const color = tx.category?.color ?? '#6b7280'
    const icon = tx.category?.icon ?? '📦'
    const existing = map.get(key)
    if (existing) {
      existing.total += Number(tx.amount)
    } else {
      map.set(key, { name: key, color, icon, total: Number(tx.amount) })
    }
  }

  return Array.from(map.values()).sort((a, b) => b.total - a.total)
}

export const getMonthlyFlow = async (userId: string, months = 6) => {
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months + 1)
  startDate.setDate(1)
  startDate.setHours(0, 0, 0, 0)

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: { in: ['INCOME', 'EXPENSE'] },
      date: { gte: startDate },
    },
    select: { type: true, amount: true, date: true },
  })

  const monthMap = new Map<string, { month: string; income: number; expense: number }>()

  // Inicializa todos los meses
  for (let i = 0; i < months; i++) {
    const d = new Date()
    d.setMonth(d.getMonth() - (months - 1) + i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('es-MX', { month: 'short', year: '2-digit' })
    monthMap.set(key, { month: label, income: 0, expense: 0 })
  }

  for (const tx of transactions) {
    const d = new Date(tx.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const entry = monthMap.get(key)
    if (entry) {
      if (tx.type === 'INCOME') entry.income += Number(tx.amount)
      else entry.expense += Number(tx.amount)
    }
  }

  return Array.from(monthMap.values())
}

export const getNetWorthHistory = async (userId: string, months = 6) => {
  const flow = await getMonthlyFlow(userId, months)
  let accumulated = 0

  return flow.map((m) => {
    accumulated += m.income - m.expense
    return { month: m.month, netWorth: Math.max(0, accumulated) }
  })
}

export const getSummaryStats = async (userId: string, startDate?: Date, endDate?: Date) => {
  const where = {
    userId,
    ...(startDate || endDate ? {
      date: {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate }),
      }
    } : {}),
  }

  const [income, expense] = await Promise.all([
    prisma.transaction.aggregate({
      where: { ...where, type: 'INCOME' },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { ...where, type: 'EXPENSE' },
      _sum: { amount: true },
    }),
  ])

  const totalIncome = Number(income._sum.amount ?? 0)
  const totalExpense = Number(expense._sum.amount ?? 0)

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    savingsRate: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0,
  }
}