<template>
    <div class="container py-4">
        <div class="row g-4">
            <!-- Panel principal -->
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm mb-4">
                    <div class="row mb-2">
                        <div class="col-auto">
                            <button @click="obtenerFechaEntrega" class="btn btn-primary">
                                Calcular Fecha de Entrega
                            </button>
                        </div>
                        <div class="col-auto mt-1">
                            <span><strong>{{ fechaEntrega }}</strong></span>
                        </div>
                    </div>

                    <!-- Feedback dinámico -->
                    <div v-if="mensajeFeedback" class="alert alert-info mt-2">
                        {{ mensajeFeedback }}
                    </div>


                    <div class="card-header bg-white border-bottom-0 py-3">
                        <div class="d-flex align-items-center">
                            <input type="checkbox" class="form-check-input me-2" v-model="todoSeleccionado" @change="seleccionarTodo">
                            <span class="text-secondary">{{ productosSeleccionados }}/{{ productosCarrito.length }} artículos seleccionados</span>
                            <div class="ms-auto">
                                <button class="btn btn-link text-secondary" @click="eliminarSeleccionados">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="card-body p-0">
                        <div v-if="productosCarrito.length === 0" class="text-center py-4">
                            El carrito está vacío
                        </div>
                        <div v-else v-for="(producto, index) in productosCarrito" 
                             :key="index" 
                             class="producto-item px-3 py-3 border-bottom">
                            <div class="d-flex align-items-center">
                                <input type="checkbox" class="form-check-input me-3 mt-2" v-model="producto.seleccionado">

                                <img :src="`${IMAGE_BASE_URL}/${producto.detalleProducto?.imagen_url}`" 
                                     :alt="producto.detalleProducto?.producto?.nombre" 
                                     class="producto-imagen me-3 rounded" 
                                     style="width: 60px; height: 60px; object-fit: cover;">

                                <div class="flex-grow-1">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 class="mb-2 text-truncate" style="max-width: 250px;">
                                                {{ producto.detalleProducto?.producto?.nombre }}
                                            </h6>

                                            <div class="producto-detalles mb-2 text-secondary">
                                                <span class="me-2">Color: {{ producto.detalleProducto?.color?.nombre }}</span>
                                                <span class="me-2">Talla: {{ producto.talla?.nombre }}</span>
                                            </div>
                                        </div>

                                        <button class="btn-close" @click="eliminarProducto(producto)"></button>
                                    </div>
                                    
                                    <div class="precio text-primary fw-bold mb-2">
                                        <span v-if="aplicaDescuentoPorMayor" class="text-decoration-line-through text-muted me-2">
                                            ${{ (producto.detalleProducto?.precio_base * producto.cantidad).toFixed(2) }}
                                        </span>
                                        ${{ calcularPrecioConDescuento(producto).toFixed(2) }}
                                    </div>

                                    <div class="d-flex align-items-center justify-content-end">
                                        <button class="btn btn-outline-secondary btn-sm" 
                                                @click="decrementarCantidad(producto)">
                                            −
                                        </button>
                                        <input type="number" 
                                               v-model="producto.cantidad" 
                                               class="form-control form-control-sm text-center mx-2" 
                                               style="width: 60px;"
                                               @change="actualizarCantidad(producto)">
                                        <button class="btn btn-outline-secondary btn-sm" 
                                                @click="incrementarCantidad(producto)">
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                    
            <!-- Panel lateral con cálculos actualizados -->
            <div class="col-lg-4">
    <div class="d-flex flex-column">

        <!-- Detalles del precio -->
        <div class="card border-0 shadow-sm mb-4">
            
            <div class="card-body">
                <h6 class="mb-3">Detalles del precio</h6>
                
                <!-- Subtotal original -->
                <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal ({{ cantidadTotalProductos }} artículos)</span>
                    <span>${{ subtotalSinDescuento.toFixed(2) }}</span>
                </div>

                <!-- Descuento por mayor si aplica -->
                <div v-if="aplicaDescuentoPorMayor" class="d-flex justify-content-between mb-2 text-success">
                    <span>Descuento por mayor (-$7.00 c/u)</span>
                    <span>-${{ descuentoTotal.toFixed(2) }}</span>
                </div>

                <hr class="my-3">

                <!-- Total con descuento aplicado -->
                <div class="d-flex justify-content-between fw-bold">
                    <span>Importe total</span>
                    <span>${{ total.toFixed(2) }}</span>
                </div>

                <!-- Mensaje de descuento -->
                <div v-if="!aplicaDescuentoPorMayor && cantidadTotalProductos > 0" 
                     class="text-muted small mt-2">
                    Agrega {{ 3 - cantidadTotalProductos }} productos más para obtener descuento por mayor
                </div>

                <button class="btn btn-dark w-100 mt-3" 
                        @click="realizarPedido"
                        :disabled="productosCarrito.length === 0">
                    Realizar pedido
                </button>
            </div>
        </div>

        <!-- Datos del cliente -->
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0">Cliente</h5>
            </div>
            <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                    <div>
                        <h6 class="mb-0">{{ userStore.user.nombre }} {{ userStore.user.apellido }}</h6>
                        <small class="text-muted">Cuenta creada: {{ formattedDate(userStore.user.created_at) }}</small>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="d-flex align-items-center mb-2">
                        <i class="material-icons me-2 text-muted">email</i>
                        <span>{{ userStore.user.email }}</span>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <i class="material-icons me-2 text-muted">phone</i>
                        <span>{{ userStore.user.celular }}</span>
                    </div>
                </div>
                <hr />
                <div class="mb-3">
                    <h6>Dirección del Local New Blessings</h6>
                    <p class="mb-0">
                        123 Calle Principal<br />
                        Chimborazo, Riobamba 170504<br />
                        Ecuador
                    </p>
                </div>
                <hr />
            </div>
        </div>
        
    </div>
