document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const loginData = {
        username: username,
        password: password
    };

    try {
        const response = await fetch('http://localhost:8081/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Сохраняем JWT-токен
            localStorage.setItem('username', username); // Сохраняем имя пользователя

            // Если введены admin/admin, перенаправляем в админку
            if (username === 'admin' && password === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html'; // Перенаправление на главную страницу
            }
        } else {
            alert('Неверное имя пользователя или пароль');
        }
    } catch (error) {
        console.error('Ошибка при входе:', error);
        alert('Произошла ошибка при входе.');
    }
});
