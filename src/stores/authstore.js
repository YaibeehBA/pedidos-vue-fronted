import { defineStore } from 'pinia'
import User from '@/apis/User'

export const useUserStore = defineStore('user', {
  state: () => ({
    authenticated: false,
    token: null,
    user: null,
  }),

  actions: {
    async login(form) {
      try {
        const response = await User.login(form)
        if (response.data?.token) {
          this.setSession(response.data.token, response.data.user)
        }
      } catch (error) {
        if (import.meta.env.DEV) console.error('Error en login:', error)
        throw error
      }
    },

    async logout() {
      try {
        await User.logout()
      } catch (error) {
        if (import.meta.env.DEV) console.warn('Error en logout del servidor.')
      } finally {
        this.resetState()
      }
    },

    async syncAuthentication() {
      if (!this.token) {
        this.resetState()
        return
      }
      try {
        if (typeof User.getProfile === 'function') {
          const response = await User.getProfile()
          if (response.data) {
            this.authenticated = true
            this.user = response.data
          }
        } else {
          this.authenticated = true
          if (!this.user) this.user = {}
        }
      } catch (error) {
        if (error.response?.status === 401) {
          this.logout()
        } else {
          if (import.meta.env.DEV) console.warn('Error al sincronizar la autenticación:', error)
          if (this.token) this.authenticated = true
        }
      }
    },

    checkAuth() {
      const token = localStorage.getItem('auth')
      if (token) {
        this.token = token
        this.authenticated = true
        this.syncAuthentication()
      } else {
        this.resetState()
      }
    },

    setSession(token, user) {
      this.token = token
      this.authenticated = true
      this.user = user || null
      localStorage.setItem('auth', token)
    },

    resetState() {
      this.authenticated = false
      this.token = null
      this.user = null
      localStorage.removeItem('auth')
    },
  },

  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['authenticated', 'token', 'user'],
  },
})