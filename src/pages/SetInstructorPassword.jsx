import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PasswordToggle } from '../components/PasswordToggle'
import Swal from 'sweetalert2'
import logo from '../Assets/linklogo.png'
import api from '../services/api'

export const SetInstructorPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()
  

  useEffect(() => {
    if (!user || user.role !== 'instructor') {
      navigate('/login')
    }
  }, [user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validatePassword = () => {
    const { newPassword, confirmPassword } = formData

    if (!newPassword) {
      setError('New password is required')
      return false
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError('Password must contain at least one uppercase letter')
      return false
    }
    if (!/[a-z]/.test(newPassword)) {
      setError('Password must contain at least one lowercase letter')
      return false
    }
    if (!/[0-9]/.test(newPassword)) {
      setError('Password must contain at least one digit')
      return false
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validatePassword()) {
      return
    }

    setLoading(true)

    try {
      await api.post('/auth/set-password', formData)
      Swal.fire({ icon: 'success', title: 'Password set' })
      setTimeout(() => navigate('/instructor/dashboard'), 1500)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to set password'
      setError(errorMsg)
      Swal.fire({ icon: 'error', title: 'Failed to set password', text: errorMsg })
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
            <h1 className="text-2xl font-bold text-gray-800">Set Your Password</h1>
            <p className="text-gray-600 mt-2">Create a secure password to access your account</p>
          </div>

          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-sm">
            <p>This is your first login. Please set a strong password to secure your account.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordToggle
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              label="New Password"
              required
            />

            <PasswordToggle
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              label="Confirm Password"
              required
            />

            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-1">
              <p className="font-semibold text-gray-700">Password requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 6 characters</li>
                <li>One uppercase letter (A-Z)</li>
                <li>One lowercase letter (a-z)</li>
                <li>One digit (0-9)</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Setting Password...' : 'Set Password'}
            </button>
          </form>
        </div>
      </div>

      
    </div>
  )
}
