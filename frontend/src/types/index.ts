// ─── User ────────────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'shop' | 'consumer'

export interface UserProfile {
  id: string
  role: UserRole
  full_name: string
  phone: string
  shop_name?: string
  shop_address?: string
  shop_phone?: string
  created_at: string
}

// ─── Category ─────────────────────────────────────────────────────────────────
export interface Category {
  id: number
  name: string
  slug: string
  icon?: string
}

// ─── Product ──────────────────────────────────────────────────────────────────
export interface Product {
  id: number
  category_id: number
  category?: Category
  name: string
  description?: string
  price_retail: number
  price_wholesale?: number
  stock_quantity: number
  unit: string
  image_url?: string
  is_active: boolean
  created_at: string
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderType = 'retail' | 'wholesale'
export type OrderStatus = 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled'
export type PaymentMethod = 'cod' | 'upi'
export type PaymentStatus = 'pending' | 'paid'

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  product?: Product
  quantity: number
  unit_price: number
  subtotal: number
}

export interface Order {
  id: number
  user_id: string
  order_type: OrderType
  status: OrderStatus
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  total_amount: number
  delivery_address: string
  phone: string
  notes?: string
  items?: OrderItem[]
  created_at: string
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  product: Product
  quantity: number
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
