import { Link } from 'react-router-dom'
import { Product } from '../types'
import { formatPrice, stockLabel } from '../lib/utils'
import { useCart } from '../hooks/useCart'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart()
  const stock = stockLabel(product.stock_quantity)

  return (
    <div className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/products/${product.id}`}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-32 object-cover" />
        ) : (
          <div className="w-full h-32 bg-gray-50 flex items-center justify-center text-4xl">
            {product.category_id === 1 ? '⚡' : '🛒'}
          </div>
        )}
      </Link>

      <div className="p-3">
        <Link to={`/products/${product.id}`}>
          <div className="font-medium text-sm text-gray-900 line-clamp-2 leading-snug">{product.name}</div>
        </Link>

        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-blue-600 font-bold text-sm">
            {formatPrice(product.price_retail)}
            <span className="text-gray-400 font-normal text-xs ml-0.5">/{product.unit}</span>
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${stock.color}`}>
            {stock.label}
          </span>
        </div>

        {product.stock_quantity > 0 && (
          <button
            onClick={() => addToCart(product, 1)}
            className="mt-2 w-full bg-blue-600 text-white text-xs py-1.5 rounded-lg hover:bg-blue-700"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  )
}
