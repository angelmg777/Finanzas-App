import apiClient from './client'
import type { ApiResponse, Category } from '../types'

export const getCategoriesApi = async () => {
  const { data } = await apiClient.get<ApiResponse<Category[]>>('/categories')
  return data.data
}

export const createCategoryApi = async (payload: {
  name: string
  icon?: string
  color?: string
}) => {
  const { data } = await apiClient.post<ApiResponse<Category>>('/categories', payload)
  return data.data
}