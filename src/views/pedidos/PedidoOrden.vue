<template>
    <div class="container py-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4>Order #5780</h4>
                <small class="text-muted">2 May 2021 at 12:43 PM</small>
            </div>
        </div>

        <div class="row">
            <!-- Cart Column -->
            <div class="col-md-8">
                <div class="card mb-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Producto Solicitado</h5>
                        <i class="material-icons">more_vert</i>
                    </div>
                    <div class="card-body">
                        <!-- Product Item -->
                        <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                            <img v-if="imagenUrl" :src="imagenUrl" alt="Product" class="rounded me-3" style="width: 80px; height: 80px; object-fit: cover;" />
                            <div class="flex-grow-1">
                                <h6 class="mb-0">{{ nombre }}</h6>
                                <p class="text-muted small mb-0">
                                    {{ descripcion }}<br />
                                    Talla: {{ talla }}<br />
                                    Color: {{ color }}
                                </p>
                            </div>
                            <div class="text-end" style="min-width: 100px;">
                                <div>1</div>
                                <strong>${{ precio }}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Summary Card -->
                <div class="card">
                    <div class="card-header">
                <h5 class="mb-0">Resumen del Pedido</h5>
            </div>
            <div class="card-body">
        <!-- Entrada para número de prendas -->
        <div class="mb-3">
          <label for="prendas" class="form-label">Cantidad de Prendas</label>
          <input
            id="prendas"
            type="number"
            v-model.number="prendas"
            @input="validarPrendas"
            class="form-control"
            placeholder="Ingrese el número de prendas"
            :max="30"
            :min="1"
          />
        </div>

        <!-- Fecha de entrega -->
        <div class="d-flex justify-content-between mb-2">
          <span>Fecha de Entrega</span>
          <span><strong>{{ fechaEntrega }}</strong></span>
        </div>

        <!-- Feedback dinámico -->
        <div v-if="mensajeFeedback" class="alert alert-info mt-2">
          {{ mensajeFeedback }}
        </div>

        <!-- Total -->
        <div class="d-flex justify-content-between mb-2">
          <span>Total</span>
          <span>$ {{ precioTotal.toFixed(2) }}</span>
        </div>
        <hr />
        <div class="d-flex justify-content-between">
          <strong>Total</strong>
          <strong>$ {{ precioTotal.toFixed(2) }}</strong>
        </div>
      </div>
        </div>

            </div>

            <!-- Customer Column -->
            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Cliente</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div>
                                <h6 class="mb-0">John Doe</h6>
                                <small class="text-muted">10 previous orders</small>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex align-items-center mb-2">
                                <i class="material-icons me-2 text-muted">email</i>
                                <span>customer@example.com</span>
                            </div>
                        </div>
                        <hr />
                        <div class="mb-3">
                            <h6>Dirección</h6>
                            <p class="mb-0">
                                John Doe<br />
                                123 Main St.<br />
                                New York, NY 10001<br />
                                United States
                            </p>
                        </div>
                        <hr />
                    </div>
                </div>

                <div>
                    <button class="btn btn-dark w-100">Enviar Correo</button>
                </div>
            </div>
        </div>
    </div>
</template>

  
  <script setup>
  import { useRoute } from "vue-router"; 
  import { ref, computed } from "vue";


// Obtener los query params de la URL
const route = useRoute();
const queryParams = route.query;


 const productoId = queryParams.producto_id;  
  const varianteId = queryParams.variante_id;
  const nombre = queryParams.nombre;
  const descripcion = queryParams.descripcion;
  const precio = queryParams.precio;
  const talla = queryParams.talla;
  const color = queryParams.color || 'No Color';
  // const imagenUrl = queryParams.imagen_url || '';
  const imagenUrl = computed(() => decodeURIComponent(route.query.imagen_url));
  
 


const prendas = ref(0); // Número de prendas
const precioBasePorPrenda = precio; // Precio base por unidad
const maxPrendasPorDia = 6;
const mensajeFeedback = ref(""); // Feedback dinámico

// Calcular fecha de entrega
const calcularFechaEntrega = (prendasTotales) => {
  const hoy = new Date();
  let diasEntrega;

  if (prendasTotales <= 0) {
    mensajeFeedback.value = "Por favor, ingrese el número de prendas.";
    return "Fecha no disponible";
  } else if (prendasTotales <= 6) {
    diasEntrega = 3;
    mensajeFeedback.value = "Pedidos de hasta 6 prendas se entregan en 3 días.";
  } else if (prendasTotales <= 15) {
    diasEntrega = 5;
    mensajeFeedback.value =
      "Pedidos entre 7 y 15 prendas se entregan en 5 días debido al procesamiento adicional.";
  } else if (prendasTotales <= 30) {
    diasEntrega = 7;
    mensajeFeedback.value =
      "Pedidos entre 16 y 30 prendas se entregan en 7 días por la carga de trabajo.";
  } else {
    mensajeFeedback.value =
      "La cantidad no puede ser mayor a 30. Por favor, ajuste su pedido.";
    return "Cantidad inválida";
  }

  // Días adicionales según la capacidad máxima diaria
  const diasExtraPorProduccion = Math.ceil(prendasTotales / maxPrendasPorDia) - 1;
  diasEntrega += diasExtraPorProduccion;

  hoy.setDate(hoy.getDate() + diasEntrega);
  return hoy.toLocaleDateString();
};

// Computed para la fecha de entrega dinámica
const fechaEntrega = computed(() => calcularFechaEntrega(prendas.value));

// Calcular precio total
const precioTotal = computed(() => prendas.value * precioBasePorPrenda);

// Validar número de prendas en tiempo real
const validarPrendas = (event) => {
  const valor = parseInt(event.target.value || 0);

  if (valor < 0) {
    prendas.value = 0;
    mensajeFeedback.value = "Por favor, ingrese una cantidad válida.";
  } else if (valor > 30) {
    prendas.value = 30;
    mensajeFeedback.value =
      "La cantidad máxima permitida es 30 prendas. Ajustando automáticamente.";
  } else {
    prendas.value = valor;
  }
};


 
  
  // Verificar que los datos están correctos
  console.log(queryParams); 
  </script>
  <style scoped>
  .card {
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  .card-header {
    background-color: white;
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }
  
  .badge {
    padding: 8px 12px;
    border-radius: 20px;
  }
  
  .material-icons {
    font-size: 20px;
    color: #666;
  }
  
  .btn-light {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
  }
  
  .btn-light:hover {
    background-color: #e9ecef;
  }
  </style>