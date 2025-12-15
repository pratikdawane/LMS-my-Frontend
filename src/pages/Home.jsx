import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Home = () => {
  const { user } = useAuth()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn, Grow, <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Succeed</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Master programming skills through interactive learning, guided projects, and real-world applications.
          </p>
          <div className="flex justify-center gap-4">
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Content</h3>
            <p className="text-gray-700">Learn from industry experts with carefully curated content covering all levels.</p>
          </div>

          <Link to="/courses" className="p-8 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Learn by Doing </h3>
            <p className="text-gray-700">Hands-on projects and real-world applications to build practical skills.</p>
          </Link>

          <div className="p-8 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Career Ready</h3>
            <p className="text-gray-700">Build a portfolio and get job-ready with industry-relevant skills.</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Learning Journey Today</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of students already learning on Linkcode</p>
          <Link
            to="/signup"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Sign Up Free
          </Link>
        </div>
      </div>
    </div>
  )
}






// import React, { useEffect } from 'react'
// import { Link, useLocation } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'

// export const Home = () => {
//   const { user } = useAuth()
//   const location = useLocation()

//   useEffect(() => {
//     window.scrollTo(0, 0)
//   }, [location])

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-7xl mx-auto px-4 py-20">
//         <div className="text-center mb-20">
//           <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
//             Learn, Grow, <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Succeed</span>
//           </h1>
//           <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//             Master programming skills through interactive learning, guided projects, and real-world applications.
//           </p>
//           <div className="flex justify-center gap-4">
//             {user ? (
//               <Link
//                 to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
//                 className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
//               >
//                 Go to Dashboard
//               </Link>
//             ) : (
//               <>
//                 <Link
//                   to="/signup"
//                   className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
//                 >
//                   Get Started
//                 </Link>
//                 <Link
//                   to="/login"
//                   className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
//                 >
//                   Sign In
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 mb-20">
//           <div className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
//             <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
//               <span className="text-2xl">📚</span>
//             </div>
//             <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Content</h3>
//             <p className="text-gray-700">Learn from industry experts with carefully curated content covering all levels.</p>
//           </div>

//           {/* Learn by Doing Card */}
//           <div className="p-8 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
//             <div className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
//               <span className="text-2xl">🚀</span>
//             </div>
//             <Link 
//               to="/courses" 
//               className="text-xl font-bold text-gray-900 mb-2 hover:text-purple-700 transition inline-block group-hover:translate-x-2"
//             >
//               Learn by Doing →
//             </Link>
//             <p className="text-gray-700 mb-4">Hands-on projects and real-world applications to build practical skills.</p>
//             {/* <div className="text-purple-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition">
//               Click to explore all courses
//             </div> */}
//           </div>

//           <div className="p-8 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
//             <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center mb-4">
//               <span className="text-2xl">🎯</span>
//             </div>
//             <h3 className="text-xl font-bold text-gray-900 mb-2">Career Ready</h3>
//             <p className="text-gray-700">Build a portfolio and get job-ready with industry-relevant skills.</p>
//           </div>
//         </div>

       
//         {/* <div className="mb-20">
//           <div className="flex justify-between items-center mb-10">
//             <div>
//               <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
//               <p className="text-gray-600 mt-2">Start learning with our most popular courses</p>
//             </div>
//             <Link 
//               to="/courses"
//               className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition hover:-translate-y-1"
//             >
//               View All Courses →
//             </Link>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           
//             <Link to="/courses" className="block">
//               <div className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
//                 <div className="mb-4">
//                   <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
//                     Frontend
//                   </span>
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">
//                   React Mastery
//                 </h3>
//                 <p className="text-gray-700 mb-4">Build modern web applications with React and learn advanced concepts.</p>
//                 <div className="flex items-center text-blue-600 font-semibold">
//                   Explore Course <span className="ml-2 group-hover:translate-x-2 transition">→</span>
//                 </div>
//               </div>
//             </Link>

            
//             <Link to="/courses" className="block">
//               <div className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
//                 <div className="mb-4">
//                   <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
//                     Backend
//                   </span>
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition">
//                   Node.js Development
//                 </h3>
//                 <p className="text-gray-700 mb-4">Create scalable backend applications with Node.js and Express.</p>
//                 <div className="flex items-center text-green-600 font-semibold">
//                   Explore Course <span className="ml-2 group-hover:translate-x-2 transition">→</span>
//                 </div>
//               </div>
//             </Link>

           
//             <Link to="/courses" className="block">
//               <div className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
//                 <div className="mb-4">
//                   <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
//                     Full Stack
//                   </span>
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition">
//                   Complete Web Development
//                 </h3>
//                 <p className="text-gray-700 mb-4">Master both frontend and backend technologies in one comprehensive course.</p>
//                 <div className="flex items-center text-purple-600 font-semibold">
//                   Explore Course <span className="ml-2 group-hover:translate-x-2 transition">→</span>
//                 </div>
//               </div>
//             </Link>
//           </div>
//         </div> */}

//         <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-12 text-white text-center">
//           <h2 className="text-3xl font-bold mb-4">Start Your Learning Journey Today</h2>
//           <p className="text-lg mb-8 opacity-90">Join thousands of students already learning on Linkcode</p>
//           <Link
//             to="/signup"
//             onClick={() => window.scrollTo(0, 0)}
//             className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition hover:-translate-y-1"
//           >
//             Sign Up Free
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }