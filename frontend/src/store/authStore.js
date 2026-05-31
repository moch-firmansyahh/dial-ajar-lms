import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  token: null,
  user: null,       // { nama, nomorInduk, role: 'DOSEN' | 'MAHASISWA' }
  isLoggedIn: false,

  login: (token, user) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ token, user, isLoggedIn: true })
  },
  
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: null, user: null, isLoggedIn: false })
  },
  
  // Hydrate state on load
  initAuth: () => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        set({ token, user, isLoggedIn: true })
      } catch (e) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }
}))
