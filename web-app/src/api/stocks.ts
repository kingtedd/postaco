import apiClient from './client'
import type { Stock, PaginatedResponse } from '@/types'

export const stocksApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Stock>> => {
    const res = await apiClient.get('/api/stocks', { params })
    return res.data
  },

  getById: async (id: string): Promise<Stock> => {
    const res = await apiClient.get(`/api/stocks/${id}`)
    return res.data
  },

  adjust: async (id: string, data: { type: string; quantity: number; notes?: string }): Promise<Stock> => {
    const res = await apiClient.post(`/api/stocks/${id}/adjust`, data)
    return res.data
  },

  getMovements: async (params?: { page?: number; limit?: number }) => {
    const res = await apiClient.get('/api/stocks/movements', { params })
    return res.data
  },
}
