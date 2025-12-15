import axios from 'axios'

/**
 * API Base URL - Uses environment variable or defaults to localhost
 */
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"  // ||  import.meta.env.VITE_API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api"
/**
 * API Request Timeout - Uses environment variable or defaults to 30 seconds
 */
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000

/**
 * Axios instance with default configuration
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: API_TIMEOUT
})

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const requestUrl = originalRequest?.url || ''
    const isAuthEndpoint = requestUrl.includes('/auth/login') || 
                           requestUrl.includes('/auth/admin/login') ||
                           requestUrl.includes('/auth/signup') ||
                           requestUrl.includes('/auth/forgot-password') ||
                           requestUrl.includes('/auth/verify-otp-login') ||
                           requestUrl.includes('/auth/refresh-token')

    // Don't handle 401 errors for auth endpoints - let them be handled by the calling code
    if (isAuthEndpoint && error.response?.status === 401) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await api.post('/auth/refresh-token')
        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
