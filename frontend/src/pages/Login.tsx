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

  const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50'

  if (registered) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-sm text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-lg font-bold text-gray-900">Account Created!</h2>
          {isShop ? (
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Your shop account request has been submitted. The owner will verify your
              details and activate wholesale access. You'll be contacted on the phone provided.
            </p>
          ) : (
            <p className="text-gray-500 text-sm mt-2">
              Your account is ready. You can now sign in and start shopping.
            </p>
          )}
          <button
            onClick={() => { setRegistered(false); setMode('login') }}
            className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold text-sm"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo + title */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🙏</div>
          <h1 className="text-xl font-bold text-gray-900">Om Namashivaya Agents</h1>
          <p className="text-gray-400 text-sm mt-1">Premium FMCG Distributor</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

          {/* Tab toggle */}
          <div className="flex border-b border-gray-100 mb-6">
            {(['login', 'register'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors ${
                  mode === m
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">

            {mode === 'register' && (
              <>
                {/* Role selector */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">I am a:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsShop(false)}
                      className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                        !isShop
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-green-300'
                      }`}
                    >
                      🛒 Regular Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsShop(true)}
                      className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                        isShop
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-green-300'
                      }`}
                    >
                      🏪 Shop / Business
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                  <input required value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    className={inputCls} placeholder="Your full name" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                  <input required type="tel" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className={inputCls} placeholder="10-digit mobile number" />
                </div>

                {/* Shop-specific fields */}
                {isShop && (
                  <div className="space-y-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                      Shop Details — for wholesale access
                    </p>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Shop Name</label>
                      <input required value={form.shop_name}
                        onChange={e => setForm(f => ({ ...f, shop_name: e.target.value }))}
                        className={inputCls} placeholder="Name of your shop" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Shop Phone</label>
                      <input required type="tel" value={form.shop_phone}
                        onChange={e => setForm(f => ({ ...f, shop_phone: e.target.value }))}
                        className={inputCls} placeholder="Shop contact number" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Shop Address</label>
                      <textarea required rows={2} value={form.shop_address}
                        onChange={e => setForm(f => ({ ...f, shop_address: e.target.value }))}
                        className={inputCls} placeholder="Full shop address" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        GSTIN <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <input value={form.gstin}
                        onChange={e => setForm(f => ({ ...f, gstin: e.target.value }))}
                        className={inputCls} placeholder="15-digit GST number" maxLength={15} />
                    </div>
                    <p className="text-xs text-blue-600">
                      Wholesale access activated after owner verification.
                    </p>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input required type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className={inputCls} placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
              <input required type="password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className={inputCls} placeholder="••••••••" />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-3 rounded-2xl font-semibold text-sm mt-1"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-4">
            {mode === 'login' ? (
              <>Don't have an account?{' '}
                <button onClick={() => { setMode('register'); setError('') }} className="text-green-600 font-medium hover:underline">
                  Register
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError('') }} className="text-green-600 font-medium hover:underline">
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex justify-center gap-6 mt-5">
          {[['🔒', 'Secure'], ['✅', 'Verified'], ['⚡', 'Fast & Easy']].map(([icon, label]) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-xs text-gray-400 hover:text-gray-600">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
