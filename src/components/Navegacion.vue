

<!-- <script setup>
import User from '../apis/User';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import {show_alerta} from '../apis/Api';
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
userStore.checkAuth()  // Revisa si el usuario está autenticado
const router = useRouter();


const logout = async () => {
  try {
    // Realizamos la petición al backend para cerrar sesión
    const response = await User.logout();
    
    // Verificamos la respuesta
    if (response.data) {
      // Eliminamos el token de la sesión
      localStorage.removeItem('auth');
      
      // Redirigimos al usuario al Login
      router.push({ name: 'Login' });

      // Mostramos el mensaje de éxito
      show_alerta('Cierre de sesión con éxito', 'success', '');
    }
  } catch (error) {
    // En caso de error mostramos un alerta
    show_alerta('Error al cerrar sesión', 'error', '');
    console.error('Error:', error);
  }
};
</script> -->
<script setup>
import User from '../apis/User';
import { useRouter } from 'vue-router';
import { show_alerta } from '../apis/Api';
import { useUserStore } from '@/stores/authstore';

const userStore = useUserStore(); // Accede al store de usuario

const router = useRouter();

 const logout = async () => {
  try {
    // Realizamos la petición al backend para cerrar sesión
    const response = await User.logout();

    // Verificamos la respuesta
    if (response.data) {
      // Eliminamos el token de la sesión
       localStorage.removeItem('auth');
      
      // // Actualizamos el estado de autenticación en el store de Pinia
       userStore.authenticated = false;
      userStore.token = null;
      userStore.user = null;
     

      // Redirigimos al usuario al Login
      router.push({ name: 'Login' });

      // Mostramos el mensaje de éxito
      show_alerta('Cierre de sesión con éxito', 'success', '');
    }
  } catch (error) {
    // En caso de error mostramos una alerta
    show_alerta('Error al cerrar sesión', 'error', '');
    console.error('Error:', error);
  }
};



</script>


<template>
  <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container">
          <!-- Logo -->
          <div class="navbar-brand-container" style="display: flex; align-items: center; gap: 10px; width: 200px;">
            
             
                <router-link to="/" class="navbar-brand fw-bold fs-2">

                  <img src="https://img.freepik.com/vector-premium/mujer-nativa-americana-mas-cincuenta-anos-haciendo-mocasines_1238364-97558.jpg?semt=ais_hybrid" height="50" alt="Logo" />
                </router-link>
              
              <router-link to="/" class="navbar-brand fw-bold fs-2">New Blessings</router-link>
          </div>

          <!-- Botón hamburguesa para móvil -->
          <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
              <span class="navbar-toggler-icon"></span>
          </button>

          <!-- Contenido del navbar -->
          <div class="collapse navbar-collapse" id="navbarContent">
              <!-- Enlaces centrados -->
              <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                      <!-- MARCO PLS -->
                  </li>
                  

                  <li class="nav-item" v-if="userStore.authenticated">
                      <router-link  class="nav-item nav-link" :to="{ name: 'Pedidos' }">
                          Mis Pedidos
                      </router-link>
                  </li>
                  <li class="nav-item" v-if="userStore.authenticated" >
                    <router-link @click.prevent="logout" class="nav-link" to="/logout">Salir</router-link>
                  </li>
              </ul>

              <!-- Iconos de la derecha -->
              <div class="d-flex align-items-center gap-3">
                  <!-- carrito -->
                  <!-- <button class="btn border-0 mb-1"> 
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
          </svg>

        </button> -->
        <div v-if="!userStore.authenticated">

          <button class="btn d-flex align-items-center border-0 nav-link  py-2">
            <span class="material-icons px-2">login</span>
              <router-link  class="nav-item text-dark text-decoration-none" :to="{ name: 'Login' }">
                  Iniciar sesión
              </router-link>
          </button>
        </div>
              </div>
          </div>
      </div>
  </nav>
</template>


<style scoped>
.navbar {
  padding: 1.2rem 0;
  background-color: white;
  border-bottom: 1px solid #eee;
}

.nav-link {
  color: #333 !important;
 
  text-transform: capitalize;
  position: relative;
}

/* Efecto hover con línea roja debajo */
.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  background: #ff0000;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  transition: width 0.3s ease-in-out;
}

.nav-link:hover::after {
  width: 100%;
}



.btn i {
  color: #333;
  font-size: 1.1rem;
}

.btn:hover i {
  color: #666;
}
</style>