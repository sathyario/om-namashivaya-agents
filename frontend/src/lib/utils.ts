// Format Indian Rupees
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date to readable Indian format
export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Stock badge helper
export const stockLabel = (qty: number): { label: string; color: string } => {
  if (qty === 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50' }
  if (qty <= 5) return { label: `Only ${qty} left`, color: 'text-orange-600 bg-orange-50' }
  return { label: 'In Stock', color: 'text-green-600 bg-green-50' }
}

// Order status color
export const statusColor: Record<string, string> = {
  pending: 'text-yellow-700 bg-yellow-50',
  confirmed: 'text-blue-700 bg-blue-50',
  dispatched: 'text-purple-700 bg-purple-50',
  delivered: 'text-green-700 bg-green-50',
  cancelled: 'text-red-700 bg-red-50',
}
