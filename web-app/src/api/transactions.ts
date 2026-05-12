import apiClient from './client'
import type { Transaction, PaginatedResponse, CartItem } from '@/types'

export interface CreateTransactionDto {
  items: {
    productId: string
    quantity: number
    unitPrice: number
    discountAmount?: number
  }[]
  subtotal?: number
  discountAmount?: number
  discountPercent?: number
  taxAmount?: number
  total?: number
  paymentMethod: 'cash' | 'card' | 'transfer' | 'digital_wallet' | 'other'
  amountPaid?: number
  changeAmount?: number
  notes?: string
}

export const transactionsApi = {
  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const res = await apiClient.post('/api/transactions', data)
    return res.data
  },

  getAll: async (params?: { page?: number; limit?: number; startDate?: string; endDate?: string }): Promise<PaginatedResponse<Transaction>> => {
    const res = await apiClient.get('/api/transactions', { params })
    return res.data
  },

  getById: async (id: string): Promise<Transaction> => {
    const res = await apiClient.get(`/api/transactions/${id}`)
    return res.data
  },

  cancel: async (id: string): Promise<Transaction> => {
    const res = await apiClient.post(`/api/transactions/${id}/cancel`)
    return res.data
  },
}
