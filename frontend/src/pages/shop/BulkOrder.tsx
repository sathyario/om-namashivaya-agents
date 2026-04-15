import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../../lib/api'
import { formatPrice } from '../../lib/utils'
import type { CartItem } from '../../types'
import { useAuth } from '../../hooks/useAuth'

export default function BulkOrder() {
  const navigate = useNavigate()
  const location = useLocation()
  const cart: CartItem[] = location.state?.cart ?? []
  const { profile } = useAuth()
  const [form, setForm] = useState({ phone: '', address: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Auto-fill shop address and phone from already-loaded profile
  useEffect(() => {
    if (profile) {
      setForm(f => ({
        ...f,
        phone: profile.shop_phone || profile.phone || '',
        address: profile.shop_address || '',
      }))
    }
  }, [profile])

  const totalAmount = cart.reduce(
    (s, i) => s + (i.product.price_wholesale ?? i.product.price_retail) * i.quantity, 0
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/orders', {
        order_type: 'wholesale',
        payment_method: 'cod',
        delivery_address: form.address,
        phone: form.phone,
        notes: form.notes,
        items: cart.map(i => ({
          product_id: i.product.id,
          quantity: i.quantity,
          unit_price: i.product.price_wholesale ?? i.product.price_retail,
          subtotal: (i.product.price_wholesale ?? i.product.price_retail) * i.quantity,
        })),
        total_amount: totalAmount,
      })
      navigate('/shop/orders?success=true')
    } catch {
      setError('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Confirm Bulk Order</h1>

      {/* Items summary */}
      <div className="bg-gray-50 border rounded-xl p-4 mb-6 space-y-2">
        {cart.map(({ product, quantity }) => (
          <div key={product.id} className="flex justify-between text-sm">
            <span className="text-gray-700">{product.name} × {quantity} {product.unit}</span>
            <span className="font-medium">
              {formatPrice((product.price_wholesale ?? product.price_retail) * quantity)}
            </span>
          </div>
        ))}
        <div className="border-t pt-2 flex justify-between font-bold text-gray-900">
          <span>Total (Wholesale)</span>
          <span>{formatPrice(totalAmount)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shop Phone
            {form.phone && (
              <span className="ml-2 text-xs text-green-600 font-normal">auto-filled from profile</span>
            )}
          </label>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Shop contact number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Address
            {form.address && (
              <span className="ml-2 text-xs text-green-600 font-normal">auto-filled from profile</span>
            )}
          </label>
          <textarea
            required
            rows={3}
            value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Shop address for delivery"
          />
          {profile && !form.address && (
            <p className="text-xs text-orange-500 mt-1">
              Save your shop address in your profile to auto-fill this next time.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <input
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Special instructions (optional)"
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          💰 Payment: <strong>Cash on Delivery</strong>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Placing Order...' : 'Confirm Bulk Order'}
        </button>
      </form>
    </div>
  )
}
