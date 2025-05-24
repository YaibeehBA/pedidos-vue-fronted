import Api from '@/apis/Api';
import Csrf from './Csrf';

const Carrusel = {
 
  async fetchImages() {
    try {
  
      const token = localStorage.getItem('auth');
      if (!token) throw new Error('Token de autenticación no disponible');

      const response = await Api.get('admin/carrusel', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

     return response.data || [];
    } catch (error) {
      console.error('Error al obtener imágenes del carrusel:', error);
      throw error;
    }
  },

  async fetchImagesPublica() {
  try {
    const response = await Api.get('carrusel-publico'); // sin headers
    return response.data || [];
  } catch (error) {
    console.error('Error al obtener imágenes del carrusel:', error);
    throw error;
  }
},

 
  
  async createImage(imageData) {
    try {
      
      const token = localStorage.getItem('auth');
      if (!token) throw new Error('Token de autenticación no disponible');

      const response = await Api.post(
        'admin/carrusel',
        imageData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error al subir imagen al carrusel:', error);
      throw error;
    }
  },

  
  async updateImage(imageId, updatedData) {
    try {
     
      const token = localStorage.getItem('auth');
      if (!token) throw new Error('Token de autenticación no disponible');

      const response = await Api.post(
        `admin/carrusel/${imageId}/actualizar`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error al actualizar imagen del carrusel:', error);
      throw error;
    }
  },

 
  async deleteImage(imageId) {
    try {
      
      const token = localStorage.getItem('auth');
      if (!token) throw new Error('Token de autenticación no disponible');

      const response = await Api.delete(
        `admin/carrusel/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error al eliminar imagen del carrusel:', error);
      throw error;
    }
  },

 
  
};

export default Carrusel;