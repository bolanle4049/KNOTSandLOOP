// ==========================================
// CART MANAGEMENT SYSTEM
// ==========================================

const cartContainer = document.getElementById("cart-items");
const totalDisplay = document.getElementById("cart-total");

// Global cart variable
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ==========================================
// ADD TO CART (works on ALL pages)
// ==========================================
function addToCart(product) {
  // Use the global cart variable, not a new local one
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Check if product already exists in cart
  let existingProduct = cart.find(item => item.id === product.id);
  
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }
  
  // Save back to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Show confirmation
  alert(product.name + ' added to cart!');
  
  // Update display if on cart page
  if (cartContainer) {
    displayCart();
  }
}

// ==========================================
// DISPLAY CART (on cart.html page)
// ==========================================
function displayCart() {
  if (!cartContainer) return; // Not on cart page, exit
  
  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    totalDisplay.textContent = "₦0";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    cartContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-details">
          <h4>${item.name}</h4>
          <p>₦${item.price.toLocaleString()}</p>
          <div class="quantity-controls">
            <button onclick="changeQty(${index}, -1)">-</button>
            <span class="quantity">${item.quantity}</span>
            <button onclick="changeQty(${index}, 1)">+</button>
          </div>
          <span class="remove-btn" onclick="removeItem(${index})">Remove</span>
        </div>
      </div>
    `;
  });

  totalDisplay.textContent = "₦" + total.toLocaleString();
}

// ==========================================
// CHANGE QUANTITY
// ==========================================
function changeQty(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  updateCart();
}

// ==========================================
// REMOVE ITEM
// ==========================================
function removeItem(index) {
  if (confirm('Remove this item from cart?')) {
    cart.splice(index, 1);
    updateCart();
  }
}

// ==========================================
// UPDATE CART
// ==========================================
function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// ==========================================
// GO TO CHECKOUT
// ==========================================
function goToCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  window.location.href = "checkout.html";
}

// ==========================================
// INITIALIZE (only run on cart page)
// ==========================================
if (cartContainer) {
  displayCart();
}