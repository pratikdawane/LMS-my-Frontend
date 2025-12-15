import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Swal from 'sweetalert2'

export const Profile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    address: { street: '', city: '', state: '', country: '', zipCode: '' },
    education: { qualification: '', specialization: '', institution: '', yearOfCompletion: '' },
    bio: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchProfile()
  }, [user, navigate])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/me')
      const data = response.data.data
      setProfileData(data)
      setEditData({
        address: data.address || { street: '', city: '', state: '', country: '', zipCode: '' },
        education: data.education || { qualification: '', specialization: '', institution: '', yearOfCompletion: '' },
        bio: data.bio || ''
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original data
    if (profileData) {
      setEditData({
        address: profileData.address || { street: '', city: '', state: '', country: '', zipCode: '' },
        education: profileData.education || { qualification: '', specialization: '', institution: '', yearOfCompletion: '' },
        bio: profileData.bio || ''
      })
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await api.put('/auth/complete-profile', editData)
      setProfileData(response.data.data)
      setIsEditing(false)
      Swal.fire({ icon: 'success', title: 'Profile updated successfully', timer: 2000, showConfirmButton: false })
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Failed to update profile', text: error.response?.data?.error || 'Something went wrong' })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (section, field, value) => {
    setEditData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    return user?.name?.[0]?.toUpperCase() || 'U'
  }

  const getFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    return user?.name || 'User'
  }

  const getRoleDisplay = () => {
    const role = user?.role || ''
    if (role === 'instructor') return 'Instructor'
    if (role === 'admin') return 'Administrator'
    return 'Student'
  }

  const getLocation = () => {
    if (profileData?.address) {
      const { city, state, country } = profileData.address
      const parts = [city, state, country].filter(Boolean)
      return parts.length > 0 ? parts.join(', ') : 'Not specified'
    }
    return 'Not specified'
  }

  const getPhone = () => {
    return profileData?.mobileNo || profileData?.phone || 'Not provided'
  }

  const getEducation = () => {
    if (profileData?.education) {
      const { qualification, specialization, institution } = profileData.education
      if (qualification && institution) {
        return `${qualification}${specialization ? `, ${specialization}` : ''}, ${institution}`
      }
    }
    return 'Not specified'
  }

  const getOccupation = () => {
    const role = user?.role || ''
    if (role === 'instructor') return 'Instructor'
    if (role === 'admin') return 'Administrator'
    return 'Student'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {getInitials()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{getFullName()}</h1>
                <p className="text-lg text-gray-600">{getRoleDisplay()}</p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          {/* Bio Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Bio</h3>
                {isEditing ? (
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-gray-700">{profileData?.bio || 'No bio added yet'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="text-gray-900 font-medium">{getFullName()}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-900 font-medium">{getPhone()}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-900 font-medium">{user?.email || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editData.address.street || ''}
                        onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                        placeholder="Street Address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editData.address.city || ''}
                          onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                          placeholder="City"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                        <input
                          type="text"
                          value={editData.address.state || ''}
                          onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                          placeholder="State"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editData.address.country || ''}
                          onChange={(e) => handleInputChange('address', 'country', e.target.value)}
                          placeholder="Country"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                        <input
                          type="text"
                          value={editData.address.zipCode || ''}
                          onChange={(e) => handleInputChange('address', 'zipCode', e.target.value)}
                          placeholder="Zip Code"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-900 font-medium">{getLocation()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7M5 12.55v7.45a2 2 0 002 2h10a2 2 0 002-2v-7.45" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Education</p>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editData.education.qualification || ''}
                        onChange={(e) => handleInputChange('education', 'qualification', e.target.value)}
                        placeholder="Qualification (e.g., B.Tech, MBA)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                      <input
                        type="text"
                        value={editData.education.specialization || ''}
                        onChange={(e) => handleInputChange('education', 'specialization', e.target.value)}
                        placeholder="Specialization"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                      <input
                        type="text"
                        value={editData.education.institution || ''}
                        onChange={(e) => handleInputChange('education', 'institution', e.target.value)}
                        placeholder="Institution"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                      <input
                        type="number"
                        value={editData.education.yearOfCompletion || ''}
                        onChange={(e) => handleInputChange('education', 'yearOfCompletion', e.target.value)}
                        placeholder="Year of Completion"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900 font-medium">{getEducation()}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Occupation</p>
                  <p className="text-gray-900 font-medium">{getOccupation()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

