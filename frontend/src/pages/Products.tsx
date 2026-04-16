import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { formatPrice } from '../lib/utils'
import ProductCard from '../components/ProductCard'

const CATEGORY_TABS = [
  { label: 'All', value: '' },
  { label: '⚡ Electronics', value: 'electronics' },
  { label: '🌿 Food', value: 'food' },
]

const BRAND_TABS = [
  { label: 'All Brands', value: '' },
  { label: 'Panasonic', value: 'panasonic' },
  { label: 'Eveready', value: 'eveready' },
  { label: 'Healthy Grocer', value: 'healthy grocer' },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { totalItems, totalAmount } = useCart()

  const categorySlug = searchParams.get('category') || ''
  const categoryId = categorySlug === 'electronics' ? 1 : categorySlug === 'food' ? 2 : undefined

  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [brand, setBrand] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)

  const { products, loading } = useProducts({ categoryId })
  const showWholesale = profile?.role === 'shop' || profile?.role === 'admin'

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (brand && !p.name.toLowerCase().includes(brand)) return false
      if (inStockOnly && p.stock_quantity === 0) return false
      return true
    })
  }, [products, search, brand, inStockOnly])

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* Top search + category bar — sticky */}
      <div className="bg-white sticky top-14 z-30 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-3 pb-2">
          <div className="relative mb-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-gray-100 rounded-xl pl-9 pr-8 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >✕</button>
            )}
          </div>

          {/* Category tabs — mobile only (desktop uses sidebar) */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 lg:hidden">
            {CATEGORY_TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setSearchParams(tab.value ? { category: tab.value } : {})}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  categorySlug === tab.value
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <div className="lg:flex lg:gap-6">

          {/* ── Desktop sidebar ── */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-36 space-y-6">

              {/* Category filter */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Category</p>
                <div className="space-y-1">
                  {CATEGORY_TABS.map(tab => (
                    <button
                      key={tab.value}
                      onClick={() => setSearchParams(tab.value ? { category: tab.value } : {})}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        categorySlug === tab.value
                          ? 'bg-green-50 text-green-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand filter */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Brand</p>
                <div className="space-y-1">
                  {BRAND_TABS.map(b => (
                    <button
                      key={b.value}
                      onClick={() => setBrand(b.value)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        brand === b.value
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* In-stock toggle */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Availability</p>
                <label className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-green-500"
                  />
                  <span className="text-sm text-gray-700">In stock only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* Mobile: brand + in-stock filters */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide lg:hidden">
              {BRAND_TABS.map(b => (
                <button
                  key={b.value}
                  onClick={() => setBrand(b.value)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    brand === b.value
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {b.label}
                </button>
              ))}
              <button
                onClick={() => setInStockOnly(v => !v)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  inStockOnly
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                }`}
              >
                In stock
              </button>
            </div>

            {/* Results count */}
            {!loading && (
              <p className="text-xs text-gray-400 mb-3">
                {filtered.length} product{filtered.length !== 1 ? 's' : ''}
                {search && ` for "${search}"`}
              </p>
            )}

            {/* Product grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-52 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-3">🔍</div>
                <p className="text-gray-500 font-medium">No products found</p>
                <p className="text-gray-400 text-sm mt-1">Try a different search or filter</p>
                <button
                  onClick={() => { setSearch(''); setBrand(''); setInStockOnly(false) }}
                  className="mt-4 text-green-600 text-sm font-medium underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.02 } } }}
              >
                {filtered.map(p => (
                  <motion.div
                    key={p.id}
                    variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                  >
                    <ProductCard product={p} showWholesale={showWholesale} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky cart bar */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4"
          >
            <div className="max-w-7xl mx-auto">
              <button
                onClick={() => navigate('/cart')}
                className="w-full flex items-center justify-between bg-green-500 hover:bg-green-600 text-white px-5 py-3.5 rounded-2xl shadow-lg"
              >
                <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                  {totalItems} item{totalItems !== 1 ? 's' : ''}
                </span>
                <span className="font-semibold text-sm">View Cart</span>
                <span className="font-bold">{formatPrice(totalAmount)}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
