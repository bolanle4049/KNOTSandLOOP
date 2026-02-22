let cart = JSON.parse(localStorage.getItem("cart")) || [];
let productTotal = 0;
let currentDeliveryFee = 0;

const summary = document.getElementById("order-items");
const subtotalEl = document.getElementById("order-subtotal");
const totalEl = document.getElementById("order-total");

// Build order summary on load
cart.forEach(item => {
  productTotal += item.price * item.quantity;
  summary.innerHTML += `
    <div class="order-item">
      <span>${item.name} x${item.quantity}</span>
      <span>₦${(item.price * item.quantity).toLocaleString()}</span>
    </div>`;
});

subtotalEl.textContent = productTotal.toLocaleString();
totalEl.textContent = productTotal.toLocaleString();

// Updates fee and total when zone is selected
function updateDeliveryFee() {
  const select = document.getElementById("delivery-zone");
  const selected = select.options[select.selectedIndex];
  currentDeliveryFee = parseInt(selected.getAttribute("data-fee")) || 0;

  const feeLine = document.getElementById("delivery-fee-line");
  const feeDisplay = document.getElementById("order-delivery-fee");

  if (currentDeliveryFee > 0) {
    feeDisplay.textContent = currentDeliveryFee.toLocaleString();
    feeLine.style.display = "flex";
  } else {
    feeLine.style.display = "none";
  }

  totalEl.textContent = (productTotal + currentDeliveryFee).toLocaleString();
}

function placeOrder() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const zone = document.getElementById("delivery-zone").value;
  const exactAddress = document.getElementById("exact-address").value.trim();

  // Clear previous errors
  document.getElementById("zone-error").style.display = "none";
  document.getElementById("address-error").style.display = "none";

  let valid = true;

  if (!name || !phone) {
    alert("Please enter your name and phone number.");
    valid = false;
  }

  if (!zone) {
    document.getElementById("zone-error").style.display = "block";
    valid = false;
  }

  if (!exactAddress) {
    document.getElementById("address-error").style.display = "block";
    valid = false;
  }

  if (!valid) return;

  const finalTotal = productTotal + currentDeliveryFee;

  // Build WhatsApp message
  let message = `NEW ORDER - Knot & Loop\n`;
  message += `Name: ${name}\n`;
  message += `Phone: ${phone}\n`;
  message += `Delivery Zone: ${zone}\n`;
  message += `Address: ${exactAddress}\n`;
  message += `\nOrder Details:\n`;

  cart.forEach(item => {
    message += `${item.name} x${item.quantity} — ₦${(item.price * item.quantity).toLocaleString()}\n`;
  });

  message += `\nSubtotal: ₦${productTotal.toLocaleString()}`;
  message += `\nDelivery Fee: ₦${currentDeliveryFee.toLocaleString()}`;
  message += `\nTOTAL: ₦${finalTotal.toLocaleString()}`;

  const whatsappURL = `https://wa.me/234XXXXXXXXXX?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");

  localStorage.removeItem("cart");
}
