<template>
  <div class="bg-light min-vh-100" v-if="hasDataLoaded">
    <!-- Header con progreso -->
    <div class="bg-white shadow-sm mt-4">
      <div class="container py-4">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="d-flex align-items-center justify-content-center mb-0">
              <!-- Paso 1: Carrito -->
              <div class="d-flex align-items-center">
                <div class="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" 
                     style="width: 45px; height: 45px;">
                  <i class="bi bi-check2 fs-5"></i>
                </div>
                <span class="ms-2 fw-medium text-success">Carrito</span>
              </div>
              
              <!-- Línea conectora -->
              <div class="border-top border-2 border-success mx-4" style="width: 60px;"></div>
              
              <!-- Paso 2: Pago -->
              <div class="d-flex align-items-center">
                <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" 
                     style="width: 45px; height: 45px;">
                  <i class="bi bi-credit-card fs-5"></i>
                </div>
                <span class="ms-2 fw-medium text-primary">Finalizar Compra</span>
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
                    <div class="fw-medium">{{ userStore.user ? `${userStore.user.nombre} ${userStore.user.apellido}` : 'No disponible' }}</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex flex-column">
                    <small class="text-muted mb-1">Email</small>
                    <div class="fw-medium">{{ userStore.user ? userStore.user.email : 'No disponible' }}</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex flex-column">
                    <small class="text-muted mb-1">Teléfono</small>
                    <div class="fw-medium">{{ userStore.user ? userStore.user.celular : 'No disponible' }}</div>
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
                    <input class="form-check-input d-none" type="radio" id="envioNacional" v-model="envioTipo" value="nacional">
                    <label class="form-check-label w-100" for="envioNacional">
                      <div class="card h-100 cursor-pointer" 
                           :class="{ 'border-primary bg-primary bg-opacity-10': envioTipo === 'nacional', 'border-2': envioTipo === 'nacional' }">
                        <div class="card-body text-center">
                          <i class="bi bi-box-seam text-primary fs-1 mb-3"></i>
                          <h6 class="fw-bold mb-2">Envío a Domicilio</h6>
                          <p class="text-muted small mb-2">Recibe tu pedido en la comodidad de tu hogar</p>
                          <div class="d-flex justify-content-between align-items-center">
                            <span class="badge bg-primary">3-5 días</span>
                            <span class="fw-bold text-primary">$15.00</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="form-check p-0">
                    <input class="form-check-input d-none" type="radio" id="retiroTienda" v-model="envioTipo" value="retiro">
                    <label class="form-check-label w-100" for="retiroTienda">
                      <div class="card h-100 cursor-pointer" 
                           :class="{ 'border-success bg-success bg-opacity-10': envioTipo === 'retiro', 'border-2': envioTipo === 'retiro' }">
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
                    <select class="form-select" id="ciudad" v-model="envioDatos.ciudad" required>
                      <option value="" disabled>Selecciona tu ciudad</option>
                      <option v-for="ciudad in ciudades" :key="ciudad.id" :value="ciudad.id">
                        {{ ciudad.nombre }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label for="direccion" class="form-label">Dirección completa *</label>
                    <input type="text" class="form-control" id="direccion" 
                           v-model="envioDatos.direccion" 
                           placeholder="Calle, número, sector" required>
                  </div>
                  <div class="col-12">
                    <label for="referencia" class="form-label">Referencia (opcional)</label>
                    <textarea class="form-control" id="referencia" 
                              v-model="envioDatos.referencia" 
                              rows="2" 
                              placeholder="Puntos de referencia, indicaciones adicionales..."></textarea>
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
                        style="border:0;" 
                        allowfullscreen="" 
                        loading="lazy" 
                        referrerpolicy="no-referrer-when-downgrade">
                      </iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar: Resumen del pedido (Actualizado) -->
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
                  <span class="fw-medium">Productos ({{ cantidadTotalProductos }})</span>
                  <button class="btn btn-outline-primary btn-sm" @click="router.push('/carrito')">
                    <i class="bi bi-pencil me-1"></i>Editar
                  </button>
                </div>
                
                <div v-for="(item, index) in productosCarrito" :key="index" 
                     class="d-flex mb-3" :class="{ 'pb-3 border-bottom': index < productosCarrito.length - 1 }">
                  <div class="position-relative me-3">
                    <img :src="`${IMAGE_BASE_URL}/${item.detalleProducto?.imagen_url}`" 
                         class="rounded" 
                         style="width: 60px; height: 60px; object-fit: cover;"
                         :alt="item.detalleProducto?.producto?.nombre">
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" 
                          style="font-size: 0.7rem;">
                      {{ item.cantidad }}
                    </span>
                  </div>
                  <div class="flex-grow-1 min-w-0">
                    <h6 class="mb-1 text-truncate">{{ item.detalleProducto?.producto?.nombre }}</h6>
                    <div class="small text-muted">
                      <span v-if="item.talla" class="me-2">Talla: {{ item.talla.nombre }}</span>
                      <span v-if="item.detalleProducto?.color">Color: {{ item.detalleProducto.color.nombre }}</span>
                    </div>
                    <div class="fw-medium text-end mt-1">
                      <span v-if="aplicaDescuentoPorMayor" class="text-decoration-line-through text-muted me-2">
                        ${{ (item.detalleProducto?.precio_base * item.cantidad).toFixed(2) }}
                      </span>
                      ${{ calcularPrecioConDescuento(item).toFixed(2) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Cálculos actualizados -->
              <div class="p-3">
                <div class="d-flex justify-content-between mb-2">
                  <span>Subtotal ({{ cantidadTotalProductos }} artículos):</span>
                  <span>${{ subtotalSinDescuento.toFixed(2) }}</span>
                </div>
                
                <template v-if="discountData?.descuento_aplicado">
                  <div v-for="descuento in Object.values(descuentosAplicados)" 
                       :key="descuento.id" 
                       class="d-flex justify-content-between mb-2 text-success">
                    <span>
                      <i class="bi bi-tag me-1"></i>
                      {{ descuento.nombre }} (-{{ formatearValorDescuento(descuento.tipo, descuento.valor) }})
                    </span>
                    <span>-${{ descuento.total.toFixed(2) }}</span>
                  </div>
                </template>
                
                <div class="d-flex justify-content-between mb-3" 
                     :class="envioTipo === 'retiro' ? 'text-success' : ''">
                  <span>
                    <i :class="['me-1', envioTipo === 'nacional' ? 'bi-truck' : 'bi-shop']"></i>
                    {{ envioTipo === 'nacional' ? 'Envío:' : 'Retiro en tienda:' }}
                  </span>
                  <span>
                    {{ envioTipo === 'nacional' ? '$' + precioEnvio.toFixed(2) : 'GRATIS' }}
                  </span>
                </div>

                <div v-if="fechaEntrega" class="d-flex justify-content-between mb-3 text-info">
                  <span>
                    <i class="bi bi-calendar me-1"></i>
                    Fecha estimada de entrega:
                  </span>
                  <span>{{ fechaEntrega }}</span>
                </div>
                
                <hr class="my-3">
                
                <div class="d-flex justify-content-between fs-5 fw-bold text-primary">
                  <span>Total a pagar:</span>
                  <span>${{ totalConEnvio.toFixed(2) }}</span>
                </div>

                <div v-if="hayProductosConDescuento && 
                          !aplicaDescuentoPorMayor && 
                          cantidadTotalProductos > 0 && 
                          cantidadMinimaDescuento > cantidadTotalProductos"
                     class="text-muted small mt-2">
                  <i class="bi bi-info-circle me-1"></i>
                  Agrega {{ cantidadMinimaDescuento - cantidadTotalProductos }} productos más para obtener descuento
                </div>
              </div>
            </div>
            
            <!-- Botones de acción -->
            <div class="card-footer bg-white">
              <div id="paypal-button-container" ref="paypalButtonContainer" class="mb-3"></div>
              <button class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center" 
                      @click="router.push('/carrito')">
                <i class="bi bi-arrow-left me-2"></i>
                Volver al Carrito
              </button>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useUserStore } from '@/stores/authstore'
import axios from 'axios'
import Swal from 'sweetalert2'
import { loadScript } from '@paypal/paypal-js'

// Constantes y stores
const IMAGE_BASE_URL = "http://localhost:8000/storage"
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

// Estados del componente
const hasDataLoaded = ref(false)
const envioTipo = ref('nacional')
const envioDatos = ref({
  ciudad: '',
  direccion: '',
  referencia: ''
})
const ciudades = ref([
  { id: 1, nombre: 'Quito' },
  { id: 2, nombre: 'Guayaquil' },
  { id: 3, nombre: 'Cuenca' }
])
const precioEnvio = ref(15.00)
const fechaEntrega = ref('')
const mensajeFeedback = ref('')

// Datos de productos y descuentos
const productosData = ref([])
const discountData = ref(null)
const descuentosActivos = ref([])

// PayPal
const paypalButtonContainer = ref(null)
const loading = ref(true)
const error = ref('')

// Computed properties
const productosCarrito = computed(() => {
  return cartStore.cartItems.map(cartItem => {
    const detalleProducto = productosData.value.find(p => p.id === cartItem.detalles_productos_id)
    const talla = detalleProducto?.tallas.find(t => t.id === cartItem.talla_id)
    
    return {
      ...cartItem,
      detalleProducto,
      talla,
      seleccionado: false
    }
  })
})

const cantidadTotalProductos = computed(() => {
  return discountData.value?.cantidad_total || 0
})

const aplicaDescuentoPorMayor = computed(() => {
  return discountData.value?.descuento_aplicado || false
})

const calcularPrecioConDescuento = (producto) => {
  if (!discountData.value) return producto.detalleProducto?.precio_base * producto.cantidad
  
  const productoDescuento = discountData.value.productos.find(
    p => p.producto_id === producto.detalles_productos_id
  )
  
  return productoDescuento?.precio_final || (producto.detalleProducto?.precio_base * producto.cantidad)
}

const subtotalSinDescuento = computed(() => {
  return productosCarrito.value.reduce((total, producto) => {
    return total + (producto.detalleProducto?.precio_base * producto.cantidad)
  }, 0)
})

const descuentoTotal = computed(() => {
  return discountData.value?.descuento_total || 0
})

const total = computed(() => {
  return subtotalSinDescuento.value - descuentoTotal.value
})

const totalConEnvio = computed(() => {
  return envioTipo.value === 'nacional' ? total.value + precioEnvio.value : total.value
})

const descuentosAplicados = computed(() => {
  if (!discountData.value?.productos || !descuentosActivos.value) return {}
  
  const descuentosPorProducto = discountData.value.productos
    .filter(p => p.descuento > 0)
    .flatMap(producto => {
      const descuentosParaProducto = descuentosActivos.value.filter(descuento => {
        return descuento.activo && 
               (descuento.aplica_todos_productos || 
                descuento.detalles_productos.some(dp => dp.id === producto.producto_id))
      })

      return descuentosParaProducto.map(descuento => ({
        id: descuento.id,
        nombre: descuento.nombre,
        tipo: descuento.tipo,
        valor: descuento.valor,
        descuento: producto.descuento / descuentosParaProducto.length,
        producto_id: producto.producto_id
      }))
    })

  return descuentosPorProducto.reduce((acc, curr) => {
    if (!acc[curr.id]) {
      acc[curr.id] = {
        ...curr,
        total: curr.descuento
      }
    } else {
      acc[curr.id].total += curr.descuento
    }
    return acc
  }, {})
})

const formatearValorDescuento = (tipo, valor) => {
  if (tipo === 'porcentaje') {
    return `${parseFloat(valor).toFixed(2)}%`
  } else {
    return `$${parseFloat(valor).toFixed(2)}`
  }
}

const hayProductosConDescuento = computed(() => {
  return productosCarrito.value.some(producto => {
    return descuentosActivos.value.some(descuento => {
      return descuento.activo && 
             (descuento.aplica_todos_productos || 
              descuento.detalles_productos.some(dp => dp.id === producto.detalles_productos_id))
    })
  })
})

const cantidadMinimaDescuento = computed(() => {
  if (!descuentosActivos.value.length) return 0
  const cantidadesMinimas = descuentosActivos.value
    .filter(descuento => descuento.activo)
    .map(descuento => descuento.cantidad_minima)
  return cantidadesMinimas.length === 0 ? 0 : Math.max(...cantidadesMinimas)
})

// Métodos
const fetchProductosData = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/admin/detalle/all')
    productosData.value = response.data.data
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const fetchDescuentos = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/descuentos')
    descuentosActivos.value = response.data.data
  } catch (error) {
    console.error('Error obteniendo descuentos:', error)
  }
}

