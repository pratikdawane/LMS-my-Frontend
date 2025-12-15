import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../Assets/linklogo.png'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    setDropdownOpen(false)
  }

  const getDashboardLink = () => {    if (!user) return '/'
    if (user.role === 'admin') return '/admin/dashboard'  
    if (user.role === 'instructor') return '/instructor/dashboard'
    return '/dashboard'
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2">
          <img src={logo} alt="Linkcode" className="h-12" />
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-gray-700 font-medium hidden sm:inline">{user.name?.split(' ')[0]}</span>
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1">
                  <Link
                    to="/profile"
                    onClick={() => {
                      setDropdownOpen(false)
                      window.scrollTo(0, 0)
                    }}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Profile
                  </Link>
                  <Link
                    to={getDashboardLink()}
                    onClick={() => {
                      setDropdownOpen(false)
                      window.scrollTo(0, 0)
                    }}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/reset-password"
                    onClick={() => {
                      setDropdownOpen(false)
                      window.scrollTo(0, 0)
                    }}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Reset Password
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition font-medium border-t border-gray-200 mt-1"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                onClick={() => window.scrollTo(0, 0)}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => window.scrollTo(0, 0)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:shadow-lg transition font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
