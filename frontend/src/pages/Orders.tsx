import { useSearchParams } from 'react-router-dom'
import { useOrders } from '../hooks/useOrders'
import { formatDate, formatPrice, statusColor } from '../lib/utils'

export default function Orders() {
  const { orders, loading } = useOrders()
  const [searchParams] = useSearchParams()
  const success = searchParams.get('success')

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-4">My Orders</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-green-700 text-sm">
          ✅ Order placed successfully! We'll confirm it shortly.
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border rounded-xl h-24 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-400 py-20">No orders yet</div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Order #{order.id}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[order.status]}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <span className="text-xs text-gray-400 uppercase">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'UPI'}</span>
                <span className="font-bold text-gray-900">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
