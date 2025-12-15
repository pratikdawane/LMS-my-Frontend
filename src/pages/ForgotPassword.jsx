import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext' // Import the auth context
import Swal from 'sweetalert2'
import logo from '../Assets/linklogo.png'

export const ForgotPassword = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { verifyOTPAndLogin, forgotPassword } = useAuth()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleRequestOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await forgotPassword(email)
      Swal.fire({ icon: 'info', title: 'OTP sent', text: 'If your email is registered with us, you will receive an OTP shortly' })
      setStep(2)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to request OTP'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')

    if (otp.length !== 6) {
      setError('OTP must be 6 digits')
      return
    }

    setLoading(true)

    try {
      const result = await verifyOTPAndLogin(email, otp)

      // Check if user needs to reset password (from forgot password flow)
      if (result.requiresPasswordReset) {
        Swal.fire({ icon: 'info', title: 'OTP verified', text: 'Please set a new password' })
        setTimeout(() => {
          navigate('/reset-password?forgot=true')
        }, 500)
      } else {
        const userRole = result.user?.role
        Swal.fire({ icon: 'success', title: 'Login successful' })
        
        // Navigate based on role (same as login)
        setTimeout(() => {
          if (userRole === 'admin') {
            navigate('/admin/dashboard')
          } else if (userRole === 'instructor') {
            navigate('/instructor/dashboard')
          } else {
            navigate('/dashboard')
          }
        }, 500)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'OTP verification failed'
      setError(errorMsg)
      Swal.fire({ icon: 'error', title: 'OTP verification failed', text: errorMsg })
      console.error('OTP verification error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Linkcode" className="h-16" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
            <p className="text-gray-600 mt-2">
              {step === 1 ? 'Enter your email to receive OTP' : 'Enter the OTP you received'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending OTP...' : 'Get OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Enter the 6-digit OTP sent to <span className="font-semibold">{email}</span>
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-2">OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  required
                  className="w-full px-4 py-2 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1)
                  setOtp('')
                  setError('')
                }}
                className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Back
              </button>
            </form>
          )}

          <p className="text-center text-gray-600 mt-6">
            Remember your password?{' '}
            <Link to="/login" onClick={() => window.scrollTo(0, 0)} className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      
    </div>
  )
}
