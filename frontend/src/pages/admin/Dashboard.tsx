import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { formatPrice } from '../../lib/utils'

interface Stats {
  total_orders: number
  pending_orders: number
  total_revenue: number
  low_stock_products: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    api.get<Stats>('/admin/stats').then(res => setStats(res.data)).catch(() => {})
  }, [])

  const cards = [
    { label: 'Total Orders', value: stats?.total_orders ?? '—', link: '/admin/orders', color: 'bg-blue-50 text-blue-700' },
    { label: 'Pending Orders', value: stats?.pending_orders ?? '—', link: '/admin/orders?status=pending', color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Total Revenue', value: stats ? formatPrice(stats.total_revenue) : '—', link: '/admin/orders', color: 'bg-green-50 text-green-700' },
    { label: 'Low Stock Items', value: stats?.low_stock_products ?? '—', link: '/admin/inventory', color: 'bg-red-50 text-red-700' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {cards.map(card => (
          <Link key={card.label} to={card.link} className={`rounded-xl p-5 ${card.color} hover:opacity-90`}>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-sm mt-1 opacity-75">{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h2>
        {[
          { label: '+ Add New Product', to: '/admin/products?action=add' },
          { label: '📦 Manage Inventory', to: '/admin/inventory' },
          { label: '🧾 View All Orders', to: '/admin/orders' },
          { label: '🏪 Shop Access Requests', to: '/admin/shop-requests' },
          { label: '👥 Manage Users', to: '/admin/users' },
        ].map(action => (
          <Link
            key={action.label}
            to={action.to}
            className="block bg-white border rounded-xl px-4 py-3 text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600"
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
