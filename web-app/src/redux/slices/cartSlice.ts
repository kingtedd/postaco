import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CartItem {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  discountAmount?: number
}

interface CartState {
  items: CartItem[]
  discountAmount: number
  discountPercent: number
  taxAmount: number
}

const initialState: CartState = {
  items: [],
  discountAmount: 0,
  discountPercent: 0,
  taxAmount: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(item => item.productId === action.payload.productId)
      if (existing) {
        existing.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload)
    },
    updateCartItem: (state, action: PayloadAction<CartItem>) => {
      const item = state.items.find(item => item.productId === action.payload.productId)
      if (item) {
        Object.assign(item, action.payload)
      }
    },
    setDiscount: (state, action: PayloadAction<{ amount?: number; percent?: number }>) => {
      if (action.payload.amount !== undefined) {
        state.discountAmount = action.payload.amount
      }
      if (action.payload.percent !== undefined) {
        state.discountPercent = action.payload.percent
      }
    },
    setTax: (state, action: PayloadAction<number>) => {
      state.taxAmount = action.payload
    },
    clearCart: (state) => {
      state.items = []
      state.discountAmount = 0
      state.discountPercent = 0
      state.taxAmount = 0
    },
  },
})

export const { addToCart, removeFromCart, updateCartItem, setDiscount, setTax, clearCart } = cartSlice.actions
export default cartSlice.reducer
