import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product } from '../types'
import { formatPrice } from '../lib/utils'
import { useCart } from '../hooks/useCart'

interface Props {
  product: Product
  showWholesale?: boolean
}

function ProductImage({ product }: { product: Product }) {
  const fallback = product.category_id === 1 ? '⚡' : '🛒'
  const bg = product.category_id === 1 ? 'bg-blue-50' : 'bg-orange-50'

  if (!product.image_url) {
    return (
      <div className={`w-full h-36 ${bg} flex items-center justify-center text-5xl`}>
        {fallback}
      </div>
    )
  }

  return (
    <img
      src={product.image_url}
      alt={product.name}
      className="w-full h-36 object-contain p-2"
      onError={e => {
        const target = e.currentTarget
        target.style.display = 'none'
        const div = document.createElement('div')
        div.className = `w-full h-36 ${bg} flex items-center justify-center text-5xl`
        div.textContent = fallback
        target.parentNode?.insertBefore(div, target)
      }}
    />
  )
}

// Extract battery type tag from product name
function getBatteryTag(name: string): string | null {
  const lower = name.toLowerCase()
  if (lower.includes(' d ') || lower.includes(' d-') || lower.includes('d size') || lower.includes('d-size')) return 'D'
  if (lower.includes(' c ') || lower.includes(' c-') || lower.includes('c size')) return 'C'
  if (lower.includes('9v') || lower.includes('9 v')) return '9V'
  if (lower.includes('aaa')) return 'AAA'
  if (lower.includes('aa')) return 'AA'
  return null
}

export default function ProductCard({ product, showWholesale }: Props) {
  const { cart, addToCart, updateQuantity } = useCart()
  const cartItem = cart.find(i => i.product.id === product.id)
  const qty = cartItem?.quantity ?? 0
  const price = showWholesale && product.price_wholesale ? product.price_wholesale : product.price_retail
  const isOutOfStock = product.stock_quantity === 0
  const batteryTag = product.category_id === 1 ? getBatteryTag(product.name) : null

  // Savings % when wholesale price applies
  const savingsPct = showWholesale && product.price_wholesale && product.price_wholesale < product.price_retail
    ? Math.round((1 - product.price_wholesale / product.price_retail) * 100)
    : null

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
      <Link to={`/products/${product.id}`} className="block relative">
        <ProductImage product={product} />
        {/* Savings badge */}
        {savingsPct && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
            {savingsPct}% OFF
          </span>
        )}
        {/* Low stock badge (no savings badge showing) */}
        {!savingsPct && product.stock_quantity > 0 && product.stock_quantity <= 5 && (
          <span className="absolute top-2 left-2 bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
            Only {product.stock_quantity} left
          </span>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Out of stock</span>
          </div>
        )}
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <Link to={`/products/${product.id}`} className="block flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-xs text-gray-400">{product.unit}</p>
            {batteryTag && (
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                {batteryTag}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">{product.name}</p>
        </Link>

        <div className="mt-2 flex items-end justify-between gap-1">
          <div>
            <p className="text-base font-bold text-gray-900">{formatPrice(price)}</p>
            {showWholesale && product.price_wholesale && product.price_wholesale < product.price_retail && (
              <p className="text-xs text-gray-400 line-through">{formatPrice(product.price_retail)}</p>
            )}
          </div>

          {!isOutOfStock && (
            <AnimatePresence mode="wait">
              {qty === 0 ? (
                <motion.button
                  key="add"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => addToCart(product, 1)}
                  className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-4 py-1.5 rounded-xl"
                >
                  ADD
                </motion.button>
              ) : (
                <motion.div
                  key="qty"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center bg-green-500 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => updateQuantity(product.id, qty - 1)}
                    className="text-white font-bold text-lg w-8 h-8 flex items-center justify-center hover:bg-green-600"
                  >−</button>
                  <span className="text-white font-bold text-sm w-6 text-center">{qty}</span>
                  <button
                    onClick={() => updateQuantity(product.id, qty + 1)}
                    disabled={qty >= product.stock_quantity}
                    className="text-white font-bold text-lg w-8 h-8 flex items-center justify-center hover:bg-green-600 disabled:opacity-50"
                  >+</button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}
