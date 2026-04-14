import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useProduct } from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'
import { formatPrice, stockLabel } from '../lib/utils'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { product, loading } = useProduct(Number(id))
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>
  if (!product) return <div className="p-8 text-center text-gray-400">Product not found</div>

  const stock = stockLabel(product.stock_quantity)

  const handleAdd = () => {
    addToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-56 object-cover rounded-xl mb-6"
        />
      ) : (
        <div className="w-full h-56 bg-gray-100 rounded-xl mb-6 flex items-center justify-center text-5xl">
          {product.category_id === 1 ? '⚡' : '🛒'}
        </div>
      )}

      <span className={`text-xs font-medium px-2 py-1 rounded-full ${stock.color}`}>
        {stock.label}
      </span>

      <h1 className="text-xl font-bold text-gray-900 mt-2">{product.name}</h1>
      {product.description && (
        <p className="text-gray-500 text-sm mt-2">{product.description}</p>
      )}

      <div className="mt-4 text-2xl font-bold text-blue-600">
        {formatPrice(product.price_retail)}
        <span className="text-sm text-gray-400 font-normal ml-1">/ {product.unit}</span>
      </div>

      {product.stock_quantity > 0 && (
        <div className="mt-6 flex items-center gap-3">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="px-3 py-2 text-gray-600 hover:bg-gray-50"
            >−</button>
            <span className="px-4 py-2 font-medium">{qty}</span>
            <button
              onClick={() => setQty(q => Math.min(product.stock_quantity, q + 1))}
              className="px-3 py-2 text-gray-600 hover:bg-gray-50"
            >+</button>
          </div>
          <button
            onClick={handleAdd}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {added ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      )}

      <button
        onClick={() => navigate('/cart')}
        className="mt-3 w-full border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50"
      >
        View Cart
      </button>
    </div>
  )
}
