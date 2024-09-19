document.getElementById('registrationForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userData = {
        username: username,
        email: email,
        password: password
    };

    try {
        const response = await fetch('http://localhost:8081/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            alert('Регистрация прошла успешно');
            localStorage.setItem('username', username);
            window.location.href = 'index.html'; // Перенаправление на главную страницу
        } else {
            const errorMessage = await response.text();
            alert('Ошибка: ' + errorMessage);
        }
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        alert('Произошла ошибка при регистрации.');
    }
});
