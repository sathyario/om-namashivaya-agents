import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

const features = [
  {
    icon: '✅',
    title: 'Genuine Products',
    desc: 'Only authentic Panasonic, Eveready & Healthy Grocer — no fakes, no compromises.',
  },
  {
    icon: '💰',
    title: 'Cash on Delivery',
    desc: 'No online payment required. Pay when your order arrives at your door.',
  },
  {
    icon: '🏪',
    title: 'Wholesale Pricing',
    desc: 'Shop owners get special bulk pricing on every order, every time.',
  },
]

const stats = [
  { num: '14+', label: 'Products in Stock' },
  { num: '₹0', label: 'Delivery Fee' },
  { num: 'COD', label: 'Cash on Delivery' },
]

const categories = [
  {
    slug: 'electronics',
    icon: '⚡',
    title: 'Electronics',
    subtitle: 'Batteries & More',
    description: 'Panasonic Evolta & Eveready Ultima — AA, AAA, 9V, C, D size batteries for every need.',
    gradient: 'from-blue-600 to-blue-800',
    lightBg: 'bg-blue-50',
    border: 'border-blue-100',
    items: ['AA Batteries', 'AAA Batteries', '9V Batteries', 'D-Size', 'C-Size'],
  },
  {
    slug: 'food',
    icon: '🌿',
    title: 'Food (Pirangoon)',
    subtitle: 'Pure & Natural',
    description: 'Premium Healthy Grocer hing (asafoetida) — 25g, 50g, 100g packs for your kitchen.',
    gradient: 'from-orange-500 to-orange-700',
    lightBg: 'bg-orange-50',
    border: 'border-orange-100',
    items: ['Hing 25g', 'Hing 50g', 'Hing 100g'],
  },
]

