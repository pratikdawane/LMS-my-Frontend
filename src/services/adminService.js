import api from './api'

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats')
    return response.data
  },

  getUsers: async (filters = {}) => {
    const response = await api.get('/admin/users', { params: filters })
    return response.data
  },

  getUserById: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`)
    return response.data
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.patch(`/admin/users/${userId}/status`, { status })
    return response.data
  },

  activateUser: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/activate`)
    return response.data
  },

  deactivateUser: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/deactivate`)
    return response.data
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`)
    return response.data
  },

  updateUser: async (userId, updates) => {
    const response = await api.patch(`/admin/users/${userId}`, updates)
    return response.data
  }
}
