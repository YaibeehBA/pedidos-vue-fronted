<template>
    <div class="slider-wrapper">
      <!-- Contenedor de imágenes -->
      <div class="slider-container">
        <div class="slider">
          <div 
            v-for="(image, index) in images" 
            :key="index" 
            class="slide" 
            :style="{
              opacity: currentIndex === index ? 1 : 0,
              transition: 'opacity 1.5s ease-out',
            }">
            <img :src="image" alt="Slide" class="slide-image"/>
          </div>
        </div>
      </div>
  
      <!-- Contenedor de los botones fuera del slider -->
      <div class="buttons-container">
        <button @click="prevSlide" class="prev-btn">❮</button>
        <button @click="nextSlide" class="next-btn">❯</button>
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue';
  
  export default {
    setup() {
      const images = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1BE2o7cit9w7x3AdKqFqn-qC_JUQS2PMr6A&s',
        'https://www.shutterstock.com/image-vector/ad-banner-design-kids-clothes-600nw-2191568211.jpg',
        'https://i.pinimg.com/736x/3a/b8/d4/3ab8d4c2461f0c85260133fabb3cfb55.jpg',
      ];
      const currentIndex = ref(0); // El índice actual de la imagen visible.
  
      // Función para ir a la imagen siguiente
      const nextSlide = () => {
        currentIndex.value = (currentIndex.value + 1) % images.length;
      };
  
      // Función para ir a la imagen anterior
      const prevSlide = () => {
        currentIndex.value = (currentIndex.value - 1 + images.length) % images.length;
      };
  
      // Cambio automático de imagen segundos
      onMounted(() => {
        setInterval(nextSlide, 8000);
      });
  
      return {
        images,
        currentIndex,
        nextSlide,
        prevSlide,
      };
    },
  };
  </script>
  
  <style scoped>
.slider-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 400px; /* Ajusta la altura de la imagen según sea necesario */
}

.slider-container {
  position: relative;
  overflow: hidden;
  width: calc(100% - 6cm); /* El contenedor solo ocupa el ancho disponible, dejando 3cm a la izquierda y derecha */
  height: 100%;
  margin: 0 3cm; /* Márgenes izquierdo y derecho de 3cm para el espacio de los botones */
}

.slider {
  display: flex;
  transition: transform 90s ease-in-out; /* Transición de 90 segundos (1.5 minutos) */
}

.slide {
  min-width: 100%;
  height: 100%;
  position: absolute; /* Las imágenes estarán apiladas */
  transition: opacity 90s ease-in-out; /* Transición de 90 segundos para la opacidad */
  opacity: 0;
}

.slide:nth-child(1) {
  opacity: 1; /* Solo la primera imagen está visible */
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Asegura que la imagen no se deforme */
}



  /* Contenedor de botones, fuera del área de las imágenes */
  .buttons-container {
    position: absolute;
    width: 100%; /* El contenedor abarca todo el ancho */
    display: flex;
    justify-content: space-between; /* Alineación horizontal de los botones */
    top: 50%;
    transform: translateY(-50%);
    z-index: 10; /* Asegura que los botones estén por encima de las imágenes */
  }
  
  button {
    background-color: rgba(255, 255, 255, 0.712);
    color: #d8b621;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    padding: 10px;
    z-index: 10;
  }
  
  .prev-btn {
    position: absolute;
    left: 55px;
  }
  
  .next-btn {
    position: absolute;
    right: 55px;
  }
  </style>
  