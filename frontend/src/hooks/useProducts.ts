import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Product } from '../types'

interface UseProductsOptions {
  categoryId?: number
  inStockOnly?: boolean
}

const _cache = new Map<string, Product[]>()

export function clearProductCache() {
  _cache.clear()
}

export function useProducts(options: UseProductsOptions = {}) {
  const cacheKey = `${options.categoryId ?? 'all'}-${options.inStockOnly ?? false}`
  const cached = _cache.get(cacheKey)

  const [products, setProducts] = useState<Product[]>(cached ?? [])
  const [loading, setLoading] = useState(!cached)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (_cache.has(cacheKey)) return

    const params: Record<string, string | number | boolean> = {}
    if (options.categoryId) params.category_id = options.categoryId
    if (options.inStockOnly) params.in_stock = true

    api.get<Product[]>('/products', { params })
      .then(res => {
        _cache.set(cacheKey, res.data)
        setProducts(res.data)
      })
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false))
  }, [cacheKey])

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
