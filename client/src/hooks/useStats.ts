import { useQuery } from '@tanstack/react-query'
import {
  getExpensesByCategoryApi,
  getMonthlyFlowApi,
  getNetWorthHistoryApi,
  getSummaryStatsApi,
} from '../api/state.api'

export const useExpensesByCategory = (startDate?: string, endDate?: string) =>
  useQuery({
    queryKey: ['stats', 'expenses-by-category', startDate, endDate],
    queryFn: () => getExpensesByCategoryApi(startDate, endDate),
  })

export const useMonthlyFlow = (months = 6) =>
  useQuery({
    queryKey: ['stats', 'monthly-flow', months],
    queryFn: () => getMonthlyFlowApi(months),
  })

export const useNetWorthHistory = (months = 6) =>
  useQuery({
    queryKey: ['stats', 'net-worth-history', months],
    queryFn: () => getNetWorthHistoryApi(months),
  })

export const useSummaryStats = (startDate?: string, endDate?: string) =>
  useQuery({
    queryKey: ['stats', 'summary', startDate, endDate],
    queryFn: () => getSummaryStatsApi(startDate, endDate),
  })