import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../lib/utils'

export default function Cart() {
  const { cart, updateQuantity, totalItems, totalAmount } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <div className="text-gray-500 font-medium mb-1">Your cart is empty</div>
        <div className="text-gray-400 text-sm mb-6">Add items to get started</div>
        <Link to="/products" className="bg-green-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold">
          Browse Products
        </Link>
      </div>
    )
  }

  const BillSummary = () => (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <p className="text-sm font-semibold text-gray-700 mb-4">Bill Summary</p>
      <div className="space-y-2.5">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Items total ({totalItems})</span>
          <span>{formatPrice(totalAmount)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery fee</span>
          <span className="text-green-600 font-medium">FREE</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Payment</span>
          <span>Cash on Delivery</span>
        </div>
      </div>
      <div className="flex justify-between font-bold text-gray-900 mt-4 pt-4 border-t text-base">
        <span>Total</span>
        <span>{formatPrice(totalAmount)}</span>
      </div>
      <button
        onClick={() => navigate('/checkout')}
        className="mt-4 w-full flex items-center justify-between bg-green-500 hover:bg-green-600 text-white px-5 py-3.5 rounded-2xl shadow-sm font-semibold"
      >
        <span className="text-sm">Proceed to Checkout</span>
        <span>{formatPrice(totalAmount)}</span>
      </button>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 pb-32 lg:pb-10">
      <h1 className="text-xl font-bold text-gray-900 mb-5">
        Cart <span className="text-gray-400 font-normal text-base">({totalItems} items)</span>
      </h1>

      {/* Desktop: items left + summary right | Mobile: stacked */}
      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8 lg:items-start">

        {/* Cart items */}
        <div className="space-y-3">
          <AnimatePresence>
            {cart.map(({ product, quantity }) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-3 shadow-sm"
              >
                {/* Product image */}
                <div className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ${product.category_id === 1 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-contain p-1"
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      {product.category_id === 1 ? '⚡' : '🌿'}
                    </div>
                  )}
                </div>

                {/* Name + price */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">{product.name}</p>
                  <p className="text-green-600 text-sm font-bold mt-0.5">
                    {formatPrice(product.price_retail * quantity)}
                  </p>
                  <p className="text-xs text-gray-400">{formatPrice(product.price_retail)} / {product.unit}</p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center bg-green-500 rounded-xl overflow-hidden flex-shrink-0">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="text-white font-bold text-lg w-9 h-9 flex items-center justify-center hover:bg-green-600"
                  >−</button>
                  <span className="text-white font-bold text-sm w-7 text-center">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="text-white font-bold text-lg w-9 h-9 flex items-center justify-center hover:bg-green-600"
                  >+</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bill summary — desktop: sticky right panel | mobile: below items */}
        <div className="mt-5 lg:mt-0 lg:sticky lg:top-24">
          <BillSummary />
        </div>
      </div>

      {/* Fixed checkout button — mobile only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-gray-50 pt-4">
        <button
          onClick={() => navigate('/checkout')}
          className="w-full flex items-center justify-between bg-green-500 hover:bg-green-600 text-white px-5 py-3.5 rounded-2xl shadow-lg font-semibold"
        >
          <span className="text-sm">Proceed to Checkout</span>
          <span>{formatPrice(totalAmount)}</span>
        </button>
      </div>
    </div>
  )
}
