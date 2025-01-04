import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminLayout from '..//components/admin/AdminLayout.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import Categorias from '../views/admin/Categorias.vue'
import Usuarios from '../views/admin/Usuarios.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/Login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      
    },
    {
      path: '/Registro',
      name: 'Registro',
      component: () => import('../views/Registro.vue'),
     
    },
    {
      path: '/Pedidos',
      name: 'Pedidos',
      component: () => import('../views/Pedidos.vue'),
      
    },
    {
      path: '/admin',
      name: 'AdminLayout',
      component: () => import('../components/admin/AdminLayout.vue'), // Carga dinámica para el layout
    },
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      component: () => import('../views/admin/Dashboard.vue'), // Vista de Dashboard
    },
    {
      path: '/admin/categorias',
      name: 'Categorias',
      component: () => import('../views/admin/Categorias.vue'), // Vista de Categorías
    },
    {
      path: '/admin/usuarios',
      name: 'Usuarios',
      component: () => import('../views/admin/Usuarios.vue'), // Vista de Usuarios
    },

  ],
})





export default router