const fetchDiscountData = async () => {
  try {
    const productos = productosCarrito.value.map(item => ({
      id: item.detalles_productos_id,
      cantidad: item.cantidad
    }))

    const response = await axios.post('http://localhost:8000/api/aplicar-descuento', {
      productos
    })
    discountData.value = response.data
  } catch (error) {
    console.error('Error fetching discount:', error)
  }
}

const obtenerFechaEntrega = async () => {
  mensajeFeedback.value = ""
  fechaEntrega.value = ""

  try {
    const totalProductos = cantidadTotalProductos.value

    const response = await axios.post("http://localhost:8000/api/calcular-fecha-entrega", {
      cantidad: totalProductos,
    })

    if (response.data.status === "success") {
      const fechaEntregaOriginal = new Date(response.data.fecha_entrega)
      const fechaEntregaAjustada = new Date(fechaEntregaOriginal)
      fechaEntregaAjustada.setDate(fechaEntregaAjustada.getDate() + 1)

      fechaEntrega.value = fechaEntregaAjustada.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      mensajeFeedback.value = response.data.mensaje + `. La fecha de entrega será el ${fechaEntrega.value}.`
    } else {
      mensajeFeedback.value = response.data.mensaje || "No se pudo calcular la fecha de entrega."
    }
  } catch (error) {
    console.error("Error al obtener la fecha de entrega:", error)
    mensajeFeedback.value =
      error.response?.data?.message ||
      "Hubo un error al consultar la fecha."
  }
}

