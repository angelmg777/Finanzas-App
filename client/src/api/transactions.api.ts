import apiClient from './client'
import type { ApiResponse, Transaction, TransactionType, PaginatedTransactions } from '../types'

interface TransactionFilters {
  accountId?: string
  categoryId?: string
  type?: TransactionType
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

export const getTransactionsApi = async (filters: TransactionFilters = {}) => {
  const { data } = await apiClient.get<ApiResponse<PaginatedTransactions>>('/transactions', {
    params: filters,
  })
  return data.data
}

export const createTransactionApi = async (payload: {
  type: TransactionType
  amount: number
  description?: string
  date?: string
  accountId: string
  destinationAccountId?: string
  categoryId?: string
}) => {
  const { data } = await apiClient.post<ApiResponse<Transaction>>('/transactions', payload)
  return data.data
}

export const deleteTransactionApi = async (id: string) => {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/transactions/${id}`)
  return data
}