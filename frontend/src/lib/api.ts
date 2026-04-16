import axios from 'axios'
import { supabase } from './supabase'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

let _accessToken: string | null = null

// Refresh token on startup if expiring within 30s, so first request gets a valid token.
const _tokenReady = supabase.auth.getSession().then(async ({ data }) => {
  const session = data.session
  if (!session) { _accessToken = null; return }
  const expiresAt = session.expires_at ?? 0
  if (expiresAt < Math.floor(Date.now() / 1000) + 30) {
    const { data: fresh } = await supabase.auth.refreshSession()
    _accessToken = fresh.session?.access_token ?? null
  } else {
    _accessToken = session.access_token
  }
})

export function setAccessToken(token: string | null) {
  _accessToken = token
}

api.interceptors.request.use(async (config) => {
  await _tokenReady
  if (_accessToken) {
    config.headers.Authorization = `Bearer ${_accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || 'Something went wrong'
    console.error('API Error:', message)
    return Promise.reject(error)
  }
)
