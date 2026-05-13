import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getTransactionsApi, createTransactionApi, deleteTransactionApi } from '../api/transactions.api'
import { getApiError } from '../lib/utils'
import type { TransactionType } from '../types'

interface Filters {
  accountId?: string
  type?: TransactionType
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

export const useTransactions = (filters: Filters = {}) =>
  useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => getTransactionsApi(filters),
  })

export const useCreateTransaction = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTransactionApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['accounts'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
      toast.success('Movimiento registrado')
    },
    onError: (err) => toast.error(getApiError(err)),
  })
}

export const useDeleteTransaction = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteTransactionApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['accounts'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
      toast.success('Transacción eliminada')
    },
    onError: (err) => toast.error(getApiError(err)),
  })
}