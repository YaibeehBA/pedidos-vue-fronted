// import { defineStore } from 'pinia';
// import User from '@/apis/User'; 

// export const useUserStore = defineStore('user', {
//   state: () => ({
//     authenticated: false,
//     token: localStorage.getItem('auth') || null,
//     user: null,
//   }),
//   actions: {
//     async login(form) {
//       try {
//         const response = await User.login(form);
//         if (response.data.token) {
//           this.token = response.data.token;
//           localStorage.setItem('auth', this.token);
//           this.authenticated = true;
//         }
//       } catch (error) {
//         console.error('Error en login:', error);
//         throw error;
//       }
//     },
//     async logout() {
//       try {
//         await User.logout();
//         this.authenticated = false;
//         this.token = null;
//         localStorage.removeItem('auth');
//       } catch (error) {
//         console.error('Error en logout:', error);
//         throw error;
//       }
//     },
//     checkAuth() {
//       this.authenticated = !!this.token;
//     },
//   },
// });


import { defineStore } from 'pinia';
import User from '@/apis/User';

export const useUserStore = defineStore('user', {
  state: () => ({
    authenticated: false,
    token: localStorage.getItem('auth') || null,
    user: null, // Información del usuario logueado
  }),

  actions: {
    // Acción para iniciar sesión
    async login(form) {
      try {
        const response = await User.login(form);
        if (response.data && response.data.token) {
          this.token = response.data.token;
          localStorage.setItem('auth', this.token);
          this.authenticated = true;

          // Decodificar o sincronizar información del usuario
          this.user = response.data.user || null; // Si el servidor envía datos del usuario
        }
      } catch (error) {
        console.error('Error en login:', error);
        throw error; // Lanza el error para manejarlo en el componente
      }
    },

    // Acción para cerrar sesión
    async logout() {
      try {
        await User.logout(); // Si tu API requiere un logout en el servidor
      } catch (error) {
        console.warn('Error en logout del servidor. Continuando con logout local.');
      } finally {
        this.authenticated = false;
        this.token = null;
        this.user = null;
        localStorage.removeItem('auth');
      }
    },

    // Sincronizar el estado del usuario a partir del token en el localStorage
    syncAuthentication() {
      const token = localStorage.getItem('auth');
      if (token) {
        this.token = token;
        this.authenticated = true;
        // Opcionalmente, puedes decodificar el token si contiene datos del usuario
        // Ejemplo: Decodificar JWT y obtener usuario
        this.user = this.user || null; // Asegúrate de manejar el usuario correctamente
      } else {
        this.authenticated = false;
        this.token = null;
        this.user = null;
      }
    },

    // Verificar el estado de autenticación
    checkAuth() {
      this.authenticated = !!this.token;
    },
   
  },
});
