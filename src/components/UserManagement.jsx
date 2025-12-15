import React, { useState, useEffect } from 'react'
import { adminService } from '../services/adminService'
import Swal from 'sweetalert2'

export const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    role: '',
    search: ''
  })
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', role: '' })

  useEffect(() => {
    fetchUsers()
  }, [filters])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filters.role) params.role = filters.role
      if (filters.search) params.search = filters.search
      const data = await adminService.getUsers(params)
      setUsers(data.data?.users || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = async (userId) => {
    try {
      await adminService.activateUser(userId)
      setUsers(users.map(u => u._id === userId ? { ...u, isActive: true } : u))
      Swal.fire({ icon: 'success', title: 'User activated' })
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to activate user'
      setError(msg)
      Swal.fire({ icon: 'error', title: 'Activate failed', text: msg })
    }
  }

  const handleDeactivate = async (userId) => {
    try {
      await adminService.deactivateUser(userId)
      setUsers(users.map(u => u._id === userId ? { ...u, isActive: false } : u))
      Swal.fire({ icon: 'success', title: 'User deactivated' })
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to deactivate user'
      setError(msg)
      Swal.fire({ icon: 'error', title: 'Deactivate failed', text: msg })
    }
  }

  const handleDelete = async (userId) => {
    const confirm = await Swal.fire({ icon: 'warning', title: 'Delete user?', showCancelButton: true, confirmButtonText: 'Delete' })
    if (!confirm.isConfirmed) return
    try {
      await adminService.deleteUser(userId)
      setUsers(users.filter(u => u._id !== userId))
      Swal.fire({ icon: 'success', title: 'User deleted' })
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to delete user'
      setError(msg)
      Swal.fire({ icon: 'error', title: 'Delete failed', text: msg })
    }
  }

  const openEdit = (user) => {
    setEditingUser(user)
    setEditForm({ firstName: user.firstName || '', lastName: user.lastName || '', email: user.email || '', role: user.role || '' })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const saveEdit = async () => {
    if (!editingUser) return
    try {
      const updates = { firstName: editForm.firstName, lastName: editForm.lastName, email: editForm.email, role: editForm.role }
      const resp = await adminService.updateUser(editingUser._id, updates)
      const updated = resp.data?.user || editingUser
      setUsers(users.map(u => u._id === editingUser._id ? { ...u, ...updated } : u))
      setEditingUser(null)
      Swal.fire({ icon: 'success', title: 'User updated' })
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update user'
      setError(msg)
      Swal.fire({ icon: 'error', title: 'Update failed', text: msg })
    }
  }

  const getFullName = (user) => {
    return `${user.firstName} ${user.lastName}`
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="relative">
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Active</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-800">{getFullName(user)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => openEdit(user)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs"
                    >
                      Edit
                    </button>
                    {user.isActive ? (
                      <button
                        onClick={() => handleDeactivate(user._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(user._id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-xs"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <div className="space-y-3">
              <input
                type="text"
                name="firstName"
                value={editForm.firstName}
                onChange={handleEditChange}
                placeholder="First name"
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="lastName"
                value={editForm.lastName}
                onChange={handleEditChange}
                placeholder="Last name"
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <select
                name="role"
                value={editForm.role}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditingUser(null)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
