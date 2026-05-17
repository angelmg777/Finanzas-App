import apiClient from './client'
import type { ApiResponse, User } from '../types'

interface AuthPayload {
  token: string
  user: User
}

export const loginApi = async (email: string, password: string) => {
  const { data } = await apiClient.post<ApiResponse<AuthPayload>>('/auth/login', {
    email,
    password,
  })
  return data.data
}

export const registerApi = async (name: string, email: string, password: string) => {
  const { data } = await apiClient.post<ApiResponse<{ message: string }>>('/auth/register', {
    name,
    email,
    password,
  })
  return data.data
}