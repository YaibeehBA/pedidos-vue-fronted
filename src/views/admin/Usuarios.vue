<template>
    <div class="container mt-3">
        <div class="admin-container">
            <h3 class="text-center">Administración de Usuarios</h3>

            <!-- Botón para añadir usuario -->
            <button type="button" class="btn btn-success mb-3 d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#userModal" @click="clearForm"><span class="material-icons me-2">person_add</span> Añadir Usuario</button>

            <!-- Tabla de usuarios -->
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Nº</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Celular</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in users" :key="user.id">
                        <td>{{ index+1 }}</td>
                        <td>{{ user.nombre }}</td>
                        <td>{{ user.apellido }}</td>
                        <td>{{ user.celular }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                            <span v-if="user.esadmin" class="badge bg-primary">Sí</span>
                            <span v-else class="badge bg-secondary">No</span>
                        </td>
                        <td>
                            <div class="btn-group">
                                <button class="btn btn-warning me-2 d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#userModal" @click="editUser(user)">
                                    <span class="material-icons me-2">edit</span> Editar
                                </button>
                                <button class="btn btn-danger d-flex align-items-center" @click="deleteUser(user.id)">
                                    <span class="material-icons me-2">delete</span> Eliminar
                                </button>
                            </div>


                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal para añadir o editar usuario -->
        <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ currentEditId ? 'Editar Usuario' : 'Registrar Nuevo Usuario' }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="registerOrUpdate">
                            <div class="row mb-3">
                                <div class="col-12 col-md-6">
                                    <div class="input-container">
                                        <input type="text" placeholder="Ingrese su nombre" :value="form.nombre" @input="validateNombre" id="name" class="form-control" :class="{ 'is-invalid': errors.nombre }" />
                                        <span class="input-icon material-icons">person</span>
                                    </div>
                                    <div class="feedback" v-if="errors.nombre">
                                        {{ errors.nombre[0] }}
                                    </div>
                                </div>
                                <div class="col-12 col-md-6">
                                    <div class="input-container">
                                        <input type="text" placeholder="Ingrese su apellido" :value="form.apellido" @input="validateApellido" id="apellido" class="form-control" :class="{ 'is-invalid': errors.apellido }" />
                                        <span class="input-icon material-icons">person_outline</span>
                                    </div>
                                    <div class="feedback" v-if="errors.apellido">
                                        {{ errors.apellido[0] }}
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <div class="input-container">
                                        <input type="text" placeholder="Ingrese su celular" @input="validateCelular" v-model="form.celular" id="celular" class="form-control" :class="{ 'is-invalid': errors.celular }" />
                                        <span class="input-icon material-icons">phone</span>
                                    </div>
                                    <div class="feedback" v-if="errors.celular">
                                        {{ errors.celular[0] }}
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="input-container">
                                        <input type="email" placeholder="Ingrese su correo electrónico" v-model="form.email" id="email" class="form-control" :class="{ 'is-invalid': errors.email }" />
                                        <span class="input-icon material-icons">email</span>
                                    </div>
                                    <div class="feedback" v-if="errors.email">
                                        {{ errors.email[0] }}
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-3">
                            <div class="col-md-6">
                                <div class="input-container">
                                <input 
                                    :type="isPasswordVisible ? 'text' : 'password'" 
                                    placeholder="Ingrese su contraseña" 
                                    v-model="form.password" 
                                    id="password" 
                                    class="form-control" 
                                    :class="{ 'is-invalid': errors.password }" 
                                />
                                <span class="input-icon material-icons">lock</span>
                                <span 
                                    type="button" 
                                    @click="togglePasswordVisibility('password')" 
                                    class="password-toggle material-icons position-absolute top-50 end-0 translate-middle-y" 
                                    :class="{'text-primary': isPasswordVisible}"
                                >
                                    {{ isPasswordVisible ? 'visibility' : 'visibility_off' }}
                                </span>
                                </div>
                                <div class="feedback" v-if="errors.password">
                                {{ errors.password[0] }}
                                </div>
                                <small class="text-muted" v-if="currentEditId">
                                Dejar en blanco para mantener la contraseña actual
                                </small>
                            </div>
                            <div class="col-md-6">
                                <div class="input-container">
                                <input 
                                    :type="isPasswordConfirmVisible ? 'text' : 'password'" 
                                    placeholder="Confirme su contraseña" 
                                    v-model="form.password_confirmation" 
                                    id="password_confirmation" 
                                    class="form-control" 
                                    :class="{ 'is-invalid': errors.password_confirmation }" 
                                />
                                <span class="input-icon material-icons">lock</span>
                                <span 
                                    type="button" 
                                    @click="togglePasswordVisibility('password_confirmation')" 
                                    class="password-toggle material-icons position-absolute top-50 end-0 translate-middle-y" 
                                    :class="{'text-primary': isPasswordConfirmVisible}"
                                >
                                    {{ isPasswordConfirmVisible ? 'visibility' : 'visibility_off' }}
                                </span>
                                </div>
                                <div class="feedback" v-if="errors.password_confirmation">
                                {{ errors.password_confirmation[0] }}
                                </div>
                            </div>
                            </div>


                            <div class="mb-3">
                                <label class="form-label">¿Es Administrador?</label>
                                <select class="form-control" v-model="form.esadmin">
                                    <option :value="true">Sí</option>
                                    <option :value="false">No</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">{{ currentEditId ? 'Actualizar' : 'Registrar' }}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import User from '../../apis/User';
