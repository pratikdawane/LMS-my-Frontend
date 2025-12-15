import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PasswordToggle } from '../components/PasswordToggle'
import Swal from 'sweetalert2'
import logo from '../Assets/linklogo.png'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setError('')
    setLoading(true)

    try {
      const data = await login(email, password)
      
      if (!data || !data.user) {
        throw new Error('Invalid login response')
      }
      
      const userRole = data.user?.role
      
      if (data.requiresPasswordChange && data.isFirstLogin) {
        Swal.fire({ icon: 'info', title: 'Action required', text: 'Please set your password to continue' })
        setLoading(false)
        setTimeout(() => navigate('/set-password'), 1500)
      } else {
        Swal.fire({ icon: 'success', title: 'Login successful' })
        setLoading(false)
        
        // Navigate based on role
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
      console.error('Login error:', err)
      const errorMsg = err.response?.data?.error || err.message || 'Login failed. Please check your credentials.'
      setError(errorMsg)
      Swal.fire({ icon: 'error', title: 'Login failed', text: errorMsg })
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
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <PasswordToggle
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              required
            />

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            New student?{' '}
            <Link to="/signup" onClick={() => window.scrollTo(0, 0)} className="text-blue-600 font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>

      
    </div>
  )
}
