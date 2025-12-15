import api from './api'

export const enrollmentService = {
  my: async () => {
    const res = await api.get('/enrollments/me')
    return res.data.data
  }
}