</div>


        </div>
    </div>


    
    


</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useUserStore } from '@/stores/authstore'
import { IMAGE_BASE_URL } from "@/apis/Api"
import { PublicApi } from "@/apis/Api";
import Swal from "sweetalert2"; 

import axios from 'axios'

const router = useRouter()
const cartStore = useCartStore()
const todoSeleccionado = ref(false)
const productosData = ref([])

const userStore = useUserStore();

// Formatea la fecha, por ejemplo:
const formattedDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

// Fetch productos data from API
const fetchProductosData = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/admin/detalle/all')
        productosData.value = response.data.data
    } catch (error) {
        console.error('Error fetching products:', error)
    }
}

// Combine cart items with API data
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

// Cantidad total de productos en el carrito
const cantidadTotalProductos = computed(() => {
    return productosCarrito.value.reduce((total, producto) => total + producto.cantidad, 0)
})

// Verifica si aplica descuento por mayor (más de 3 productos)
const aplicaDescuentoPorMayor = computed(() => {
    return cantidadTotalProductos.value >= 3
})

// Calcula el descuento para un producto individual
const calcularPrecioConDescuento = (producto) => {
    const precioBase = producto.detalleProducto?.precio_base * producto.cantidad
    if (aplicaDescuentoPorMayor.value) {
        return precioBase - (7 * producto.cantidad)
    }
    return precioBase
}

// Subtotal sin descuento
const subtotalSinDescuento = computed(() => {
    return productosCarrito.value.reduce((total, producto) => {
        return total + (producto.detalleProducto?.precio_base * producto.cantidad)
    }, 0)
})

// Calcula el descuento total
const descuentoTotal = computed(() => {
    if (!aplicaDescuentoPorMayor.value) return 0
    return productosCarrito.value.reduce((total, producto) => {
        return total + (7 * producto.cantidad)
    }, 0)
})

// Total final con descuento aplicado
const total = computed(() => {
    return subtotalSinDescuento.value - descuentoTotal.value
})

const productosSeleccionados = computed(() => {
    return productosCarrito.value.filter(p => p.seleccionado).length
})

const seleccionarTodo = () => {
    productosCarrito.value.forEach(producto => {
        producto.seleccionado = todoSeleccionado.value
    })
}

const incrementarCantidad = (producto) => {
    if (producto.cantidad < 100) {
        cartStore.updateQuantity(
            producto.detalles_productos_id,
            producto.talla_id,
            producto.cantidad + 1
        )
    }
}

const decrementarCantidad = (producto) => {
    if (producto.cantidad > 1) {
        cartStore.updateQuantity(
            producto.detalles_productos_id,
            producto.talla_id,
            producto.cantidad - 1
        )
    }
}