export default function Home() {
  const { profile } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO SECTION ── */}
      <section className="bg-[#0a2e2e] relative overflow-hidden">
        {/* Background subtle pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #22c55e 0%, transparent 50%), radial-gradient(circle at 75% 20%, #16a34a 0%, transparent 40%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 pt-16 pb-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">

            {/* Left — copy */}
            <div className="text-center lg:text-left pb-10 lg:pb-20">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6"
              >
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Premium FMCG Distributor
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl lg:text-6xl font-extrabold text-white leading-tight"
              >
                Your Trusted Distributor for{' '}
                <span className="text-green-400">Batteries</span>{' '}
                &amp; Food Essentials
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-5 text-gray-300 text-base lg:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0"
              >
                Om Namashivaya Agents delivers authentic Panasonic/Eveready batteries and
                premium Healthy Grocer hing directly to your store with zero delivery fees.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              >
                <Link
                  to="/products"
                  className="bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-3.5 rounded-full text-sm transition-colors flex items-center justify-center gap-2"
                >
                  Browse Products →
                </Link>
                {!profile ? (
                  <Link
                    to="/auth/login"
                    className="border border-white/30 hover:border-white/60 text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
                  >
                    Login / Sign Up
                  </Link>
                ) : (
                  <Link
                    to="/products"
                    className="border border-white/30 hover:border-white/60 text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    View All Products
                  </Link>
                )}
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start"
              >
                {['🚚 Free Delivery', '💰 Cash on Delivery', '✅ Genuine Products'].map(badge => (
                  <span key={badge} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs px-3 py-1.5 rounded-full">
                    {badge}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — warehouse image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a2e2e] via-transparent to-transparent z-10 rounded-2xl" />
                <div className="w-full h-96 bg-[#0d3535] rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
                  <div className="text-center">
                    <div className="text-8xl mb-4">⚡</div>
                    <div className="text-white/60 text-sm">Panasonic · Eveready · Healthy Grocer</div>
                  </div>
                </div>
                {/* Floating cards */}
                <div className="absolute -left-6 top-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white text-sm font-medium shadow-xl">
                  <div className="text-2xl mb-1">🔋</div>
                  <div className="font-bold">AA Batteries</div>
                  <div className="text-green-400 font-bold">₹180/pack</div>
                </div>
                <div className="absolute -right-4 bottom-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white text-sm font-medium shadow-xl">
                  <div className="text-2xl mb-1">🌿</div>
                  <div className="font-bold">Hing 100g</div>
                  <div className="text-green-400 font-bold">₹85/pack</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-green-500">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-8 lg:gap-16">
            {stats.map((s, i) => (
              <div key={i} className="text-center text-white">
                <div className="text-xl lg:text-2xl font-extrabold">{s.num}</div>
                <div className="text-xs lg:text-sm text-green-100">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="text-center mb-8">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">What We Sell</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className="block rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100"
              >
                {/* Gradient header */}
                <div className={`bg-gradient-to-br ${cat.gradient} px-6 py-8 text-white relative overflow-hidden`}>
                  <div className="absolute -right-4 -top-4 text-8xl opacity-20 group-hover:opacity-30 transition-opacity">
                    {cat.icon}
                  </div>
                  <span className="text-5xl">{cat.icon}</span>
                  <p className="font-extrabold text-xl mt-3">{cat.title}</p>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mt-0.5">{cat.subtitle}</p>
                  <p className="text-white/80 text-sm mt-2 leading-relaxed">{cat.description}</p>
                </div>

                {/* Items strip */}
                <div className={`${cat.lightBg} px-6 py-4 border-t ${cat.border}`}>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map(item => (
                      <span key={item} className="text-xs text-gray-700 bg-white rounded-full px-3 py-1 border border-gray-200 shadow-sm font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 text-xs font-bold text-gray-500 group-hover:text-green-600 transition-colors flex items-center gap-1">
                    Shop {cat.title} →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Why Om Namashivaya?</p>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Built for Your Business</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-bold text-gray-900 mt-3 text-base">{f.title}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOP OWNER CTA ── */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Shop owner dark card */}
          {(!profile || profile.role === 'consumer') && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-900 rounded-3xl p-8 text-white"
            >
              <div className="text-3xl mb-3">🏪</div>
              <h3 className="text-xl font-bold">Are you a Shop Owner?</h3>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                Get wholesale prices, bulk order support, and priority service for your business.
                Register as a shop owner to unlock exclusive pricing.
              </p>
              <Link
                to={profile ? '/shop' : '/auth/login'}
                className="mt-6 inline-flex items-center gap-2 bg-white text-gray-900 text-sm font-bold px-6 py-3 rounded-full hover:bg-green-50 transition-colors"
              >
                {profile ? 'Go to Shop Portal' : 'Register as Shop Owner'} →
              </Link>
            </motion.div>
          )}

          {/* Browse products green card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`bg-green-500 rounded-3xl p-8 text-white ${(!profile || profile.role === 'consumer') ? '' : 'lg:col-span-2'}`}
          >
            <div className="text-3xl mb-3">🛒</div>
            <h3 className="text-xl font-bold">Browse All Products</h3>
            <p className="text-green-100 text-sm mt-2 leading-relaxed">
              14+ products — Panasonic, Eveready batteries in all sizes, and Healthy Grocer hing powder.
              Free delivery on all orders.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 bg-white text-green-700 text-sm font-bold px-6 py-3 rounded-full hover:bg-green-50 transition-colors"
            >
              Shop Now →
            </Link>
          </motion.div>

          {/* Admin shortcut */}
          {profile?.role === 'admin' && (
            <Link
              to="/admin"
              className="bg-purple-600 hover:bg-purple-700 rounded-3xl p-8 text-white flex items-center justify-between transition-colors"
            >
              <div>
                <h3 className="text-xl font-bold">Admin Dashboard</h3>
                <p className="text-purple-200 text-sm mt-1">Manage orders, inventory & users</p>
              </div>
              <span className="text-4xl">⚙️</span>
            </Link>
          )}

          {/* Shop portal shortcut */}
          {profile?.role === 'shop' && (
            <Link
              to="/shop"
              className="bg-blue-600 hover:bg-blue-700 rounded-3xl p-8 text-white flex items-center justify-between transition-colors"
            >
              <div>
                <h3 className="text-xl font-bold">Shop Portal</h3>
                <p className="text-blue-200 text-sm mt-1">Wholesale prices & bulk orders</p>
              </div>
              <span className="text-4xl">🏪</span>
            </Link>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0a2e2e] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-extrabold text-lg">🙏 Om Namashivaya Agents</div>
              <div className="text-gray-400 text-sm mt-1">Your trusted FMCG distributor</div>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="/products" className="hover:text-white transition-colors">Products</Link>
              <Link to="/auth/login" className="hover:text-white transition-colors">Login</Link>
              <Link to="/auth/login" className="hover:text-white transition-colors">Sign Up</Link>
            </div>
            <div className="text-gray-500 text-xs">
              © 2026 Om Namashivaya Agents · COD Only
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
