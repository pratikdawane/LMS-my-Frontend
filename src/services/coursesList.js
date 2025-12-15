
// craete a service to fetch the list of courses from the backend API

import api from './api'   


export const fetchCourses = async () => {
  try {
    const response = await api.get('/courses')  
    return response.data
    } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  } 
}





