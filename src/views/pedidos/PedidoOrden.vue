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
              <h5 class="mb-0">Customer's cart</h5>
              <i class="material-icons">more_vert</i>
            </div>
            <div class="card-body">
              <!-- Product Item -->
              <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                <img src="" alt="Product" class="rounded me-3" style="width: 80px; height: 80px; object-fit: cover;">
                <div class="flex-grow-1">
                  <h6 class="mb-0">{{ nombre }}</h6>
                  <p class="text-muted small mb-0">
                    Planter Style: Grant, Limited Edition planter<br>
                    Size: {{ talla }}<br>
                    Color: {{ color }}
                  </p>
                </div>
                <div class="text-end" style="min-width: 100px;">
                  <div>1</div>
                  <strong>£{{ precio }}</strong>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Summary Card -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Summary</h5>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>£{{ precio }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>£9.99</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Tax</span>
                <span>£{{ (precio * 0.20).toFixed(2) }}</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between">
                <strong>Total</strong>
                <strong>£{{ (parseFloat(precio) + 9.99 + (precio * 0.20)).toFixed(2) }}</strong>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Customer Column -->
        <div class="col-md-4">
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Customer</h5>
            </div>
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <img src="" alt="Customer" class="rounded-circle me-2">
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
              <hr>
              <div class="mb-3">
                <h6>Shipping address</h6>
                <p class="mb-0">
                  John Doe<br>
                  123 Main St.<br>
                  New York, NY 10001<br>
                  United States
                </p>
              </div>
              <hr>
              <div>
                <h6>Billing address</h6>
                <p class="mb-0">
                  John Doe<br>
                  123 Main St.<br>
                  New York, NY 10001<br>
                  United States
                </p>
              </div>
            </div>
          </div>
  
          <!-- Shipping Card -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Shipping</h5>
            </div>
            <div class="card-body">
              <div class="d-flex align-items-center">
                <img src="" alt="DPD" class="me-3" style="width: 40px; height: 40px;">
                <div>
                  <h6 class="mb-0">DPD Delivery</h6>
                  <small class="text-muted">Saturday & Sunday Delivery</small>
                </div>
                <strong class="ms-auto">£9.99</strong>
              </div>
              <button class="btn btn-light w-100 mt-3">
                View carrier details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from "vue-router"; // Importar useRoute
  
  // Obtener los query params de la URL
  const route = useRoute();
  const queryParams = route.query;
  
  // Extraer los parámetros directamente
  const productoId = queryParams.producto_id;  // Este debería estar correctamente poblado ahora
  const varianteId = queryParams.variante_id;
  const nombre = queryParams.nombre;
  const descripcion = queryParams.descripcion;
  const precio = queryParams.precio;
  const talla = queryParams.talla;
  const color = queryParams.color || 'No Color';
  
  // Verificar que los datos están correctos
  console.log(queryParams); // Para ver qué parámetros recibes en consola
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