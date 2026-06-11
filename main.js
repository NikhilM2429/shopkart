const PRODUCTS = [
  {id:1,  name:'iPhone 17 Pro Max 256GB',      cat:'electronics', price:89999,  orig:164900, rating:4.8, reviews:2341,  emoji:'📱', disc:45},
  {id:2,  name:'Samsung Galaxy S24 Ultra',      cat:'electronics', price:79999,  orig:134999, rating:4.7, reviews:1876,  emoji:'📲', disc:41},
  {id:3,  name:'Sony WH-1000XM5 Headphones',   cat:'electronics', price:24990,  orig:34990,  rating:4.9, reviews:987,   emoji:'🎧', disc:29},
  {id:4,  name:'MacBook Air M3 13"',            cat:'electronics', price:114900, orig:149900, rating:4.8, reviews:654,   emoji:'💻', disc:23},
  {id:5,  name:'Nike Air Max 270 Shoes',        cat:'fashion',     price:4499,   orig:8995,   rating:4.6, reviews:3201,  emoji:'👟', disc:50},
  {id:6,  name:"Levi's 501 Original Jeans",     cat:'fashion',     price:2999,   orig:5999,   rating:4.5, reviews:1543,  emoji:'👖', disc:50},
  {id:7,  name:'Silk Saree Banarasi',           cat:'fashion',     price:3499,   orig:7499,   rating:4.7, reviews:892,   emoji:'🥻', disc:53},
  {id:8,  name:'Tommy Hilfiger Polo Shirt',     cat:'fashion',     price:1999,   orig:3999,   rating:4.4, reviews:765,   emoji:'👕', disc:50},
  {id:9,  name:'Bosch Mixer Grinder 750W',     cat:'home',        price:4299,   orig:6499,   rating:4.6, reviews:2109,  emoji:'🥣', disc:34},
  {id:10, name:'Philips Air Fryer XXL',         cat:'home',        price:8499,   orig:12999,  rating:4.7, reviews:1432,  emoji:'🍳', disc:35},
  {id:11, name:'Dyson V15 Detect Vacuum',       cat:'home',        price:44990,  orig:59900,  rating:4.8, reviews:543,   emoji:'🧹', disc:25},
  {id:12, name:'Himalaya Neem Face Wash',       cat:'beauty',      price:149,    orig:249,    rating:4.5, reviews:8765,  emoji:'🧴', disc:40},
  {id:13, name:'Lakme 9to5 Foundation',         cat:'beauty',      price:399,    orig:649,    rating:4.4, reviews:3421,  emoji:'💄', disc:39},
  {id:14, name:'Yoga Mat Anti-Slip Premium',    cat:'sports',      price:799,    orig:1499,   rating:4.6, reviews:2134,  emoji:'🧘', disc:47},
  {id:15, name:'Decathlon Running Shoes',       cat:'sports',      price:1999,   orig:3499,   rating:4.5, reviews:1876,  emoji:'🏃', disc:43},
  {id:16, name:'Atomic Habits by James Clear',  cat:'books',       price:299,    orig:499,    rating:4.9, reviews:12432, emoji:'📚', disc:40},
  {id:17, name:'LEGO Technic Car Set',          cat:'toys',        price:3499,   orig:5999,   rating:4.8, reviews:876,   emoji:'🏎️', disc:42},
  {id:18, name:'Tata Salt 1kg Pack of 5',       cat:'grocery',     price:99,     orig:125,    rating:4.7, reviews:5432,  emoji:'🧂', disc:21},
];


const DEALS = [
  {id: 'd1', name:'Sony WH-1000XM5 Headphones', price:24990, orig:34990, disc:29, emoji:'🎧'},
  {id: 'd2', name:'Nike Air Max 270', price:4499, orig:8995, disc:50, emoji:'👟'},
  {id: 'd3', name:'Dyson V15 Vacuum', price:44990, orig:59900, disc:25, emoji:'🧹'},
  {id: 'd4', name:'iPad Pro 12.9"', price:79990, orig:102900, disc:22, emoji:'📱'},
];


