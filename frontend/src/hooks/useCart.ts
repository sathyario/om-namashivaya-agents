import { useState, useEffect } from 'react'
import { CartItem, Product } from '../types'

const CART_KEY = 'om_cart'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, { product, quantity }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(i => i.product.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return }
    setCart(prev =>
      prev.map(i => i.product.id === productId ? { ...i, quantity } : i)
    )
  }

  const clearCart = () => setCart([])

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)
  const totalAmount = cart.reduce((sum, i) => sum + i.product.price_retail * i.quantity, 0)

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalAmount }
}
