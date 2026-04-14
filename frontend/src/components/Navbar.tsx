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
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold text-gray-900 text-sm">
          🙏 Om Namashivaya
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/products" className="text-sm text-gray-600 hover:text-gray-900">Products</Link>

          {!loading && (
            <>
              {profile?.role === 'admin' && (
                <Link to="/admin" className="text-sm text-purple-600 font-medium hover:text-purple-800">Admin</Link>
              )}
              {profile?.role === 'shop' && (
                <Link to="/shop" className="text-sm text-blue-600 font-medium hover:text-blue-800">Shop Portal</Link>
              )}
            </>
          )}

          <Link to="/cart" className="relative text-gray-600 hover:text-gray-900">
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {!loading && (
            profile ? (
              <button
                onClick={handleSignOut}
                className="text-xs text-gray-400 hover:text-gray-700"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/auth/login"
                className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700"
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