// ===================================
// STATE
// ===================================
let cart = [];
let visibleCount = 8;
let activeCategory = 'all';
let activeSort = 'default';
let toastTimeout;


// ===================================
// INIT
// ===================================
document.addEventListener('DOMContentLoaded', function() {
  renderProducts();
  renderDeals();
  bindEvents();
  startCountdown();
  loadCart();
  updateNavbarLogin(); // ✅ Update navbar on login
});


// ===================================
// EVENTS
// ===================================
function bindEvents() {
  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('cartCloseBtn').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);
  document.getElementById('checkoutBtn').addEventListener('click', goToCheckout);
  
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', function() {
      filterCategory(this.dataset.category);
    });
  });
  
  document.getElementById('sortFilter').addEventListener('change', function() {
    activeSort = this.value;
    renderProducts();
  });
  
  document.getElementById('loadMoreBtn').addEventListener('click', function() {
    visibleCount += 4;
    renderProducts();
  });
  
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      filterCategory(this.dataset.category);
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  document.getElementById('heroAddBtn').addEventListener('click', addToCartFromHero);
  document.getElementById('subscribeBtn').addEventListener('click', subscribe);
}


// ===================================
// PRODUCTS
// ===================================
function getFilteredProducts() {
  let prods = activeCategory === 'all'
    ? [...PRODUCTS]
    : PRODUCTS.filter(p => p.cat === activeCategory);

  if (activeSort === 'price-low')  prods.sort((a,b) => a.price - b.price);
  else if (activeSort === 'price-high') prods.sort((a,b) => b.price - a.price);
  else if (activeSort === 'rating')     prods.sort((a,b) => b.rating - a.rating);
  else if (activeSort === 'name')       prods.sort((a,b) => a.name.localeCompare(b.name));
  
  return prods;
}


