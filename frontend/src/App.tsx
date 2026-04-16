import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import RouteGuard from './components/RouteGuard'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Login from './pages/Login'
import ShopDashboard from './pages/shop/ShopDashboard'
import BulkOrder from './pages/shop/BulkOrder'
import ShopOrders from './pages/shop/ShopOrders'
import AdminDashboard from './pages/admin/Dashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'
import ShopRequests from './pages/admin/ShopRequests'

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public — anyone can see */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/auth/login" element={<Login />} />

        {/* Logged in users only */}
        <Route path="/checkout" element={
          <RouteGuard allowedRoles={['consumer', 'shop', 'admin']}>
            <Checkout />
          </RouteGuard>
        } />
        <Route path="/orders" element={
          <RouteGuard allowedRoles={['consumer', 'shop', 'admin']}>
            <Orders />
          </RouteGuard>
        } />

        {/* Shop only — wholesale portal */}
        <Route path="/shop" element={
          <RouteGuard allowedRoles={['shop', 'admin']}>
            <ShopDashboard />
          </RouteGuard>
        } />
        <Route path="/shop/order" element={
          <RouteGuard allowedRoles={['shop', 'admin']}>
            <BulkOrder />
          </RouteGuard>
        } />
        <Route path="/shop/orders" element={
          <RouteGuard allowedRoles={['shop', 'admin']}>
            <ShopOrders />
          </RouteGuard>
        } />

        {/* Admin only */}
        <Route path="/admin" element={
          <RouteGuard allowedRoles={['admin']}>
            <AdminDashboard />
          </RouteGuard>
        } />
        <Route path="/admin/orders" element={
          <RouteGuard allowedRoles={['admin']}>
            <AdminOrders />
          </RouteGuard>
        } />
        <Route path="/admin/products" element={
          <RouteGuard allowedRoles={['admin']}>
            <AdminProducts />
          </RouteGuard>
        } />
        <Route path="/admin/shop-requests" element={
          <RouteGuard allowedRoles={['admin']}>
            <ShopRequests />
          </RouteGuard>
        } />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}
