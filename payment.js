let cart = [];
let customer = {};
let totals = {};
let paymentMethod = '';

function loadCheckoutData() {
  const checkoutData = JSON.parse(localStorage.getItem('checkoutData') || '{}');

  customer = checkoutData.customer || JSON.parse(localStorage.getItem('checkoutCustomer') || '{}');
  cart = checkoutData.cart || JSON.parse(localStorage.getItem('checkoutCart') || localStorage.getItem('cart') || '[]');
  totals = checkoutData.totals || {};
  paymentMethod = localStorage.getItem('selectedPaymentMethod') || '';
}

document.addEventListener('DOMContentLoaded', function () {
  loadCheckoutData();
  renderSummary();
  renderDeliveryInfo();
  restorePaymentMethod();

  const confirmBtn = document.getElementById('confirmPaymentBtn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', confirmPayment);
  }
});

function renderSummary() {
  let subtotal = totals.subtotal;
  let shipping = totals.shipping;
  let tax = totals.tax;
  let total = totals.total;

  if (subtotal == null || shipping == null || tax == null || total == null) {
    subtotal = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);
    shipping = subtotal > 500 ? 0 : 50;
    tax = Math.round(subtotal * 0.18);
    total = subtotal + shipping + tax;
  }

  const subtotalEl = document.getElementById('subtotalPrice');
  const shippingEl = document.getElementById('shippingPrice');
  const taxEl = document.getElementById('taxPrice');
  const totalEl = document.getElementById('totalPrice');

  if (subtotalEl) subtotalEl.textContent = '₹' + subtotal.toLocaleString();
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : '₹' + shipping;
  if (taxEl) taxEl.textContent = '₹' + tax.toLocaleString();
  if (totalEl) totalEl.textContent = '₹' + total.toLocaleString();
}

function renderDeliveryInfo() {
  const infoEl = document.getElementById('deliveryInfo');
  if (!infoEl) return;

  if (!customer.name) {
    infoEl.textContent = 'No delivery details found.';
    return;
  }

  infoEl.innerHTML = `
    <strong>${customer.name}</strong><br>
    ${customer.address || ''}, ${customer.city || ''}${customer.state ? ', ' + customer.state : ''} ${customer.pincode ? '- ' + customer.pincode : ''}<br>
    Phone: ${customer.phone || ''}<br>
    Email: ${customer.email || ''}
  `;
}

function restorePaymentMethod() {
  if (!paymentMethod) return;
  const radio = document.querySelector(`input[name="payment"][value="${paymentMethod}"]`);
  if (radio) radio.checked = true;
}

function confirmPayment() {
  if (!cart.length) {
    showToast('Cart is empty.', 'error');
    return;
  }

  const selected = document.querySelector('input[name="payment"]:checked');
  paymentMethod = selected ? selected.value : paymentMethod;

  if (!paymentMethod) {
    showToast('Please select a payment method.', 'error');
    return;
  }

  const subtotal = totals.subtotal ?? cart.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);
  const shipping = totals.shipping ?? (subtotal > 500 ? 0 : 50);
  const tax = totals.tax ?? Math.round(subtotal * 0.18);
  const total = totals.total ?? (subtotal + shipping + tax);
  const orderId = 'ORD' + Date.now();

  const order = {
    id: orderId,
    items: cart,
    customer: customer,
    paymentMethod,
    subtotal,
    shipping,
    tax,
    total,
    status: 'confirmed',
    orderDate: new Date().toISOString()
  };

  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  localStorage.setItem('latestOrderId', orderId);
  localStorage.setItem('selectedPaymentMethod', paymentMethod);

  showConfirmation(order);
}

function showConfirmation(order) {
  const box = document.getElementById('confirmationBox');
  const text = document.getElementById('confirmationText');
  const idEl = document.getElementById('confirmationOrderId');
  const methodEl = document.getElementById('confirmationMethod');
  const totalEl = document.getElementById('confirmationTotal');

  if (box) box.style.display = 'flex';
  if (text) text.textContent = 'Your payment has been confirmed successfully.';
  if (idEl) idEl.textContent = 'Order ID: ' + order.id;
  if (methodEl) methodEl.textContent = 'Payment Method: ' + order.paymentMethod.toUpperCase();
  if (totalEl) totalEl.textContent = 'Total Paid: ₹' + order.total.toLocaleString();
}

document.addEventListener('DOMContentLoaded', function () {
  const closeBtn = document.getElementById('closeConfirmationBtn');
  const box = document.getElementById('confirmationBox');

  if (closeBtn && box) {
    closeBtn.addEventListener('click', function () {
      box.style.display = 'none';
    });
  }

  if (box) {
    box.addEventListener('click', function (e) {
      if (e.target === box) {
        box.style.display = 'none';
      }
    });
  }
});