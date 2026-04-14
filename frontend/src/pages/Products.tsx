import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categorySlug = searchParams.get('category') || ''

  const categoryId = categorySlug === 'electronics' ? 1 : categorySlug === 'food' ? 2 : undefined
  const { products, loading } = useProducts({ categoryId })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { label: 'All', value: '' },
            { label: '⚡ Electronics', value: 'electronics' },
            { label: '🛒 Food', value: 'food' },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setSearchParams(tab.value ? { category: tab.value } : {})}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                categorySlug === tab.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-48 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-400 py-20">No products found</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
