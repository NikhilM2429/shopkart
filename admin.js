// Admin Product Management System
// Only logged-in admins can access this page and add products

// Check admin authentication on page load
document.addEventListener('DOMContentLoaded', function() {
  checkAdminAuth();
  loadProductsList();
  
  // Setup form submission
  const addProductForm = document.getElementById('addProductForm');
  if (addProductForm) {
    addProductForm.addEventListener('submit', handleAddProduct);
  }
  
  // Setup logout button
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', handleAdminLogout);
  }
});

// Check if user is authenticated as admin
function checkAdminAuth() {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  
  if (!user || !user.isAdmin) {
    // Not admin - show error and redirect to login
    showToast('Access denied! Please login as admin.', 'error');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
    return false;
  }
  
  return true;
}

// Handle admin logout
function handleAdminLogout() {
  localStorage.removeItem('currentUser');
  showToast('Logged out successfully', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

// Handle add product form submission
function handleAddProduct(e) {
  e.preventDefault();
  
  if (!checkAdminAuth()) return;
  
  // Get form values
  const product = {
    id: generateProductId(),
    name: document.getElementById('productName').value,
    category: document.getElementById('productCategory').value,
    price: parseFloat(document.getElementById('productPrice').value),
    originalPrice: parseFloat(document.getElementById('productOriginalPrice').value),
    image: document.getElementById('productImage').value,
    description: document.getElementById('productDescription').value,
    rating: parseFloat(document.getElementById('productRating').value),
    stock: parseInt(document.getElementById('productStock').value),
    addedBy: JSON.parse(localStorage.getItem('currentUser')).name,
    addedAt: new Date().toISOString()
  };
  
  // Get existing products or create empty array
  const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
  
  // Add new product
  products.push(product);
  
  // Save to localStorage
  localStorage.setItem('adminProducts', JSON.stringify(products));
  
  // Show success message
  showToast('Product added successfully! It will appear on the homepage.', 'success');
  
  // Reset form
  document.getElementById('addProductForm').reset();
  
  // Reload products list
  loadProductsList();
  
  // Update homepage products automatically
  updateHomepageProducts();
}

// Generate unique product ID
function generateProductId() {
  return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Load and display products list
function loadProductsList() {
  const productsList = document.getElementById('productsAddedList');
  if (!productsList) return;
  
  const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
  
  if (products.length === 0) {
    productsList.innerHTML = '<div class="no-products">📦 No products added yet. Add your first product above!</div>';
    return;
  }
  
  productsList.innerHTML = products.map(product => `
    <div class="product-item" data-id="${product.id}">
      <div class="product-item-info">
        <div class="product-item-img">${product.image}</div>
        <div class="product-item-details">
          <h4>${product.name}</h4>
          <p>₹${product.price} | ${product.category} | ⭐${product.rating} | Stock: ${product.stock}</p>
        </div>
      </div>
      <div class="product-item-actions">
        <button class="btn-delete" onclick="deleteProduct('${product.id}')">
          <i class="ti ti-trash"></i> Delete
        </button>
      </div>
    </div>
  `).join('');
}

// Delete product
function deleteProduct(productId) {
  if (!checkAdminAuth()) return;
  
  const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
  const filteredProducts = products.filter(p => p.id !== productId);
  
  localStorage.setItem('adminProducts', JSON.stringify(filteredProducts));
  showToast('Product deleted successfully', 'success');
  loadProductsList();
  updateHomepageProducts();
}

// Update homepage to show admin-added products
function updateHomepageProducts() {
  const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
  
  // Save to localStorage so homepage can read it
  localStorage.setItem('homepageProducts', JSON.stringify(products));
  
  console.log('✅ Products updated on homepage:', products.length);
}

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  toast.style.background = type === 'error' ? '#ef4444' : '#10b981';
  toast.innerHTML = `
    <i class="ti ti-${type === 'error' ? 'x' : 'check'}"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}