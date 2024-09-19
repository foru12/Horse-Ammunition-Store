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
        category: productCategory,
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
        } else {
            alert('Ошибка при добавлении товара');
        }
    } catch (error) {
        console.error('Ошибка при добавлении товара:', error);
    }
});
