import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../lib/utils'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, totalItems, totalAmount } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <div className="text-gray-500 mb-4">Your cart is empty</div>
        <Link
          to="/products"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">
        Cart ({totalItems} items)
      </h1>

      <div className="space-y-3">
        {cart.map(({ product, quantity }) => (
          <div key={product.id} className="bg-white border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
              {product.category_id === 1 ? '⚡' : '🛒'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 truncate">{product.name}</div>
              <div className="text-blue-600 text-sm font-medium">
                {formatPrice(product.price_retail)} / {product.unit}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="w-7 h-7 rounded-full border text-gray-600 hover:bg-gray-50 text-sm"
              >−</button>
              <span className="w-6 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="w-7 h-7 rounded-full border text-gray-600 hover:bg-gray-50 text-sm"
              >+</button>
              <button
                onClick={() => removeFromCart(product.id)}
                className="ml-1 text-red-400 hover:text-red-600 text-sm"
              >✕</button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-gray-50 border rounded-xl p-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal ({totalItems} items)</span>
          <span>{formatPrice(totalAmount)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>Delivery</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 mt-3 pt-3 border-t">
          <span>Total</span>
          <span>{formatPrice(totalAmount)}</span>
        </div>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700"
      >
        Proceed to Checkout
      </button>
    </div>
  )
}
