// Common Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  tenantId?: string;
}

export interface TokenPayload {
  id: string;
  email: string;
  tenantId: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Product Types
export interface CreateProductPayload {
  sku: string;
  name: string;
  description?: string;
  categoryId?: string;
  price: number;
  costPrice?: number;
  barcode?: string;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  id: string;
}

// Stock Types
export interface StockMovementPayload {
  type: 'in' | 'out' | 'adjustment' | 'return';
  quantity: number;
  notes?: string;
  referenceId?: string;
}

// Transaction Types
export interface TransactionItemPayload {
  productId: string;
  quantity: number;
  unitPrice: number;
  discountAmount?: number;
}

export interface CreateTransactionPayload {
  items: TransactionItemPayload[];
  discountAmount?: number;
  discountPercent?: number;
  taxAmount?: number;
  paymentMethod: string;
}
