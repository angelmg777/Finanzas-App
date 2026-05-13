import { prisma } from '../config/database'

interface CreateCategoryInput {
  name: string
  icon?: string
  color?: string
}

export const getCategories = async (userId: string) => {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  })
}

export const createCategory = async (userId: string, input: CreateCategoryInput) => {
  const { name, icon = '💰', color = '#6366f1' } = input

  const existing = await prisma.category.findUnique({
    where: { name_userId: { name, userId } },
  })

  if (existing) throw new Error('Ya existe una categoría con ese nombre')

  return prisma.category.create({
    data: { name, icon, color, userId },
  })
}

export const seedDefaultCategories = async (userId: string) => {
  const defaults = [
    { name: 'Alimentación', icon: '🍔', color: '#f59e0b' },
    { name: 'Transporte', icon: '🚗', color: '#3b82f6' },
    { name: 'Entretenimiento', icon: '🎬', color: '#8b5cf6' },
    { name: 'Salud', icon: '🏥', color: '#ef4444' },
    { name: 'Educación', icon: '📚', color: '#06b6d4' },
    { name: 'Ropa', icon: '👕', color: '#ec4899' },
    { name: 'Hogar', icon: '🏠', color: '#14b8a6' },
    { name: 'Servicios', icon: '💡', color: '#f97316' },
    { name: 'Salario', icon: '💼', color: '#22c55e' },
    { name: 'Otros', icon: '📦', color: '#6b7280' },
  ]

  await prisma.category.createMany({
    data: defaults.map((c) => ({ ...c, userId })),
    skipDuplicates: true,
  })
}