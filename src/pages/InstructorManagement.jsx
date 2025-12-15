import React, { useState } from 'react'
import { authService } from '../services/authService'
import { PasswordToggle } from '../components/PasswordToggle'
import Swal from 'sweetalert2'

export const InstructorManagement = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      const errorMsg = 'Passwords do not match'
      setError(errorMsg)
      Swal.fire({ icon: 'error', title: 'Validation error', text: errorMsg })
      return
    }

    if (formData.password.length < 6) {
      const errorMsg = 'Password must be at least 6 characters'
      setError(errorMsg)
      Swal.fire({ icon: 'error', title: 'Validation error', text: errorMsg })
      return
    }

    setLoading(true)

    try {
      await authService.createInstructor({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      })
      Swal.fire({ icon: 'success', title: 'Instructor created', text: 'Password email sent to instructor.' })
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
      setError('')
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create instructor'
      setError(errorMsg)
      Swal.fire({ icon: 'error', title: 'Create failed', text: errorMsg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Instructor</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter instructor's first name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter instructor's last name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="instructor@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <PasswordToggle
            name="password"
            value={formData.password}
            onChange={handleChange}
            label="Password"
            required
          />

          <PasswordToggle
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            label="Confirm Password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Creating...' : 'Create Instructor'}
          </button>
        </form>
      </div>

      
    </div>
  )
}
