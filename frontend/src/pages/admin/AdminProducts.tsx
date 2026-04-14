import { useState } from 'react'
import { useProducts } from '../../hooks/useProducts'
import { api } from '../../lib/api'
import { formatPrice } from '../../lib/utils'
import { Product } from '../../types'

interface ProductForm {
  name: string
  description: string
  category_id: string
  price_retail: string
  price_wholesale: string
  stock_quantity: string
  unit: string
}

const EMPTY_FORM: ProductForm = {
  name: '', description: '', category_id: '1',
  price_retail: '', price_wholesale: '', stock_quantity: '', unit: 'piece',
}

export default function AdminProducts() {
  const { products, loading } = useProducts()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/products', {
        ...form,
        category_id: Number(form.category_id),
        price_retail: Number(form.price_retail),
        price_wholesale: form.price_wholesale ? Number(form.price_wholesale) : null,
        stock_quantity: Number(form.stock_quantity),
      })
      setShowForm(false)
      setForm(EMPTY_FORM)
      window.location.reload()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this product?')) return
    await api.delete(`/products/${id}`)
    window.location.reload()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-white border rounded-xl p-5 mb-6 space-y-3">
          <h2 className="font-semibold text-gray-900 mb-3">New Product</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Product name" />
            </div>
            <div className="col-span-2">
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Description (optional)" />
            </div>
            <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm">
              <option value="1">⚡ Electronics</option>
              <option value="2">🛒 Food (Pirangoon)</option>
            </select>
            <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm">
              {['piece', 'dozen', 'box', 'kg', 'litre', 'packet'].map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <input required type="number" value={form.price_retail} onChange={e => setForm(f => ({ ...f, price_retail: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm" placeholder="Retail price (₹)" />
            <input type="number" value={form.price_wholesale} onChange={e => setForm(f => ({ ...f, price_wholesale: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm" placeholder="Wholesale price (₹)" />
            <input required type="number" value={form.stock_quantity} onChange={e => setForm(f => ({ ...f, stock_quantity: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm col-span-2" placeholder="Stock quantity" />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Product'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="border text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Product list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((p: Product) => (
            <div key={p.id} className="bg-white border rounded-xl p-4 flex items-center gap-3">
              <div className="text-xl">{p.category_id === 1 ? '⚡' : '🛒'}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900">{p.name}</div>
                <div className="text-xs text-gray-500">
                  Retail: {formatPrice(p.price_retail)}
                  {p.price_wholesale && ` · Wholesale: ${formatPrice(p.price_wholesale)}`}
                  {' · '}Stock: <span className={p.stock_quantity === 0 ? 'text-red-500' : 'text-green-600'}>{p.stock_quantity} {p.unit}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(p.id)}
                className="text-red-400 hover:text-red-600 text-sm px-2 py-1">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
