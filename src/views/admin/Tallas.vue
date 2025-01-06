<template>
  <div class="mb-3 d-flex justify-content-between align-items-center">
    <button
      type="button"
      class="btn btn-primary"
      @click="openAddCategoryModal"
    >
      Añadir Nueva Talla
    </button>
  </div>
  
  <!-- Modal para agregar categoría -->
  <div class="modal fade" id="addCategoryModal" tabindex="-1" aria-labelledby="addCategoryModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addCategoryModalLabel">Añadir Talla</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="categoryName" class="form-label">Nombre</label>
            <input type="text" id="categoryName" v-model="categoryName" class="form-control" />
          </div>
          
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" @click="addCategory" class="btn btn-primary">Guardar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para actualizar talla -->
  <div class="modal fade" id="editCategoryModal" tabindex="-1" aria-labelledby="editCategoryModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editCategoryModalLabel">Actualizar Talla</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="editCategoryName" class="form-label">Nombre</label>
            <input type="text" id="editCategoryName" v-model="categoryName" class="form-control" />
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
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categories" :key="category.id">
          <td>{{ index+1}}</td>
          <td>{{ category.nombre }}</td>
          <td>
            <div class="btn-group">
              <button @click="openEditModal(category)" class="btn btn-warning">
                <span class="material-icons">edit</span>
              </button>
              <button @click="deleteTallas(category.id)" class="btn btn-danger">
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
import Tallas from '@/apis/Tallas';
import { show_alerta } from '@/apis/Api';
import { initializeDataTable } from '@/apis/utils';

const categories = ref([]);
const categoryName = ref(""); // Usando `categoryName` ya que solo tenemos este campo para tallas.
const isEditMode = ref(false);
let currentCategoryId = ref(null);

// Obtener todas las tallas al montar
const fetchTallas = async () => {
  try {
    const data = await Tallas.fetchTallas();
    categories.value = [...data];
  } catch (error) {
    console.error("Error al cargar las Tallas:", error);
  }
};

onMounted(() => {
  fetchTallas();
});

// Función para abrir el modal de agregar
const openAddCategoryModal = () => {
  categoryName.value = "";  
  isEditMode.value = false;

  const modalElement = document.getElementById('addCategoryModal');
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
};

// Función para abrir el modal de editar
const openEditModal = (category) => {
  categoryName.value = category.nombre;
  currentCategoryId.value = category.id;
  isEditMode.value = true;

  const modalElement = document.getElementById('editCategoryModal');
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
};

// Añadir nueva talla
const addCategory = async () => {
  if (!categoryName.value) {
    show_alerta("Por favor completa todos los campos", "warning");
    return;
  }

  try {
    const categoryData = { nombre: categoryName.value };

    const response = await Tallas.createTallas(categoryData);
    show_alerta('Talla creada correctamente', 'success');

    if (response && response.data) {
      categories.value.push(response.data); // Agregar nueva talla
      categoryName.value = ""; // Limpiar el campo

      const modalElement = document.getElementById('addCategoryModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }

      // Re-iniciar tabla
      setTimeout(() => {
        initializeDataTable();
      }, 0);
    }
  } catch (error) {
    console.error("Error al crear la talla:", error);
    show_alerta('Error al crear la talla', 'error');
  }
};

// Actualizar talla
const updateCategory = async () => {
  if (!categoryName.value) {
    show_alerta("Por favor completa todos los campos", "warning");
    return;
  }

  try {
    const categoryData = { nombre: categoryName.value };

    const response = await Tallas.updateTallas(currentCategoryId.value, categoryData);
    show_alerta('Talla actualizada correctamente', 'success');

    if (response && response.data) {
      const index = categories.value.findIndex(category => category.id === currentCategoryId.value);
      categories.value[index] = response.data;  // Actualizamos la talla

      categoryName.value = ""; // Limpiar el campo

      const modalElement = document.getElementById('editCategoryModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }

      // Re-iniciar tabla
      setTimeout(() => {
        initializeDataTable();
      }, 0);
    }
  } catch (error) {
    console.error("Error al actualizar la talla:", error);
    show_alerta('Error al actualizar la talla', 'error');
  }
};
import Swal from 'sweetalert2'; 
// Eliminar talla
const deleteTallas = async (id) => {
  try {
    const result = await Swal.fire({
      title: '¿Estás seguro de eliminar esta talla?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      buttonsStyling: true,
    });

    if (result.isConfirmed) {
      const response = await Tallas.deleteTallas(id);
      if (response) {
        categories.value = categories.value.filter(category => category.id !== id);
        show_alerta('Talla eliminada correctamente', 'success');
      }
    } else {
      show_alerta('Eliminación cancelada', 'info');
    }
  } catch (error) {
    console.error("Error al eliminar la talla:", error);
    show_alerta('Error al eliminar la talla', 'error');
  }
};
</script>

 





<style scoped>
.btn-group {
  gap: 10px; /* Espaciado entre botones */
}
</style>