
import React, { useEffect, useState, useRef } from 'react';   
import { Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import { fetchCourses } from '../services/coursesList.js';
import axios from 'axios';  
import { ShimmerThumbnail, ShimmerTitle, ShimmerContentBlock, ShimmerButton } from 'react-shimmer-effects';

export const CoursesList = () => {
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const coursesRef = useRef(null);
  
  // Wishlist/Favorites state
  const [favorites, setFavorites] = useState([]);
  
  // User enrolled courses state
  const [enrolledCourses, setEnrolledCourses] = useState([
    '1-0', // React Mastery
    '3-0', // Full Stack Web Development
    '5-0', // DevOps Essentials
    '8-0', // Machine Learning Fundamentals
    '12-0', // GraphQL API Development
    '15-0', // Vue.js Framework
    '18-0', // Big Data Analytics
    '20-0', // TypeScript Mastery
  ]);
  
  // Demo data in case API fails or for initial display
  const allDemoCourses = [
    {
      id: 1,
      title: 'React Mastery',
      description: 'Learn React from basics to advanced concepts with hands-on projects',
      category: 'frontend',
      duration: '12 weeks',
      rating: 4.5,
      students: 1000,
      instructor: 'Jane Doe',
      level: 'Intermediate'
    },
    {
      id: 2,
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js and Express',
      category: 'backend',
      duration: '10 weeks',
      rating: 4.4,
      students: 800,
      instructor: 'Sarah Lee',
      level: 'Intermediate'
    },
    {
      id: 3,
      title: 'Full Stack Web Development',
      description: 'Complete course covering both frontend and backend technologies',
      category: 'fullstack',
      duration: '16 weeks',
      rating: 4.5,
      students: 1100,
      instructor: 'Michael Brown',
      level: 'Intermediate'
    },
    {
      id: 4,
      title: 'Data Science with Python',
      description: 'Learn data analysis, machine learning, and data visualization',
      category: 'data-science',
      duration: '14 weeks',
      rating: 4.5,  
      students: 850,
      instructor: 'Emily Clark',
      level: 'Advanced'
    },
    {
      id: 5,
      title: 'DevOps Essentials',
      description: 'Master CI/CD, Docker, Kubernetes, and cloud deployment',
      category: 'devops',
      duration: '8 weeks',
      rating: 4.2,
      students: 600,
      instructor: 'David Wilson',
      level: 'Beginner'
    },
    {
      id: 6,
      title: 'Advanced JavaScript',
      description: 'Deep dive into modern JavaScript concepts and patterns',
      category: 'frontend',
      duration: '6 weeks',
      rating: 4.3,
      students: 700,
      instructor: 'Alice Johnson',
      level: 'Beginner'
    },
    {
      id: 7,
      title: 'Python Django Framework',
      description: 'Build web applications using Django and Python',
      category: 'backend',
      duration: '10 weeks',
      rating: 4.4,
      students: 800,
      instructor: 'Sarah Lee',
      level: 'Intermediate'
    },
    {
      id: 8,
      title: 'Machine Learning Fundamentals',
      description: 'Introduction to ML algorithms and practical implementations',
      category: 'data-science',
      duration: '12 weeks',
      rating: 4.5,
      students: 850,
      instructor: 'Emily Clark',
      level: 'Advanced'
    },
    {
      id: 9,
      title: 'Cloud Computing with AWS',
      description: 'Learn AWS services, deployment, and management',
      category: 'devops',
      duration: '8 weeks',
      rating: 4.6,
      students: 900,
      instructor: 'John Smith',
      level: 'Intermediate'
    },
    // Additional courses for scrolling
    {
      id: 10,
      title: 'React Native Mobile Development',
      description: 'Build cross-platform mobile apps with React Native',
      category: 'frontend',
      duration: '10 weeks',
      rating: 4.5,
      students: 800,
      instructor: 'Jane Doe',
      level: 'Intermediate'
    },
    {
      id: 11,
      title: 'MongoDB Database Design',
      description: 'Master NoSQL database design and implementation',
      category: 'backend',
      duration: '8 weeks',
      rating: 4.3,
      students: 650,
      instructor: 'John Smith',
      level: 'Beginner'
    },
    {
      id: 12,
      title: 'GraphQL API Development',
      description: 'Learn to build efficient APIs with GraphQL',
      category: 'fullstack',
      duration: '6 weeks',
      rating: 4.4,
      students: 750,
      instructor: 'Michael Brown',
      level: 'Intermediate'
    },
    {
      id: 13,
      title: 'TensorFlow Deep Learning',
      description: 'Build neural networks with TensorFlow and Keras',
      category: 'data-science',
      duration: '12 weeks',
      rating: 4.5,  
      students: 850,
      instructor: 'Emily Clark',
      level: 'Advanced'
    },
    {
      id: 14,
      title: 'Docker Containers',
      description: 'Containerize applications with Docker',
      category: 'devops',
      duration: '5 weeks',
      rating: 4.2,
      students: 600,
      instructor: 'David Wilson',
      level: 'Beginner'
    },
    {
      id: 15,
      title: 'Vue.js Framework',
      description: 'Build modern web apps with Vue.js',
      category: 'frontend',
      duration: '8 weeks',
      rating: 4.3,
      students: 700,
      instructor: 'Alice Johnson',
      level: 'Beginner'
    },
    {
      id: 16,
      title: 'Spring Boot Java Development',
      description: 'Enterprise Java applications with Spring Boot',
      category: 'backend',
      duration: '12 weeks',
      rating: 4.4,
      students: 800,
      instructor: 'Sarah Lee',
      level: 'Intermediate'
    },
    {
      id: 17,
      title: 'MEAN Stack Development',
      description: 'MongoDB, Express, Angular, and Node.js full stack',
      category: 'fullstack',
      duration: '14 weeks',
      rating: 4.5,
      students: 1100,
      instructor: 'Michael Brown',
      level: 'Intermediate'
    },
    {
      id: 18,
      title: 'Big Data Analytics',
      description: 'Process and analyze large datasets',
      category: 'data-science',
      duration: '10 weeks',
      rating: 4.6,
      students: 900,
      instructor: 'Emily Clark',
      level: 'Advanced'
    },
    {
      id: 19,
      title: 'Kubernetes Orchestration',
      description: 'Container orchestration with Kubernetes',
      category: 'devops',
      duration: '8 weeks',
      rating: 4.7,
      students: 1200,
      instructor: 'John Smith',
      level: 'Intermediate'
    },
    {
      id: 20,
      title: 'TypeScript Mastery',
      description: 'Advanced TypeScript patterns and practices',
      category: 'frontend',
      duration: '6 weeks',
      rating: 4.8,
      students: 1500,
      instructor: 'Jane Doe',
      level: 'Advanced'
    }
  ];



  // Generate duplicate courses with unique IDs for demo
  const demoCourses = (() => {
    const courses = [];
    for (let i = 0; i < 5; i++) {  // Create 5 copies of each course
      allDemoCourses.forEach(course => {
        courses.push({
          ...course,  // Spread existing course properties
          id: `${course.id}-${i}`  // Create unique ID: "1-0", "1-1", etc.
        });
      });
    }
    return courses;  // Returns array of 100 courses (20 original × 5 copies)
  })();


  
  const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'frontend', name: 'Frontend Development' },
    { id: 'backend', name: 'Backend Development' },
    { id: 'fullstack', name: 'Full Stack' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'devops', name: 'DevOps & Cloud' }
  ];



  // Initial visible courses
  const INITIAL_COUNT = 9;
  const LOAD_MORE_COUNT = 6;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [shimmerCourses, setShimmerCourses] = useState([]);
  


  useEffect(() => {       
    window.scrollTo(0, 0);
    setLoading(true);
    
    // Fetch courses from API with fallback to demo data
    const getCourses = async () => {
      try {     
        // Use the imported fetchCourses function
        const response = await fetchCourses();
        
        // Ensure we have an array - adjust based on your API response structure
        let coursesData = response.data || response || [];
        
        // If response.data is not an array or is empty, use demo data
        if (!Array.isArray(coursesData) || coursesData.length === 0) {
          // console.log('API returned no data or invalid format, using demo data');
          coursesData = demoCourses;
        }
        
        setCourses(coursesData);  
        setFilteredCourses(coursesData.slice(0, INITIAL_COUNT));
        setError(null);
        
        // Check if we have more courses to load
        setHasMore(coursesData.length > INITIAL_COUNT);
      } catch (error) {
        console.error('Error fetching courses, using demo data:', error);
        // Fallback to demo data if API fails
        setCourses(demoCourses);
        setFilteredCourses(demoCourses.slice(0, INITIAL_COUNT));
        // setError('Unable to load courses. Showing demo data.');
        setHasMore(demoCourses.length > INITIAL_COUNT);
      } finally {
        setLoading(false);
      }
    };
    
    getCourses();
  }, [location]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;
    
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Trigger load more when 80% scrolled
      if (scrollTop + windowHeight >= documentHeight * 0.8) {
        loadMoreCourses();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore]);

  const loadMoreCourses = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    
    // Generate shimmer courses for loading effect
    const shimmerArray = Array(LOAD_MORE_COUNT).fill({});
    setShimmerCourses(shimmerArray);
    


    try {
      // Simulate 2 second loading with shimmer effect
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const nextVisibleCount = visibleCount + LOAD_MORE_COUNT;
      const allCourses = courses.length > 0 ? courses : demoCourses;
      
      if (selectedCategory === 'all') {
        const newCourses = allCourses.slice(0, nextVisibleCount);
        setFilteredCourses(newCourses);
      } else {
        const filtered = allCourses.filter(course => course.category === selectedCategory);
        const newCourses = filtered.slice(0, nextVisibleCount);
        setFilteredCourses(newCourses);
      }
      
      setVisibleCount(nextVisibleCount);
      
      // Check if we have more courses to load
      const allFiltered = selectedCategory === 'all' 
        ? allCourses 
        : allCourses.filter(course => course.category === selectedCategory);
      setHasMore(nextVisibleCount < allFiltered.length);
      
      // Clear shimmer courses after loading
      setShimmerCourses([]);
    } catch (error) {
      console.error('Error loading more courses:', error);
      setShimmerCourses([]);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setVisibleCount(INITIAL_COUNT);
    
    if (categoryId === 'all') {
      const allCourses = courses.length > 0 ? courses : demoCourses;
      setFilteredCourses(allCourses.slice(0, INITIAL_COUNT));
      setHasMore(allCourses.length > INITIAL_COUNT);
    } else {
      const allCourses = courses.length > 0 ? courses : demoCourses;
      const filtered = allCourses.filter(course => course.category === categoryId);
      setFilteredCourses(filtered.slice(0, INITIAL_COUNT));
      setHasMore(filtered.length > INITIAL_COUNT);
    }
    
    // Scroll to courses section
    setTimeout(() => {
      if (coursesRef.current) {
        coursesRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  // Toggle favorite function
  const toggleFavorite = (courseId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(courseId)) {
        // Remove from favorites
        return prevFavorites.filter(id => id !== courseId);
      } else {
        // Add to favorites
        return [...prevFavorites, courseId];
      }
    });
  };

  // Check if course is enrolled
  const isCourseEnrolled = (courseId) => {
    return enrolledCourses.includes(courseId);
  };

  // Ensure filteredCourses is always an array
  const safeFilteredCourses = Array.isArray(filteredCourses) ? filteredCourses : [];

  // Shimmer Loading Components - IMPROVED VERSION
  const CourseShimmer = () => (
    <div className="border border-gray-200 rounded-xl p-6 bg-white">
      {/* Category badge shimmer - replaces the colored span */}
      <div className="mb-4">
        <div className="w-20 h-4 bg-gray-200 rounded"></div>
      </div>
      
      {/* Course title shimmer - replaces h3 */}
      <div className="mb-3">
        <ShimmerTitle line={2} gap={10} variant="primary" />
      </div>
      
      
      {/* Rating and student count shimmer - replaces the div with stars */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className="flex items-center mr-2">
            <div className="w-4 h-4 bg-gray-200 rounded mr-1 animate-pulse"></div>
            <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        {/* Instructor, duration, level shimmer - replaces the flex justify-between */}
        <div className="flex justify-between text-sm">
          <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const CategoryShimmer = () => (
    <div className="px-6 py-3 rounded-full bg-gray-200">
      <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );


  return (
    <div className="min-h-screen bg-white">     
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">  
            Explore Our Courses
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">        
            Browse through a variety of courses to enhance your skills and knowledge. 
            Start your learning journey today!
          </p>
          
          {/* Favorites Counter */}
          {favorites.length > 0 && (
            <div className="inline-flex items-center justify-center px-4 py-2 bg-pink-50 border border-pink-200 rounded-full text-pink-700">
              <span className="mr-2">❤️</span>
              <span className="font-semibold">{favorites.length}</span>
              <span className="ml-2">courses in your wishlist</span>
            </div>
          )}
          
          {/* Enrolled Courses Counter */}
          {enrolledCourses.length > 0 && (
            <div className="inline-flex items-center justify-center px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 ml-4">
              <span className="mr-2">📚</span>
              <span className="font-semibold">{enrolledCourses.length}</span>
              <span className="ml-2">courses enrolled</span>
            </div>
          )}
        </div>

        {/* Initial Loading State with Shimmer */}
        {loading && (
          <div>
            {/* Category Filters Shimmer - IMPROVED */}
            <div className="mb-10">
              {/* Category title shimmer */}
              <div className="text-center mb-8">
                <div className="w-64 h-8 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                <div className="w-48 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
              </div>
              
              {/* Category buttons shimmer */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <CategoryShimmer key={index} />
                ))}
              </div>
              
              {/* Results count shimmer */}
              <div className="text-center mb-6">
                <div className="w-48 h-6 bg-gray-200 rounded mx-auto animate-pulse"></div>
              </div>
            </div>

            {/* Courses Grid Shimmer - IMPROVED */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 9 }).map((_, index) => (
                <CourseShimmer key={index} />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-center">
            <p className="text-yellow-800">{error}</p>
          </div>
        )}

        {/* Content when loaded */}
        {!loading && (
          <>
            {/* Category Filters */}
            <div ref={coursesRef} className="mb-10">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Browse by Category
              </h2>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {categories.map((category) => (
                  <button 
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              
              {/* Results Count */}
              <div className="text-center mb-6">
                <p className="text-lg text-gray-700">
                  Showing <span className="font-bold text-blue-600">{safeFilteredCourses.length}</span> 
                  {selectedCategory !== 'all' && ` ${categories.find(c => c.id === selectedCategory)?.name}`} courses
                  {hasMore && ' (Scroll down for more)'}
                </p>
              </div>
            </div>

            {/* Courses Grid - Real Courses */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safeFilteredCourses.length > 0 ? (
                safeFilteredCourses.map((course, index) => (
                  <div 
                    key={`${course.id}-${index}`}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white relative"
                  >      
                    {/* Favorite Heart Button */}
                    <button 
                      onClick={() => toggleFavorite(course.id)}
                      className="absolute top-6 right-6 text-2xl hover:scale-125 transition-transform duration-200 z-10"
                      aria-label={favorites.includes(course.id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {favorites.includes(course.id) ? '❤️' : '🤍'}
                    </button>
                    
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      {/* Category Badge */}
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        course.category === 'frontend' ? 'bg-blue-100 text-blue-800' :
                        course.category === 'backend' ? 'bg-green-100 text-green-800' :
                        course.category === 'fullstack' ? 'bg-purple-100 text-purple-800' :
                        course.category === 'data-science' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {course.category}
                      </span>
                      
                      {/* ENROLLED Badge - Right next to Category Badge */}
                      {isCourseEnrolled(course.id) && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                          <span className="mr-1">📚</span> ENROLLED
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 pr-10">{course.title}</h3>
                    <p className="text-gray-700 mb-4">{course.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-center mb-2">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="font-semibold">{course.rating || '4.5'}</span>
                        <span className="text-gray-500 ml-2">({course.students || '1000'} students)</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>👨‍🏫 {course.instructor || 'Expert Instructor'}</span>
                        <span>⏱️ {course.duration || '10 weeks'}</span>
                        <span>📊 {course.level || 'Intermediate'}</span>
                      </div>
                    </div>
                    
                    {/* Favorite Status Indicator */}
                    {favorites.includes(course.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center text-pink-600 text-sm">
                          <span className="mr-2">❤️</span>
                          <span>Added to your wishlist</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Enrolled Status Indicator */}
                    {isCourseEnrolled(course.id) && (
                      <div className="mt-1 pt-1 border-t border-gray-100">
                        <div className="flex items-center text-green-600 text-sm">
                          <span className="mr-2">✅</span>
                          <span>You are enrolled in this course</span>
                        </div>
                      </div>
                    )}
                    
                  </div>  
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <div className="text-5xl mb-4">😕</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h3>
                  <p className="text-gray-600">No courses available in this category. Try selecting a different category.</p>
                  <button 
                    onClick={() => handleCategoryChange('all')}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition"
                  >
                    Show All Courses
                  </button>
                </div>
              )}
            </div>

            {/* Shimmer Effect Courses when loading more */}
            {shimmerCourses.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {shimmerCourses.map((_, index) => (
                  <CourseShimmer key={`shimmer-${index}`} />
                ))}
              </div>
            )}


            {/* Load More Indicator */}
            {loadingMore && shimmerCourses.length === 0 && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600 mb-2">Loading more courses...</p>
                <p className="text-sm text-gray-500">This will take about 2 seconds</p>
              </div>
            )}

        
          </>
        )}
      </div>
    </div>
  );
}