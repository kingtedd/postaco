import apiClient from './client'
import type { Recipe, PaginatedResponse } from '@/types'

export const recipesApi = {
  getAll: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Recipe>> => {
    const res = await apiClient.get('/api/recipes', { params })
    return res.data
  },

  getById: async (id: string): Promise<Recipe> => {
    const res = await apiClient.get(`/api/recipes/${id}`)
    return res.data
  },

  create: async (data: Partial<Recipe>): Promise<Recipe> => {
    const res = await apiClient.post('/api/recipes', data)
    return res.data
  },

  update: async (id: string, data: Partial<Recipe>): Promise<Recipe> => {
    const res = await apiClient.put(`/api/recipes/${id}`, data)
    return res.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/recipes/${id}`)
  },
}
