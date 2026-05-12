import apiClient from './client'
import type { Product, PaginatedResponse } from '@/types'

export interface ProductFilters {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  isActive?: boolean
}

export interface CreateProductDto {
  sku: string
  name: string
  description?: string
  categoryId?: string
  price: number
  costPrice?: number
  barcode?: string
  isActive?: boolean
}

export const productsApi = {
  getAll: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const res = await apiClient.get('/api/products', { params: filters })
    return res.data
  },

  getById: async (id: string): Promise<Product> => {
    const res = await apiClient.get(`/api/products/${id}`)
    return res.data
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const res = await apiClient.post('/api/products', data)
    return res.data
  },

  update: async (id: string, data: Partial<CreateProductDto>): Promise<Product> => {
    const res = await apiClient.put(`/api/products/${id}`, data)
    return res.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/products/${id}`)
  },
}