const initPayPal = async () => {
  try {
    const paypal = await loadScript({
      'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID_SANDBOX,
      currency: 'USD',
    })

    paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: totalConEnvio.value.toFixed(2),
                currency_code: 'USD',
              },
            },
          ],
        })
      },
      onApprove: async (data, actions) => {
        return actions.order.capture().then(async (details) => {
          await Swal.fire({
            icon: 'success',
            title: 'Pago exitoso',
            text: `Gracias por tu compra, ${details.payer.name.given_name}.`,
            confirmButtonText: 'Aceptar',
          })
          await realizarPedido()
        })
      },
      onCancel: (data) => {
        Swal.fire({
          icon: 'warning',
          title: 'Pago cancelado',
          text: 'El pago fue cancelado por el usuario.',
          confirmButtonText: 'Aceptar',
        })
      },
      onError: (err) => {
        error.value = 'Error: ' + err.message
        Swal.fire({
          icon: 'error',
          title: 'Error en el pago',
          text: 'Hubo un problema al procesar tu pago. Intenta nuevamente.',
          confirmButtonText: 'Aceptar',
        })
      },
    }).render(paypalButtonContainer.value)

    loading.value = false
  } catch (err) {
    error.value = 'Error al cargar PayPal: ' + err.message
    loading.value = false
    Swal.fire({
      icon: 'error',
      title: 'Error al cargar PayPal',
      text: 'No se pudo cargar el SDK de PayPal. Intenta recargar la página.',
      confirmButtonText: 'Aceptar',
    })
  }
}

