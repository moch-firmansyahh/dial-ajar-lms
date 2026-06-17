import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  token: null,
  user: null,       // { nama, nomorInduk, role: 'DOSEN' | 'MAHASISWA' }
  isLoggedIn: false,

  login: (token, user, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem('token', token)
    storage.setItem('user', JSON.stringify(user))
    set({ token, user, isLoggedIn: true })
  },
  
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    set({ token: null, user: null, isLoggedIn: false })
  },
  
  // Hydrate state on load
  initAuth: () => {
    let token = localStorage.getItem('token')
    let userStr = localStorage.getItem('user')
    if (!token || !userStr) {
      token = sessionStorage.getItem('token')
      userStr = sessionStorage.getItem('user')
    }
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        set({ token, user, isLoggedIn: true })
      } catch (e) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
      }
    }
  }
}))
