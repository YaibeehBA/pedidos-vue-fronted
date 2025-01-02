<template>
   <main class="product-section">
    <div class="product-header">
        <span><i class=""></i> 64 resultados para ropa</span>
        <select class="sort-select">
            <option>Popular</option>
            <option>Precio: Menor a Mayor</option>
            <option>Precio: Mayor a Menor</option>
        </select>
    </div>

    <div class="products-grid">
        <!-- Product Card -->
        <div class="product-card">
            <div class="product-image-wrap">
                <img src="https://i.pinimg.com/736x/65/a7/03/65a703451eb4173250f80063679b2841.jpg" 
                     alt="Producto 1" 
                     class="product-image">
                <button class="wishlist-btn">
                    <span class="material-icons">favorite_border </span>
                    
                </button>
            </div>
            <div class="product-info">
                <h3>Vista previa</h3>
                <p class="price"> <span class="material-icons">local_shipping</span>Realizar Pedido</p>
            </div>
        </div>

        <!-- Repetir la card anterior 5 veces más -->
        <div class="product-card">
            <div class="product-image-wrap">
                <img src="https://i.pinimg.com/736x/15/72/32/1572323a287991f646f7b873059a3572.jpg" 
                     alt="Producto 1" 
                     class="product-image">
                <button class="wishlist-btn">
                    <span class="material-icons">favorite_border </span>
                    
                </button>
            </div>
            <div class="product-info">
                <h3>Vista previa</h3>
                <p class="price"> <span class="material-icons">local_shipping</span>Realizar Pedido</p>
            </div>
        </div>
        <div class="product-card">
            <div class="product-image-wrap">
                <img src="https://i.pinimg.com/736x/dc/ca/f1/dccaf179919197bc4764b8296a451328.jpg" 
                     alt="Producto 1" 
                     class="product-image">
                <button class="wishlist-btn">
                    <span class="material-icons">favorite_border </span>
                </button>
            </div>
            <div class="product-info">
                <h3>Vista previa</h3>
                <p class="price"> <span class="material-icons">local_shipping</span>Realizar Pedido</p>
            </div>
        </div>
        <div class="product-card">
            <div class="product-image-wrap">
                <img src="https://i.pinimg.com/736x/83/85/a9/8385a94ae1498449681174e693fa132c.jpg" 
                     alt="Producto 1" 
                     class="product-image">
                <button class="wishlist-btn">
                    <span class="material-icons">favorite_border </span>
                    
                </button>
            </div>
            <div class="product-info">
                <h3>Vista previa</h3>
                <p class="price"> <span class="material-icons">local_shipping</span>Realizar Pedido</p>
            </div>
        </div>
        <div class="product-card">
            <div class="product-image-wrap">
                <img src="https://i.pinimg.com/736x/3f/1b/20/3f1b20998806b5ab670ab2633efa5d19.jpg" 
                     alt="Producto 1" 
                     class="product-image">
                <button class="wishlist-btn">
                    <span class="material-icons">favorite_border </span>
                    
                </button>
            </div>
            <div class="product-info">
                <h3>Vista previa</h3>
                <p class="price"> <span class="material-icons">local_shipping</span>Realizar Pedido</p>
                
            </div>
        </div>
        <div class="product-card">
            <div class="product-image-wrap">
                <img src="https://i.pinimg.com/736x/bf/27/98/bf27984c795ab9199d9f2f50f79cc7bf.jpg" 
                     alt="Producto 1" 
                     class="product-image">
                <button class="wishlist-btn">
                    <span class="material-icons">favorite_border </span>
                    
                </button>
            </div>
            <div class="product-info">
                <h3>Vista previa</h3>
                <p class="price"> <span class="material-icons">local_shipping</span>Realizar Pedido</p>
                
            </div>
        </div>
    </div>
</main>

  </template>
  
<style scoped>

.product-section {
    width: 100%;
    padding: 0 15px;
}

.product-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.sort-select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
}

.product-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: box-shadow 0.3s ease;
    width: 100%;
}

.product-card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transform: translateY(-2px);
    transition: all 0.3s ease;
}

.product-image-wrap {
    position: relative;
    width: 100%;
    height: 447px;
    overflow: hidden;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-card:hover .product-image {
    transform: scale(1.05);
}

.wishlist-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
}

.wishlist-btn:hover {
    background: #fc0137;
    transform: scale(1.1);
}

.product-info {
    padding: 1rem;
}

.product-info h3 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    color: #333;
}

.price {
    color: #0066cc;
    font-weight: bold;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

@media (max-width: 1200px) {
    .products-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 992px) {
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 576px) {
    .products-grid {
        grid-template-columns: 1fr;
    }
    
    .product-section {
        padding: 0 10px;
    }
    
    .product-header {
        flex-direction: column;
        gap: 1rem;
    }
}
</style>
  