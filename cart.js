/* ===================================
   ADD TO CART FUNCTION
====================================== */

// Add to cart function
function addToCart(product) {
    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex > -1) {
        // Increase quantity
        cart[existingIndex].quantity += 1;
    } else {
        // Add new product
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart display
    updateCartDisplay();
    
    // Show toast
    showToast('Added to cart!', 'success');
}

// Update cart display
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Update cart count
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
    
    // Update cart panel
    renderCartItems();
}

// Render cart items in panel
function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItemsEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    
    if (!cartItemsEl) return;
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="cart-empty">
                <i class="ti ti-shopping-cart-off"></i>
                <div class="cart-empty-title">Your cart is empty</div>
                <div class="cart-empty-text">Add products to get started</div>
                <a href="index.html" class="cart-empty-btn" onclick="closeCart()">
                    Continue Shopping
                </a>
            </div>
        `;
        if (cartTotalEl) cartTotalEl.textContent = '₹0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                    <div class="cart-item-actions">
                        <div class="cart-quantity">
                            <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <input type="text" value="${item.quantity}" readonly>
                            <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                            <i class="ti ti-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItemsEl.innerHTML = html;
    
    if (cartTotalEl) {
        cartTotalEl.textContent = '₹' + total.toLocaleString();
    }
}

// Update quantity
function updateQuantity(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (quantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartDisplay();
    }
}

// Remove from cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartDisplay();
    showToast('Removed from cart', 'success');
}

// Close cart
function closeCart() {
    const overlay = document.getElementById('cartOverlay');
    const panel = document.getElementById('cartPanel');
    
    if (overlay) overlay.classList.remove('show');
    if (panel) panel.classList.remove('show');
    document.body.style.overflow = '';
}

// Open cart
function openCart() {
    const overlay = document.getElementById('cartOverlay');
    const panel = document.getElementById('cartPanel');
    
    if (overlay) overlay.classList.add('show');
    if (panel) panel.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Show toast
function showToast(message, type = 'success') {
    let toast = document.getElementById('toast');
    
    if (!toast) {
        // Create toast if not exists
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    
    setTimeout(function() {
        toast.className = 'toast';
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    
    // Cart icon click
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
});

// Make functions global
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.showToast = showToast;