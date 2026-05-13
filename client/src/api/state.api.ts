import apiClient from './client'
import type { ApiResponse } from '../types'

export interface CategoryStat {
  name: string
  color: string
  icon: string
  total: number
}

export interface MonthlyFlow {
  month: string
  income: number
  expense: number
}

export interface NetWorthPoint {
  month: string
  netWorth: number
}

export interface SummaryStats {
  totalIncome: number
  totalExpense: number
  balance: number
  savingsRate: number
}

export const getExpensesByCategoryApi = async (startDate?: string, endDate?: string) => {
  const { data } = await apiClient.get<ApiResponse<CategoryStat[]>>('/stats/expenses-by-category', {
    params: { startDate, endDate },
  })
  return data.data
}

export const getMonthlyFlowApi = async (months = 6) => {
  const { data } = await apiClient.get<ApiResponse<MonthlyFlow[]>>('/stats/monthly-flow', {
    params: { months },
  })
  return data.data
}

export const getNetWorthHistoryApi = async (months = 6) => {
  const { data } = await apiClient.get<ApiResponse<NetWorthPoint[]>>('/stats/net-worth-history', {
    params: { months },
  })
  return data.data
}

export const getSummaryStatsApi = async (startDate?: string, endDate?: string) => {
  const { data } = await apiClient.get<ApiResponse<SummaryStats>>('/stats/summary', {
    params: { startDate, endDate },
  })
  return data.data
}