const actualizarCantidad = (producto) => {
    let cantidad = parseInt(producto.cantidad)
    if (isNaN(cantidad) || cantidad < 1) cantidad = 1
    if (cantidad > 100) cantidad = 100

    cartStore.updateQuantity(
        producto.detalles_productos_id,
        producto.talla_id,
        cantidad
    )
}

const eliminarProducto = (producto) => {
    cartStore.removeFromCart(producto.detalles_productos_id, producto.talla_id)
}

const eliminarSeleccionados = () => {
    productosCarrito.value
        .filter(producto => producto.seleccionado)
        .forEach(producto => {
            cartStore.removeFromCart(producto.detalles_productos_id, producto.talla_id)
        })
}

// const realizarPedido = async () => {
//     try {
//         await cartStore.createOrder()
//         router.push('/Pedidos')
//     } catch (error) {
//         console.error('Error al crear la orden:', error)
//         alert('Error al procesar el pedido')
//     }
// }


const realizarPedido = async () => {
  try { 
    await cartStore.createOrder();
    // Si la creación del pedido es exitosa, se muestra el mensaje de éxito.
    Swal.fire({
      icon: 'success',
      title: 'Pedido realizado con éxito',
      text: 'Tu pedido se ha procesado correctamente',
      confirmButtonText: 'Aceptar'
    });
    // Redirigir a la página de pedidos
    router.push('/Pedidos');
  } catch (error) {
    console.error('Error al crear la orden:', error);
    // Si ocurre un error, se muestra el mensaje de error.
    Swal.fire({
      icon: 'error',
      title: 'Error al procesar el pedido',
      text: 'Hubo un problema al procesar tu pedido. Intenta nuevamente.',
      confirmButtonText: 'Aceptar'
    });
  }
};

const mensajeFeedback = ref("");
const fechaEntrega = ref("");
const cantidadPrendas = ref(0);
const cuposActuales = ref({
  cupo_6: 0,
  cupo_15: 0,
  cupo_30: 0
});

// Llamar esta función cuando se desee obtener la fecha de entrega
const obtenerFechaEntrega = async () => {
  mensajeFeedback.value = "";
  fechaEntrega.value = "";

  try {
    const totalProductos = cantidadTotalProductos.value;

    const response = await PublicApi.post("calcular-fecha-entrega", {
        cantidad: totalProductos,
    });

    if (response.data.status === "success") {
      const fechaEntregaOriginal = new Date(response.data.fecha_entrega);
      const fechaEntregaAjustada = new Date(fechaEntregaOriginal);
      fechaEntregaAjustada.setDate(fechaEntregaAjustada.getDate() + 1);

      fechaEntrega.value = fechaEntregaAjustada.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      cantidadPrendas.value = response.data.cantidad_prendas;
      cuposActuales.value = response.data.cupos_actuales;

      let mensajeDetallado = response.data.mensaje + `. La fecha de entrega será el ${fechaEntrega.value}.`;
      mensajeDetallado += "\nNota: Los días hábiles no incluyen fines de semana ni festivos.";
      mensajeFeedback.value = mensajeDetallado;
    } else {
      mensajeFeedback.value = response.data.mensaje || "No se pudo calcular la fecha de entrega.";
    }
  } catch (error) {
    console.error("Error al obtener la fecha de entrega:", error);
    mensajeFeedback.value =
      error.response?.data?.message ||
       "Hubo un error al consultar la fecha.";
  }
};


onMounted(() => {
    fetchProductosData()
})
</script>

<style scoped>
/* Borde más oscuro para las tarjetas */
.card {
  border-radius: 8px;
  border: 1px solid #ddd; /* Borde gris más visible */
}

/* Ajustar color de la card para separar visualmente */
.card-body {
  background-color: #f9f9f9;
}

.producto-imagen {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.producto-item {
  border-bottom: 1px solid #ddd;
}

.producto-item:last-child {
  border-bottom: none;
}

.producto-detalles {
  font-size: 0.875rem;
  color: #666;
}

/* Ajustar el control de cantidad alineado a la derecha junto a la X */
.cantidad-control {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
}

.cantidad-control input {
  text-align: center;
  width: 50px;
  height: 32px;
  font-size: 0.875rem;
}

.precio {
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
}

.d-flex.justify-content-end {
  padding-top: 8px;
  width: 100%;
}

.btn-outline-secondary {
  border-color: #ddd; /* Color visible */
}
</style>