function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  
  const prods = getFilteredProducts().slice(0, visibleCount);

  if (!prods.length) {
    grid.innerHTML = '<div class="no-products"><i class="ti ti-mood-sad"></i><p>No products found</p></div>';
  } else {
    grid.innerHTML = prods.map(p => `
      <div class="prod-card">
        <div class="prod-img">
          <span class="prod-emoji">${p.emoji}</span>
          <div class="prod-discount">-${p.disc}%</div>
          <button class="prod-wish" onclick="toggleWish(this)" aria-label="Wishlist">
            <i class="ti ti-heart"></i>
          </button>
        </div>
        <div class="prod-body">
          <div class="prod-cat">${p.cat}</div>
          <div class="prod-name">${p.name}</div>
          <div class="prod-rating">
            <div class="stars">
              ${'<i class="ti ti-star-filled"></i>'.repeat(Math.floor(p.rating))}
              ${p.rating % 1 >= 0.5 ? '<i class="ti ti-star-half-filled"></i>' : ''}
            </div>
            <span class="rating-count">${p.rating} (${p.reviews.toLocaleString()})</span>
          </div>
          <div class="prod-price-row">
            <div class="prod-prices">
              <span class="prod-price">₹${p.price.toLocaleString()}</span>
              <span class="prod-orig">₹${p.orig.toLocaleString()}</span>
            </div>
            <button class="prod-add" onclick="addToCart(${p.id}, this)" aria-label="Add to cart">
              <i class="ti ti-plus"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  const loadBtn = document.getElementById('loadMoreBtn');
  if (loadBtn) {
    loadBtn.style.display = getFilteredProducts().length > visibleCount ? 'inline-flex' : 'none';
  }
}


function filterCategory(cat) {
  activeCategory = cat;
  visibleCount = 8;
  
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.chip').forEach(chip => {
    if (chip.dataset.category === cat) chip.classList.add('active');
  });
  
  renderProducts();
}


// ===================================
// DEALS
// ===================================
function renderDeals() {
  const grid = document.getElementById('dealsGrid');
  if (!grid) return;
  
  grid.innerHTML = DEALS.map(deal => `
    <div class="deal-card" onclick="addDealToCart('${deal.id}')">
      <div class="deal-emoji">${deal.emoji}</div>
      <div class="deal-name">${deal.name}</div>
      <div class="deal-price-row">
        <span class="deal-price">₹${deal.price.toLocaleString()}</span>
        <span class="deal-orig">₹${deal.orig.toLocaleString()}</span>
        <span class="deal-badge">-${deal.disc}%</span>
      </div>
    </div>
  `).join('');
}


function addDealToCart(dealId) {
  const deal = DEALS.find(d => d.id === dealId);
  if (!deal) return;
  
  const existing = cart.find(c => c.name === deal.name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...deal, qty: 1 });
  }
  
  saveCart();
  updateCartUI();
  showToast(deal.name + ' added to cart!');
}


// ===================================
// CART
// ===================================
function loadCart() {
  const saved = localStorage.getItem('cart');
  if (saved) {
    cart = JSON.parse(saved);
    updateCartUI();
  }
}


function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}


function addToCart(id, btn) {
  const prod = PRODUCTS.find(p => p.id === id);
  if (!prod) return;
  
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...prod, qty: 1 });
  }
  
  saveCart();
  
  if (btn) {
    btn.innerHTML = '<i class="ti ti-check"></i>';
    btn.classList.add('added');
    setTimeout(() => {
      btn.innerHTML = '<i class="ti ti-plus"></i>';
      btn.classList.remove('added');
    }, 1500);
  }

  updateCartUI();
  showToast(prod.name.slice(0, 30) + '… added to cart!');
}


function addToCartFromHero() {
  const prod = PRODUCTS[0];
  const existing = cart.find(c => c.id === prod.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...prod, qty: 1 });
  }
  
  saveCart();
  updateCartUI();
  showToast('iPhone 17 Pro Max added to cart!');
}


function changeQty(idx, delta) {
  if (!cart[idx]) return;
  cart[idx].qty = Math.max(1, cart[idx].qty + delta);
  saveCart();
  updateCartUI();
}


function removeItem(idx) {
  cart.splice(idx, 1);
  saveCart();
  updateCartUI();
}    


function updateCartUI() {
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const count = cart.reduce((s, c) => s + c.qty, 0);
  
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');
  const itemsEl = document.getElementById('cartItems');

  if (countEl) countEl.textContent = count;
  if (totalEl) totalEl.textContent = '₹' + total.toLocaleString();

  if (!itemsEl) return;

  if (!cart.length) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <i class="ti ti-shopping-cart-off"></i>
        <div class="cart-empty-title">Your cart is empty</div>
        <div class="cart-empty-text">Add products to get started</div>
        <a href="#products" class="cart-empty-btn">Continue Shopping</a>
      </div>`;
    return;
  }

  itemsEl.innerHTML = cart.map((c, i) => `
    <div class="cart-item">
      <div class="cart-item-img">${c.emoji || '📦'}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${c.name}</div>
        <div class="cart-item-price">₹${(c.price * c.qty).toLocaleString()}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${i}, -1)"><i class="ti ti-minus"></i></button>
          <span class="qty-val">${c.qty}</span>
          <button class="qty-btn" onclick="changeQty(${i}, 1)"><i class="ti ti-plus"></i></button>
        </div>
      </div>
      <button class="cart-remove" onclick="removeItem(${i})"><i class="ti ti-trash"></i></button>
    </div>
  `).join('');
}


function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartPanel').classList.add('open');
  document.body.style.overflow = 'hidden';
}


function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartPanel').classList.remove('open');
  document.body.style.overflow = '';
}


function goToCheckout() {
  if (!cart.length) {
    showToast('Your cart is empty! Add products first.');
    return;
  }

  // ✅ Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userToken = localStorage.getItem('userToken');

  if (!isLoggedIn || !userToken) {
    // User NOT logged in → redirect to login page
    showToast('Please login to continue to checkout.');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 300);
    return;
  }

  // User IS logged in → proceed to checkout
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('checkoutCart', JSON.stringify(cart));

  closeCart();

  setTimeout(() => {
    window.location.href = 'checkout.html';
  }, 300);
}


