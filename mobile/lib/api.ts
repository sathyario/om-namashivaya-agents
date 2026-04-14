import axios from 'axios'

// Change this to your Render.com backend URL after deployment
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

let authToken: string | null = null

export const setAuthToken = (token: string | null) => {
  authToken = token
}

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }
  return config
})
