import Api from '@/apis/Api';
import Csrf from './Csrf';

const Ciudades = {
 
  async fetchCiudades() {
    try {
  
      const token = localStorage.getItem('auth');
      if (!token) throw new Error('Token de autenticación no disponible');

      const response = await Api.get('admin/ciudades-envio', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

     return response.data || [];
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      throw error;
    }
  },

  async fetchCiudadesPublica() {
  try {
    const response = await Api.get('ciudades-publico'); 
    return response.data || [];
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
},

 
  
  async createCiudades(ciudadesData) {
    try {
      
      const token = localStorage.getItem('auth');
      if (!token) throw new Error('Token de autenticación no disponible');

      const response = await Api.post(
        'admin/ciudades-envio',
        ciudadesData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error al subir los datos:', error);
      throw error;
    }
  },

  
async updateCiudades(ciudadesId, updatedData) {
  try {
    const token = localStorage.getItem('auth');
    if (!token) throw new Error('Token de autenticación no disponible');

    const response = await Api.put(
      `admin/ciudades-envio/${ciudadesId}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error al actualizar los datos de la ciudades:', error.response?.data || error.message);
    throw error;
  }
},


 
  async deleteCiudades(ciudadesId) {
    try {
      
      const token = localStorage.getItem('auth');
      if (!token) throw new Error('Token de autenticación no disponible');

      const response = await Api.delete(
        `admin/ciudades-envio/${ciudadesId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error al eliminar los datos de la ciudades:', error);
      throw error;
    }
  },

 
  
};

export default Ciudades;