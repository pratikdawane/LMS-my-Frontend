import api from './api'

export const paymentService = {
  getKey: async () => {
    const res = await api.get('/payments/key')
    return res.data.data
  }
}