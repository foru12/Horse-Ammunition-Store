let cart = JSON.parse(localStorage.getItem('cart')) || [];





async function loadProducts() {
    try {
        const response = await fetch('http://localhost:8081/products');
        if (!response.ok) {
            throw new Error('Ошибка сети: ' + response.status);
        }
        const products = await response.json();
        console.log('Товары загружены:', products); // Отладка
        displayProducts(products);
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
});
function displayProducts(products) {
    const sections = {
        'Седла': document.querySelector('#sedla .product-list'),
        'Вольтрапы': document.querySelector('#voltrapy .product-list'),
        'Подпруги': document.querySelector('#podprugi .product-list'),
        'Элементы упряжи': document.querySelector('#upryaz .product-list')
    };

    products.forEach(product => {
        console.log('Отображение товара:', product); // Отладка
        const section = sections[product.category];
        if (section) {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price} руб.</p>
                <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}" data-image="${product.imageUrl}">В корзину</button>
            `;
            section.appendChild(productItem);
        }
    });

    // Добавляем обработчики для кнопок "В корзину"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        console.log('Добавление обработчика для кнопки:', button); // Отладка
        button.addEventListener('click', () => {
            const username = localStorage.getItem('username');

            if (!username) {
                alert('Пожалуйста, войдите в систему, чтобы добавить товары в корзину.');
                window.location.href = 'login.html';
                return;
            }

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
        });
    });
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

        document.getElementById('logout-button').addEventListener('click', () => {
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
// Обновляем количество товаров в корзине при загрузке страницы
updateCartCount();

// Загружаем товары с сервера при загрузке страницы
loadProducts();

// Функция для отображения товаров в корзине
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Очищаем контейнер

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="5">Ваша корзина пуста.</td></tr>';
        return;
    }

    cart.forEach((item, index) => {
        const cartItem = document.createElement('tr');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" width="50"></td>
            <td>${item.name}</td>
            <td>${item.price} руб.</td>
            <td>${item.quantity}</td>
            <td><button class="remove-item" data-index="${index}">Удалить</button></td>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Обновляем общую стоимость
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById('cart-total').textContent = `Итого: ${total} руб.`;

    // Добавляем обработчики для кнопок "Удалить"
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            removeItemFromCart(index); // Удаляем товар из корзины
        });
    });
}
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartIcon.setAttribute('data-count', totalItems);
    }
}
function removeItemFromCart(index) {
    cart.splice(index, 1); // Удаляем товар из массива cart по индексу
    saveCart(); // Сохраняем обновленную корзину в localStorage
    updateCartCount(); // Обновляем количество товаров в корзине
    displayCartItems(); // Перерисовываем корзину
}
// Открытие модального окна при нажатии на "Оформить заказ"
document.getElementById('checkout-button').addEventListener('click', () => {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'block'; // Показываем модальное окно
});

// Закрытие модального окна при нажатии на крестик
document.getElementById('close-modal').addEventListener('click', () => {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'none'; // Закрываем модальное окно
});

// Обработка отправки чека по email
document.getElementById('send-receipt').addEventListener('click', () => {
    const customerEmail = document.getElementById('customer-email').value;
    const emailModal = document.getElementById('checkout-modal');
    const emailError = document.getElementById('email-error');

    sendOrderEmail(customerEmail, emailModal, emailError);
});

function sendOrderEmail(customerEmail, emailModal, emailError) {
    // Очищаем предыдущие сообщения об ошибках
    emailError.textContent = '';

    if (!customerEmail) {
        emailError.textContent = 'Пожалуйста, введите ваш email.';
        return;
    }

    // Простая валидация email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(customerEmail)) {
        emailError.textContent = 'Пожалуйста, введите корректный email.';
        return;
    }

    // Формируем детали заказа
    let orderDetails = '';
    let total = 0;
    cart.forEach(item => {
        orderDetails += `${item.name} x${item.quantity} - ${item.price * item.quantity} руб.\n`;
        total += item.price * item.quantity;
    });
    orderDetails += `\nИтого: ${total} руб.`;

    // Отправляем email через EmailJS
    emailjs.send('service_k8pv32x', 'template_hp81hke', {
        customer_email: customerEmail,
        order_details: orderDetails
    })
    .then(() => {
        alert('Спасибо за заказ! Чек отправлен на вашу почту.');
        cart = []; // Очищаем корзину после заказа
        saveCart(); // Сохраняем пустую корзину
        updateCartCount(); // Обновляем счетчик товаров
        window.location.href = 'index.html'; // Возвращаемся на главную страницу
    }, (error) => {
        console.error('Ошибка при отправке email:', error);
        emailError.textContent = 'Не удалось оформить заказ. Пожалуйста, попробуйте снова.';
    });

    // Закрываем модальное окно
    emailModal.style.display = 'none';
}

// Функция для очистки формы email
function clearEmailForm() {
    const customerEmailInput = document.getElementById('customer-email');
    const emailError = document.getElementById('email-error');
    if (customerEmailInput) customerEmailInput.value = '';
    if (emailError) emailError.textContent = '';
}


// Обновляем количество товаров в корзине при загрузке страницы
updateCartCount();

// Загружаем товары с сервера при загрузке страницы
loadProducts();
