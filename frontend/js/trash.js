let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Функция отображения товаров в корзине
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    cartItemsContainer.innerHTML = ''; // Очищаем старое содержимое

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="5">Ваша корзина пуста.</td></tr>';
        cartTotalElement.textContent = '0 руб.';
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('tr');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <td><img src="${item.image || 'placeholder.png'}" alt="${item.name}" width="50"></td>
            <td>${item.name}</td>
            <td>${item.price} руб.</td>
            <td>
                <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="item-quantity">
            </td>
            <td><button class="remove-item" data-index="${index}">Удалить</button></td>
        `;
        cartItemsContainer.appendChild(cartItem);

        total += item.price * item.quantity;
    });

    // Обновляем общую стоимость
    cartTotalElement.textContent = `${total} руб.`;

    // Добавляем обработчики для изменения количества и удаления
    document.querySelectorAll('.item-quantity').forEach(input => {
        input.addEventListener('change', (event) => {
            const index = event.target.getAttribute('data-index');
            const newQuantity = parseInt(event.target.value);
            if (newQuantity > 0) {
                cart[index].quantity = newQuantity;
                saveCart();
                displayCartItems();
            }
        });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            removeItemFromCart(index);
        });
    });
}

// Функция удаления товара из корзины
function removeItemFromCart(index) {
    cart.splice(index, 1); // Удаляем товар по индексу
    saveCart(); // Сохраняем изменения в корзине
    displayCartItems(); // Обновляем отображение корзины
    updateCartCount(); // Обновляем количество товаров в иконке корзины
}

// Функция сохранения корзины
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Функция обновления количества товаров в иконке корзины
function updateCartCount() {
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartIcon.setAttribute('data-count', totalItems);
    }
}

// Открытие модального окна для оформления заказа
document.getElementById('checkout-button').addEventListener('click', () => {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'block'; // Показываем модальное окно
});

// Закрытие модального окна
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

// Функция отправки чека по email
function sendOrderEmail(customerEmail, emailModal, emailError) {
    emailError.textContent = ''; // Очищаем сообщения об ошибках

    if (!customerEmail) {
        emailError.textContent = 'Пожалуйста, введите ваш email.';
        return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(customerEmail)) {
        emailError.textContent = 'Пожалуйста, введите корректный email.';
        return;
    }

    let orderDetails = '';
    let total = 0;
    cart.forEach(item => {
        orderDetails += `${item.name} x${item.quantity} - ${item.price * item.quantity} руб.\n`;
        total += item.price * item.quantity;
    });
    orderDetails += `\nИтого: ${total} руб.`;

    emailjs.send('service_k8pv32x', 'template_hp81hke', {
        customer_email: customerEmail,
        order_details: orderDetails
    })
    .then(() => {
        alert('Спасибо за заказ! Чек отправлен на вашу почту.');
        cart = []; // Очищаем корзину после заказа
        saveCart();
        updateCartCount();
        window.location.href = 'index.html'; // Возвращаемся на главную страницу
    }, (error) => {
        console.error('Ошибка при отправке email:', error);
        emailError.textContent = 'Не удалось оформить заказ. Пожалуйста, попробуйте снова.';
    });

    emailModal.style.display = 'none'; // Закрываем модальное окно
}

// Инициализация отображения корзины
document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
    updateCartCount();
});
