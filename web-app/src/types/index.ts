export interface Tenant {
  id: string
  name: string
  slug: string
  email: string
  phone?: string
  address?: string
  city?: string
  status: string
  subscriptionPlan?: string
}

export interface User {
  id: string
  tenantId: string
  name: string
  email: string
  phone?: string
  role: 'admin' | 'manager' | 'cashier' | 'staff'
  status: string
  avatarUrl?: string
  lastLoginAt?: string
  createdAt: string
}

export interface ProductCategory {
  id: string
  tenantId: string
  name: string
  description?: string
}

export interface Product {
  id: string
  tenantId: string
  sku: string
  name: string
  description?: string
  categoryId?: string
  category?: ProductCategory
  price: number
  costPrice?: number
  imageUrl?: string
  barcode?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Stock {
  id: string
  tenantId: string
  productId: string
  product?: Product
  warehouseId?: string
  quantity: number
  reorderLevel?: number
  reorderQuantity?: number
  updatedAt: string
}

export interface StockMovement {
  id: string
  productId: string
  type: 'in' | 'out' | 'adjustment' | 'return'
  quantity: number
  notes?: string
  createdAt: string
}

export interface RecipeIngredient {
  id: string
  ingredientProductId: string
  ingredient?: Product
  quantity: number
  unit: string
  notes?: string
}

export interface Recipe {
  id: string
  tenantId: string
  productId: string
  product?: Product
  name: string
  description?: string
  yieldQuantity?: number
  yieldUnit?: string
  estimatedCost?: number
  isActive: boolean
  ingredients: RecipeIngredient[]
  createdAt: string
}

export interface CartItem {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  discountAmount?: number
}

export interface TransactionItem {
  productId: string
  quantity: number
  unitPrice: number
  discountAmount: number
  subtotal: number
}

export interface Transaction {
  id: string
  tenantId: string
  transactionNumber: string
  cashierUserId: string
  transactionType: string
  subtotal: number
  discountAmount: number
  discountPercent: number
  taxAmount: number
  totalAmount: number
  paymentMethod?: string
  paymentStatus: string
  status: string
  items: TransactionItem[]
  createdAt: string
}

export interface DailyReport {
  id: string
  reportDate: string
  totalTransactions: number
  totalRevenue: number
  totalDiscount: number
  totalTax: number
  totalItemsSold: number
  avgTransactionValue?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
