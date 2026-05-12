import apiClient from './client'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  tenantName: string
  tenantSlug: string
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: {
    id: string
    email: string
    name: string
    role: string
    tenantId: string
  }
  tenant: {
    id: string
    name: string
    slug: string
  }
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post('/api/auth/login', data)
    return res.data
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post('/api/auth/register', data)
    return res.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout')
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const res = await apiClient.post('/api/auth/refresh-token', { refreshToken })
    return res.data
  },

  me: async () => {
    const res = await apiClient.get('/api/auth/me')
    return res.data
  },
}
