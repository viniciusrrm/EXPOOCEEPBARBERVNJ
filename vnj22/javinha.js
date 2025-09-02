let currentUser = null;
let cart = [];

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    document.getElementById(`${pageId}-page`).classList.add('active');
    
    if (pageId === 'cart') {
        updateCartDisplay();
    }
    
    window.scrollTo(0, 0);
}

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            quantity: 1
        });
    }
    
    updateCartCount();
    
    alert(`${name} adicionado ao agendamento!`);
    
    showPage('cart');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
    updateCartCount();
}

function changeQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartDisplay();
            updateCartCount();
        }
    }
}

function updateCartDisplay() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    cartItemsElement.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p class="empty-cart-message">Você não possui serviços agendados.</p>';
        cartTotalElement.textContent = '0,00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-price">R$ ${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="setQuantity(${item.id}, this.value)">
                <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remover</button>
            </div>
        `;
        
        cartItemsElement.appendChild(cartItemElement);
    });
    
    cartTotalElement.textContent = total.toFixed(2);
}

function setQuantity(id, quantity) {
    const qty = parseInt(quantity);
    
    if (isNaN(qty) || qty < 1) {
        return;
    }
    
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity = qty;
        updateCartDisplay();
        updateCartCount();
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const servicesList = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
    
    alert(`Agendamento confirmado com sucesso!\nServiços: ${servicesList}\nTotal: R$ ${total.toFixed(2)}`);
    
    cart = [];
    updateCartDisplay();
    updateCartCount();
    
    showPage('home');
}

function selectTimeSlot(element) {
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    element.classList.add('selected');
}

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    currentUser = { email };
    alert('Login realizado com sucesso!');
    showPage('home');
});

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
    }
    
    currentUser = { name, email, phone };
    alert('Cadastro realizado com sucesso!');
    showPage('login');
});

document.getElementById('scheduling-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('scheduling-name').value;
    const email = document.getElementById('scheduling-email').value;
    const phone = document.getElementById('scheduling-phone').value;
    const date = document.getElementById('scheduling-date').value;
    const service = document.getElementById('scheduling-service').value;
    const selectedTime = document.querySelector('.time-slot.selected');
    
    if (!service) {
        alert('Por favor, selecione um serviço!');
        return;
    }
    
    if (!selectedTime) {
        alert('Por favor, selecione um horário!');
        return;
    }
    
    const time = selectedTime.textContent;
    const serviceText = document.getElementById('scheduling-service').options[document.getElementById('scheduling-service').selectedIndex].text;
    
    alert(`Agendamento realizado com sucesso!\nData: ${date}\nHorário: ${time}\nServiço: ${serviceText}`);
    this.reset();
    
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    showPage('home');
});

document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('scheduling-date').setAttribute('min', today);
});