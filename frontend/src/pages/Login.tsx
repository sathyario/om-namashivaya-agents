import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type Mode = 'login' | 'register'

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [isShop, setIsShop] = useState(false)
  const [form, setForm] = useState({
    email: '', password: '', full_name: '', phone: '',
    shop_name: '', shop_address: '', shop_phone: '', gstin: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        })
        if (error) throw error
        navigate('/')
      } else {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.full_name,
              phone: form.phone,
              // Shop request info — admin will review and approve
              ...(isShop && {
                shop_request: true,
                shop_name: form.shop_name,
                shop_address: form.shop_address,
                shop_phone: form.shop_phone,
                gstin: form.gstin,
              }),
            },
          },
        })
        if (error) throw error
        setRegistered(true)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (registered) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-lg font-bold text-gray-900">Account Created!</h2>
        {isShop ? (
          <p className="text-gray-500 text-sm mt-2">
            Your shop account request has been sent. The owner will verify your
            details and activate wholesale access. You will be notified once approved.
          </p>
        ) : (
          <p className="text-gray-500 text-sm mt-2">
            Your account is ready. You can now login and start shopping.
          </p>
        )}
        <button
          onClick={() => { setRegistered(false); setMode('login') }}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium"
        >
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-10">
      <div className="text-center mb-6">
        <div className="text-3xl mb-2">🙏</div>
        <h1 className="text-xl font-bold text-gray-900">Om Namashivaya Agents</h1>
        <p className="text-gray-400 text-sm mt-1">
          {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {mode === 'register' && (
          <>
            {/* Shop or Consumer toggle */}
            <div className="bg-gray-50 border rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">I am signing up as:</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsShop(false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    !isShop
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  Regular Customer
                </button>
                <button
                  type="button"
                  onClick={() => setIsShop(true)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    isShop
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  Shop / Business
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                required
                value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mobile number"
              />
            </div>

            {/* Shop-specific fields */}
            {isShop && (
              <div className="space-y-3 border-t pt-4">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Shop Details — for wholesale access
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                  <input
                    required
                    value={form.shop_name}
                    onChange={e => setForm(f => ({ ...f, shop_name: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Name of your shop"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shop Phone</label>
                  <input
                    required
                    type="tel"
                    value={form.shop_phone}
                    onChange={e => setForm(f => ({ ...f, shop_phone: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Shop contact number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shop Address</label>
                  <textarea
                    required
                    rows={2}
                    value={form.shop_address}
                    onChange={e => setForm(f => ({ ...f, shop_address: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full shop address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GSTIN <span className="text-gray-400 font-normal">(optional but recommended)</span>
                  </label>
                  <input
                    value={form.gstin}
                    onChange={e => setForm(f => ({ ...f, gstin: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="15-digit GST number"
                    maxLength={15}
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                  Your wholesale access will be activated after verification by the owner.
                  You will be contacted on the shop phone number provided.
                </div>
              </div>
            )}
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            required
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-500">
        {mode === 'login' ? (
          <>Don't have an account?{' '}
            <button onClick={() => setMode('register')} className="text-blue-600 hover:underline">Register</button>
          </>
        ) : (
          <>Already have an account?{' '}
            <button onClick={() => setMode('login')} className="text-blue-600 hover:underline">Sign In</button>
          </>
        )}
      </div>

      <div className="mt-4 text-center">
        <Link to="/" className="text-xs text-gray-400 hover:underline">← Back to Home</Link>
      </div>
    </div>
  )
}
