import { AxiosError } from 'axios'

export const getApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? 'Error de conexión'
  }
  return 'Error inesperado'
}

export const formatCurrency = (amount: number | string, currency = 'MXN'): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
  }).format(Number(amount))
}

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}