<template>
  <div class="container py-5">
    <div class="row">
      <!-- Mini-galería: Slider Vertical -->
      <div class="col-md-2">
        <div class="vertical-slider-container">
          <button 
            class="nav-button prev d-flex align-items-center justify-content-center"
            @click="handleScroll('up')"
          >
            &#9650;
          </button>
          
          <div class="vertical-slider custom-scrollbar" ref="sliderRef">
            <img
              v-for="(variante, index) in productoSeleccionado?.variantes"
              :key="index"
              :src="`http://localhost:8000/storage/${variante.imagen_url}`"
              alt="Miniatura"
              class="thumbnail"
              :class="{ 'selected-thumbnail': variante.imagen_url === varianteSeleccionada?.imagen_url }"
              @click="actualizarProductoSeleccionado(variante)"
            />
            
          </div>
          
          <button 
            class="nav-button next d-flex align-items-center justify-content-center"
            @click="handleScroll('down')"
          >
            &#9660;
          </button>
        </div>
      </div>

      <!-- Imagen principal -->
      <div class="col-md-6 main-image-container">
        <img
          v-if="selectedImage"
          :src="selectedImage"
          alt="Producto"
          class="main-image"
        />
        <p v-else>Cargando imagen...</p>
      </div>
      <!-- Detalles del producto -->
      <div class="col-md-4">
        <h2 v-if="productoSeleccionado">{{ productoSeleccionado.nombre }}</h2>
        <p v-if="productoSeleccionado">{{ productoSeleccionado.descripcion }}</p>
        <p v-if="varianteSeleccionada">
          <strong>${{ varianteSeleccionada.precio_base }}</strong>
        </p>

        <!-- Colores -->
        <div v-if="productoSeleccionado?.variantes?.length" class="mb-3">
          <span>Color: <strong>{{ varianteSeleccionada.color }}</strong></span>
          <div class="d-flex gap-2 mt-2">
            <div
              v-for="(variante, index) in productoSeleccionado.variantes"
              :key="index"
              class="color-box"
              :style="{ background: variante.color_hex }"
              :class="{ 'border border-dark': variante.color === varianteSeleccionada.color }"
              @click="actualizarProductoSeleccionado(variante)"
            ></div>
          </div>
        </div>

        <!-- Tallas -->
        <div v-if="productoSeleccionado?.variantes?.length" class="mb-3">
          <span>Tallas:</span>
          <div class="d-flex gap-2 mt-2">
            <button
              v-for="(variante, index) in productoSeleccionado.variantes"
              :key="index"
              class="btn btn-outline-secondary btn-sm"
              :class="{ active: variante.talla === varianteSeleccionada.talla }"
              @click="actualizarProductoSeleccionado(variante)"
            >
              {{ variante.talla }}
            </button>
          </div>
        </div>

        <!-- Botones de acción -->
        <button v-if="productoSeleccionado" class="btn btn-success w-100 mb-2">Añadir al carrito</button>
        <button v-if="productoSeleccionado"  @click="realizarPedido" class="btn btn-outline-primary w-100">Realizar Pedido</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useRouter } from "vue-router"; 

const route = useRoute();
const router = useRouter();
const productos = ref([]);
const productoSeleccionado = ref(null);
const varianteSeleccionada = ref(null);
const selectedImage = ref("");
const sliderRef = ref(null);

const categoriaId = ref(route.params.id);

const handleScroll = (direction) => {
  if (!sliderRef.value) return;
  
  const scrollAmount = 100; // altura de la miniatura + gap
  const currentScroll = sliderRef.value.scrollTop;
  
  if (direction === 'up') {
    sliderRef.value.scrollTo({
      top: currentScroll - scrollAmount,
      behavior: 'smooth'
    });
  } else {
    sliderRef.value.scrollTo({
      top: currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  }
};

const fetchProductos = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/public/variante-productos');
    if (response.data && Array.isArray(response.data.data)) {
      const categoriaSeleccionada = response.data.data.find(categoria => 
        categoria.categoria_id === parseInt(categoriaId.value)
      );

      if (categoriaSeleccionada) {
        productos.value = categoriaSeleccionada.productos;
        if (productos.value.length > 0) {
          seleccionarProducto(productos.value[0]);
        }
      }
    }
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
};

const seleccionarProducto = (producto) => {
  productoSeleccionado.value = producto;
  if (producto.variantes && producto.variantes.length > 0) {
    actualizarProductoSeleccionado(producto.variantes[0]);
  }
};

const actualizarProductoSeleccionado = (variante) => {
  varianteSeleccionada.value = variante;
  selectedImage.value = `http://localhost:8000/storage/${variante.imagen_url}`;
};

onMounted(() => {
  fetchProductos();
});

const realizarPedido = () => {
  if (productoSeleccionado.value && varianteSeleccionada.value) {
    // Enviar los datos del producto y variante como query params, incluyendo producto_id.
    router.push({
      name: 'PedidoOrden', // Nombre de la ruta de la vista de pedido
      query: {
        producto_id: productoSeleccionado.value.producto_id, // Asegúrate de que producto_id sea correcto
        variante_id: varianteSeleccionada.value.id,
        nombre: productoSeleccionado.value.nombre,
        descripcion: productoSeleccionado.value.descripcion,
        precio: varianteSeleccionada.value.precio_base,
        talla: varianteSeleccionada.value.talla,
        color: varianteSeleccionada.value.color || 'Default Color',
        imagen_url: `http://localhost:8000/storage/${varianteSeleccionada.value.imagen_url}` 
      }
    });
  }
};

</script>

<style scoped>
.vertical-slider-container {
  position: relative;
  height: 506px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.vertical-slider {
  height: 420px;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 43px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.vertical-slider::-webkit-scrollbar {
  display: none;
}

.nav-button {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 25px;
  height: 25px;
  border: none;
  background: #000;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  z-index: 2;
}

.nav-button.prev {
  top: 0;
}

.nav-button.next {
  bottom: 0;
}

.thumbnail {
  width: 70px;
  height: 90px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s;
  flex-shrink: 0;
}

.thumbnail:hover {
  transform: scale(1.1);
}

.selected-thumbnail {
  border: 2px solid #007bff;
}

.main-image-container {
  height: 506px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  overflow: hidden;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Estilos móviles */
@media (max-width: 767px) {
  .vertical-slider-container {
    height: 120px;
    flex-direction: row;
    margin-bottom: 20px;
  }

  .vertical-slider {
    height: 90px;
    margin: 0 43px;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .nav-button {
    top: 50% !important;
    bottom: auto !important;
    transform: translateY(-50%) !important;
  }

  .nav-button.prev {
    left: 10px;
    transform: translateY(-50%) rotate(90deg) !important;
  }

  .nav-button.next {
    right: 10px;
    left: auto;
    transform: translateY(-50%) rotate(90deg) !important;
  }

  .main-image-container {
    height: 350px;
  }
}
</style>
