let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

const summary = document.getElementById("order-items");
const totalEl = document.getElementById("order-total");

cart.forEach(item => {
  total += item.price * item.quantity;
  summary.innerHTML += `<div class="order-item">${item.name} x${item.quantity} — ₦${item.price*item.quantity}</div>`;
});

totalEl.textContent = total.toLocaleString();

function placeOrder(){
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const delivery = document.querySelector('input[name="delivery"]:checked').value;

  if(!name || !phone){
    alert("Please fill required fields");
    return;
  }

  let message = `NEW ORDER - Knot & Loop\nName: ${name}\nPhone: ${phone}\nDelivery: ${delivery}\n`;
  if(delivery === "Delivery") message += `Address: ${address}\n`;
  message += `\nOrder Details:\n`;

  cart.forEach(item => {
    message += `${item.name} x${item.quantity}\n`;
  });

  message += `\nTotal: ₦${total}`;

  const whatsappURL = `https://wa.me/234XXXXXXXXXX?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");

  localStorage.removeItem("cart");
}
