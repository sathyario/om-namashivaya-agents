import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

interface ShopRequest {
  id: string
  email: string
  full_name: string
  phone: string
  shop_name: string
  shop_address: string
  shop_phone: string
  gstin?: string
}

export default function ShopRequests() {
  const [requests, setRequests] = useState<ShopRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState<string | null>(null)

  const fetchRequests = () => {
    setLoading(true)
    api.get<ShopRequest[]>('/admin/shop-requests')
      .then(res => setRequests(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchRequests() }, [])

  const approve = async (userId: string, shopName: string) => {
    if (!window.confirm(`Approve "${shopName}" as wholesale shop customer?`)) return
    setApproving(userId)
    try {
      await api.put(`/admin/users/${userId}/role`, { role: 'shop' })
      fetchRequests()
    } finally {
      setApproving(null)
    }
  }

  const reject = async (userId: string) => {
    setApproving(userId)
    try {
      await api.put(`/admin/users/${userId}/role`, { role: 'consumer' })
      fetchRequests()
    } finally {
      setApproving(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-2">Shop Access Requests</h1>
      <p className="text-sm text-gray-400 mb-6">
        These users signed up as shop owners. Verify their details and approve wholesale access.
      </p>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border rounded-xl h-32 animate-pulse" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          No pending shop requests
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="bg-white border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="font-semibold text-gray-900">{req.shop_name}</div>
                  <div className="text-sm text-gray-600">👤 {req.full_name} · {req.email}</div>
                  <div className="text-sm text-gray-600">📞 Personal: {req.phone}</div>
                  <div className="text-sm text-gray-600">📞 Shop: {req.shop_phone}</div>
                  <div className="text-sm text-gray-600">📍 {req.shop_address}</div>
                  {req.gstin && (
                    <div className="text-sm text-gray-600">🏛 GSTIN: {req.gstin}</div>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => approve(req.id, req.shop_name)}
                    disabled={approving === req.id}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => reject(req.id)}
                    disabled={approving === req.id}
                    className="border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50"
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
