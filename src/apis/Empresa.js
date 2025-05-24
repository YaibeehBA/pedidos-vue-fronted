import Api from '@/apis/Api';
import Csrf from './Csrf';

const Empresa = {
 
  async fetchEmpresa() {
    try {
  
      const token = localStorage.getItem('auth');
      if (!token) throw new Error('Token de autenticación no disponible');

      const response = await Api.get('admin/empresa', {
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

  async fetchEmpresaPublica() {
  try {
    const response = await Api.get('empresa-publico'); 
    return response.data || [];
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
},

 
  
  async createEmpresa(empresaData) {
    try {
      
      const token = localStorage.getItem('auth');
      if (!token) throw new Error('Token de autenticación no disponible');

      const response = await Api.post(
        'admin/empresa',
        empresaData,
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

  
  async updateImage(empresaId, updatedData) {
    try {
     
      const token = localStorage.getItem('auth');
      if (!token) throw new Error('Token de autenticación no disponible');

      const response = await Api.post(
        `admin/empresa/${empresaId}/actualizar`,
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
      console.error('Error al actualizar los datos de la empresa:', error);
      throw error;
    }
  },

 
  async deleteImage(empresaId) {
    try {
      
      const token = localStorage.getItem('auth');
      if (!token) throw new Error('Token de autenticación no disponible');

      const response = await Api.delete(
        `admin/empresa/${empresaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error al eliminar los datos de la empresa:', error);
      throw error;
    }
  },

 
  
};

export default Empresa;