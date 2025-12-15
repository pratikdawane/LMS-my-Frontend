import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false)
  const [isFirstLogin, setIsFirstLogin] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser()
        setUser(userData.data || userData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await authService.login({ email, password })
      
      // Response structure from authService.login: { accessToken, refreshToken, user, requiresPasswordChange?, isFirstLogin? }
      // authService.login already extracts response.data.data, so response is the data object directly
      const userData = response.user
      const accessToken = response.accessToken
      const refreshToken = response.refreshToken
      
      if (!userData || !accessToken || !refreshToken) {
        console.error('Invalid login response:', response)
        throw new Error('Invalid login response: missing user data or tokens')
      }
      
      const fullName = userData.firstName && userData.lastName 
        ? `${userData.firstName} ${userData.lastName}`
        : userData.name || userData.email
      
      const userObj = {
        ...userData,
        name: fullName
      }
      
      setUser(userObj)
      setRequiresPasswordChange(response.requiresPasswordChange || false)
      setIsFirstLogin(response.isFirstLogin || false)
      
      return { 
        user: userObj,
        requiresPasswordChange: response.requiresPasswordChange || false,
        isFirstLogin: response.isFirstLogin || false
      }
    } catch (err) {
      console.error('Login error in AuthContext:', err)
      const errorMsg = err.response?.data?.error || err.message || 'Login failed'
      setError(errorMsg)
      throw err
    }
  }

  const signup = async (userData) => {
    try {
      setError(null)
      const response = await authService.signup(userData)
      const user = response.data?.user || response.user
      const fullName = `${user.firstName} ${user.lastName}`
      const userObj = {
        ...user,
        name: fullName
      }
      setUser(userObj)
      return { ...response, user: userObj }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Signup failed'
      setError(errorMsg)
      throw err
    }
  }

  const setPassword = async (newPassword, confirmPassword) => {
    try {
      setError(null)
      await authService.setPassword({ newPassword, confirmPassword })
      setRequiresPasswordChange(false)
      setIsFirstLogin(false)
      return true
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to set password'
      setError(errorMsg)
      throw err
    }
  }

  const resetPassword = async (currentPassword, newPassword, confirmPassword) => {
    try {
      setError(null)
      await authService.resetPassword({ currentPassword, newPassword, confirmPassword })
      return true
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to reset password'
      setError(errorMsg)
      throw err
    }
  }

  const completeProfile = async (profileData) => {
    try {
      setError(null)
      const response = await authService.completeProfile(profileData)
      const userData = response.data
      const fullName = userData.firstName && userData.lastName 
        ? `${userData.firstName} ${userData.lastName}`
        : userData.name || userData.email
      
      const userObj = {
        ...userData,
        name: fullName
      }
      localStorage.setItem('user', JSON.stringify(userObj))
      setUser(userObj)
      return response
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to complete profile'
      setError(errorMsg)
      throw err
    }
  }

  const verifyOTPAndLogin = async (email, otp) => {
    try {
      setError(null)
      const response = await authService.verifyOTPAndLogin(email, otp)

      const userData = response.user
      const accessToken = response.accessToken
      const refreshToken = response.refreshToken

      if (!userData || !accessToken || !refreshToken) {
        console.error('Invalid OTP login response:', response)
        throw new Error('Invalid OTP login response: missing user data or tokens')
      }

      const fullName = userData.firstName && userData.lastName
        ? `${userData.firstName} ${userData.lastName}`
        : userData.name || userData.email

      const userObj = {
        ...userData,
        name: fullName
      }

      setUser(userObj)
      setRequiresPasswordChange(response.requiresPasswordChange || false)
      setIsFirstLogin(response.isFirstLogin || false)

      return {
        user: userObj,
        requiresPasswordChange: response.requiresPasswordChange || false,
        isFirstLogin: response.isFirstLogin || false,
        requiresPasswordReset: response.requiresPasswordReset || false // Flag for forgot password flow
      }
    } catch (err) {
      console.error('OTP verification error in AuthContext:', err)
      const errorMsg = err.response?.data?.error || err.message || 'OTP verification failed'
      setError(errorMsg)
      throw err
    }
  }

  const resetPasswordForgot = async (newPassword, confirmPassword) => {
    try {
      setError(null)
      await authService.resetPasswordForgot({ newPassword, confirmPassword })
      return true
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to reset password'
      setError(errorMsg)
      throw err
    }
  }

  const forgotPassword = async (email) => {
    try {
      setError(null)
      const response = await authService.forgotPassword(email)
      return response
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to send OTP'
      setError(errorMsg)
      throw err
    }
  }

  const logout = async () => {
    try {
      await authService.logout({})
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
      setError(null)
      setRequiresPasswordChange(false)
      setIsFirstLogin(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        requiresPasswordChange,
        isFirstLogin,
        login,
        signup,
        setPassword,
        resetPassword,
        resetPasswordForgot,
        completeProfile,
        verifyOTPAndLogin,
        forgotPassword,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
