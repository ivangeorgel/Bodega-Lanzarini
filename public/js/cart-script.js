document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart'));

    if (cart) {
        Object.keys(cart).forEach(wineId => {
            const quantity = cart[wineId];
            const wineInfo = getWineInfoById(wineId);
            const wineElement = createCartItemElement(wineInfo, quantity);
            cartItemsContainer.appendChild(wineElement);
        });
    } else {
        cartItemsContainer.textContent = "No hay vinos en el carrito.";
    }



    function getWineInfoById(id) {
        const wines = {
            '1': { name: 'Magneta', price: 7000, description: 'Vino tinto Malbec.' },
            '2': { name: 'Montecepas', price: 6800, description: 'Vino blanco Cabernet Sauvignon.' },
            '3': { name: 'Sediento', price: 8000, description: 'Vino tindo Malbec Bonarda.' },
        };
    
        return wines[id];
    }
    

    function createCartItemElement(wineInfo, quantity) {
        const wineElement = document.createElement('div');
        wineElement.classList.add('cart-item');
        wineElement.innerHTML = `
            <h3>${wineInfo.name}</h3>
            <p>Precio: $${wineInfo.price}</p>
            <p>Cantidad: ${quantity}</p>
            <p>Descripción: ${wineInfo.description}</p>
        `;
        return wineElement;
    }
});



document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const resetCartButton = document.getElementById('reset-cart'); 

    resetCartButton.addEventListener('click', function() {
        localStorage.removeItem('cart'); 
        cartItemsContainer.innerHTML = "No hay vinos en el carrito."; 
    });

    const cart = JSON.parse(localStorage.getItem('cart'));

    if (cart) {
        Object.keys(cart).forEach(wineId => {
            const quantity = cart[wineId];
            const wineInfo = getWineInfoById(wineId);
            const wineElement = createCartItemElement(wineInfo, quantity);
            cartItemsContainer.appendChild(wineElement);
        });
    } else {
        cartItemsContainer.textContent = "No hay vinos en el carrito.";
    }

    function getWineInfoById(id) {
        
    }

    function createCartItemElement(wineInfo, quantity) {
        
    }
});





