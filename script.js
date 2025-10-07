// Global Variables
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let products = [];
let artwork = [];

// Show/Hide Sections
function showSection(sectionId) {
  document
    .querySelectorAll(".section")
    .forEach((sec) => sec.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
  updateCartCount();
  if (sectionId === "shop") loadProducts();
  if (sectionId === "portfolio") loadArtwork();
  if (sectionId === "cart") renderCart();
}

// Load Products from JSON
async function loadProducts() {
  try {
    const response = await fetch("products.json");
    products = await response.json();
    renderProducts();
  } catch (error) {
    console.error("Error loading products:", error);
    document.getElementById("products-container").innerHTML =
      "<p>Error loading products. Check console.</p>";
  }
}

// Render Products
function renderProducts() {
  const container = document.getElementById("products-container");
  container.innerHTML = products
    .map(
      (product) => `
        <div class="product">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>$${product.price}</p>
                <button class="add-to-cart" onclick="addToCart('${product.id}')">Add to Cart</button>
            </div>
        </div>
    `
    )
    .join("");
}

// Load Artwork from JSON
async function loadArtwork() {
  try {
    const response = await fetch("artwork.json");
    artwork = await response.json();
    renderArtwork();
  } catch (error) {
    console.error("Error loading artwork:", error);
    document.getElementById("artwork-container").innerHTML =
      "<p>Error loading artwork. Check console.</p>";
  }
}

// Render Artwork
function renderArtwork() {
  const container = document.getElementById("artwork-container");
  container.innerHTML = artwork
    .map(
      (item) => `
        <div class="artwork">
            <img src="${item.image}" alt="${item.title}" onclick="openLightbox('${item.id}')">
            <div class="artwork-info">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        </div>
    `
    )
    .join("");
}

// Cart Functions
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(`${product.name} added to cart!`);
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
}

function renderCart() {
  const itemsContainer = document.getElementById("cart-items");
  const totalContainer = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutForm = document.getElementById("checkout-form");

  if (cart.length === 0) {
    itemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalContainer.innerHTML = "";
    checkoutBtn.style.display = "none";
    checkoutForm.style.display = "none";
    return;
  }

  itemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h4>${item.name}</h4>
                <p>$${item.price} each</p>
            </div>
            <div class="quantity">
                <button onclick="updateQuantity('${item.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
            <p>$${(item.price * item.quantity).toFixed(2)}</p>
            <button onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
    `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalContainer.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
  checkoutBtn.style.display = "block";
  checkoutForm.style.display = "none";
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function showCheckout() {
  document.getElementById("checkout-form").style.display = "block";
  document.getElementById("checkout-btn").style.display = "none";
}

document.getElementById("checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();
  alert(
    "Order placed successfully! (This is a simulation. Integrate real payment gateway next.)"
  );
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
});

// Lightbox Functions
function openLightbox(itemId) {
  const item = artwork.find((a) => a.id === itemId);
  if (item) {
    document.getElementById("lightbox-img").src = item.image;
    document.getElementById(
      "lightbox-desc"
    ).innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`;
    document.getElementById("lightbox").classList.add("active");
  }
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("active");
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  showSection("home");
  updateCartCount();
});
