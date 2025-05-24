<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
import User from '@/apis/User';
import { show_alerta } from '@/apis/Api';
import { useUserStore } from '@/stores/authstore';

const userStore = useUserStore(); // Accede al store de usuario
const router = useRouter();



const isExpanded = ref(true);
const isDropdownOpen = ref({ 
  products: false,
  settings: false    // 👈 Añadido
});



const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};

const toggleDropdown = (menu) => {
  isDropdownOpen.value[menu] = !isDropdownOpen.value[menu];
};

</script>

<template>
  <aside :class="['sidebar bg-white shadow d-flex flex-column', { 'collapsed': !isExpanded }]">
    <div class="sidebar-header d-flex align-items-center justify-content-between p-4">
      <h1 class="fs-4 fw-semibold text-center mb-0" v-show="isExpanded">Panel de Administración</h1>
      <button @click="toggleSidebar" class="btn btn-link p-0" :class="{ 'ms-auto': isExpanded }">
        <span class="material-icons px-3 text-secondary">{{ isExpanded ? 'menu_open' : 'menu' }}</span>
      </button>
    </div>
    
    <nav class="mt-4 flex-grow-1">
      <ul class="nav flex-column list-unstyled">
        <li class="nav-item">
          <RouterLink to="/admin" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">dashboard</span>
            <span v-show="isExpanded">Dashboard</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/admin/reportes" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">summarize</span>
            <span v-show="isExpanded">Reportes</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <div class="nav-link d-flex align-items-center px-4 py-2 text-dark" @click="toggleDropdown('products')">
            <span class="material-icons me-3">shopping_bag</span>
            <span v-show="isExpanded">Productos</span>
            <span class="material-icons ms-auto" :class="{ 'icon-fixed': isExpanded }" v-if="isDropdownOpen.products">expand_less</span>
            <span class="material-icons ms-auto" :class="{ 'icon-fixed': isExpanded }" v-else>expand_more</span>
          </div>
          <ul v-if="isDropdownOpen.products" class="list-unstyled ps-4">
            <li class="nav-item">
              <RouterLink to="/admin/productobase" class="nav-link d-flex align-items-center py-2 text-dark">
                <span class="material-icons me-2">layers</span>
                Base
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/admin/productofinal" class="nav-link d-flex align-items-center py-2 text-dark">
                <span class="material-icons me-2">check_circle</span>
                Finales
              </RouterLink>
            </li>
          </ul>
        </li>
        <li class="nav-item">
          <RouterLink to="/admin/pedidosadmin" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">receipt_long</span>
            <span v-show="isExpanded">Pedidos</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/admin/descuentos" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">savings</span>
            <span v-show="isExpanded">Descuentos</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/admin/categorias" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">category</span>
            <span v-show="isExpanded">Categorías</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/admin/tallas" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">checkroom</span>
            <span v-show="isExpanded">Tallas</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/admin/colores" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">palette</span>
            <span v-show="isExpanded">Colores</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/admin/usuarios" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">person</span>
            <span v-show="isExpanded">Usuarios</span>
          </RouterLink>
        </li>
             <li class="nav-item">
              <div class="nav-link d-flex align-items-center px-4 py-2 text-dark" @click="toggleDropdown('settings')">
                <span class="material-icons me-3">settings</span>
                <span v-show="isExpanded">Ajustes</span>
                <span class="material-icons ms-auto" :class="{ 'icon-fixed': isExpanded }" v-if="isDropdownOpen.settings">expand_less</span>
                <span class="material-icons ms-auto" :class="{ 'icon-fixed': isExpanded }" v-else>expand_more</span>
              </div>
              <ul v-if="isDropdownOpen.settings" class="list-unstyled ps-4">
                <li class="nav-item">
                  <RouterLink to="/admin/empresa" class="nav-link d-flex align-items-center py-2 text-dark">
                    <span class="material-icons me-2">business</span>
                    Empresa
                  </RouterLink>
                </li>
                <li class="nav-item">
                  <RouterLink to="/admin/carrusel" class="nav-link d-flex align-items-center py-2 text-dark">
                    <span class="material-icons me-2">photo_library</span>
                    Imagenes
                  </RouterLink>
                </li>
              </ul>
            </li>

      </ul>
    </nav>
  </aside>
</template>
<style scoped>

.sidebar {
  width: 250px; /* Ancho del sidebar */
  min-height: 100vh; /* Ocupa toda la altura de la pantalla */
  transition: width 0.3s;
}

.sidebar.collapsed {
  width: 80px; /* Ancho del sidebar colapsado */
}

/* Estilo para fijar el ancho del ícono de expansión */
.icon-fixed {
  width: 24px; /* Ancho fijo para el ícono */
  text-align: center; /* Centrar el ícono */
}

.nav-link {
  transition: background-color 0.3s;
  white-space: nowrap;
  overflow: hidden;
}

.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-link.router-link-active {
  background-color: rgba(0, 0, 0, 0.08);
  font-weight: 500;
}



ul.list-unstyled li a {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

ul.list-unstyled li span.material-icons {
  font-size: 1rem;
  color: #0a131b; /* Color gris estándar */
}


</style>
