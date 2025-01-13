<script setup>
import { ref, onMounted } from 'vue';
import User from '../../apis/User';

const orders = ref([]);
const users = ref([]);
const selectedOrder = ref(null);
const showModal = ref(false);
const editForm = ref({
  estado: '',
  estado_pago: ''
});

const estadoOptions = ['pendiente', 'aprobada', 'rechazada', 'pagada', 'entregada'];
const estadoPagoOptions = ['pendiente', 'completado'];

const fetchOrders = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/public/ordenes');
    orders.value = await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

const fetchUsers = async () => {
  try {
    users.value = await User.fetchUsuarios();
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getUserName = (userId) => {
  const user = users.value.find(u => u.id === userId);
  return user ? `${user.nombre} ${user.apellido}` : 'Usuario no encontrado';
};

const openModal = (order) => {
  selectedOrder.value = order;
  editForm.value = {
    estado: order.estado,
    estado_pago: order.estado_pago
  };
  showModal.value = true;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  showModal.value = false;
  document.body.style.overflow = 'auto';
};

const updateOrder = async () => {
  try {
    const response = await fetch(`http://localhost:8000/api/public/ordenes/${selectedOrder.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editForm.value)
    });
    
    if (response.ok) {
      await fetchOrders();
      closeModal();
    }
  } catch (error) {
    console.error('Error updating order:', error);
  }
};

const getStatusClass = (status) => {
  const classes = {
    pendiente: 'bg-warning',
    aprobada: 'bg-success',
    rechazada: 'bg-danger',
    pagada: 'bg-info',
    entregada: 'bg-primary'
  };
  return `badge ${classes[status] || 'bg-secondary'} text-white`;
};

onMounted(() => {
  fetchOrders();
  fetchUsers();
});
</script>

<template>
  <div class="container-fluid position-relative">
    <h2 class="mb-4">Gestión de Órdenes</h2>
    
    <!-- Table -->
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Monto Total</th>
            <th>Fecha Entrega</th>
            <th>Estado</th>
            <th>Estado Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>#{{ order.id }}</td>
            <td>{{ getUserName(order.usuario_id) }}</td>
            <td>${{ order.monto_total }}</td>
            <td>{{ new Date(order.fecha_entrega).toLocaleDateString() }}</td>
            <td><span :class="getStatusClass(order.estado)">{{ order.estado }}</span></td>
            <td><span :class="getStatusClass(order.estado_pago)">{{ order.estado_pago }}</span></td>
            <td>
              <button class="btn btn-sm btn-primary" @click.stop="openModal(order)">
                <i class="material-icons">visibility</i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-wrapper">
        <div class="custom-modal-backdrop" @click="closeModal"></div>
        <div class="modal" tabindex="-1" role="dialog" style="display: block;">
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Detalles de la Orden #{{ selectedOrder?.id }}</h5>
                <button type="button" class="btn-close" @click="closeModal"></button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <!-- Order Details -->
                  <div class="col-md-6">
                    <h6>Información de la Orden</h6>
                    <div class="mb-3">
                      <label class="form-label">Estado</label>
                      <select v-model="editForm.estado" class="form-select">
                        <option v-for="option in estadoOptions" :key="option" :value="option">
                          {{ option }}
                        </option>
                      </select>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Estado de Pago</label>
                      <select v-model="editForm.estado_pago" class="form-select">
                        <option v-for="option in estadoPagoOptions" :key="option" :value="option">
                          {{ option }}
                        </option>
                      </select>
                    </div>
                    <div class="mb-3">
                      <p><strong>Fecha de Entrega:</strong> {{ new Date(selectedOrder?.fecha_entrega).toLocaleDateString() }}</p>
                      <p><strong>Fecha de Creación:</strong> {{ new Date(selectedOrder?.created_at).toLocaleString() }}</p>
                    </div>
                  </div>
                  
                  <!-- Products Details -->
                  <div class="col-md-6">
                    <h6>Productos</h6>
                    <div v-for="detalle in selectedOrder?.detalles" :key="detalle.id" class="card mb-2">
                      <div class="card-body">
                        <h6>{{ detalle.detalle_producto.producto.nombre }}</h6>
                        <p class="mb-1">Cantidad: {{ detalle.cantidad }}</p>
                        <p class="mb-1">Precio: ${{ detalle.precio_unitario }}</p>
                        <p class="mb-0">Subtotal: ${{ detalle.subtotal }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">Cerrar</button>
                <button type="button" class="btn btn-primary" @click="updateOrder">Guardar Cambios</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.custom-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal {
  position: relative;
  z-index: 1050;
  width: 100%;
}

.modal-dialog {
  margin: 1.75rem auto;
  pointer-events: auto;
}

.badge {
  font-size: 0.875rem;
  padding: 0.5em 0.75em;
}

.table-responsive {
  z-index: 1;
}
</style>