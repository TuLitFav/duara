// Global variables
let cart = [];
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users') || '[]');
let currentPerfume = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkUserSession();
    updateCartDisplay();
});

// Authentication functions
function showLoginModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
    document.getElementById('auth-modal').classList.add('flex');
    showLoginForm();
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
    document.getElementById('auth-modal').classList.remove('flex');
}

function showLoginForm() {
    document.getElementById('auth-title').textContent = 'Iniciar Sesión';
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

function showRegisterForm() {
    document.getElementById('auth-title').textContent = 'Crear Cuenta';
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Por favor completa todos los campos');
        return;
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUserDisplay();
        closeAuthModal();
        alert(`¡Bienvenido de vuelta, ${user.name}! 👋`);
    } else {
        alert('Email o contraseña incorrectos');
    }
}

function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const birthdate = document.getElementById('register-birthdate').value;

    if (!name || !email || !password) {
        alert('Por favor completa los campos obligatorios (nombre, email y contraseña)');
        return;
    }

    if (users.find(u => u.email === email)) {
        alert('Ya existe una cuenta con este email');
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        birthdate: birthdate || null,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    updateUserDisplay();
    closeAuthModal();
    alert(`¡Cuenta creada exitosamente! Bienvenido, ${name}! 🎉`);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserDisplay();
    cart = [];
    updateCartDisplay();
    alert('¡Hasta pronto! 👋');
}

function checkUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserDisplay();
    }
}

function updateUserDisplay() {
    const userSection = document.getElementById('user-section');
    const authSection = document.getElementById('auth-section');
    const userName = document.getElementById('user-name');

    if (currentUser) {
        userName.textContent = `Hola, ${currentUser.name}`;
        userSection.classList.remove('hidden');
        authSection.classList.add('hidden');
    } else {
        userSection.classList.add('hidden');
        authSection.classList.remove('hidden');
    }
}

// Cart functions
function addToCart(name, price, icon) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            icon,
            quantity: 1
        });
    }

    updateCartDisplay();
    showCartNotification(name);
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartDisplay();
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.classList.remove('hidden');
        cartCount.classList.add('cart-badge');
    } else {
        cartCount.classList.add('hidden');
    }
}

function showCartNotification(productName) {
    alert(`¡${productName} agregado al carrito! 🛒`);
}

function showCart() {
    const modal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItems.classList.add('hidden');
        cartSummary.classList.add('hidden');
        cartEmpty.classList.remove('hidden');
    } else {
        cartEmpty.classList.add('hidden');
        cartItems.classList.remove('hidden');
        cartSummary.classList.remove('hidden');

        cartItems.innerHTML = cart.map(item => `
            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div class="flex items-center space-x-4">
                    <div class="text-2xl">${item.icon}</div>
                    <div>
                        <h4 class="font-semibold text-gray-800">${item.name}</h4>
                        <p class="text-purple-600 font-bold">$${item.price}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <button onclick="updateQuantity('${item.name}', -1)" class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">-</button>
                    <span class="font-semibold">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)" class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">+</button>
                    <button onclick="removeFromCart('${item.name}')" class="text-red-500 hover:text-red-700 ml-2">🗑️</button>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeCart() {
    document.getElementById('cart-modal').classList.add('hidden');
    document.getElementById('cart-modal').classList.remove('flex');
}

function proceedToCheckout() {
    if (!currentUser) {
        alert('Por favor inicia sesión para continuar con la compra');
        closeCart();
        showLoginModal();
        return;
    }

    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    closeCart();
    showCheckout();
}

function showCheckout() {
    const modal = document.getElementById('checkout-modal');
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutTotal = document.getElementById('checkout-total');

    if (currentUser) {
        document.getElementById('shipping-name').value = currentUser.name;
    }

    checkoutItems.innerHTML = cart.map(item => `
        <div class="flex justify-between items-center">
            <span>${item.icon} ${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0;
    const total = subtotal + shipping;

    checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    checkoutTotal.textContent = `$${total.toFixed(2)}`;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.add('hidden');
    document.getElementById('checkout-modal').classList.remove('flex');
}

function completeOrder() {
    const shippingName = document.getElementById('shipping-name').value;
    const shippingAddress =
