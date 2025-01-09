<template>
  <div class="mb-3 d-flex justify-content-between align-items-center">
    <button
      type="button"
      class="btn btn-primary"
      @click="openAddProductModal"
    >
      Añadir Nuevo Producto Final
    </button>
  </div>
  
  <!-- Modal para agregar producto -->
  <div class="modal fade" id="addProductModal" tabindex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addProductModalLabel">Añadir Producto Final</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="baseProductSelect" class="form-label">Producto Base</label>
            <select
              id="baseProductSelect"
              v-model="productData.producto_id"
              class="form-select"
              required
            >
              <option value="" disabled selected>Seleccione un producto base</option>
              <option
                v-for="producto in baseProducts"
                :key="producto.id"
                :value="producto.id"
              >
                {{ producto.nombre }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label for="productImage" class="form-label">Imagen</label>
            <input 
              type="file" 
              id="productImage" 
              @change="handleImageUpload" 
              class="form-control" 
              accept="image/*" 
              required 
            />
            <div v-if="productData.imagePreview" class="mt-2">
              <img :src="productData.imagePreview" alt="Preview" class="image-preview" style="max-width: 200px;" />
            </div>
          </div>

          <div class="mb-3">
            <label for="productPrice" class="form-label">Precio Base</label>
            <input 
              type="number" 
              step="0.01" 
              id="productPrice" 
              v-model="productData.precio_base" 
              class="form-control" 
              required 
            />
          </div>

          <div class="mb-3">
            <label for="colorSelect" class="form-label">Color</label>
            <select
              id="colorSelect"
              v-model="productData.color_id"
              class="form-select"
              required
            >
              <option value="" disabled selected>Seleccione un color</option>
              <option
                v-for="color in colors"
                :key="color.id"
                :value="color.id"
              >
                {{ color.nombre }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label for="sizeSelect" class="form-label">Talla</label>
            <select
              id="sizeSelect"
              v-model="productData.talla_id"
              class="form-select"
              required
            >
              <option value="" disabled selected>Seleccione una talla</option>
              <option
                v-for="talla in sizes"
                :key="talla.id"
                :value="talla.id"
              >
                {{ talla.nombre }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label for="stockInput" class="form-label">Stock</label>
            <input 
              type="number" 
              id="stockInput" 
              v-model="productData.stock" 
              class="form-control" 
              required 
            />
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" @click="validateForm() && addProduct()" class="btn btn-primary">Guardar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal para actualizar categoría -->
  <div class="modal fade" id="editCategoryModal" tabindex="-1" aria-labelledby="editCategoryModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editCategoryModalLabel">Actualizar Categoría</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="editCategoryName" class="form-label">Nombre</label>
            <input type="text" id="editCategoryName" v-model="categoryName" class="form-control" />
          </div>
          <div class="mb-3">
            <label for="editCategoryDescription" class="form-label">Descripción</label>
            <input type="text" id="editCategoryDescription" v-model="categoryDescription" class="form-control" />
          </div>
          <div class="mb-3">
            <label for="editCategorySelect" class="form-label">Categoría</label>
              <select 
                id="editCategorySelect" 
                v-model="selectedCategory" 
                class="form-select"
                required
              >
                <option value="" disabled>Seleccione una categoría</option>
                <option 
                  v-for="categoria in allCategories" 
                  :key="categoria.id" 
                  :value="categoria.id"
                >
                  {{ categoria.nombre }}
                </option>
              </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" @click="updateCategory" class="btn btn-primary">Actualizar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Lista de productos -->
  <div>
    <table id="tabla" class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>Nº</th>
          <th>Producto Base</th>
          <th>Imagen</th>
          <th>Precio Base</th>
          <th>Color</th>
          <th>Talla</th>
          <!-- <th>Stock</th> -->
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(producto, index) in products" :key="producto.id">
          <td>{{ index + 1 }}</td>
          <td>{{ getProductoBaseName(producto.producto_id) }}</td>
          <td>
            <img :src="getImageUrl(producto.imagen_url)" alt="Imagen del Producto" class="product-image" />

          </td>
          <td>{{ producto.precio_base }}</td>
          <td>{{ getColorName(producto.color_id) }}</td>
          <td>{{ getTallaName(producto.talla_id) }}</td>
          <!-- <td>{{ producto.stock }}</td> -->
          <td>
            <div class="btn-group">
              <button @click="openEditModal(producto)" class="btn btn-warning">
                <span class="material-icons">edit</span>
              </button>
              <button @click="deleteProduct(producto.id)" class="btn btn-danger">
                <span class="material-icons">delete</span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductoFinal from '@/apis/ProductosFinal';
import ProductoBase from '@/apis/ProductosBase';
import Tallas from '@/apis/Tallas';
import Colores from '@/apis/Colores';
import { show_alerta } from '@/apis/Api';
import { initializeDataTable } from '@/apis/utils';
import Swal from 'sweetalert2'; 

const products = ref([]);
const baseProducts = ref([]);
const colors = ref([]);
const sizes = ref([]);

const productData = ref({
  producto_id: '',
  imagen_url: null,
  precio_base: '',
  color_id: '',
  talla_id: '',
  stock: 0,
  imagePreview: null
});

// Función para validar el formulario
const validateForm = () => {
  if (!productData.value.producto_id) {
    show_alerta("Seleccione un producto base", "warning");
    return false;
  }
  if (!productData.value.precio_base) {
    show_alerta("Ingrese un precio base", "warning");
    return false;
  }
  if (!productData.value.color_id) {
    show_alerta("Seleccione un color", "warning");
    return false;
  }
  if (!productData.value.talla_id) {
    show_alerta("Seleccione una talla", "warning");
    return false;
  }
  if (!productData.value.stock || productData.value.stock < 0) {
    show_alerta("Ingrese una cantidad válida de stock", "warning");
    return false;
  }
  if (!(productData.value.imagen_url instanceof File)) {
    show_alerta("Seleccione una imagen válida", "warning");
    return false;
  }
  return true;
};
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    show_alerta('El archivo debe ser una imagen válida (jpeg, png, jpg, gif)', 'error');
    event.target.value = '';
    return;
  }

  if (file.size > maxSize) {
    show_alerta('La imagen no debe superar los 5MB', 'error');
    event.target.value = '';
    return;
  }

  // Guardamos directamente el archivo, no creamos un objeto
  productData.value.imagen_url = file;
  
  // Creamos la vista previa
  const reader = new FileReader();
  reader.onload = (e) => {
    productData.value.imagePreview = e.target.result;
  };
  reader.readAsDataURL(file);
};

// Función para obtener la URL de la imagen
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return `${baseUrl}/storage/${imagePath}`;
};

