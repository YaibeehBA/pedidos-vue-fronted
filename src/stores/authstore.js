import { defineStore } from 'pinia';
import User from '@/apis/User'; 

export const useUserStore = defineStore('user', {
  state: () => ({
    authenticated: false,
    token: localStorage.getItem('auth') || null,
    user: null,
  }),
  actions: {
    async login(form) {
      try {
        const response = await User.login(form);
        if (response.data.token) {
          this.token = response.data.token;
          localStorage.setItem('auth', this.token);
          this.authenticated = true;
        }
      } catch (error) {
        console.error('Error en login:', error);
        throw error;
      }
    },
    async logout() {
      try {
        await User.logout();
        this.authenticated = false;
        this.token = null;
        localStorage.removeItem('auth');
      } catch (error) {
        console.error('Error en logout:', error);
        throw error;
      }
    },
    checkAuth() {
      this.authenticated = !!this.token;
    },
  },
});