const realizarPedido = async () => {
  try { 
    const pedidoData = {
      productos: productosCarrito.value,
      subtotal: subtotalSinDescuento.value,
      descuentos: descuentosAplicados.value,
      total: total.value,
      tipoEnvio: envioTipo.value,
      totalConEnvio: totalConEnvio.value,
      fechaEntrega: fechaEntrega.value,
      direccion: envioTipo.value === 'nacional' ? envioDatos.value : null
    }

    await cartStore.createOrder(pedidoData)
    
    Swal.fire({
      icon: 'success',
      title: 'Pedido realizado con éxito',
      text: 'Tu pedido se ha procesado correctamente',
      confirmButtonText: 'Aceptar'
    })
    
    router.push('/Pedidos')
  } catch (error) {
    console.error('Error al crear la orden:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error al procesar el pedido',
      text: 'Hubo un problema al procesar tu pedido. Intenta nuevamente.',
      confirmButtonText: 'Aceptar'
    })
  }
}

// Watchers
watch(() => productosCarrito.value, () => {
  if (productosCarrito.value.length > 0) {
    fetchDiscountData()
    obtenerFechaEntrega()
  } else {
    discountData.value = null
    fechaEntrega.value = ""
  }
}, { deep: true })

watch(envioTipo, (newVal) => {
  if (newVal === 'retiro') {
    precioEnvio.value = 0
  } else {
    precioEnvio.value = 15.00
  }
})

// Inicialización
onMounted(async () => {
  try {
    await Promise.all([
      fetchProductosData(),
      fetchDescuentos()
    ])
    
    if (productosCarrito.value.length > 0) {
      await fetchDiscountData()
      await obtenerFechaEntrega()
    }
    
    await initPayPal()
    hasDataLoaded.value = true
  } catch (error) {
    console.error('Error inicializando componente:', error)
  }
})
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
</style>