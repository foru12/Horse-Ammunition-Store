// Загружаем корзину из localStorage или создаем новую, если она отсутствует
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Функция для сохранения корзины в localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Функция для обновления счетчика товаров в корзине на всех страницах
function updateCartCount() {
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.setAttribute('data-count', cart.length);
    }
}

// Вызываем updateCartCount при загрузке страницы
updateCartCount();

// Определяем текущую страницу и выполняем соответствующие действия
if (window.location.pathname.endsWith('cart.html')) {
    // На странице корзины отображаем товары и обрабатываем оформление заказа
    displayCartItems();

    // Получаем элементы модального окна после загрузки страницы
    document.addEventListener('DOMContentLoaded', () => {
        const emailModal = document.getElementById('email-modal');
        const closeButton = document.querySelector('.close-button');
        const submitEmailButton = document.getElementById('submit-email-button');
        const customerEmailInput = document.getElementById('customer-email');
        const emailError = document.getElementById('email-error');

        // Обработчик для кнопки закрытия модального окна
        closeButton.addEventListener('click', () => {
            emailModal.style.display = 'none';
            clearEmailForm();
        });

        // Обработчик для кнопки отправки email
        submitEmailButton.addEventListener('click', () => {
            sendOrderEmail(customerEmailInput.value.trim(), emailModal, emailError);
        });

        // Закрываем модальное окно при клике вне его области
        window.addEventListener('click', (event) => {
            if (event.target == emailModal) {
                emailModal.style.display = 'none';
                clearEmailForm();
            }
        });

        // Обработчик для кнопки "Оформить заказ"
        const checkoutButton = document.getElementById('checkout-button');
        checkoutButton.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Ваша корзина пуста.');
                return;
            }
            // Открываем модальное окно
            emailModal.style.display = 'block';
        });
    });
} else {
    // На главной странице добавляем обработчики событий для кнопок "В корзину"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseInt(button.getAttribute('data-price'));
            const image = button.getAttribute('data-image'); // Получаем изображение
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

// Функция для отображения товаров в корзине на странице cart.html
function displayCartItems() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    let total = 0;

    cartItemsElement.innerHTML = '';

    if (cart.length === 0) {
        document.querySelector('.cart-page').innerHTML = '<p class="empty-cart">Ваша корзина пуста.</p>';
    } else {
        cart.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${item.image}" alt="${item.name}"></td>
                <td class="product-name">${item.name}</td>
                <td>${item.price} руб.</td>
                <td>
                    <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity-input">
                </td>
                <td><span class="remove-item" data-index="${index}">&times;</span></td>
            `;
            cartItemsElement.appendChild(tr);
            total += item.price * item.quantity;
        });

        cartTotalElement.textContent = total;

        // Обработчики для изменения количества товаров
        const quantityInputs = document.querySelectorAll('.quantity-input');
        quantityInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const index = e.target.getAttribute('data-index');
                const newQuantity = parseInt(e.target.value);
                if (newQuantity > 0) {
                    cart[index].quantity = newQuantity;
                } else {
                    cart[index].quantity = 1;
                    e.target.value = 1;
                }
                saveCart();
                displayCartItems();
                updateCartCount();
            });
        });

        // Обработчики для удаления товаров из корзины
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cart.splice(index, 1);
                saveCart();
                displayCartItems();
                updateCartCount();
            });
        });
    }
}

// Функция для отправки заказа через EmailJS
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
        cart = [];
        saveCart();
        updateCartCount();
        window.location.href = 'index.html';
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
