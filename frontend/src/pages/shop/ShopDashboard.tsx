import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import { formatPrice, stockLabel } from '../../lib/utils'
import { Product, CartItem } from '../../types'

export default function ShopDashboard() {
  const { products, loading } = useProducts()
  const navigate = useNavigate()
  const [bulkCart, setBulkCart] = useState<CartItem[]>([])

  const updateQty = (product: Product, qty: number) => {
    setBulkCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (qty <= 0) return prev.filter(i => i.product.id !== product.id)
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: qty } : i)
      return [...prev, { product, quantity: qty }]
    })
  }

  const getQty = (productId: number) =>
    bulkCart.find(i => i.product.id === productId)?.quantity ?? 0

  const totalItems = bulkCart.reduce((s, i) => s + i.quantity, 0)
  const totalAmount = bulkCart.reduce(
    (s, i) => s + (i.product.price_wholesale ?? i.product.price_retail) * i.quantity, 0
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Shop Portal</h1>
          <p className="text-sm text-gray-400">Wholesale prices shown</p>
        </div>
        {bulkCart.length > 0 && (
          <button
            onClick={() => navigate('/shop/order', { state: { cart: bulkCart } })}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Place Order ({totalItems} items · {formatPrice(totalAmount)})
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {products.map(product => {
            const stock = stockLabel(product.stock_quantity)
            const price = product.price_wholesale ?? product.price_retail
            const qty = getQty(product.id)

            return (
              <div key={product.id} className="bg-white border rounded-xl p-4 flex items-center gap-4">
                <div className="text-2xl">
                  {product.category_id === 1 ? '⚡' : '🛒'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900">{product.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-blue-600 font-medium text-sm">{formatPrice(price)}/{product.unit}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${stock.color}`}>{stock.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(product, qty - 1)}
                    className="w-7 h-7 rounded-full border text-gray-600 text-sm hover:bg-gray-50"
                  >−</button>
                  <span className="w-8 text-center text-sm font-medium">{qty}</span>
                  <button
                    onClick={() => updateQty(product, qty + 1)}
                    disabled={product.stock_quantity === 0}
                    className="w-7 h-7 rounded-full border text-gray-600 text-sm hover:bg-gray-50 disabled:opacity-40"
                  >+</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
