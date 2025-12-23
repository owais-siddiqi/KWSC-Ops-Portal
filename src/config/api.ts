// API Configuration
// In development, use proxy (empty string = same origin)
// In production, use full URL from env variable
const isDevelopment = import.meta.env.DEV
export const API_BASE_URL = isDevelopment 
  ? '/api'  // Use proxy in development
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000')

export const API_ENDPOINTS = {
  LOGIN: '/employee/login',
} as const

