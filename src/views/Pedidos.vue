<template>
  <div class="container my-4">
    <h3>Mis Órdenes</h3>

    <div v-if="!user" class="text-center my-3">
      <p>Cargando usuario...</p>
    </div>

    <!-- Filtro de estado -->
    <div class="mb-3">
      <label for="estadoFilter" class="form-label">Filtrar por Estado:</label>
      <select v-model="estadoFilter" class="form-select" id="estadoFilter">
        <option value="">Todos</option>
        <option value="pendiente">Pendiente</option>
        <option value="aprobada">Aprobada</option>
        <option value="rechazada">Rechazada</option>
        <option value="pagada">Pagada</option>
        <option value="entregada">Entregada</option>
      </select>
    </div>

    <div v-if="orders.length > 0">
      <table class="table table-striped table-bordered table-sm">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Fecha de Entrega</th>
            <th scope="col">Estado</th>
            <th scope="col">Monto Total</th>
            <th scope="col">Detalles</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(orden, index) in filteredOrders" :key="orden.id">
            <td>{{ index + 1 }}</td>
            <td>{{ new Date(orden.fecha_entrega).toLocaleDateString('es-ES') }}</td>
            <td>
              <span class="badge" :class="{
                'bg-warning': orden.estado === 'pendiente',
                'bg-success': orden.estado === 'aprobada' || orden.estado === 'pagada' || orden.estado === 'entregada',
                'bg-danger': orden.estado === 'rechazada'
              }">
                {{ orden.estado }}
              </span>
            </td>
            <td>{{ formatCurrency(orden.monto_total) }}</td>
            <td>
              <button class="btn btn-info btn-sm" @click="showDetails(orden.id)" data-bs-toggle="modal" data-bs-target="#orderDetailModal">
                <i class="material-icons">info</i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center my-3">
      <p>No tienes órdenes registradas.</p>
    </div>

   <!-- Modal para mostrar detalles -->
<div class="modal fade" id="orderDetailModal" tabindex="-1" aria-labelledby="orderDetailModalLabel" aria-hidden="true" v-if="selectedOrder">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="orderDetailModalLabel">Detalles de la Orden</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <ul>
          <li><strong>Fecha de Entrega: </strong>{{ new Date(selectedOrder.fecha_entrega).toLocaleDateString('es-ES') }}</li>
          <li><strong>Estado: </strong>{{ selectedOrder.estado }}</li>
          <li><strong>Monto Total: </strong>{{ formatCurrency(selectedOrder.monto_total) }}</li>
          
          <li v-for="detalle in selectedOrder.detalles_orden" :key="detalle.id">
            <strong>Producto: </strong>{{ detalle.detalle_producto.producto.nombre }} - 
            <strong>Cantidad: </strong>{{ detalle.cantidad }} - 
            <strong>Subtotal: </strong>{{ formatCurrency(detalle.subtotal) }} 

            <!-- Imagen del producto -->
            <div class="mt-3">
              <img :src="`${IMAGE_BASE_URL}/${detalle.detalle_producto.imagen_url}`" alt="Imagen del producto" class="img-fluid" />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>


  </div>
</template>
<script setup>
import { ref, onMounted ,computed} from "vue";
import { PublicApi } from "@/apis/Api";
import User from '@/apis/User';
import { IMAGE_BASE_URL } from "@/apis/Api";

// Variables reactivas
const user = ref(null);
const orders = ref([]);
const selectedOrder = ref(null);
const estadoFilter = ref(''); // Almacenar el valor del filtro

// Cargar el usuario
const loadUser = async () => {
  try {
    const response = await User.UsuarioActual();
    if (response) {
      user.value = response;
      loadOrders(user.value.id);  // Cargar órdenes una vez el usuario esté autenticado
    }
  } catch (error) {
    console.error('Error al cargar el usuario:', error);
  }
};

// Cargar órdenes de usuario
const loadOrders = async (userId) => {
  try {
    const response = await PublicApi.get(`ordenes/usuario/${userId}`);
    if (response.status === 200) {
      orders.value = response.data.ordenes;
    } else {
      console.log('No se pudieron cargar las órdenes.');
    }
  } catch (error) {
    console.error('Error al cargar órdenes:', error);
  }
};

// Mostrar detalles de la orden
const showDetails = (ordenId) => {
  selectedOrder.value = orders.value.find(orden => orden.id === ordenId);
};

// Formateo de moneda
const formatCurrency = (amount) => {
  return parseFloat(amount).toLocaleString('es-EC', {
    style: 'currency',
    currency: 'USD'
  });
};

// Computada para filtrar las órdenes por estado
const filteredOrders = computed(() => {
  if (!estadoFilter.value) {
    return orders.value; // Si no hay filtro, mostrar todas las órdenes
  }
  return orders.value.filter(orden => orden.estado === estadoFilter.value);
});

// Cargar usuario al montar el componente
onMounted(() => {
  loadUser();
});
</script>

<style scoped>
.table {
  width: 100%;
}

.btn {
  text-transform: uppercase;
  font-size: 14px;
}

.modal-dialog {
  max-width: 800px;
}

.modal-content {
  background-color: #f9f9f9;
}

.modal-header, .modal-body {
  padding: 1rem;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
}
</style>