// Funciones helper para obtener nombres
const getProductoBaseName = (id) => {
  const producto = baseProducts.value.find(p => p.id === id);
  return producto ? producto.nombre : '';
};

const getColorName = (id) => {
  const color = colors.value.find(c => c.id === id);
  return color ? color.nombre : '';
};

const getTallaName = (id) => {
  const talla = sizes.value.find(t => t.id === id);
  return talla ? talla.nombre : '';
};

// Función para cargar todos los datos
const fetchAllData = async () => {
  try {
    const [productsData, baseProductsData, colorsData, sizesData] = await Promise.all([
      ProductoFinal.fetchCategories(),
      ProductoBase.fetchCategories(),
      Colores.fetchColores(),
      Tallas.fetchTallas()
    ]);

    products.value = productsData;
    baseProducts.value = baseProductsData;
    colors.value = colorsData;
    sizes.value = sizesData;
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    show_alerta('Error al cargar los datos', 'error');
  }
};

const openAddProductModal = () => {
  productData.value = {
    producto_id: '',
    imagen_url: null,
    precio_base: '',
    color_id: '',
    talla_id: '',
    stock: 0,
    imagePreview: null
  };
  
  const modalElement = document.getElementById('addProductModal');
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
};

// Función para añadir un nuevo producto
const addProduct = async () => {
  if (!validateForm()) return;

  try {
    const formData = new FormData();
    
    // Convertir valores a string para asegurar el formato correcto
    formData.append('producto_id', String(productData.value.producto_id));
    formData.append('precio_base', String(productData.value.precio_base));
    formData.append('color_id', String(productData.value.color_id));
    formData.append('talla_id', String(productData.value.talla_id));
    formData.append('stock', String(productData.value.stock));
    
    // Verificar si hay una imagen y es un archivo válido
    if (productData.value.imagen_url instanceof File) {
      formData.append('imagen_url', productData.value.imagen_url);
    } else {
      // Si no hay imagen, no la incluimos en el FormData
      show_alerta('Por favor, seleccione una imagen', 'warning');
      return;
    }

    // Imprimir el contenido del FormData para debug
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await ProductoFinal.createCategory(formData);
    
    if (response && response.data) {
      show_alerta('Producto creado correctamente', 'success');
      await fetchAllData();
      
      const modalElement = document.getElementById('addProductModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }

      // Limpiar el formulario
      productData.value = {
        producto_id: '',
        imagen_url: null,
        precio_base: '',
        color_id: '',
        talla_id: '',
        stock: 0,
        imagePreview: null
      };

      initializeDataTable();
    }
  } catch (error) {
    console.error("Error al crear el producto:", error);
    show_alerta(error.response?.data?.message || 'Error al crear el producto', 'error');
  }
};
const deleteProduct = async (id) => {
  try {
    const result = await Swal.fire({
      title: '¿Estás seguro de eliminar este producto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      buttonsStyling: true,
    });

    if (result.isConfirmed) {
      const response = await ProductoFinal.deleteCategory(id);
      if (response) {
        await fetchAllData();
        show_alerta('Producto eliminado correctamente', 'success');
      }
    } else {
      show_alerta('Eliminación cancelada', 'info');
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    show_alerta('Error al eliminar el producto', 'error');
  }
};

onMounted(async () => {
  await fetchAllData();
  initializeDataTable();
});






</script>
 


<style scoped>
.product-image {
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
}

/* Estilo para la preview de la imagen en el modal */
.image-preview {
  max-width: 200px;
  max-height: 200px;
  margin-top: 10px;
}



.btn-group {
  gap: 10px; /* Espaciado entre botones */
}
</style>