import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useOrders } from '../hooks/useOrders'
import { useCart } from '../hooks/useCart'
import { formatDate, formatPrice } from '../lib/utils'
import type { Order } from '../types'
import { useSearchParams } from 'react-router-dom'

type FilterTab = 'all' | 'active' | 'delivered'

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  pending:    { label: 'Pending',    cls: 'bg-yellow-100 text-yellow-700' },
  confirmed:  { label: 'Confirmed',  cls: 'bg-blue-100 text-blue-700' },
  dispatched: { label: 'On the way', cls: 'bg-orange-100 text-orange-600' },
  delivered:  { label: 'Delivered',  cls: 'bg-green-100 text-green-700' },
  cancelled:  { label: 'Cancelled',  cls: 'bg-red-100 text-red-600' },
}

function isActive(order: Order) {
  return ['pending', 'confirmed', 'dispatched'].includes(order.status)
}

export default function Orders() {
  const { orders, loading } = useOrders()
  const { addToCart } = useCart()
  const [searchParams] = useSearchParams()
  const success = searchParams.get('success')
  const [filter, setFilter] = useState<FilterTab>('all')

  const filtered = orders.filter(o => {
    if (filter === 'active') return isActive(o)
    if (filter === 'delivered') return o.status === 'delivered'
    return true
  })

  const activeCount = orders.filter(isActive).length

  const handleReorder = (order: Order) => {
    if (!order.items) return
    order.items.forEach(item => {
      if (item.product) addToCart(item.product, item.quantity)
    })
  }

  const TABS: { key: FilterTab; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: orders.length },
    { key: 'active', label: 'Active', count: activeCount },
    { key: 'delivered', label: 'Delivered' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="mb-1">
          <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-400 mt-0.5">View and manage your recent purchases</p>
        </div>

        {/* Success banner */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-4 mt-4 flex items-start gap-3"
            >
              <span className="text-xl">✅</span>
              <div>
                <p className="font-semibold text-green-800 text-sm">Order placed successfully!</p>
                <p className="text-green-600 text-xs mt-0.5">We'll confirm it and call you shortly.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter tabs */}
        <div className="flex gap-2 mt-5 mb-4 border-b border-gray-100">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                filter === tab.key
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  filter === tab.key ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading skeletons */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="text-gray-700 font-semibold">
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {filter === 'all'
                ? 'Your orders will appear here once you place them'
                : `You don't have any ${filter} orders right now`}
            </p>
            <Link
              to="/products"
              className="mt-5 inline-block bg-green-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          /* Order list */
          <div className="space-y-3">
            {filtered.map(order => {
              const status = STATUS_CONFIG[order.status] ?? { label: order.status, cls: 'bg-gray-100 text-gray-600' }
              const delivered = order.status === 'delivered'

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                >
                  {/* Order header */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">
                      #ORD-{String(order.id).padStart(5, '0')}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.cls}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>

                  {/* Items list */}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-base">
                              {item.product?.category_id === 1 ? '⚡' : '🌿'}
                            </span>
                            <span className="text-gray-700 line-clamp-1">
                              {item.product?.name ?? `Product #${item.product_id}`}
                            </span>
                            <span className="text-xs text-gray-400">× {item.quantity}</span>
                          </div>
                          <span className="text-gray-900 font-medium flex-shrink-0 ml-2">
                            {formatPrice(item.subtotal)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <div>
                      <p className="text-xs text-gray-400">Total Amount</p>
                      <p className="text-sm font-bold text-gray-900">{formatPrice(order.total_amount)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.order_type === 'wholesale' && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                          Wholesale
                        </span>
                      )}
                      {delivered && order.items && order.items.length > 0 ? (
                        <button
                          onClick={() => handleReorder(order)}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                        >
                          Reorder
                        </button>
                      ) : isActive(order) ? (
                        <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                          Track Order
                        </span>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
