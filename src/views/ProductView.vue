<template>
  <div class="container py-5">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Men</a></li>
        <li class="breadcrumb-item"><a href="#">Tops</a></li>
        <li class="breadcrumb-item active" aria-current="page">Peanuts Long Sleeve Sweatshirt</li>
      </ol>
    </nav>

    <div class="row">
      <!-- Imágenes del producto -->
      <div>
        <ProductImages />
      </div>

      
    </div>

    <!-- Opiniones y calificaciones (una sola fila) -->
    <div class="row mt-5">
      <div class="col-md-6">
        <Reviews />
      </div>
      <div class="col-md-6">

        <Ratings />
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  import ProductImages from "../components/layout/producto/ProductImages.vue";
  import ProductDetails from "../components/layout/producto/ProductDetails.vue";
  import Ratings from "../components/layout/producto/Ratings.vue";
  import Reviews from "../components/layout/producto/Reviews.vue";
  </script>
  
  <style>
  body {
    font-family: "Arial", sans-serif;
  }
  </style>
  