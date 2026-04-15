import { useAllOrders } from '../../hooks/useOrders'
import { formatDate, formatPrice, statusColor } from '../../lib/utils'
import type { OrderStatus } from '../../types'

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled']

export default function AdminOrders() {
  const { orders, loading, updateStatus } = useAllOrders()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">All Orders</h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-400 py-20">No orders yet</div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div>
                  <span className="font-medium text-gray-900">Order #{order.id}</span>
                  <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {order.order_type}
                  </span>
                </div>
                <select
                  value={order.status}
                  onChange={e => updateStatus(order.id, e.target.value)}
                  className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${statusColor[order.status]}`}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
              <div className="text-sm text-gray-600 mt-1">📞 {order.phone}</div>
              <div className="text-sm text-gray-600 truncate">📍 {order.delivery_address}</div>
              {order.notes && (
                <div className="text-sm text-gray-400 mt-1 italic">"{order.notes}"</div>
              )}
              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <span className="text-xs text-gray-400 uppercase">
                  {order.payment_method === 'cod' ? 'Cash on Delivery' : 'UPI'}
                </span>
                <span className="font-bold text-gray-900">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
