import Api from '@/apis/Api'
import Csrf from '../apis/Csrf';

const User = {
  async register(form) {
    try {
      await Csrf.getCookie();
      const response = await Api.post('/auth/register', form); 
      return response;
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  },
  async login(form) {
    try {
      await Csrf.getCookie();
      const response = await Api.post('/auth/login', form); 
      return response;
    } catch (error) {
      console.error('Error al iniciar session:', error);
      throw error;
    }
  },
  async logout() {
    try {
      await Csrf.getCookie();  // Obtenemos y validamos el token CSRF
  
      const token = localStorage.getItem('auth');  // Obtenemos el token de autenticación
      if (!token) {
        throw new Error('No estás autenticado');
      }
  
      // Realizamos la solicitud GET para cerrar sesión con el token CSRF
      const response = await Api.get('/auth/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Eliminar el token después de logout
      if (response.data) {
        localStorage.removeItem('auth');
      }
  
      return response;
  
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }
  

};

export default User;