// ===================================
// TOAST
// ===================================
function showToast(msg) {
  const t = document.getElementById('toast');
  const span = document.getElementById('toastMsg');
  if (!t || !span) return;
  
  span.textContent = msg;
  t.classList.add('show');
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => t.classList.remove('show'), 3000);
}


// ===================================
// NEWSLETTER
// ===================================
function subscribe() {
  const v = document.getElementById('emailInput').value.trim();
  if (!v || !v.includes('@')) {
    showToast('Please enter a valid email.');
    return;
  }
  showToast('Subscribed! Check your inbox for 10% off 🎉');
  document.getElementById('emailInput').value = '';
}


// ===================================
// COUNTDOWN
// ===================================
function startCountdown() {
  let secs = 8 * 3600 + 34 * 60 + 22;
  
  setInterval(() => {
    secs--;
    if (secs < 0) secs = 86400;
    
    const hEl = document.getElementById('countHrs');
    const mEl = document.getElementById('countMins');
    const sEl = document.getElementById('countSecs');
    
    if (hEl) hEl.textContent = String(Math.floor(secs / 3600)).padStart(2, '0');
    if (mEl) mEl.textContent = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    if (sEl) sEl.textContent = String(secs % 60).padStart(2, '0');
  }, 1000);
}


// ===================================
// UTILITY
// ===================================
function toggleWish(btn) {
  btn.classList.toggle('active');
}

/* =============================================
   MOBILE MENU — toggle nav actions drawer
============================================= */
document.addEventListener('DOMContentLoaded', function () {
  const toggle    = document.getElementById('mobileMenuToggle');
  const navActions = document.getElementById('navActions');
  if (!toggle || !navActions) return;

  function openMenu() {
    navActions.classList.add('active');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    const icon = toggle.querySelector('i');
    icon.classList.replace('ti-menu-2', 'ti-x');
  }

  function closeMenu() {
    navActions.classList.remove('active');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    const icon = toggle.querySelector('i');
    icon.classList.replace('ti-x', 'ti-menu-2');
  }

  toggle.addEventListener('click', function () {
    navActions.classList.contains('active') ? closeMenu() : openMenu();
  });

  // Close when a nav button is tapped on mobile
  navActions.querySelectorAll('.nav-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (window.innerWidth <= 767) closeMenu();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navActions.classList.contains('active')) closeMenu();
  });

  // Close on resize past mobile breakpoint
  window.addEventListener('resize', function () {
    if (window.innerWidth > 767) closeMenu();
  });

  // Close when clicking outside the nav
  document.addEventListener('click', function (e) {
    if (
      navActions.classList.contains('active') &&
      !navActions.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      closeMenu();
    }
  });
});

// Update navbar based on login status + bind logout
document.addEventListener('DOMContentLoaded', function() {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  
  // Check if logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (isLoggedIn) {
    // Show logout button, hide login button
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) {
      logoutBtn.style.display = 'inline-flex';
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userName = user.name || user.email || 'User';
      logoutBtn.innerHTML = `<i class="ti ti-logout"></i><span class="nav-text">Logout, ${userName}</span>`;
    }
    
    console.log('✅ Logged in - showing logout button');
  } else {
    // Show login button, hide logout button
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (logoutBtn) logoutBtn.style.display = 'none';
    
    console.log('👤 Not logged in - showing login button');
  }
  
  // Bind logout button click
  if (logoutBtn) {
    logoutBtn.onclick = function() {
      console.log('🔴 Logout button clicked');
      
      if (confirm('Are you sure you want to logout?')) {
        logout();
      }
    };
  }
});

