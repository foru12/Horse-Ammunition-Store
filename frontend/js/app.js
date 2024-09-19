let cart = JSON.parse(localStorage.getItem('cart')) || [];

async function loadCategoriesAndProducts() {
    try {
        // Загрузка категорий
        const categoryResponse = await fetch('http://localhost:8081/categories');
        if (!categoryResponse.ok) {
            throw new Error('Ошибка сети: ' + categoryResponse.status);
        }
        const categories = await categoryResponse.json();
        console.log('Категории загружены:', categories);

        // Отображение категорий на главной странице
        displayCategories(categories);

        // Загрузка товаров
        const productResponse = await fetch('http://localhost:8081/products');
        if (!productResponse.ok) {
            throw new Error('Ошибка сети: ' + productResponse.status);
        }
        const products = await productResponse.json();
        console.log('Товары загружены:', products);

        // Отображение товаров
        displayProducts(products);

    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
}

// Запуск загрузки категорий и товаров при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadCategoriesAndProducts();
    updateCartCount();
});

// Отображение категорий на главной странице
function displayCategories(categories) {
    const main = document.querySelector('main');
    main.innerHTML = ''; // Очищаем старое содержимое

    categories.forEach(category => {
        const section = document.createElement('section');
        section.id = `category-${category.id}`; // Устанавливаем ID секции по ID категории
        section.innerHTML = `
            <h2>${category.name}</h2>
            <div class="product-list"></div>
        `;
        main.appendChild(section);
    });
}

// Отображение товаров в соответствующих категориях
function displayProducts(products) {
    products.forEach(product => {
        // Найдем секцию категории, используя ID категории товара
        const section = document.querySelector(`#category-${product.category} .product-list`);
        if (section) {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <img src="${product.imageUrl || 'placeholder.png'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price} руб.</p>
                <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}" data-image="${product.imageUrl}">В корзину</button>
            `;
            section.appendChild(productItem);
        } else {
            console.warn(`Секция для категории ${product.category} не найдена`);
        }
    });

    // Добавляем обработчики для кнопок "В корзину" только один раз
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.removeEventListener('click', addToCart);  // Удаляем старые обработчики
        button.addEventListener('click', addToCart);  // Добавляем новые обработчики
    });
}

// Обработчик для добавления товара в корзину
function addToCart(event) {
    const button = event.target;
    const name = button.getAttribute('data-name');
    const price = parseInt(button.getAttribute('data-price'));
    const image = button.getAttribute('data-image');
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    alert(`${name} добавлен(а) в корзину.`);
}

// Сохранение корзины в localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Обновление количества товаров в корзине
function updateCartCount() {
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartIcon.setAttribute('data-count', totalItems);
    }
}

// Отображение информации о пользователе и кнопки "Выйти"
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const authContainer = document.getElementById('auth-container');

    if (username) {
        authContainer.innerHTML = `
            <p>Привет, ${username}!</p>
            <button id="logout-button">Выйти</button>
        `;

        document.getElementById('logout-button').addEventListener('click', () => {по
            localStorage.removeItem('username');
            localStorage.removeItem('token');
            window.location.href = 'index.html'; // Перезагрузка страницы после выхода
        });
    } else {
        authContainer.innerHTML = `
            <a href="login.html">Войти</a> или <a href="register.html">Зарегистрироваться</a>
        `;
    }
});
