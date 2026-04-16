import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'

export default function Navbar() {
  const { profile, loading, signOut } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
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
          {/* Mobile: Products link */}
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
              <div className="flex items-center gap-2">
                <span className="hidden md:block text-xs text-gray-400 max-w-[120px] truncate">
                  {profile.full_name || profile.role}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
                >
                  Sign out
                </button>
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
