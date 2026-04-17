import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'

export default function Navbar() {
  const { profile, loading, signOut } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
    navigate('/')
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : (profile?.role?.[0] ?? '?').toUpperCase()

  const roleLabel: Record<string, string> = {
    admin: 'Administrator',
    shop: 'Shop / Business',
    consumer: 'Customer',
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-14 flex items-center justify-between">

        {/* Left: Logo + nav links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-gray-900 text-sm flex items-center gap-1.5 flex-shrink-0">
            🙏 <span className="hidden sm:inline">Om Namashivaya</span><span className="sm:hidden">ONA</span>
          </Link>

          <div className="hidden sm:flex items-center gap-5">
            <Link to="/products" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
              Products
            </Link>
            {!loading && profile && (
              <Link to="/orders" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
                My Orders
              </Link>
            )}
            {!loading && profile?.role === 'admin' && (
              <Link to="/admin" className="text-sm text-purple-600 font-medium hover:text-purple-800 transition-colors">
                Admin
              </Link>
            )}
            {!loading && profile?.role === 'shop' && (
              <Link to="/shop" className="text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors">
                Shop Portal
              </Link>
            )}
          </div>
        </div>

        {/* Right: Cart + Auth */}
        <div className="flex items-center gap-3">
          <Link to="/products" className="sm:hidden text-sm text-gray-500 hover:text-gray-900 font-medium">
            Products
          </Link>

          {/* Cart icon */}
          <Link to="/cart" className="relative p-1 text-gray-600 hover:text-gray-900 flex items-center">
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-green-500 text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          {/* Auth */}
          {!loading && (
            profile ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpen(v => !v)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0a2e2e] text-white text-xs font-bold flex items-center justify-center select-none">
                    {initials}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {profile.full_name?.split(' ')[0] || profile.role}
                  </span>
                  <span className="hidden md:block text-gray-400 text-xs">▾</span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {profile.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {roleLabel[profile.role] ?? profile.role}
                      </p>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      <Link
                        to="/orders"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        📦 My Orders
                      </Link>
                      {profile.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
                        >
                          ⚙️ Admin Panel
                        </Link>
                      )}
                      {profile.role === 'shop' && (
                        <Link
                          to="/shop"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                        >
                          🏪 Shop Portal
                        </Link>
                      )}
                    </div>

                    {/* Sign out */}
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        🚪 Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                Login
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  )
}
