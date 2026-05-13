import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getAccountsApi, getAccountSummaryApi, createAccountApi, deleteAccountApi } from '../api/accounts.api'
import { getApiError } from '../lib/utils'
import type { AccountType } from '../types'

export const useAccounts = () =>
  useQuery({ queryKey: ['accounts'], queryFn: getAccountsApi })

export const useAccountSummary = () =>
  useQuery({ queryKey: ['accounts', 'summary'], queryFn: getAccountSummaryApi })

export const useCreateAccount = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; type: AccountType; balance?: number; creditLimit?: number; color?: string }) =>
      createAccountApi(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Cuenta creada exitosamente')
    },
    onError: (err) => toast.error(getApiError(err)),
  })
}

export const useDeleteAccount = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAccountApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Cuenta archivada')
    },
    onError: (err) => toast.error(getApiError(err)),
  })
}