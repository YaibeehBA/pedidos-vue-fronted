<template>
  <div class="bg-light min-vh-100" v-if="hasDataLoaded">
    <!-- Header con progreso -->
    <div class="bg-white shadow-sm py-3" style="margin-left: 145px; margin-top: 20px; margin-right: 145px;">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="d-flex align-items-center justify-content-center position-relative" style="max-width: 400px; margin: 0 auto;">
              <!-- Paso 1: Carrito (Completado) -->
              <div class="d-flex flex-column align-items-center position-relative" style="flex: 0 0 auto;">
                <div class="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">
                  <span class="material-icons" style="font-size: 1.2rem;">shopping_cart</span>
                </div>

                <span class="fw-medium text-success mt-1" style="font-size: 0.8rem;">Carrito</span>
                <div class="position-absolute top-0 start-100 translate-middle">
                  <span class="material-icons text-success" style="font-size: 1.2rem;">check_circle</span>
                </div>
              </div>

              <!-- Línea conectora -->
              <div class="flex-grow-1 mx-2" style="height: 2px; background-color: #e9ecef; position: relative; top: -8px;">
                <div class="h-100 bg-success" style="width: 100%;"></div>
              </div>

              <!-- Paso 2: Pago (Activo) -->
              <div class="d-flex flex-column align-items-center position-relative" style="flex: 0 0 auto;">
                <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center position-relative" style="width: 36px; height: 36px; z-index: 2;">
                  <span class="material-icons" style="font-size: 1.2rem;">credit_card</span>
                </div>
                <span class="fw-bold text-primary mt-1" style="font-size: 0.8rem;">Pago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="container py-5">
      <div class="row justify-content-center g-4">
        <!-- Columna principal: Información y entrega -->
        <div class="col-lg-8">
          <!-- Información del cliente -->
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-white py-3">
              <h5 class="card-title mb-0 d-flex align-items-center">
                <i class="bi bi-person-circle text-primary me-2"></i>
                Información del Cliente
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="d-flex flex-column">
                    <small class="text-muted mb-1">Nombre completo</small>
                    <div class="fw-medium">{{ orderStore.pedido.cliente.nombre || 'No disponible' }}</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex flex-column">
                    <small class="text-muted mb-1">Email</small>
                    <div class="fw-medium">{{ orderStore.pedido.cliente.email || 'No disponible' }}</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex flex-column">
                    <small class="text-muted mb-1">Teléfono</small>
                    <div class="fw-medium">{{ orderStore.pedido.cliente.telefono || 'No disponible' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Método de entrega -->
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-white py-3">
              <h5 class="card-title mb-0 d-flex align-items-center">
                <i class="bi bi-truck text-primary me-2"></i>
                Método de Entrega
              </h5>
            </div>
            <div class="card-body">
              <!-- Opciones de entrega -->
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <div class="form-check p-0">
                    <input class="form-check-input d-none" type="radio" id="envioNacional" v-model="envioTipo" value="nacional" />
                    <label class="form-check-label w-100" for="envioNacional">
                      <div class="card h-100 cursor-pointer" :class="{ 'border-primary bg-primary bg-opacity-10': envioTipo === 'nacional', 'border-2': envioTipo === 'nacional' }">
                        <div class="card-body text-center">
                          <i class="bi bi-box-seam text-primary fs-1 mb-3"></i>
                          <h6 class="fw-bold mb-2">Envío a Domicilio</h6>
                          <p class="text-muted small mb-2">Recibe tu pedido en la comodidad de tu hogar</p>
                          <div class="d-flex justify-content-between align-items-center">
                            <span class="badge bg-primary">1-2 días</span>
                            <span class="fw-bold" :class="ciudadSeleccionada ? 'text-primary' : 'text-muted'">
                              <template v-if="ciudadSeleccionada"> <i class="fas fa-truck"></i> ${{ ciudadSeleccionada.precio_envio.toFixed(2) }} </template>
                              <template v-else> <i class="fas fa-map-marker-alt"></i> Selecciona una ciudad </template>
                            </span>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-check p-0">
                    <input class="form-check-input d-none" type="radio" id="retiroTienda" :checked="envioTipo === 'retiro'" @change="handleEnvioChange('retiro')" />
                    <label class="form-check-label w-100" for="retiroTienda">
                      <div class="card h-100 cursor-pointer" :class="{ 'border-success bg-success bg-opacity-10': envioTipo === 'retiro', 'border-2': envioTipo === 'retiro' }">
                        <div class="card-body text-center">
                          <i class="bi bi-shop text-success fs-1 mb-3"></i>
                          <h6 class="fw-bold mb-2">Retiro en Tienda</h6>
                          <p class="text-muted small mb-2">Retira tu pedido cuando gustes</p>
                          <div class="d-flex justify-content-between align-items-center">
                            <span class="badge bg-success">Inmediato</span>
                            <span class="fw-bold text-success">GRATIS</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Formulario para envío nacional -->
              <div v-if="envioTipo === 'nacional'" class="border-top pt-4">
                <h6 class="fw-semibold mb-3 text-primary">
                  <i class="bi bi-geo-alt me-2"></i>
                  Dirección de Entrega
                </h6>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="ciudad" class="form-label">Ciudad *</label>
                    <select v-model="ciudadSeleccionada" class="form-select" @change="handleCiudadChange">
                      <option :value="null">Seleccione una ciudad</option>
                      <option v-for="ciudad in ciudades" :key="ciudad.id" :value="ciudad">
                        {{ ciudad.nombre }}
                        <span v-if="ciudad.precio_envio !== undefined">
                          (+${{ ciudad.precio_envio.toFixed(2) }})
                        </span>
                      </option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label for="direccion" class="form-label">Dirección completa *</label>
                    <input type="text" class="form-control" id="direccion" v-model="direccionCompleta" placeholder="Ej: Av. Amazonas N24-12 y Colón, Edificio Torres del Sol" required />
                    <div class="form-text">
                      <small class="text-muted">Incluye calle, número y referencias importantes</small>
                    </div>
                  </div>

                  <div class="col-12">
                    <label for="referencia" class="form-label">Referencia *</label>
                    <textarea class="form-control" id="referencia" v-model="referencia" rows="2" placeholder="Ej: Frente al parque central, casa color azul con portón blanco" required></textarea>
                    <div class="form-text">
                      <small class="text-muted">Puntos de referencia que faciliten la entrega</small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Información de retiro en tienda -->
              <div v-if="envioTipo === 'retiro'" class="border-top pt-4">
                <h6 class="fw-semibold mb-3 text-success">
                  <i class="bi bi-geo-alt me-2"></i>
                  Ubicación de la Tienda
                </h6>
                <div class="row g-4">
                  <div class="col-md-6">
                    <div class="bg-light rounded p-3">
                      <div class="mb-3">
                        <i class="bi bi-person-badge text-success me-2"></i>
                        <strong>Contacto:</strong> Jaime Suquilandi Minta
                      </div>
                      <div class="mb-3">
                        <i class="bi bi-telephone text-success me-2"></i>
                        <strong>Teléfono:</strong>
                        <a href="tel:0969674222" class="text-decoration-none">096 967 4222</a>
                      </div>
                      <div class="mb-3">
                        <i class="bi bi-geo-alt text-success me-2"></i>
                        <strong>Dirección:</strong> Av. 9 de octubre y Bulgaria
                      </div>
                      <div>
                        <i class="bi bi-info-circle text-success me-2"></i>
                        <strong>Referencia:</strong> Local color blanco, puerta negra
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="ratio ratio-4x3 rounded overflow-hidden">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3988.082274863185!2d-78.635305!3d-1.690275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMcKwNDEnMjUuMCJTIDc4wrAzOCcwNy4xIlc!5e0!3m2!1ses-419!2sec!4v1748654841332!5m2!1ses-419!2sec"
                        style="border: 0;"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                      >
                      </iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar: Resumen del pedido -->
        <div class="col-lg-4">
          <div class="card shadow-sm sticky-top" style="top: 2rem;">
            <div class="card-header bg-white py-3">
              <h5 class="card-title mb-0 d-flex align-items-center">
                <i class="bi bi-bag-check text-primary me-2"></i>
                Resumen del Pedido
              </h5>
            </div>
            <div class="card-body p-0">
              <!-- Lista de productos -->
              <div class="p-3 border-bottom">
                <div class="d-flex align-items-center justify-content-between mb-3">
                  <span class="fw-medium">Productos ({{ orderStore.pedido.productos.reduce((total, item) => total + item.cantidad, 0) }})</span>
                  <button class="btn btn-outline-primary btn-sm" @click="router.push('/carrito')"><i class="bi bi-pencil me-1"></i>Editar</button>
                </div>

                <div v-for="(item, index) in orderStore.pedido.productos" :key="index" class="d-flex mb-3" :class="{ 'pb-3 border-bottom': index < orderStore.pedido.productos.length - 1 }">
                  <div class="position-relative me-3">
                    <img :src="item.imagenUrl" class="rounded" style="width: 60px; height: 60px; object-fit: cover;" :alt="item.nombre" />
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" style="font-size: 0.7rem;">
                      {{ item.cantidad }}
                    </span>
                  </div>
                  <div class="flex-grow-1 min-w-0">
                    <h6 class="mb-1 text-truncate">{{ item.nombre }}</h6>
                    <div class="small text-muted">
                      <span v-if="item.talla" class="me-2">Talla: {{ item.talla }}</span>
                      <span v-if="item.color">Color: {{ item.color }}</span>
                    </div>
                    <div class="fw-medium text-end mt-1">
                      <span v-if="item.descuentoAplicado" class="text-decoration-line-through text-muted me-2">
                        ${{ (item.precioUnitario * item.cantidad).toFixed(2) }}
                      </span>
                      ${{ (item.precioFinal ).toFixed(2) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Cálculos -->
              <div class="p-3">
                <div class="d-flex justify-content-between mb-2">
                  <span>Subtotal ({{ orderStore.pedido.productos.reduce((total, item) => total + item.cantidad, 0) }} artículos):</span>
                  <span>${{ orderStore.pedido.subtotal.toFixed(2) }}</span>
                </div>

                <template v-if="orderStore.pedido.descuentos.length > 0">
                  <div v-for="(descuento, index) in orderStore.pedido.descuentos" :key="index" class="d-flex justify-content-between mb-2 text-success">
                    <span>
                      <i class="bi bi-tag me-1"></i>
                      {{ descuento.nombre }} (-{{ formatearValorDescuento(descuento.tipo, descuento.valor) }})
                    </span>
                    <span>-${{ descuento.total.toFixed(2) }}</span>
                  </div>
                </template>
                <div class="d-flex justify-content-between mb-3" :class="envioTipo === 'retiro' ? 'text-success' : ''">
                  <span>
                    <i :class="['me-1', envioTipo === 'nacional' ? 'bi-truck' : 'bi-shop']"></i>
                    {{ envioTipo === 'nacional' ? 'Envío Nacional:' : 'Retiro en tienda:' }}
                  </span>
                  <div class="text-end">
                    <template v-if="envioTipo === 'retiro'">
                      <span class="fw-bold text-success">GRATIS</span>
                    </template>
                    <template v-else-if="!orderStore.pedido.cliente.direccion.ciudad">
                      <span class="text-muted small">Seleccione ciudad*</span>
                    </template>
                    <template v-else>
                      <div class="fw-bold">${{ orderStore.pedido.envio.precio.toFixed(2) }}</div>
                      <div v-if="orderStore.pedido.envio.pesoTotal > 0" class="text-muted" style="font-size: 0.7rem;">Incluye peso</div>
                    </template>
                  </div>
                </div>

                <div v-if="orderStore.pedido.envio.fechaEntrega" class="d-flex justify-content-between mb-3 text-info">
                  <span>
                    <i class="bi bi-calendar me-1"></i>
                    Fecha estimada de entrega:
                  </span>
                  <span>{{ orderStore.pedido.envio.fechaEntrega }}</span>
                </div>

                <hr class="my-3" />

                <div class="d-flex justify-content-between fs-5 fw-bold text-primary">
                  <span>Total a pagar:</span>
                  <span>${{ orderStore.pedido.total.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="card-footer bg-white">
              <div>
                <!-- Barra de progreso para envío nacional -->
                <div v-if="envioTipo === 'nacional'" class="mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <small class="text-muted fw-medium">Información de envío</small>
                    <small class="text-muted">{{ Math.round(getCompletionPercentage) }}%</small>
                  </div>

                  <div class="progress mb-2" style="height: 6px;">
                    <div
                      class="progress-bar transition-all duration-300"
                      :class="{
                          'bg-danger': getCompletionPercentage < 34,
                          'bg-warning': getCompletionPercentage >= 34 && getCompletionPercentage < 67,
                          'bg-info': getCompletionPercentage >= 67 && getCompletionPercentage < 100,
                          'bg-success': getCompletionPercentage === 100
                        }"
                      :style="{ width: `${getCompletionPercentage}%` }"
                      role="progressbar"
                    ></div>
                  </div>

                  <small class="text-muted d-block">
                    {{ getProgressText }}
                  </small>

                  <!-- Indicadores específicos de lo que falta -->
                  <div v-if="getCompletionPercentage < 100" class="mt-2">
                    <div class="d-flex flex-wrap gap-2">
                      <span v-if="!ciudadSeleccionada" class="badge bg-light text-dark border">
                        <i class="bi bi-circle me-1" style="font-size: 0.5rem;"></i>
                        Ciudad
                      </span>
                      <span v-if="direccionCompleta.trim().length < 10" class="badge bg-light text-dark border">
                        <i class="bi bi-circle me-1" style="font-size: 0.5rem;"></i>
                        Dirección
                      </span>
                      <span v-if="referencia.trim().length < 10" class="badge bg-light text-dark border">
                        <i class="bi bi-circle me-1" style="font-size: 0.5rem;"></i>
                        Referencia
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Mensaje para retiro en tienda -->
                <div v-if="envioTipo === 'retiro'" class="mb-3">
                  <div class="d-flex align-items-center text-success">
                    <i class="bi bi-check-circle-fill me-2"></i>
                    <small class="fw-medium">{{ getProgressText }}</small>
                  </div>
                </div>

                <!-- Contenedor del botón PayPal -->
                <div
                  ref="paypalButtonContainer"
                  :class="{ 
                    'opacity-50 pointer-events-none': envioTipo === 'nacional' && !camposEnvioValidos,
                    'transition-opacity duration-300': true
                  }"
                  class="d-flex justify-content-center mt-3">
                </div>

                <p v-if="error" class="text-danger mt-2 small">{{ error }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Estado de carga -->
  <div v-else class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="text-center">
      <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <h5 class="mb-2">Preparando tu pedido</h5>
      <p class="text-muted">Cargando detalles del checkout...</p>
    </div>
  </div>

 

</template>

<script setup>
import { ref, onMounted ,computed, watch} from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'
import { loadScript } from '@paypal/paypal-js';
import Ciudades from '@/apis/Ciudades';
import ConfiguracionPrecio from '@/apis/ConfiguracionPrecio'

import Swal from "sweetalert2"; 

const paypalButtonContainer = ref(null);
const loading = ref(true);
const error = ref('');
const configuracion = ref({ precio_por_kg: 0 });
const nuevoPrecio = ref(0);
// Stores
const orderStore = useOrderStore()
const router = useRouter()

// Estados
const hasDataLoaded = ref(false)
const envioTipo = ref(orderStore.pedido.envio.tipo === 'Retiro tienda Física' ? 'retiro' : 'nacional');
// Observa cambios en el store para sincronizar
watch(() => orderStore.pedido.envio.tipo, (newTipo) => {
  envioTipo.value = newTipo === 'Retiro tienda Física' ? 'retiro' : 'nacional';
});

// Actualiza el store cuando el usuario cambia el input
// const handleEnvioChange = (tipo) => {
//   envioTipo.value = tipo;
  
//   if (tipo === 'retiro') {
//     // Resetear ciudad seleccionada si cambia a retiro
//     ciudadSeleccionada.value = null;
//     orderStore.actualizarEnvio('Retiro tienda Física', 0);
//     orderStore.actualizarDireccion({ ciudad: '' }); // Opcional: limpia la ciudad en el store
//   } else {
//     // Resetear ciudad al cambiar a envío nacional
//     ciudadSeleccionada.value = null;
//     orderStore.actualizarEnvio('Envío Nacional', 0); // Precio temporal 0 hasta seleccionar ciudad
//   }
// };


const handleEnvioChange = (tipo) => {
  envioTipo.value = tipo;
  
  if (tipo === 'retiro') {
    // Resetear todos los campos de envío
    ciudadSeleccionada.value = null;
    direccionCompleta.value = '';
    referencia.value = '';
    
    orderStore.actualizarEnvio('Retiro tienda Física', 0);
    orderStore.actualizarDireccion({ 
      ciudad: '',
      direccionCompleta: '',
      referencia: ''
    });
  } else {
    // Resetear todos los campos para envío nacional
    ciudadSeleccionada.value = null;
    direccionCompleta.value = '';
    referencia.value = '';
    
    orderStore.actualizarEnvio('Envío Nacional', 0);
    orderStore.actualizarDireccion({ 
      ciudad: '',
      direccionCompleta: '',
      referencia: ''
    });
  }
};

// Función para calcular porcentaje de completitud
const getCompletionPercentage = computed(() => {
  if (envioTipo.value === 'retiro') {
    return 100; // Siempre completo para retiro
  }
  
  let completed = 0;
  let total = 3;
  
  if (ciudadSeleccionada.value) completed++;
  if (direccionCompleta.value.trim().length >= 10) completed++;
  if (referencia.value.trim().length >= 10) completed++;
  
  return (completed / total) * 100;
});

// Computed para obtener el texto de progreso
const getProgressText = computed(() => {
  if (envioTipo.value === 'retiro') {
    return 'Listo para proceder con el pago';
  }
  
  const percentage = getCompletionPercentage.value;
  if (percentage === 100) {
    return 'Información completa - Listo para pagar';
  } else if (percentage >= 66) {
    return 'Casi listo - Completa el último campo';
  } else if (percentage >= 33) {
    return 'Progreso medio - Completa la información restante';
  } else {
    return 'Completa tu información de envío para continuar';
  }
});

// Métodos
const formatearValorDescuento = (tipo, valor) => {
  return tipo === 'porcentaje' ? `${valor}%` : `$${valor}`
}

const ciudades = ref([])
const ciudadSeleccionada = ref(null) 

const cargarCiudades = async () => {
  try {
    const response = await Ciudades.fetchCiudades(); 
    ciudades.value = response.map(ciudad => ({
      id: ciudad.id,
      nombre: ciudad.nombre,
      precio_envio: parseFloat(ciudad.precio_envio) 
    }));
    
  } catch (error) {
    console.error('Error al cargar ciudades:', error);
  }
};

// Mensaje inicial o precio de envío
const mostrarPrecioEnvio = computed(() => {
  if (!ciudadSeleccionada.value?.precio_envio) {
    return "Esperando selección de ciudad";
  }
  return `$${parseFloat(ciudadSeleccionada.value.precio_envio).toFixed(2)}`;
});

// Método para manejar el cambio de ciudad
const handleCiudadChange = () => {
  if (ciudadSeleccionada.value) {
    // Guarda la ciudad en el store
    orderStore.actualizarDireccion({
      ciudad: ciudadSeleccionada.value.nombre
    });
    
    // Actualiza el precio de envío en el store
    orderStore.actualizarEnvio(
      'Envío Nacional', // O el tipo que corresponda
      parseFloat(ciudadSeleccionada.value.precio_envio)
    );
  }
};

const handleRetiroEnTienda = () => {
  orderStore.actualizarEnvio(
    'Retiro tienda Física', // Tipo explícito
    0 // Precio cero para retiro
  );
  envioTipo.value = 'retiro'; // Actualiza el ref local
};

const obtenerConfiguracion = async () => {
  try {
  
    const data = await ConfiguracionPrecio.fetchConfigPrecio();
    configuracion.value = data;
    nuevoPrecio.value = data.precio_por_kg;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo obtener la configuración',
    });
  } finally {
   
  }
};

orderStore.actualizarPrecioPorKg(1.23)




// Validación de campos de envío
const direccionCompleta = ref('')
const referencia = ref('')
const camposEnvioValidos = computed(() => {
  if (envioTipo.value === 'retiro') {
    return true // Siempre válido para retiro en tienda
  }
  // Para envío nacional, validar que ambos campos tengan contenido real
  return direccionCompleta.value.trim().length >= 10 && 
         referencia.value.trim().length >= 10
})

// Watchers para sincronizar con el store
watch(direccionCompleta, (newValue) => {
  orderStore.actualizarDireccion({
    direccionCompleta: newValue
  })
})

watch(referencia, (newValue) => {
  orderStore.actualizarDireccion({
    referencia: newValue
  })
})

// Inicializar valores desde el store
watch(() => orderStore.pedido.cliente.direccion.direccionCompleta, (newValue) => {
  if (newValue !== direccionCompleta.value) {
    direccionCompleta.value = newValue
  }
}, { immediate: true })

watch(() => orderStore.pedido.cliente.direccion.referencia, (newValue) => {
  if (newValue !== referencia.value) {
    referencia.value = newValue
  }
}, { immediate: true })


// Función separada para inicializar PayPal
const initializePayPal = async () => {
  try {
    const paypal = await loadScript({
      'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID_SANDBOX,
      currency: 'USD',
    });

    paypal.Buttons({
      createOrder: (data, actions) => {
        if (envioTipo.value === 'nacional' && !camposEnvioValidos.value) {
          error.value = 'Por favor completa todos los campos de envío';
          Swal.fire({
            icon: 'warning',
            title: 'Información incompleta',
            text: 'Por favor completa la dirección y referencia para continuar.',
          });
          return Promise.reject('Campos incompletos');
        }

        return actions.order.create({
          purchase_units: [{
            amount: {
              value: orderStore.pedido.total.toFixed(2),
              currency_code: 'USD',
            },
          }],
        });
      },
      onApprove: async (data, actions) => {
        if (envioTipo.value === 'nacional' && !camposEnvioValidos.value) {
          error.value = 'Por favor completa todos los campos de envío';
          return;
        }

        const details = await actions.order.capture();
        console.log('Pago exitoso:', details);
        Swal.fire({
          icon: 'success',
          title: 'Pago exitoso',
          text: `Gracias por tu compra, ${details.payer.name.given_name}.`,
        });
      },
      onCancel: () => {
        Swal.fire({
          icon: 'warning',
          title: 'Pago cancelado',
          text: 'El pago fue cancelado.',
        });
      },
      onError: (err) => {
        console.error('Error en PayPal:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al procesar el pago.',
        });
      },
    }).render(paypalButtonContainer.value);

  } catch (err) {
    console.error('Error al cargar PayPal:', err);
    Swal.fire({
      icon: 'error',
      title: 'Error al cargar PayPal',
      text: 'No se pudo cargar el SDK de PayPal.',
    });
  }
};

// onMounted simplificado
onMounted(async () => {
  try {
    cargarCiudades()
     obtenerConfiguracion()
    console.log('Datos del pedido:', JSON.parse(JSON.stringify(orderStore.pedido)))
    hasDataLoaded.value = true
    
    // Inicializar PayPal
    await initializePayPal()
    
  } catch (error) {
    console.error('Error al cargar datos del checkout:', error)
    router.push('/carrito')
  }
})

// // Inicialización
// onMounted(() => {
//   try {
//     cargarCiudades()
//     obtenerConfiguracion()
//     console.log('Datos del pedido:', JSON.parse(JSON.stringify(orderStore.pedido)))
//     hasDataLoaded.value = true
//   } catch (error) {
//     console.error('Error al cargar datos del checkout:', error)
//     router.push('/carrito')
//   }
// })

</script>

<style scoped>

.cursor-pointer {
  cursor: pointer;
}

.min-w-0 {
  min-width: 0;
}

.sticky-top {
  position: sticky;
}

.card {
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-1px);
}

.form-check-label .card {
  transition: all 0.3s ease;
  border: 2px solid #dee2e6;
}

.form-check-label .card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.bg-opacity-10 {
  --bs-bg-opacity: 0.1;
}

.text-truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* barra de progreso */
.pointer-events-none {
  pointer-events: none;
}

.transition-all {
  transition: all 0.3s ease;
}

.transition-opacity {
  transition: opacity 0.3s ease;
}

.duration-300 {
  transition-duration: 300ms;
}

.progress-bar {
  transition: width 0.4s ease, background-color 0.3s ease;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
}

</style>