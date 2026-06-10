/* =========================
   GLOBAL VARIABLES
========================= */

let cart = [];
let customer = {};
let totals = {};
let paymentMethod = '';

/* =========================
   LOAD DATA FROM STORAGE
========================= */

function loadCheckoutData() {
  const checkoutData = JSON.parse(localStorage.getItem('checkoutData') || '{}');

  customer = checkoutData.customer || JSON.parse(localStorage.getItem('checkoutCustomer') || '{}');
  cart = checkoutData.cart || JSON.parse(localStorage.getItem('checkoutCart') || localStorage.getItem('cart') || '[]');
  totals = checkoutData.totals || {};
  paymentMethod = localStorage.getItem('selectedPaymentMethod') || '';
}

/* =========================
   INIT PAGE
========================= */

document.addEventListener('DOMContentLoaded', function () {
  loadCheckoutData();
  renderSummary();
  renderDeliveryInfo();
  restorePaymentMethod();

  const confirmBtn = document.getElementById('confirmPaymentBtn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', confirmPayment);
  }

  setupConfirmationClose();
});

/* =========================
   ORDER SUMMARY
========================= */

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

  document.getElementById('subtotalPrice').textContent = '₹' + subtotal.toLocaleString();
  document.getElementById('shippingPrice').textContent = shipping === 0 ? 'FREE' : '₹' + shipping;
  document.getElementById('taxPrice').textContent = '₹' + tax.toLocaleString();
  document.getElementById('totalPrice').textContent = '₹' + total.toLocaleString();
}

/* =========================
   DELIVERY INFO
========================= */

function renderDeliveryInfo() {
  const infoEl = document.getElementById('deliveryInfo');

  if (!customer.name) {
    infoEl.textContent = 'No delivery details found.';
    return;
  }

  infoEl.innerHTML = `
    <strong>${customer.name}</strong><br>
    ${customer.address || ''}, ${customer.city || ''} ${customer.state || ''} ${customer.pincode || ''}<br>
    Phone: ${customer.phone || ''}<br>
    Email: ${customer.email || ''}
  `;
}

/* =========================
   PAYMENT METHOD RESTORE
========================= */

function restorePaymentMethod() {
  if (!paymentMethod) return;

  const radio = document.querySelector(`input[name="payment"][value="${paymentMethod}"]`);
  if (radio) radio.checked = true;
}

/* =========================
   CONFIRM PAYMENT (COD + ONLINE)
========================= */

function confirmPayment() {
  if (!cart || !cart.length) {
    showToast('Cart is empty.', 'error');
    return;
  }

  const selected = document.querySelector('input[name="payment"]:checked');
  paymentMethod = selected ? selected.value : '';

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
    customer,
    paymentMethod,
    subtotal,
    shipping,
    tax,
    total,
    status: 'confirmed',
    orderDate: new Date().toISOString()
  };

  // SAVE ORDER LOCALLY
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(order);

  localStorage.setItem('orders', JSON.stringify(orders));
  localStorage.setItem('latestOrderId', orderId);
  localStorage.setItem('selectedPaymentMethod', paymentMethod);

  // ONLINE PAYMENT (RAZORPAY)
  if (paymentMethod === 'upi' || paymentMethod === 'card' || paymentMethod === 'netbanking') {
    payNow(total, orderId);
    return;
  }

  // COD
  showConfirmation(order);
}

/* =========================
   RAZORPAY PAYMENT
========================= */

async function payNow(amount, orderId) {
  try {
    const res = await fetch("https://appealing-spirit-production-da94.up.railway.app/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ amount })
    });

    const data = await res.json();

    if (!data.success) {
      alert("Payment failed");
      return;
    }

    const options = {
      key: "rzp_test_xxxxx",
      amount: data.order.amount,
      currency: data.order.currency,
      name: "ShopKart",
      description: "Order Payment",
      order_id: data.order.id,

      handler: function (response) {
        alert("Payment Successful 🎉");

        const order = {
          id: orderId,
          paymentMethod: paymentMethod,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          status: "paid"
        };

        showConfirmation(order);
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();

  } catch (error) {
    console.log(error);
    alert("Payment error");
  }
}

/* =========================
   CONFIRMATION UI
========================= */

function showConfirmation(order) {
  const box = document.getElementById('confirmationBox');

  document.getElementById('confirmationText').textContent =
    'Your order has been placed successfully.';

  document.getElementById('confirmationOrderId').textContent =
    'Order ID: ' + order.id;

  document.getElementById('confirmationMethod').textContent =
    'Payment Method: ' + (order.paymentMethod || 'ONLINE').toUpperCase();

  document.getElementById('confirmationTotal').textContent =
    order.total ? 'Total Paid: ₹' + order.total : '';

  box.style.display = 'flex';
}

/* =========================
   CLOSE MODAL
========================= */

function setupConfirmationClose() {
  const box = document.getElementById('confirmationBox');

  if (!box) return;

  box.addEventListener('click', function (e) {
    if (e.target === box) {
      box.style.display = 'none';
    }
  });
}

/* =========================
   TOAST MESSAGE
========================= */

function showToast(msg, type) {
  alert(msg); // simple fallback
}