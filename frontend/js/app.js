document.addEventListener('DOMContentLoaded', function () {
    const productsSection = document.getElementById('products');
    
    // Пример: добавим продукт через JavaScript
    const product = document.createElement('div');
    product.innerHTML = `
        <h3>Leather Saddle</h3>
        <p>High-quality leather saddle for comfortable riding.</p>
        <p>Price: $200</p>
        <button>Add to Cart</button>
    `;
    
    productsSection.appendChild(product);
});