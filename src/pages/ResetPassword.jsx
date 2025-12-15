import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PasswordToggle } from '../components/PasswordToggle'
import { Toast, useToast } from '../components/Toast'

export const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const isForgotPasswordFlow = searchParams.get('forgot') === 'true'
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    match: false
  })
  const navigate = useNavigate()
  const { resetPassword, resetPasswordForgot, user } = useAuth()
  const { toasts, showToast, removeToast } = useToast()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  useEffect(() => {
    // Check password strength
    const checks = {
      length: newPassword.length >= 6,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      match: newPassword === confirmPassword && confirmPassword.length > 0
    }
    setPasswordChecks(checks)
    
    const strength = Object.values(checks).filter(Boolean).length
    setPasswordStrength(strength)
  }, [newPassword, confirmPassword])

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setError('')
    setLoading(true)

    // Validation based on flow type
    if (isForgotPasswordFlow) {
      // Forgot password flow - no current password required
      if (!newPassword || !confirmPassword) {
        setError('All fields are required')
        showToast('All fields are required', 'error')
        setLoading(false)
        return
      }
    } else {
      // Normal reset flow - current password required
      if (!currentPassword || !newPassword || !confirmPassword) {
        setError('All fields are required')
        showToast('All fields are required', 'error')
        setLoading(false)
        return
      }

      if (currentPassword === newPassword) {
        setError('New password must be different from current password')
        showToast('New password must be different from current password', 'error')
        setLoading(false)
        return
      }
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      showToast('New passwords do not match', 'error')
      setLoading(false)
      return
    }

    if (passwordStrength < 4) {
      setError('Password does not meet all requirements')
      showToast('Password does not meet all requirements', 'error')
      setLoading(false)
      return
    }

    try {
      if (isForgotPasswordFlow) {
        // Use forgot password endpoint (no current password)
        await resetPasswordForgot(newPassword, confirmPassword)
        showToast('Password reset successfully!', 'success')
        setLoading(false)
        
        // Navigate to appropriate dashboard based on role
        setTimeout(() => {
          if (user?.role === 'admin') {
            navigate('/admin/dashboard')
          } else if (user?.role === 'instructor') {
            navigate('/instructor/dashboard')
          } else {
            navigate('/dashboard')
          }
        }, 1500)
      } else {
        // Use normal reset endpoint (with current password)
        await resetPassword(currentPassword, newPassword, confirmPassword)
        showToast('Password reset successfully!', 'success')
        setLoading(false)
        setTimeout(() => {
          navigate(-1)
        }, 1500)
      }
    } catch (err) {
      console.error('Reset password error:', err)
      const errorMsg = err.response?.data?.error || err.message || 'Failed to reset password'
      setError(errorMsg)
      showToast(errorMsg, 'error')
      setLoading(false)
    }
  }

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500'
    if (passwordStrength === 3) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak'
    if (passwordStrength === 3) return 'Medium'
    return 'Strong'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {isForgotPasswordFlow ? 'Set New Password' : 'Reset Your Password'}
            </h2>
            <p className="text-blue-100 text-sm">
              {isForgotPasswordFlow 
                ? 'Create a secure password for your account'
                : 'Enter your current password and choose a new secure password'}
            </p>
          </div>

          {/* Form Section */}
          <div className="px-8 py-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {/* Current Password - Only show for normal reset flow */}
              {!isForgotPasswordFlow && (
                <PasswordToggle
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  label="Current Password"
                  required
                />
              )}

              {/* New Password */}
              <div>
                <PasswordToggle
                  id="new-password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  label="New Password"
                  required
                />
                
                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">Password Strength</span>
                      <span className={`text-xs font-semibold ${getStrengthColor().replace('bg-', 'text-')}`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-3">Password Requirements:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li className="flex items-center text-sm">
                      <svg className={`w-4 h-4 mr-2 flex-shrink-0 ${passwordChecks.length ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {passwordChecks.length ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        )}
                      </svg>
                      <span className={passwordChecks.length ? 'text-gray-700' : 'text-gray-500'}>
                        At least 6 characters long
                      </span>
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className={`w-4 h-4 mr-2 flex-shrink-0 ${passwordChecks.uppercase ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {passwordChecks.uppercase ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        )}
                      </svg>
                      <span className={passwordChecks.uppercase ? 'text-gray-700' : 'text-gray-500'}>
                        At least one uppercase letter
                      </span>
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className={`w-4 h-4 mr-2 flex-shrink-0 ${passwordChecks.lowercase ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {passwordChecks.lowercase ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        )}
                      </svg>
                      <span className={passwordChecks.lowercase ? 'text-gray-700' : 'text-gray-500'}>
                        At least one lowercase letter
                      </span>
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className={`w-4 h-4 mr-2 flex-shrink-0 ${passwordChecks.number ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {passwordChecks.number ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        )}
                      </svg>
                      <span className={passwordChecks.number ? 'text-gray-700' : 'text-gray-500'}>
                        At least one number
                      </span>
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className={`w-4 h-4 mr-2 flex-shrink-0 ${passwordChecks.match ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {passwordChecks.match ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        )}
                      </svg>
                      <span className={passwordChecks.match ? 'text-gray-700' : 'text-gray-500'}>
                        Passwords match
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <PasswordToggle
                  id="confirm-password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  label="Confirm New Password"
                  required
                />
                {confirmPassword && !passwordChecks.match && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading || passwordStrength < 4 || !passwordChecks.match || (!isForgotPasswordFlow && !currentPassword)}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isForgotPasswordFlow ? 'Setting Password...' : 'Resetting Password...'}
                    </span>
                  ) : (
                    isForgotPasswordFlow ? 'Set New Password' : 'Reset Password'
                  )}
                </button>
                {!isForgotPasswordFlow && (
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
