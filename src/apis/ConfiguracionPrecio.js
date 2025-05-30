import Api from '@/apis/Api';
import Csrf from './Csrf';

const ConfiguracionPrecio = {
 
  async fetchConfigPrecio() {
    try {
  
      const token = localStorage.getItem('auth');
      if (!token) throw new Error('Token de autenticación no disponible');

      const response = await Api.get('admin/configuracion-envio', {
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

  async fetchConfigPrecioPublica() {
  try {
    const response = await Api.get('configuracion-envio-publico'); 
    return response.data || [];
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
},

 
  
  async createConfigPrecio(configuracion_envioData) {
    try {
      
      const token = localStorage.getItem('auth');
      if (!token) throw new Error('Token de autenticación no disponible');

      const response = await Api.post(
        'admin/configuracion-envio',
        configuracion_envioData,
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

  
async updateConfigPrecio(updatedData) {
  try {
    const token = localStorage.getItem('auth');
    if (!token) throw new Error('Token de autenticación no disponible');

    // Asegúrate que updatedData contiene precio_por_kg
    if (!updatedData.precio_por_kg) {
      throw new Error('El campo precio_por_kg es requerido');
    }

    const response = await Api.put(
      'admin/configuracion-envio', 
      {
        precio_por_kg: updatedData.precio_por_kg
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Cambiado a JSON
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error al actualizar la configuración:', error);
    throw error;
  }
},
 
  async deleteConfigPrecio(configuracion_envioId) {
    try {
      
      const token = localStorage.getItem('auth');
      if (!token) throw new Error('Token de autenticación no disponible');

      const response = await Api.delete(
        `admin/configuracion-envio/${configuracion_envioId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error al eliminar los datos de la configuracion-envio:', error);
      throw error;
    }
  },

 
  
};

export default ConfiguracionPrecio;