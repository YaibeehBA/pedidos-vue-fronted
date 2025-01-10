<template>
  <div class="mb-3 d-flex justify-content-between align-items-center">
    <button
      type="button"
      class="btn btn-primary"
      @click="openAddCategoryModal"
    >
      Añadir Nueva Categoría
    </button>
  </div>
  
  <!-- Modal para agregar categoría -->
  <div class="modal fade" id="addCategoryModal" tabindex="-1" aria-labelledby="addCategoryModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addCategoryModalLabel">Añadir Categoría</h5>
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
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categories" :key="category.id">
          <td>{{ index+1 }}</td>
          <td>{{ category.nombre }}</td>
          <td>{{ category.descripcion }}</td>
          <td>
            <div class="btn-group">
              <button @click="openEditModal(category)" class="btn btn-warning">
                <span class="material-icons">edit</span>
              </button>
              <button @click="deleteCategory(category.id)" class="btn btn-danger">
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
import Producto from '@/apis/Productos';
import { show_alerta } from '@/apis/Api';
import { initializeDataTable } from '@/apis/utils';

const categories = ref([]);
const categoryName = ref("");
const categoryDescription = ref("");
const isEditMode = ref(false);
let currentCategoryId = ref(null);


initializeDataTable();

const fetchCategories = async () => {
  try {
    const data = await Producto.fetchCategories();
    categories.value = [...data];
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
  }
};

onMounted(() => {
  fetchCategories();
});

// abrir modal para añadir categoría
const openAddCategoryModal = () => {
  categoryName.value = "";  
  categoryDescription.value = "";
  isEditMode.value = false;

  const modalElement = document.getElementById('addCategoryModal');
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
};

// abrir modal para editar categoría
const openEditModal = (category) => {
  categoryName.value = category.nombre;
  categoryDescription.value = category.descripcion;
  currentCategoryId.value = category.id;
  isEditMode.value = true;

  const modalElement = document.getElementById('editCategoryModal');
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
};

// Add a new categoría
const addCategory = async () => {
  if (!categoryName.value || !categoryDescription.value) {
    show_alerta("Por favor completa todos los campos", "warning");
    return;
  }

  try {
    const categoryData = {
      nombre: categoryName.value,
      descripcion: categoryDescription.value,
    };

    const response = await Producto.createCategory(categoryData);
    show_alerta('Categoría creada correctamente', 'success');

    if (response && response.data) {
      categories.value.push(response.data); // Add new category to the array
      categoryName.value = "";
      categoryDescription.value = "";

      // Close modal
      const modalElement = document.getElementById('addCategoryModal');
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
    console.error("Error al crear la categoría:", error);
    show_alerta('Error al crear la categoría', 'error');
  }
};

// Update category
const updateCategory = async () => {
  if (!categoryName.value || !categoryDescription.value) {
    show_alerta("Por favor completa todos los campos", "warning");
    return;
  }

  try {
    const categoryData = {
      nombre: categoryName.value,
      descripcion: categoryDescription.value,
    };

    const response = await Producto.updateCategory(currentCategoryId.value, categoryData);
    show_alerta('Categoría actualizada correctamente', 'success');

    if (response && response.data) {
      const index = categories.value.findIndex(category => category.id === currentCategoryId.value);
      categories.value[index] = response.data;  // Update the existing category

      categoryName.value = "";
      categoryDescription.value = "";

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

// Delete a category
// const deleteCategory = async (id) => {
//   try {
//     const response = await Producto.deleteCategory(id);
//     if (response) {
//       categories.value = categories.value.filter(category => category.id !== id);
//       show_alerta('Categoría eliminada correctamente', 'success');
//     }
//   } catch (error) {
//     console.error("Error al eliminar la categoría:", error);
//     show_alerta('Error al eliminar la categoría', 'error');
//   }
// };

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
      const response = await Producto.deleteCategory(id);
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