import { reactive, ref, onMounted } from 'vue';
import { show_alerta } from '../../apis/Api';
import Swal from 'sweetalert2';

const users = ref([]);
const form = reactive({
  nombre: '',
  apellido: '',
  celular: '',
  email: '',
  password: '',
  password_confirmation: '',
  esadmin: false,
});

const errors = reactive({});
const currentEditId = ref(null);
const isPasswordVisible = ref(false);
const isPasswordConfirmVisible = ref(false);

const togglePasswordVisibility = (field) => {
    if (field === 'password') {
        isPasswordVisible.value = !isPasswordVisible.value;
    } else if (field === 'password_confirmation') {
        isPasswordConfirmVisible.value = !isPasswordConfirmVisible.value;
    }
};

// Validación de celular
const validateCelular = () => {
  form.celular = form.celular.replace(/\D/g, '');
  if (form.celular.length > 10) {
    form.celular = form.celular.slice(0, 10);
  }
  if (form.celular && !/^0\d{9}$/.test(form.celular)) {
    errors.celular = ['El celular debe tener 10 dígitos y empezar con 0'];
  } else {
    delete errors.celular;
  }
};

// Validación de nombre
const validateNombre = (e) => {
  const value = e.target.value;
  if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(value)) {
    e.target.value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
  }
  form.nombre = e.target.value;
  if (!form.nombre.trim()) {
    errors.nombre = ['El nombre es requerido'];
  } else {
    delete errors.nombre;
  }
};

// Validación de apellido
const validateApellido = (e) => {
  const value = e.target.value;
  if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(value)) {
    e.target.value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
  }
  form.apellido = e.target.value;
  if (!form.apellido.trim()) {
    errors.apellido = ['El apellido es requerido'];
  } else {
    delete errors.apellido;
  }
};

