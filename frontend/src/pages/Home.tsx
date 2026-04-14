import { Link } from 'react-router-dom'

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: '⚡',
    description: 'Batteries, inverters, tape, testers and more',
    bg: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
  },
  {
    name: 'Food (Pirangoon)',
    slug: 'food',
    icon: '🛒',
    description: 'Ghee and homemaking food essentials',
    bg: 'bg-orange-50 border-orange-200',
    iconBg: 'bg-orange-100',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Om Namashivaya Agents</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Your trusted supplier for electronics &amp; food essentials
        </p>
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <Link
            to="/products"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Browse Products
          </Link>
          <Link
            to="/auth/login"
            className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Login / Register
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Shop by Category</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className={`border rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow ${cat.bg}`}
            >
              <span className={`text-2xl w-12 h-12 flex items-center justify-center rounded-lg ${cat.iconBg}`}>
                {cat.icon}
              </span>
              <div>
                <div className="font-semibold text-gray-900">{cat.name}</div>
                <div className="text-sm text-gray-500 mt-1">{cat.description}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Shop owner CTA */}
        <div className="mt-8 bg-gray-900 text-white rounded-xl p-5">
          <div className="font-semibold">Are you a shop owner?</div>
          <div className="text-sm text-gray-400 mt-1">
            Login to see wholesale prices and place bulk orders.
          </div>
          <Link
            to="/shop"
            className="mt-3 inline-block bg-white text-gray-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Go to Shop Portal →
          </Link>
        </div>
      </div>
    </div>
  )
}
