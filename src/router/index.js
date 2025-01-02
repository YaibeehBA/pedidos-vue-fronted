import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
  ],
})





export default router
