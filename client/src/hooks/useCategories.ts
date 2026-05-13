import { useQuery } from '@tanstack/react-query'
import { getCategoriesApi } from '../api/categories.api'

export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: getCategoriesApi })