// Validación del formulario completo
const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]);
  
  let isValid = true;

  // Validaciones básicas
  if (!form.nombre.trim()) {
    errors.nombre = ['El nombre es requerido'];
    isValid = false;
  }

  if (!form.apellido.trim()) {
    errors.apellido = ['El apellido es requerido'];
    isValid = false;
  }

  if (!/^0\d{9}$/.test(form.celular)) {
    errors.celular = ['El celular debe tener 10 dígitos y empezar con 0'];
    isValid = false;
  }

  if (!form.email.trim()) {
    errors.email = ['El email es requerido'];
    isValid = false;
  }

  // Validación de contraseña
  if (!currentEditId.value) {
    // Nuevo usuario: contraseña requerida
    if (!form.password) {
      errors.password = ['La contraseña es requerida'];
      isValid = false;
    }
  }

  // Si se ingresó una contraseña (nuevo usuario o edición)
  if (form.password || form.password_confirmation) {
    if (form.password.length < 8) {
      errors.password = ['La contraseña debe tener al menos 8 caracteres'];
      isValid = false;
    }
    
    if (form.password !== form.password_confirmation) {
      errors.password = ['Las contraseñas no coinciden'];
      isValid = false;
    }
  }

  return isValid;
};
const fetchUsers = async () => {
  try {
    users.value = await User.fetchUsuarios();
  } catch (error) {
    console.error(error);
    show_alerta('Error al cargar usuarios', 'error');
  }
};

const clearForm = () => {
  Object.assign(form, {
    nombre: '',
    apellido: '',
    celular: '',
    email: '',
    password: '',
    password_confirmation: '',
    esadmin: false,
  });
  currentEditId.value = null;
  Object.keys(errors).forEach(key => delete errors[key]);
};

const closeModal = () => {
  const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
  if (modal) {
    modal.hide();
  }
};

const registerOrUpdate = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    if (currentEditId.value) {
      // Preparar datos para actualización
      const updateData = { ...form };
      
      // Si no se ingresó una nueva contraseña, eliminar los campos relacionados
      if (!updateData.password.trim()) {
        delete updateData.password;
        delete updateData.password_confirmation;
      }

      await User.updateUsuario(currentEditId.value, updateData);
      show_alerta('Usuario actualizado con éxito', 'success');
    } else {
      await User.register(form);
      show_alerta('Usuario registrado con éxito', 'success');
    }
    
    closeModal();
    await fetchUsers();
    clearForm();
  } catch (error) {
    console.error(error);
    const errorMessage = error.response?.data?.message || 'Error en la operación';
    show_alerta(errorMessage, 'error');
  }
};
const deleteUser = async (id) => {
  try {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await User.deleteUsuario(id);
      users.value = users.value.filter((user) => user.id !== id);
      Swal.fire(
        'Eliminado!',
        'El usuario ha sido eliminado.',
        'success'
      );
    }
  } catch (error) {
    console.error(error);
    show_alerta('Error al eliminar el usuario', 'error');
  }
};

const editUser = (user) => {
  clearForm();
  Object.assign(form, {
    ...user,
    password: '',
    password_confirmation: ''
  });
  currentEditId.value = user.id;
};

onMounted(fetchUsers);
</script>

<style scoped>



.form-control {
    padding: 0.8rem 1rem;
    border: 1px solid #ced4da;
    border-radius: 8px;
    background-color: #f8f5f6;
}

.form-control:focus {
    box-shadow: none;
    border-color: #dc8e35;
    background-color: #ffffff;
}


.password-field {
    position: relative;
}

.password-toggle {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #6c757d;
}

.forgot-password {
    color:  #eb8511c7;
    text-decoration: none;
    font-size: 0.9rem;
}


/* Estilos comunes para el contenedor de input */
.input-container {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
}

.input-container input {
    border-radius: 6px;
    border: 1px solid #ccc;  /* Borde del input solo */
    padding-left: 30px;  /* espacio para el icono */
}

.input-container .input-icon {
    position: absolute;
    left: 10px;  /* posiciona el ícono dentro del input */
    font-size: 18px;
    color: #555;
}

/* Mostrar los iconos de las contraseñas */
.password-toggle {
    cursor: pointer;
    transition: color 0.3s;
}

.password-toggle.text-primary {
    color: #007bff;  /* Cambio de color al hacer click */
}

/* Apoyo para inputs con error */
.is-invalid {
    border-color: #dc3545 !important;
    background-color: #f8d7da;
}

.feedback {
    color: #dc3545;
    font-size: 0.875rem;
}



</style>