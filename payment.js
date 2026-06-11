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

  customer = checkoutData.customer || JSON.parse(localStorage.getItem('checkoutCustomer') || localStorage.getItem('user') || '{}');
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
  
  // Fill form with existing customer data if available
  fillCustomerForm();

  const confirmBtn = document.getElementById('confirmPaymentBtn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', confirmPayment);
  }

  setupConfirmationClose();
});


/* =========================
   FILL CUSTOMER FORM WITH EXISTING DATA
========================= */

function fillCustomerForm() {
  // Check if customer data exists
  if (customer.name || customer.email || customer.phone) {
    // Fill form fields if they exist in the page
    const fullNameEl = document.getElementById('fullName');
    const phoneEl = document.getElementById('phone');
    const addr1El = document.getElementById('addr1');
    const addr2El = document.getElementById('addr2');
    const cityEl = document.getElementById('city');
    const stateEl = document.getElementById('state');
    const pincodeEl = document.getElementById('pincode');
    const deliveryNotesEl = document.getElementById('deliveryNotes');

    if (fullNameEl && customer.name) fullNameEl.value = customer.name;
    if (phoneEl && customer.phone) phoneEl.value = customer.phone;
    if (addr1El && customer.address) addr1El.value = customer.address;
    if (addr2El && customer.address2) addr2El.value = customer.address2;
    if (cityEl && customer.city) cityEl.value = customer.city;
    if (stateEl && customer.state) stateEl.value = customer.state;
    if (pincodeEl && customer.pincode) pincodeEl.value = customer.pincode;
    if (deliveryNotesEl && customer.deliveryNotes) deliveryNotesEl.value = customer.deliveryNotes;
  }
}


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
   PAYMENT METHOD RESTORE
========================= */

function restorePaymentMethod() {
  if (!paymentMethod) return;

  const radio = document.querySelector(
    `input[name="payment"][value="${paymentMethod}"]`
  );

  if (radio) radio.checked = true;
}

/* =========================
   CONFIRM PAYMENT
========================= */

function confirmPayment() {

  if (!cart || !cart.length) {
    showToast("Cart is empty.", "error");
    return;
  }

  const selected =
    document.querySelector('input[name="payment"]:checked');

  paymentMethod = selected ? selected.value : "";

  if (!paymentMethod) {
    showToast("Please select a payment method.", "error");
    return;
  }

  const subtotal =
    totals.subtotal ??
    cart.reduce(
      (sum, item) =>
        sum + ((item.price || 0) * (item.qty || 1)),
      0
    );

  const shipping =
    totals.shipping ??
    (subtotal > 500 ? 0 : 50);

  const tax =
    totals.tax ??
    Math.round(subtotal * 0.18);

  const total =
    totals.total ??
    (subtotal + shipping + tax);

  const orderId = "ORD" + Date.now();

  const order = {
    id: orderId,
    items: cart,
    customer: customer,
    paymentMethod: paymentMethod,
    subtotal: subtotal,
    shipping: shipping,
    tax: tax,
    total: total,
    status: "confirmed",
    orderDate: new Date().toISOString()
  };

  localStorage.setItem(
    "selectedPaymentMethod",
    paymentMethod
  );

  // ONLINE PAYMENT
  if (paymentMethod === "online") {
    payNow(total, orderId);
    return;
  }

  // CASH ON DELIVERY
  showConfirmation(order);
}

/* =========================
   RAZORPAY PAYMENT
========================= */

async function payNow(amount, orderId) {

  try {

    const response = await fetch(
      "https://appealing-spirit-production-da94.up.railway.app/api/payment/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: amount
        })
      }
    );

    const data = await response.json();

    if (!data.success) {
      alert("Unable to create payment order");
      return;
    }

    const options = {

      key: "rzp_test_SzoUbn4wJGkBqA",

      amount: data.order.amount,
      currency: data.order.currency,

      name: "ShopKart",

      description: "Order Payment",

      order_id: data.order.id,

      prefill: {
        name: customer.name || "",
        email: customer.email || "",
        contact: customer.phone || ""
      },

      theme: {
        color: "#3399cc"
      },

      handler: function (response) {

        const order = {

          id: orderId,

          items: cart,

          customer: customer,

          paymentMethod: "online",

          subtotal:
            totals.subtotal || 0,

          shipping:
            totals.shipping || 0,

          tax:
            totals.tax || 0,

          total: amount,

          razorpay_payment_id:
            response.razorpay_payment_id,

          razorpay_order_id:
            response.razorpay_order_id,

          status: "paid",

          orderDate:
            new Date().toISOString()
        };

        alert("Payment Successful 🎉");

        showConfirmation(order);
      }
    };

    const rzp =
      new Razorpay(options);

    rzp.on(
      "payment.failed",
      function (response) {

        console.log(response.error);

        alert(
          "Payment Failed : " +
          response.error.description
        );
      }
    );

    rzp.open();

  } catch (error) {

    console.error(error);

    alert("Payment Server Error");
  }
}

function showConfirmation(order) {

  const receiptData = {

    orderId: order.id,

    orderDate:
      new Date().toLocaleString(),

    customerName:
      customer.name || "",

    customerPhone:
      customer.phone || "",

    customerEmail:
      customer.email || "",

    shippingAddress: {
      line1:
        customer.address || "",

      city:
        customer.city || "",

      state:
        customer.state || "",

      pincode:
        customer.pincode || "",

      fullAddress:
        `${customer.address || ""}, ${customer.city || ""}, ${customer.state || ""} - ${customer.pincode || ""}`
    },

    products: cart.map(item => ({
      name:
        item.name || "Product",

      quantity:
        item.qty ||
        item.quantity ||
        1,

      price:
        item.price || 0,

      image:
        item.image || "",

      category:
        item.category ||
        "General"
    })),

    subtotal:
      order.subtotal,

    shipping:
      order.shipping,

    tax:
      order.tax,

    total:
      order.total,

    paymentMethod:
      order.paymentMethod === "online"
        ? "Online Payment"
        : "Cash On Delivery",

    status:
      order.status
  };

  // Save latest receipt
  localStorage.setItem(
    "lastOrder",
    JSON.stringify(receiptData)
  );

  // Save order history
  const orders =
    JSON.parse(
      localStorage.getItem("orders") || "[]"
    );

  orders.push(receiptData);

  localStorage.setItem(
    "orders",
    JSON.stringify(orders)
  );

  // Clear cart only
  localStorage.removeItem("cart");
  localStorage.removeItem("checkoutCart");
  localStorage.removeItem("checkoutData");

  // Open receipt page
  window.location.href =
    "receipt.html";
}