// Update navbar based on login status + bind logout
document.addEventListener('DOMContentLoaded', function() {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  
  // Check if logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  console.log('🔍 Navbar check:');
  console.log('  isLoggedIn:', isLoggedIn);
  console.log('  loginBtn:', loginBtn);
  console.log('  logoutBtn:', logoutBtn);
  
  if (isLoggedIn) {
    // Logged in: Show logout button, hide login button
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) {
      logoutBtn.style.display = 'inline-flex';
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userName = user.name || user.email || 'User';
      logoutBtn.innerHTML = `<i class="ti ti-logout"></i><span class="nav-text">Logout, ${userName}</span>`;
      
      console.log('✅ Logged in - showing: Logout, ' + userName);
    }
  } else {
    // Not logged in: Show login button, hide logout button
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (logoutBtn) logoutBtn.style.display = 'none';
    
    console.log('👤 Not logged in - showing: Login');
  }
  
  // Bind logout button click
  if (logoutBtn) {
    logoutBtn.onclick = function() {
      console.log('🔴 Logout button clicked');
      
      if (confirm('Are you sure you want to logout?')) {
        // Call logout function
        if (typeof logout === 'function') {
          logout();
          
          // After logout, show login button again
          setTimeout(function() {
            if (loginBtn) loginBtn.style.display = 'inline-flex';
            if (logoutBtn) logoutBtn.style.display = 'none';
            console.log('✅ After logout - showing: Login');
          }, 100);
        }
      }
    };
  }
});
// ============================================
// ADMIN FEATURE - Show admin button & load products
// ============================================

// Check if current user is admin and show admin button
function checkAdminAndShowButton() {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const adminBtn = document.getElementById('adminBtn');
  
  if (user && user.isAdmin) {
    // Admin is logged in - show admin button
    if (adminBtn) adminBtn.style.display = 'flex';
  } else {
    // Not admin - hide admin button
    if (adminBtn) adminBtn.style.display = 'none';
  }
}

// Load admin-added products and display on homepage
function loadAdminProducts() {
  const adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
  const productsGrid = document.getElementById('productsGrid');
  
  if (!productsGrid) return;
  
  if (adminProducts.length === 0) {
    // No admin products, keep existing products
    return;
  }
  
  // Add admin products to existing products
  const allProducts = [...window.products, ...adminProducts];
  
  // Render all products
  productsGrid.innerHTML = allProducts.map(product => createProductCard(product)).join('');
  
  // Re-attach event listeners for add to cart buttons
  attachAddToCartEvents();
}

// Create product card HTML
function createProductCard(product) {
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  
  return `
    <div class="prod-card" data-category="${product.category}" data-id="${product.id}">
      <div class="prod-img-wrap">
        <div class="prod-img">${product.image}</div>
        <div class="prod-badge">-${discount}%</div>
        <button class="prod-quick-btn" data-id="${product.id}" aria-label="Quick view">
          <i class="ti ti-eye"></i>
        </button>
      </div>
      <div class="prod-info">
        <div class="prod-cat">${product.category}</div>
        <h3 class="prod-name">${product.name}</h3>
        <p class="prod-desc">${product.description}</p>
        <div class="prod-rating">
          <i class="ti ti-star filled"></i>
          <span>${product.rating}</span>
          <span class="prod-reviews">(${Math.floor(product.stock * 0.1)})</span>
        </div>
        <div class="prod-prices">
          <span class="prod-price">₹${product.price}</span>
          <span class="prod-old-price">₹${product.originalPrice}</span>
        </div>
        <button class="prod-add-btn" data-id="${product.id}" aria-label="Add to cart">
          <i class="ti ti-plus"></i> Add to Cart
        </button>
      </div>
    </div>
  `;
}

// Re-attach add to cart event listeners
function attachAddToCartEvents() {
  const addBtns = document.querySelectorAll('.prod-add-btn');
  addBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = this.dataset.id;
      addToCart(productId);
    });
  });
}

// Initialize admin features on page load
function initAdminFeatures() {
  checkAdminAndShowButton();
  loadAdminProducts();
}

// Call when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminFeatures);
} else {
  initAdminFeatures();
}