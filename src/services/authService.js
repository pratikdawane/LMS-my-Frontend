import api from './api'

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export const authService = {
  /**
   * Student signup
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Response data with tokens and user info
   */
  signup: async (userData) => {
    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      mobileNo: userData.mobileNo,
      gender: userData.gender,
      password: userData.password,
      confirmPassword: userData.confirmPassword
    }
    const response = await api.post('/auth/signup/student', payload)
    return response.data.data
  },

  /**
   * Login (supports all roles: student, instructor, admin)
   * @param {Object} credentials - Login credentials { email, password } or { email, otp }
   * @returns {Promise<Object>} Response data with tokens and user info
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data.data
  },

  /**
   * Admin login (backward compatibility)
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>} Response data with tokens and user info
   */
  adminLogin: async (credentials) => {
    const response = await api.post('/auth/admin/login', credentials)
    return response.data.data
  },

  /**
   * Get current authenticated user
   * @returns {Promise<Object>} Current user data
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me')
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Set password for instructor (first login)
   * @param {Object} passwordData - Password data { newPassword, confirmPassword }
   * @returns {Promise<Object>} Response data
   */
  setPassword: async (passwordData) => {
    const response = await api.post('/auth/set-password', passwordData)
    return response.data.data
  },

  /**
   * Request password reset OTP
   * @param {string} email - User email
   * @returns {Promise<Object>} Response data
   */
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data.data
  },

  /**
   * Verify OTP and login
   * @param {string} email - User email
   * @param {string} otp - OTP code
   * @returns {Promise<Object>} Response data with tokens and user info
   */
  verifyOTPAndLogin: async (email, otp) => {
    const response = await api.post('/auth/verify-otp-login', { email, otp })
    return response.data.data
  },

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} New access token
   */
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', { refreshToken })
    return response.data.data
  },

  /**
   * Complete user profile
   * @param {Object} profileData - Profile data { address, education, bio }
   * @returns {Promise<Object>} Updated user data
   */
  completeProfile: async (profileData) => {
    const response = await api.put('/auth/complete-profile', profileData)
    return response.data.data
  },

  /**
   * Create instructor (admin only)
   * @param {Object} instructorData - Instructor data { firstName, lastName, email }
   * @returns {Promise<Object>} Created instructor data
   */
  createInstructor: async (instructorData) => {
    const payload = {
      firstName: instructorData.firstName,
      lastName: instructorData.lastName,
      email: instructorData.email
    }
    const response = await api.post('/auth/admin/create-instructor', payload)
    return response.data.data
  },

  /**
   * Reset password (authenticated users)
   * @param {Object} passwordData - Password data { currentPassword, newPassword, confirmPassword }
   * @returns {Promise<Object>} Response data
   */
  resetPassword: async (passwordData) => {
    const response = await api.post('/auth/reset-password', passwordData)
    return response.data.data
  },

  /**
   * Reset password after forgot password flow (no current password required)
   * @param {Object} passwordData - Password data { newPassword, confirmPassword }
   * @returns {Promise<Object>} Response data
   */
  resetPasswordForgot: async (passwordData) => {
    const response = await api.post('/auth/reset-password-forgot', passwordData)
    return response.data.data
  },

  /**
   * Logout user
   * @param {Object} data - Optional data
   * @returns {Promise<void>}
   */
  logout: async (data = {}) => {
    try {
      await api.post('/auth/logout', data)
    } catch (err) {
      console.error('Logout error:', err)
      // Don't throw error on logout failure
    }
  }
}