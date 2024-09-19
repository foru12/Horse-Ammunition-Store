document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadProducts();
});

// Добавление товара
document.getElementById('productForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productPrice = document.getElementById('productPrice').value;
    const productCategory = document.getElementById('productCategory').value;
    const productImage = document.getElementById('productImage').value;

    const productData = {
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
        category: parseInt(productCategory), // Передаем ID категории
        imageUrl: productImage
    };

    try {
        const response = await fetch('http://localhost:8081/products/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            alert('Товар добавлен успешно');
            loadProducts(); // Перезагружаем список товаров после добавления
        } else {
            alert('Ошибка при добавлении товара');
        }
    } catch (error) {
        console.error('Ошибка при добавлении товара:', error);
    }
});

// Добавление категории
document.getElementById('categoryForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const categoryName = document.getElementById('categoryName').value;

    const categoryData = {
        name: categoryName
    };

    try {
        const response = await fetch('http://localhost:8081/categories/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData)
        });

        if (response.ok) {
            alert('Категория добавлена успешно');
            loadCategories(); // Перезагружаем список категорий после добавления
        } else {
            alert('Ошибка при добавлении категории');
        }
    } catch (error) {
        console.error('Ошибка при добавлении категории:', error);
    }
});
function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';  // Очищаем список товаров

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('item');
        productItem.innerHTML = `
            <span>${product.name} - ${product.price} руб.</span>
            <button class="delete" data-id="${product.id}">Удалить</button>
        `;
        productList.appendChild(productItem);

        // Добавляем обработчик удаления товара
        productItem.querySelector('.delete').addEventListener('click', async function() {
            const productId = this.getAttribute('data-id');
            await deleteProduct(productId);
        });
    });
}

// Загрузка списка категорий
async function loadCategories() {
    try {
        const response = await fetch('http://localhost:8081/categories');
        const categories = await response.json();
        const categorySelect = document.getElementById('productCategory');
        const categoryList = document.getElementById('categoryList');
        categorySelect.innerHTML = '';
        categoryList.innerHTML = '';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);

            const categoryItem = document.createElement('div');
            categoryItem.classList.add('item');
            categoryItem.innerHTML = `
                <span>${category.name}</span>
                <button class="delete" data-id="${category.id}">Удалить</button>
            `;
            categoryList.appendChild(categoryItem);

            // Удаление категории
            categoryItem.querySelector('.delete').addEventListener('click', async function() {
                const categoryId = this.getAttribute('data-id');
                await deleteCategory(categoryId);
            });
        });
    } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
    }
}

async function loadProducts() {
    try {
        const response = await fetch('http://localhost:8081/products');
        if (!response.ok) {
            throw new Error('Ошибка сети: ' + response.status);
        }

        // Проверяем, что ответ имеет содержимое
        const text = await response.text();
        if (!text) {
            throw new Error('Ответ от сервера пуст');
        }

        // Парсим JSON только если содержимое не пустое
        const products = JSON.parse(text);
        console.log('Товары загружены:', products);
        displayProducts(products);
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
    }
}


// Удаление товара
async function deleteProduct(productId) {
    try {
        const response = await fetch(`http://localhost:8081/products/delete/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Товар удален успешно');
            loadProducts(); // Перезагружаем список товаров после удаления
        } else {
            alert('Ошибка при удалении товара');
        }
    } catch (error) {
        console.error('Ошибка при удалении товара:', error);
    }
}

// Удаление категории
async function deleteCategory(categoryId) {
    try {
        const response = await fetch(`http://localhost:8081/categories/delete/${categoryId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Категория удалена успешно');
            loadCategories(); // Перезагружаем список категорий после удаления
        } else {
            alert('Ошибка при удалении категории');
        }
    } catch (error) {
        console.error('Ошибка при удалении категории:', error);
    }
}
