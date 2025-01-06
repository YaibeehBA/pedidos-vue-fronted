<template>
  <div class="mb-3 d-flex justify-content-between align-items-center">
    <button
      type="button"
      class="btn btn-primary"
      @click="openAddCategoryModal"
    >
      Añadir Nuevo Producto Base
    </button>
  </div>
  
  <!-- Modal para agregar producto -->
  <div class="modal fade" id="addCategoryModal" tabindex="-1" aria-labelledby="addCategoryModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addCategoryModalLabel">Añadir Producto Base</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="categoryName" class="form-label">Nombre</label>
            <input type="text" id="categoryName" v-model="categoryName" class="form-control" />
          </div>
          <div class="mb-3">
            <label for="categoryDescription" class="form-label">Descripción</label>
            <input type="text" id="categoryDescription" v-model="categoryDescription" class="form-control" />
          </div>
       
          <div class="mb-3">
            <label for="categorySelect" class="form-label">Categoría</label>
            <select 
              id="categorySelect" 
              v-model="selectedCategory" 
              class="form-select"
              required
            >
              <option value="" disabled selected>Seleccione una categoría</option>
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
          <button type="button" @click="addCategory" class="btn btn-primary">Guardar</button>
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

  <!-- Lista de categorías con botones de editar y eliminar -->
  <div>
    <table id="tabla" class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>Nº</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Categoría</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(producto, index) in categories" :key="producto.id">
          <td>{{ index+1 }}</td>
          <td>{{ producto.nombre }}</td>
          <td>{{ producto.descripcion }}</td>
          <td>{{ producto.categoria.nombre }}</td>
          <td >
            <div class="btn-group">

              <button @click="openEditModal(producto)" class="btn btn-warning ">
                <span class="material-icons">edit</span>
                
              </button>
              <button @click="deleteCategory(producto.id)" class="btn btn-danger">
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
import ProductoBase from '@/apis/ProductosBase';
import Producto from '@/apis/Productos';
import { show_alerta } from '@/apis/Api';
import { initializeDataTable } from '@/apis/utils';

const categories = ref([]);
const categoryName = ref("");
const categoryDescription = ref("");
const isEditMode = ref(false);
let currentCategoryId = ref(null);
const selectedCategory = ref(null); // Para almacenar la categoría seleccionada
const allCategories = ref([]); // Para listar todas las categorías disponibles



initializeDataTable();

const fetchCategories = async () => {
  try {
    const data = await ProductoBase.fetchCategories();
    categories.value = [...data];
  } catch (error) {
    console.error("Error al cargar los productos base:", error);
  }
};

const fetchAllCategories = async () => {
  try {
    // Asumiendo que fetchCategories devuelve directamente el array
    const response = await Producto.fetchCategories();
    allCategories.value = Array.isArray(response) ? response : [];
    console.log('Categorías cargadas:', allCategories.value);
  } catch (error) {
    console.error("Error al cargar todas las categorías:", error);
    show_alerta('Error al cargar las categorías', 'error');
  }
};




// abrir modal para añadir categoría
const openAddCategoryModal = async () => {
  try {
    // Recargar las categorías antes de abrir el modal
    await fetchAllCategories();
    
    // Resetear los valores
    categoryName.value = "";
    categoryDescription.value = "";
    selectedCategory.value = null;
    isEditMode.value = false;

    // Abrir el modal
    const modalElement = document.getElementById('addCategoryModal');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  } catch (error) {
    console.error("Error al abrir el modal:", error);
    show_alerta('Error al cargar las categorías', 'error');
  }
};

// abrir modal para editar categoría
const openEditModal = async (producto) => {
  try {
    // Recargar las categorías antes de abrir el modal
    await fetchAllCategories();
    
    categoryName.value = producto.nombre;
    categoryDescription.value = producto.descripcion;
    selectedCategory.value = producto.categoria?.id;
    currentCategoryId.value = producto.id;

    const modalElement = document.getElementById('editCategoryModal');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  } catch (error) {
    console.error("Error al abrir el modal de edición:", error);
    show_alerta('Error al cargar las categorías', 'error');
  }
};
onMounted(async () => {
  try {
    await Promise.all([fetchCategories(), fetchAllCategories()]);
    initializeDataTable();
  } catch (error) {
    console.error("Error en la inicialización:", error);
    show_alerta('Error al cargar los datos', 'error');
  }
});

// Add a new categoría
const addCategory = async () => {
  if (!categoryName.value || !categoryDescription.value || !selectedCategory.value) {
    show_alerta("Por favor completa todos los campos", "warning");
    return;
  }

  try {
    const categoryData = {
      nombre: categoryName.value,
      descripcion: categoryDescription.value,
      categoria_id: selectedCategory.value,
    };

    const response = await ProductoBase.createCategory(categoryData);
    show_alerta('Categoría creada correctamente', 'success');

    if (response && response.data) {
      categories.value.push(response.data); // Add new category to the array
      categoryName.value = "";
      categoryDescription.value = "";
      selectedCategory.value = null;


      // Close modal
      const modalElement = document.getElementById('addCategoryModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }

      // Re-initialize the data table
      
        initializeDataTable();
      
    }
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    show_alerta('Error al crear la categoría', 'error');
  }
};

// Update category
const updateCategory = async () => {
  if (!categoryName.value || !categoryDescription.value || !selectedCategory.value) {
    show_alerta("Por favor completa todos los campos", "warning");
    return;
  }

  try {
    const categoryData = {
      nombre: categoryName.value,
      descripcion: categoryDescription.value,
      categoria_id: selectedCategory.value,
    };

    const response = await ProductoBase.updateCategory(currentCategoryId.value, categoryData);
    show_alerta('Categoría actualizada correctamente', 'success');

    if (response && response.data) {
      const index = categories.value.findIndex(category => category.id === currentCategoryId.value);
      categories.value[index] = response.data;  // Update the existing category

      categoryName.value = "";
      categoryDescription.value = "";
      selectedCategory.value = null;

      const modalElement = document.getElementById('editCategoryModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }

      // Re-initialize the data table
      setTimeout(() => {
        initializeDataTable();
      }, 0);
    }
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    show_alerta('Error al actualizar la categoría', 'error');
  }
};



import Swal from 'sweetalert2'; 

const deleteCategory = async (id) => {
  try {
    // Mostrar la alerta de confirmación de eliminación
    const result = await Swal.fire({
      title: '¿Estás seguro de eliminar esta categoría?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,  // Mostrar botón "No" (cancelar)
      confirmButtonText: 'Sí', // Botón "Sí"
      cancelButtonText: 'No',  // Botón "No"
      buttonsStyling: true,     // Estilo de los botones
    });

    // Si el usuario confirma la eliminación
    if (result.isConfirmed) {
      const response = await ProductoBase.deleteCategory(id);
      if (response) {
        // Si la categoría es eliminada, actualizamos el listado
        categories.value = categories.value.filter(category => category.id !== id);
        show_alerta('Categoría eliminada correctamente', 'success');
      }
    } else {
      // Si el usuario cancela, mostrar un mensaje
      show_alerta('Eliminación cancelada', 'info');
    }
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    show_alerta('Error al eliminar la categoría', 'error');
  }
};


</script>
 





<style scoped>
.btn-group {
  gap: 10px; /* Espaciado entre botones */
}
</style>