import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Tenant {
  id: string
  name: string
  slug: string
  subscriptionPlan: string
}

interface TenantState {
  current: Tenant | null
  isLoading: boolean
}

const initialState: TenantState = {
  current: null,
  isLoading: false,
}

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenant: (state, action: PayloadAction<Tenant | null>) => {
      state.current = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setTenant, setLoading } = tenantSlice.actions
export default tenantSlice.reducer
