import apiClient from './client'
import type { DailyReport } from '@/types'

export const reportsApi = {
  getDaily: async (params?: { startDate?: string; endDate?: string; page?: number; limit?: number }) => {
    const res = await apiClient.get('/api/reports/daily', { params })
    return res.data
  },

  getSummary: async (params?: { startDate?: string; endDate?: string }) => {
    const res = await apiClient.get('/api/reports/summary', { params })
    return res.data
  },

  getTopProducts: async (params?: { startDate?: string; endDate?: string; limit?: number }) => {
    const res = await apiClient.get('/api/reports/top-products', { params })
    return res.data
  },
}
