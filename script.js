/* ================= API ================= */

const API_URL = "https://opensheet.elk.sh/1SzJ6PfHvEEJSkRN-Ne5uEVmOLrbst0OfdyPqVwRzkO8/Sheet1";


/* ================= CART ================= */

// Load from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];


/* ================= ADD TO CART ================= */

function addToCart(name, price) {

  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  updateCart();
}


/* ================= UPDATE CART ================= */

function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));

  const cartCount = document.getElementById("cart-count");

  if (cartCount) {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.innerText = totalQty;
  }
}


/* ================= REMOVE ITEM ================= */

function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCart();
  renderCartPage();
}


/* ================= CHANGE QUANTITY ================= */

function changeQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    removeFromCart(name);
  } else {
    updateCart();
    renderCartPage();
  }
}


/* ================= SAFE STRING ================= */
// Prevent breaking onclick if product name has quotes

function safeText(text) {
  return text.replace(/'/g, "\\'");
}


/* ================= CARD TEMPLATE ================= */

function createCard(product) {
  const safeName = safeText(product.name);

  return `
    <div class="card">

      <button class="add-btn"
        onclick="addToCart('${safeName}', ${product.price})">
        ➕
      </button>

      <img src="${product.image}" alt="${product.name}">
      <h4>${product.name}</h4>
      <p>₹${product.price}</p>

    </div>
  `;
}


/* ================= RENDER PRODUCTS ================= */

function renderProducts(data) {

  const productContainer = document.getElementById("product-container");
  const categoryContainer = document.querySelector("[data-category]");

  if (productContainer) productContainer.innerHTML = "";
  if (categoryContainer) categoryContainer.innerHTML = "";

  data.forEach(product => {

    const card = createCard(product);
    const category = product.category?.toLowerCase();

    // INDEX PAGE
    if (productContainer) {
      productContainer.innerHTML += card;
    }

    // CATEGORY PAGE
    if (categoryContainer) {
      const pageCategory = categoryContainer.dataset.category.toLowerCase();

      if (category === pageCategory) {
        categoryContainer.innerHTML += card;
      }
    }
  });
}


/* ================= LOAD PRODUCTS ================= */

function loadProducts() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {

      if (!data || data.length === 0) {
        const container =
          document.getElementById("product-container") ||
          document.querySelector("[data-category]");

        if (container) {
          container.innerHTML = "<p>No products found</p>";
        }
        return;
      }

      renderProducts(data);
    })
    .catch(err => {
      console.error("PRODUCT ERROR:", err);

      const container =
        document.getElementById("product-container") ||
        document.querySelector("[data-category]");

      if (container) {
        container.innerHTML = "<p>Failed to load products</p>";
      }
    });
}


/* ================= CATEGORY FILTER ================= */

function filterCategory(category) {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {

      const container = document.getElementById("product-container");
      if (!container) return;

      const filtered = data.filter(p =>
        p.category?.toLowerCase() === category.toLowerCase()
      );

      container.innerHTML = "";

      if (filtered.length === 0) {
        container.innerHTML = "<p>No items found</p>";
        return;
      }

      filtered.forEach(product => {
        container.innerHTML += createCard(product);
      });
    });
}


/* ================= CART PAGE ================= */

function renderCartPage() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");

  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty 🛒</p>";
    if (totalEl) totalEl.innerText = "";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;

    const safeName = safeText(item.name);

    container.innerHTML += `
      <div class="card">
        <h4>${item.name}</h4>
        <p>₹${item.price}</p>

        <div>
          <button onclick="changeQty('${safeName}', -1)">➖</button>
          ${item.qty}
          <button onclick="changeQty('${safeName}', 1)">➕</button>
        </div>

        <button onclick="removeFromCart('${safeName}')">❌ Remove</button>
      </div>
    `;
  });

  if (totalEl) {
    totalEl.innerText = "Total: ₹" + total;
  }
}


/* ================= CHECKOUT ================= */

/* ================= WHATSAPP CHECKOUT ================= */

function checkoutWhatsApp() {

  if (cart.length === 0) {
    alert("Your cart is empty 🛒");
    return;
  }

  let message = "🛒 *New Order - ShopMart*%0A%0A";

  let total = 0;

  cart.forEach(item => {
    message += `• ${item.name} (x${item.qty}) - ₹${item.price * item.qty}%0A`;
    total += item.price * item.qty;
  });

  message += `%0A*Total: ₹${total}*%0A`;
  message += "%0A📦 Please confirm my order.";

  // ✅ Your WhatsApp number (no + sign)
  const phone = "919159842232";

  const url = `https://wa.me/${phone}?text=${message}`;

  // Open WhatsApp
  window.open(url, "_blank");

  // OPTIONAL: clear cart after checkout
  cart = [];
  updateCart();
  renderCartPage();
}


/* ================= FOUNDERS SLIDER ================= */

let currentSlide = 0;

function nextSlide() {
  const slides = document.querySelectorAll(".slide");

  if (slides.length === 0) return;

  slides.forEach(slide => {
    slide.classList.remove("active", "exit");
  });

  slides[currentSlide].classList.add("exit");

  currentSlide = (currentSlide + 1) % slides.length;

  slides[currentSlide].classList.add("active");
}


/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {

  loadProducts();
  updateCart();
  renderCartPage();

  const slides = document.querySelectorAll(".slide");
  if (slides.length > 0) {
    slides[0].classList.add("active");
  }
});


/* ================= AUTO SLIDE ================= */

setInterval(nextSlide, 4000);