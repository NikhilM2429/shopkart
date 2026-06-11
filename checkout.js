// ===================================
// CHECKOUT LOGIN GUARD (FIXED - checks token only)
// ===================================
(function() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userToken = localStorage.getItem('userToken');
  
  console.log('🔍 Checkout Login Guard Check:');
  console.log('  isLoggedIn:', isLoggedIn);
  console.log('  userToken:', userToken);

  // Check: isLoggedIn must be 'true' AND userToken must exist
  if (isLoggedIn !== 'true' || !userToken) {
    console.log('🚫 Checkout blocked: User not logged in');
    
    // Clear stale data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userToken');
    localStorage.removeItem('checkoutCart');
    
    alert('Please login to continue to checkout.');
    window.location.replace('login.html');
    throw new Error('Redirecting to login');
  }

  console.log('✅ Checkout allowed: User is logged in');
})();


let cart = [];


document.addEventListener("DOMContentLoaded", function () {
  console.log("=== CHECKOUT PAGE LOADED ===");


  cart = JSON.parse(localStorage.getItem("checkoutCart") || localStorage.getItem("cart") || "[]");


  console.log("Cart loaded:", cart);


  if (cart.length === 0) {
    showEmptyCart();
  } else {
    renderCheckout();
  }


  const placeOrderBtn = document.getElementById("placeOrderBtn");
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", placeOrder);
  }
});


function showEmptyCart() {
  const container = document.querySelector(".checkout-grid");
  if (!container) return;


  container.innerHTML = `
    <div class="empty-cart-msg" style="grid-column: 1/-1;">
      <i class="ti ti-shopping-cart-off"></i>
      <h2>Your cart is empty</h2>
      <p>Add products before checkout</p>
      <a href="index.html" class="continue-shopping">
        ← Continue Shopping
      </a>
    </div>
  `;
}


function renderCheckout() {
  const itemsEl = document.getElementById("checkoutItems");
  if (!itemsEl) return;


  itemsEl.innerHTML = cart.map((item, index) => `
    <div class="checkout-item">
      <div class="checkout-item-img">${item.emoji || "📦"}</div>
      <div class="checkout-item-info">
        <div class="checkout-item-name">${item.name || "Product"}</div>
        <div class="checkout-item-price">₹${(item.price || 0).toLocaleString()} × ${item.qty || 1}</div>
        <div class="checkout-item-qty">
          <button class="checkout-qty-btn" type="button" onclick="changeQty(${index}, -1)">
            <i class="ti ti-minus"></i>
          </button>
          <span class="checkout-qty-val">${item.qty || 1}</span>
          <button class="checkout-qty-btn" type="button" onclick="changeQty(${index}, 1)">
            <i class="ti ti-plus"></i>
          </button>
        </div>
      </div>
      <div style="font-weight: 600;">₹${((item.price || 0) * (item.qty || 1)).toLocaleString()}</div>
    </div>
  `).join("");


  updateTotals();
}


function updateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);
  const shipping = subtotal >= 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;


  const subtotalEl = document.getElementById("subtotal");
  const shippingEl = document.getElementById("shipping");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");


  if (subtotalEl) subtotalEl.textContent = "₹" + subtotal.toLocaleString();
  if (shippingEl) shippingEl.textContent = shipping === 0 ? "FREE" : "₹" + shipping.toLocaleString();
  if (taxEl) taxEl.textContent = "₹" + tax.toLocaleString();
  if (totalEl) totalEl.textContent = "₹" + total.toLocaleString();
}


function calculateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);
  const shipping = subtotal >= 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}


function changeQty(index, delta) {
  cart[index].qty = Math.max(1, (cart[index].qty || 1) + delta);
  saveCart();
  renderCheckout();
}


function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("checkoutCart", JSON.stringify(cart));
}


function showToast(msg) {
  const toast = document.querySelector(".toast");
  const toastMsg = document.getElementById("toastMsg");


  if (!toast || !toastMsg) {
    alert(msg);
    return;
  }


  toastMsg.textContent = msg;
  toast.style.display = "block";


  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

{

  function placeOrder() {

const name = document.getElementById("name")?.value.trim() || "";
const email = document.getElementById("email")?.value.trim() || "";
const phone = document.getElementById("phone")?.value.trim() || "";
const address = document.getElementById("address")?.value.trim() || "";
const city = document.getElementById("city")?.value.trim() || "";
const pincode = document.getElementById("pincode")?.value.trim() || "";

console.log({
name,
email,
phone,
address,
city,
pincode
});

if (!name || !email || !phone || !address || !city || !pincode) {
showToast("Please fill all fields");
return;
}

if (!cart || cart.length === 0) {
showToast("Cart is empty");
return;
}

const customer = {
name,
email,
phone,
address,
city,
pincode
};

const totals = calculateTotals();

const orderId = "ORD" + Date.now();

const checkoutData = {
orderId,
customer,
cart,
totals,
createdAt: new Date().toISOString()
};

console.log("Saving checkoutData:", checkoutData);

try {

localStorage.setItem(
  "latestOrderId",
  orderId
);

localStorage.setItem(
  "checkoutData",
  JSON.stringify(checkoutData)
);

console.log(
  "Saved checkoutData:",
  localStorage.getItem("checkoutData")
);

showToast("Order placed successfully!");

setTimeout(() => {
  window.location.href = "payment.html";
}, 1000);
```

} catch (error) {

```
console.error(
  "localStorage save failed:",
  error
);

showToast(
  "Could not save checkout details"
);

  setTimeout(() => {
      window.location.href = "payment.html";
    }, 1200);
  } 
  catch (error) {
    console.error("localStorage save failed:", error);
    showToast("Could not save checkout details");
  }
}
}