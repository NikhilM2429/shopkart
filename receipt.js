const order = JSON.parse(
  localStorage.getItem("lastOrder")
);

console.log(order);

document.getElementById("orderId").textContent =
order.orderId;

document.getElementById("orderDate").textContent =
order.orderDate;

document.getElementById("customerName").textContent =
order.customerName;

document.getElementById("customerEmail").textContent =
order.customerEmail;

document.getElementById("customerPhone").textContent =
order.customerPhone;

document.getElementById("shippingAddress").textContent =
order.shippingAddress.fullAddress;

document.getElementById("paymentMethod").textContent =
order.paymentMethod;

document.getElementById("orderStatus").textContent =
order.status;

document.getElementById("subtotal").textContent =
"₹" + order.subtotal;

document.getElementById("shipping").textContent =
order.shipping === 0
? "FREE"
: "₹" + order.shipping;

document.getElementById("tax").textContent =
"₹" + order.tax;

document.getElementById("totalAmount").textContent =
"₹" + order.total;

const table =
document.getElementById("productsTable");

order.products.forEach(product => {

    const total =
    product.price * product.quantity;

    table.innerHTML += `
    <tr>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.quantity}</td>
        <td>₹${product.price}</td>
        <td>₹${total}</td>
    </tr>
    `;
});