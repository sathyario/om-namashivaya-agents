import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProduct } from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../lib/utils'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { product, loading } = useProduct(Number(id))
  const { cart, addToCart, updateQuantity } = useCart()
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          <div className="w-full h-72 lg:h-96 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="mt-6 lg:mt-0 space-y-4">
            <div className="h-6 bg-gray-100 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-3">📦</div>
        <p className="text-gray-500 font-medium">Product not found</p>
        <button onClick={() => navigate('/products')} className="mt-4 text-green-600 text-sm font-medium underline">
          Back to products
        </button>
      </div>
    )
  }

  const cartItem = cart.find(i => i.product.id === product.id)
  const qty = cartItem?.quantity ?? 0
  const isOutOfStock = product.stock_quantity === 0
  const fallbackBg = product.category_id === 1 ? 'bg-blue-50' : 'bg-orange-50'
  const fallbackIcon = product.category_id === 1 ? '⚡' : '🌿'

  const QtyControls = () => (
    <AnimatePresence mode="wait">
      {qty === 0 ? (
        <motion.button
          key="add"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={() => addToCart(product, 1)}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold text-sm"
        >
          ADD TO CART
        </motion.button>
      ) : (
        <motion.div
          key="qty"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="flex items-center gap-3 w-full"
        >
          <div className="flex items-center bg-green-500 rounded-2xl overflow-hidden">
            <button onClick={() => updateQuantity(product.id, qty - 1)}
              className="text-white font-bold text-xl w-12 h-12 flex items-center justify-center hover:bg-green-600">−</button>
            <span className="text-white font-bold text-lg w-10 text-center">{qty}</span>
            <button onClick={() => updateQuantity(product.id, qty + 1)}
              disabled={qty >= product.stock_quantity}
              className="text-white font-bold text-xl w-12 h-12 flex items-center justify-center hover:bg-green-600 disabled:opacity-50">+</button>
          </div>
          <button
            onClick={() => navigate('/cart')}
            className="flex-1 border-2 border-green-500 text-green-600 py-3 rounded-2xl font-semibold text-sm hover:bg-green-50"
          >
            View Cart →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 pb-28 lg:pb-10">

      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-500 text-sm mb-6 hover:text-gray-800">
        ← Back
      </button>

      {/* Desktop: 2-col side-by-side | Mobile: stacked */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">

        {/* Image column */}
        <div className="lg:sticky lg:top-24">
          <div className={`w-full h-64 lg:h-[480px] rounded-2xl overflow-hidden ${fallbackBg} flex items-center justify-center`}>
            {product.image_url && !imgError ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain p-6"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-8xl lg:text-9xl">{fallbackIcon}</span>
            )}
          </div>
        </div>

        {/* Info column */}
        <div className="mt-6 lg:mt-0">
          {isOutOfStock ? (
            <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">Out of stock</span>
          ) : product.stock_quantity <= 5 ? (
            <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
              Only {product.stock_quantity} left
            </span>
          ) : (
            <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">In stock</span>
          )}

          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-3 leading-snug">{product.name}</h1>
          <p className="text-sm text-gray-400 mt-1">{product.unit}</p>

          {product.description && (
            <p className="text-gray-500 text-sm mt-4 leading-relaxed">{product.description}</p>
          )}

          <div className="mt-5 mb-6">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price_retail)}</span>
            <span className="text-gray-400 text-sm ml-2">/ {product.unit}</span>
          </div>

          {/* ADD controls — inline on desktop */}
          {!isOutOfStock && (
            <div className="hidden lg:flex items-center gap-3 mb-6">
              <QtyControls />
            </div>
          )}

          {/* Delivery info card */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5 border border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>💰</span><span>Cash on Delivery — pay when order arrives</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>✅</span><span>Genuine — {product.category_id === 1 ? 'Panasonic / Eveready' : 'Healthy Grocer'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-green-600 font-medium">
              <span>🚚</span><span>Free delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom bar — mobile only */}
      {!isOutOfStock && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <QtyControls />
          </div>
        </div>
      )}
    </div>
  )
}
