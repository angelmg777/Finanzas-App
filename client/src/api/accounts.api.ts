import apiClient from './client'
import type { ApiResponse, Account, AccountSummary, AccountType } from '../types'

export const getAccountsApi = async () => {
  const { data } = await apiClient.get<ApiResponse<Account[]>>('/accounts')
  return data.data
}

export const getAccountSummaryApi = async () => {
  const { data } = await apiClient.get<ApiResponse<AccountSummary>>('/accounts/summary')
  return data.data
}

export const createAccountApi = async (payload: {
  name: string
  type: AccountType
  balance?: number
  creditLimit?: number
  currency?: string
  color?: string
}) => {
  const { data } = await apiClient.post<ApiResponse<Account>>('/accounts', payload)
  return data.data
}

export const updateAccountApi = async (
  id: string,
  payload: { name?: string; color?: string; isArchived?: boolean }
) => {
  const { data } = await apiClient.put<ApiResponse<Account>>(`/accounts/${id}`, payload)
  return data.data
}

export const deleteAccountApi = async (id: string) => {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/accounts/${id}`)
  return data
}