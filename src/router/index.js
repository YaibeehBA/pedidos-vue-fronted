import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AdminLayout from '../components/admin/AdminLayout.vue';
import Dashboard from '../views/admin/Dashboard.vue';
import Categorias from '../views/admin/Categorias.vue';
import Usuarios from '../views/admin/Usuarios.vue';
import Tallas from '@/views/admin/Tallas.vue';
import Colores from '@/views/admin/Colores.vue';
import ProductoBase from '@/views/admin/ProductoBase.vue';
import ProductoFinal from '@/views/admin/ProductoFinal.vue';

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
      path: '/DetalleProducto/:id',
      name: 'DetalleProducto',
      component: () => import('../views/ProductView.vue'),
      
    },
    {
      path: '/PedidoOrden',
      name: 'PedidoOrden',
      component: () => import('../views/pedidos/PedidoOrden.vue'),
      
    },
    {
      path: '/OlvideContrasena',
      name: 'OlvideContrasena',
      component: () => import('../views/OlvideContrasena.vue'),
    },
    {
      path: '/RestablecerContrasena',
      name: 'RestablecerContrasena',
      component: () => import('../views/RestablecerContrasena.vue'),
    },
    {
      path: '/Pedidos',
      name: 'Pedidos',
      component: () => import('../views/Pedidos.vue'),
    },
    {
      path: '/admin',
      name:AdminLayout,
      component: AdminLayout,  // 'AdminLayout' es ahora un contenedor
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: Dashboard,  // Ruta por defecto al entrar al admin
        },
        {
          path: 'categorias',  // Rutas hijas de '/admin'
          name: 'Categorias',
          component: Categorias,
        }, {
          path: 'tallas',  // Rutas hijas de '/admin'
          name: 'tallas',
          component: Tallas,
        },
        {
          path: 'colores',
          name: 'colores',
          component: Colores,
        },
        {
          path: 'productobase',
          name: 'productobase',
          component: ProductoBase,
        },
        {
          path: 'productofinal',
          name: 'productofinal',
          component: ProductoFinal,
        },
        {
          path: 'usuarios',
          name: 'usuarios',
          component: Usuarios,
        },
        {
          path: 'usuarios',
          name: 'Usuarios',
          component: Usuarios,
        },
      ],
    },
  ],
});




export default router
