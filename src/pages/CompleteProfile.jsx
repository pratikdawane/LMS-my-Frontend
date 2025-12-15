import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Swal from 'sweetalert2'
import logo from '../Assets/linklogo.png'
import api from '../services/api'

export const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    education: {
      qualification: '',
      specialization: '',
      institution: '',
      yearOfCompletion: ''
    },
    bio: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [skipCount, setSkipCount] = useState(0)
  const navigate = useNavigate()
  const { user } = useAuth()
  

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }))
  }

  const handleEducationChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      education: { ...prev.education, [name]: value }
    }))
  }

  const handleBioChange = (e) => {
    setFormData(prev => ({ ...prev, bio: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.put('/auth/complete-profile', formData)
      Swal.fire({ icon: 'success', title: 'Profile updated' })
      setTimeout(() => {
        if (user.role === 'student') {
          navigate('/dashboard')
        } else if (user.role === 'instructor') {
          navigate('/instructor/dashboard')
        } else {
          navigate('/admin/dashboard')
        }
      }, 1500)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update profile'
      setError(errorMsg)
      Swal.fire({ icon: 'error', title: 'Update failed', text: errorMsg })
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    if (skipCount < 2) {
      setSkipCount(skipCount + 1)
      Swal.fire({ icon: 'info', title: 'You can skip 2 more times', timer: 2000, showConfirmButton: false })
    } else {
      Swal.fire({ icon: 'warning', title: 'Profile completion required', text: 'Please complete your profile to continue' })
      setError('Please complete your profile to continue')
    }
  }

  const navigateToDashboard = () => {
    if (user.role === 'student') {
      navigate('/dashboard')
    } else if (user.role === 'instructor') {
      navigate('/instructor/dashboard')
    } else {
      navigate('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Linkcode" className="h-16" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Complete Your Profile</h1>
            <p className="text-gray-600 mt-2">Help us know you better</p>
          </div>

          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            <p>Welcome, {user?.firstName}! Please complete your profile to get the best experience.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  placeholder="Street Address"
                  className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  placeholder="City"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.address.state}
                  onChange={handleAddressChange}
                  placeholder="State"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="country"
                  value={formData.address.country}
                  onChange={handleAddressChange}
                  placeholder="Country"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="zipCode"
                  value={formData.address.zipCode}
                  onChange={handleAddressChange}
                  placeholder="Zip Code"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {user?.role === 'student' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Education</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="qualification"
                    value={formData.education.qualification}
                    onChange={handleEducationChange}
                    placeholder="Qualification (e.g., B.Tech, MBA)"
                    className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="specialization"
                    value={formData.education.specialization}
                    onChange={handleEducationChange}
                    placeholder="Specialization"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="institution"
                    value={formData.education.institution}
                    onChange={handleEducationChange}
                    placeholder="Institution"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    name="yearOfCompletion"
                    value={formData.education.yearOfCompletion}
                    onChange={handleEducationChange}
                    placeholder="Year of Completion"
                    className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {user?.role === 'instructor' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="qualification"
                    value={formData.education.qualification}
                    onChange={handleEducationChange}
                    placeholder="Highest Qualification"
                    className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="specialization"
                    value={formData.education.specialization}
                    onChange={handleEducationChange}
                    placeholder="Area of Expertise"
                    className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleBioChange}
                placeholder="Tell us about yourself..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 py-2 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Skip (Remaining: {3 - skipCount})
              </button>
            </div>
          </form>
        </div>
      </div>

      
    </div>
  )
}
