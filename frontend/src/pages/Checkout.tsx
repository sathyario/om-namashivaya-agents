import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { api } from '../lib/api'
import { formatPrice } from '../lib/utils'

export default function Checkout() {
  const { cart, totalAmount, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', phone: '', address: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/orders', {
        order_type: 'retail',
        payment_method: 'cod',
        delivery_address: form.address,
        phone: form.phone,
        notes: form.notes,
        items: cart.map(i => ({
          product_id: i.product.id,
          quantity: i.quantity,
          unit_price: i.product.price_retail,
          subtotal: i.product.price_retail * i.quantity,
        })),
        total_amount: totalAmount,
      })
      clearCart()
      navigate('/orders?success=true')
    } catch {
      setError('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8 lg:items-start">

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              required
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="10-digit mobile number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Full delivery address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <input
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Any special instructions"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
            💰 Payment: <strong>Cash on Delivery</strong> — pay when your order arrives
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-3.5 rounded-2xl font-semibold hover:bg-green-600 disabled:opacity-50 text-sm"
          >
            {loading ? 'Placing Order...' : `Place Order — ${formatPrice(totalAmount)}`}
          </button>
        </form>

        {/* Order summary — sidebar on desktop */}
        <div className="mt-6 lg:mt-0 lg:sticky lg:top-24 bg-gray-50 border border-gray-100 rounded-2xl p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Order Summary</p>
          <div className="space-y-2">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="text-gray-700 truncate pr-2">{product.name} × {quantity}</span>
                <span className="font-medium text-gray-900 flex-shrink-0">{formatPrice(product.price_retail * quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-3 pt-3 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
          <div className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
            <span>🚚</span> Free delivery
          </div>
        </div>
      </div>
    </div>
  )
}
