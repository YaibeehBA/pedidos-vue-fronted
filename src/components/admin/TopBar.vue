<template>
    <nav class="topbar bg-white shadow-sm">
      <div class="container-fluid d-flex align-items-center justify-content-between px-4">
        <!-- Nombre del usuario (a la izquierda) -->
        <span class="navbar-brand mb-0 h1">Bienvenido, {{ formattedUserName }}</span>
  
        <!-- Botones de notificaciones y salir (a la derecha) -->
        <div class="d-flex align-items-center gap-3">
          <!-- Botón de notificaciones -->
          <button class="btn btn-link text-dark p-0" @click="toggleNotifications">
            <span class="material-icons">notifications</span>
          </button>
  
          <!-- Botón de salir -->
          <button class="btn btn-link text-dark p-0" @click="logout">
            <span class="material-icons">logout</span>
            <span class="ms-2">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref ,computed} from 'vue';
  import User from '@/apis/User';
  import { useUserStore } from '@/stores/authstore';
  import { useRouter } from 'vue-router';
  import { show_alerta } from '@/apis/Api';
  
  const userStore = useUserStore();
  const router = useRouter();
  

  const formattedUserName = computed(() => {
  const name = userStore.user.nombre || '';
  const lastName = userStore.user.apellido || '';
  return `${name.charAt(0).toUpperCase() + name.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`;
});
  // Función para manejar el cierre de sesión
  const logout = async () => {
    try {
      // Realizamos la petición al backend para cerrar sesión
      const response = await User.logout();
  
      // Verificamos la respuesta
      if (response.data) {
        // Eliminamos el token de la sesión
        localStorage.removeItem('auth');
  
        // Actualizamos el estado de autenticación en el store de Pinia
        userStore.authenticated = false;
        userStore.token = null;
        userStore.user = null;
  
        // Redirigimos al usuario al Login
        router.push({ name: 'home' });
  
        // Mostramos el mensaje de éxito
        show_alerta('Cierre de sesión con éxito', 'success', '');
      }
    } catch (error) {
      // En caso de error mostramos una alerta
      show_alerta('Error al cerrar sesión', 'error', '');
      console.error('Error:', error);
    }
  };
  
  // Función para manejar las notificaciones
  const toggleNotifications = () => {
    console.log('Mostrar/ocultar notificaciones...');
    // Aquí puedes agregar la lógica para mostrar notificaciones
  };
  </script>
  
  <style scoped>
  .topbar {
    height: 60px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .navbar-brand {
    font-size: 1.25rem; /* Tamaño del texto del nombre */
    font-weight: 500; /* Grosor de la fuente */
  }
  
  .btn-link {
    text-decoration: none; /* Quitar subrayado de los botones */
    display: flex;
    align-items: center;
  }
  
  .btn-link:hover {
    opacity: 0.8; /* Efecto hover suave */
  }
  
  .material-icons {
    font-size: 24px; /* Tamaño de los íconos */
  }
  </style>