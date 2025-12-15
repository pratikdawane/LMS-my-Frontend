import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { ForgotPassword } from './pages/ForgotPassword'
import { SetInstructorPassword } from './pages/SetInstructorPassword'
import { CompleteProfile } from './pages/CompleteProfile'
import { Profile } from './pages/Profile'
import { ResetPassword } from './pages/ResetPassword'
import { StudentDashboard } from './pages/StudentDashboard'
import { AdminDashboard } from './pages/AdminDashboard'
import { InstructorDashboard } from './pages/InstructorDashboard'
import { InstructorManagement } from './pages/InstructorManagement'
import { CoursesList } from './pages/CoursesList' // Import the CoursesList component

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/set-password"
                element={
                  <ProtectedRoute requiredRole="instructor">
                    <SetInstructorPassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/complete-profile"
                element={
                  <ProtectedRoute>
                    <CompleteProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <ProtectedRoute>
                    <ResetPassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/dashboard"
                element={
                  <ProtectedRoute requiredRole="instructor">
                    <InstructorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/add-instructor"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <div className="min-h-screen bg-gray-50">
                      <div className="max-w-7xl mx-auto px-4 py-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-8">Manage Instructors</h1>
                        <InstructorManagement />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route path="/courses" element={<CoursesList />} />

            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
