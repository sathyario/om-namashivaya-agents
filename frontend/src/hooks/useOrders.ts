import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Order } from '../types'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {
    setLoading(true)
    api.get<Order[]>('/orders')
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  return { orders, loading, refetch: fetchOrders }
}

export function useAllOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {
    setLoading(true)
    api.get<Order[]>('/orders/all')
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (orderId: number, status: string) => {
    await api.put(`/orders/${orderId}/status`, { status })
    fetchOrders()
  }

  return { orders, loading, updateStatus, refetch: fetchOrders }
}
