<template>
    <div class="container py-4">
        <div class="row g-4">
            <!-- Panel principal -->
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm mb-4">
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

                        <!-- Gastos de envío -->
                        <div class="d-flex justify-content-between mb-2">
                            <span>Gastos de envío</span>
                            <span class="text-success">Envío gratis</span>
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
import axios from 'axios'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
const todoSeleccionado = ref(false)
const productosData = ref([])

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

const realizarPedido = async () => {
    try {
        await cartStore.createOrder()
        router.push('/orden-completada')
    } catch (error) {
        console.error('Error al crear la orden:', error)
        alert('Error al procesar el pedido')
    }
}

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
