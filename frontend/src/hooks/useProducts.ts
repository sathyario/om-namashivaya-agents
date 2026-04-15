import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Product } from '../types'

interface UseProductsOptions {
  categoryId?: number
  inStockOnly?: boolean
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params: Record<string, string | number | boolean> = {}
    if (options.categoryId) params.category_id = options.categoryId
    if (options.inStockOnly) params.in_stock = true

    api.get<Product[]>('/products', { params })
      .then(res => setProducts(res.data))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false))
  }, [options.categoryId, options.inStockOnly])

  return { products, loading, error }
}

export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Product>(`/products/${id}`)
      .then(res => setProduct(res.data))
      .finally(() => setLoading(false))
  }, [id])

  return { product, loading }
}
