/* ================= API ================= */

const API_URL =
  "https://opensheet.elk.sh/1SzJ6PfHvEEJSkRN-Ne5uEVmOLrbst0OfdyPqVwRzkO8/Sheet2";

/* ================= STORAGE ================= */

let categoryData = {};
let newArrivalData = [];

let cart =
  JSON.parse(localStorage.getItem("cart")) || [];

/* ================= FETCH DATA ================= */

async function fetchSheetData() {

  try {

    const response = await fetch(API_URL);

    const rows = await response.json();

    console.log("SHEET DATA:", rows);

    processSheetData(rows);

  } catch (error) {

    console.error("FETCH ERROR:", error);
  }
}

/* ================= GOOGLE DRIVE IMAGE ================= */

function convertDriveImage(url) {

  if (!url) {
    return "images/no-image.jpg";
  }

  if (url.includes("drive.google.com")) {

    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);

    if (match && match[1]) {

      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
    }
  }

  return url;
}

/* ================= PROCESS DATA ================= */

function processSheetData(rows) {

  categoryData = {};
  newArrivalData = [];

  rows.forEach(row => {

    const type =
      (row.type || "").trim().toLowerCase();

    const mainCategory =
      (row.main_category || "").trim().toLowerCase();

    const categoryTitle =
      (row.category_title || "").trim();

    const subCategory =
      (row.sub_category || "").trim();

    const image =
      convertDriveImage(row.image);

    const product = {
      name: row.product_name || "No Name",
      price: Number(row.price) || 0,
      img: image
    };

    if (!mainCategory || !subCategory) return;

    /* ================= NEW ARRIVAL ================= */

    if (type === "new_arrival") {

      let main =
        newArrivalData.find(
          item => item.category === mainCategory
        );

      if (!main) {

        main = {
          category: mainCategory,
          title: categoryTitle,
          subcategories: []
        };

        newArrivalData.push(main);
      }

      let sub =
        main.subcategories.find(
          item => item.name === subCategory
        );

      if (!sub) {

        sub = {
          name: subCategory,
          img: image,
          products: []
        };

        main.subcategories.push(sub);
      }

      sub.products.push(product);
    }

    /* ================= NORMAL CATEGORY ================= */

    else {

      if (!categoryData[mainCategory]) {
        categoryData[mainCategory] = [];
      }

      let category =
        categoryData[mainCategory].find(
          item => item.title === categoryTitle
        );

      if (!category) {

        category = {
          title: categoryTitle,
          subcategories: []
        };

        categoryData[mainCategory].push(category);
      }

      let sub =
        category.subcategories.find(
          item => item.name === subCategory
        );

      if (!sub) {

        sub = {
          name: subCategory,
          img: image,
          products: []
        };

        category.subcategories.push(sub);
      }

      sub.products.push(product);
    }
  });

  console.log("CATEGORY DATA:", categoryData);
  console.log("NEW ARRIVALS:", newArrivalData);

  loadPageData();
}

/* ================= RENDER SUBCATEGORIES ================= */

function renderSubCategories(data, containerId) {

  const container =
    document.getElementById(containerId);

  if (!container || !data || data.length === 0) {

    if (container) {
      container.innerHTML = "<p>No products found</p>";
    }

    return;
  }

  let html = "";

  data.forEach((cat, catIndex) => {

    html += `
      <div class="category-section">

        <h3>${cat.title}</h3>

        <div class="grid">
    `;

    cat.subcategories.forEach((sub, subIndex) => {

      html += `
        <div class="card"
          onclick="showProducts('${containerId}', ${catIndex}, ${subIndex})">

          <img src="${sub.img}" alt="${sub.name}">

          <h4>${sub.name}</h4>

          <p>View Products</p>

        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* ================= SHOW PRODUCTS ================= */

function showProducts(containerId, catIndex, subIndex) {

  const dataMap = {

    flowersCategories:
      categoryData["flowers"],

    groceryCategories:
      categoryData["grocery"],

    dryfruitsCategories:
      categoryData["dryfruits"],

    giftsCategories:
      categoryData["gifts"],

    electronicsCategories:
      categoryData["electronics"],

    birthdayCategories:
      categoryData["birthday"]
  };

  const data = dataMap[containerId];

  if (!data) return;

  const sub =
    data[catIndex].subcategories[subIndex];

  const container =
    document.getElementById(containerId);

  let html = `
    <button class="back-btn"
      onclick="goBack('${containerId}')">
      ⬅ Back
    </button>

    <h3>${sub.name}</h3>

    <div class="grid">
  `;

  sub.products.forEach(p => {

    const safeName =
      p.name.replace(/'/g, "\\'");

    html += `
      <div class="card">

        <button class="add-btn"
          onclick="event.stopPropagation(); addToCart('${safeName}', ${p.price}, '${p.img}')">
          ➕
        </button>

        <img src="${p.img}" alt="${p.name}">

        <h4>${p.name}</h4>

        <p>₹${p.price}</p>

      </div>
    `;
  });

  html += `</div>`;

  container.innerHTML = html;
}

/* ================= GO BACK ================= */

function goBack(containerId) {

  const map = {

    flowersCategories:
      categoryData["flowers"],

    groceryCategories:
      categoryData["grocery"],

    dryfruitsCategories:
      categoryData["dryfruits"],

    giftsCategories:
      categoryData["gifts"],

    electronicsCategories:
      categoryData["electronics"],

    birthdayCategories:
      categoryData["birthday"]
  };

  renderSubCategories(
    map[containerId],
    containerId
  );
}

/* ================= NEW ARRIVALS ================= */

function renderNewArrivals() {

  const container =
    document.getElementById("new-arrivals");

  if (!container) return;

  let html = "";

  newArrivalData.forEach(cat => {

    html += `
      <div class="category-section">

        <h3>${cat.title}</h3>

        <div class="grid">
    `;

    cat.subcategories.forEach(sub => {

      sub.products.forEach(p => {

        const safeName =
          p.name.replace(/'/g, "\\'");

        html += `
          <div class="card">

            <button class="add-btn"
              onclick="addToCart('${safeName}', ${p.price}, '${p.img}')">
              ➕
            </button>

            <img src="${p.img}" alt="${p.name}">

            <h4>${p.name}</h4>

            <p>₹${p.price}</p>

            <small>${sub.name}</small>

          </div>
        `;
      });
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* ================= CART ================= */

function updateCart() {

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  const cartCount =
    document.getElementById("cart-count");

  if (cartCount) {

    const totalQty =
      cart.reduce(
        (sum, item) => sum + item.qty,
        0
      );

    cartCount.innerText = totalQty;
  }
}

function addToCart(name, price, img = "") {

  const existing =
    cart.find(item => item.name === name);

  if (existing) {

    existing.qty += 1;

  } else {

    cart.push({
      name,
      price,
      img,
      qty: 1
    });
  }

  updateCart();

  alert(name + " added to cart");
}

/* ================= CART PAGE ================= */

function renderCartPage() {

  const container =
    document.getElementById("cart-items");

  const totalDiv =
    document.getElementById("total");

  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {

    container.innerHTML =
      "<h3>Your cart is empty</h3>";

    if (totalDiv) {
      totalDiv.innerHTML = "";
    }

    return;
  }

  let total = 0;

  cart.forEach((item, index) => {

    const subtotal =
      item.price * item.qty;

    total += subtotal;

    container.innerHTML += `

      <div class="card cart-card">

        <img
          src="${item.img || 'images/no-image.jpg'}"
          alt="${item.name}"
        >

        <h4>${item.name}</h4>

        <p>₹${item.price}</p>

        <div class="qty-box">

          <button
            onclick="changeQty(${index}, 'minus')">
            ➖
          </button>

          <span>${item.qty}</span>

          <button
            onclick="changeQty(${index}, 'plus')">
            ➕
          </button>

        </div>

        <p>Subtotal: ₹${subtotal}</p>

        <button
          class="remove-btn"
          onclick="removeFromCart(${index})">
          ❌ Remove
        </button>

      </div>
    `;
  });

  if (totalDiv) {

    totalDiv.innerHTML =
      `Total Amount: ₹${total}`;
  }
}

function removeFromCart(index) {

  cart.splice(index, 1);

  updateCart();

  renderCartPage();
}

function changeQty(index, action) {

  if (action === "plus") {
    cart[index].qty += 1;
  }

  if (action === "minus") {

    cart[index].qty -= 1;

    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
  }

  updateCart();

  renderCartPage();
}

/* ================= WHATSAPP ================= */

function checkoutWhatsApp() {

  if (cart.length === 0) {

    alert("Cart is empty");

    return;
  }

  let message =
    "🛒 *ShopMart Order* %0A%0A";

  let total = 0;

  cart.forEach(item => {

    const subtotal =
      item.price * item.qty;

    total += subtotal;

    message +=
      `📦 ${item.name}%0A` +
      `Qty: ${item.qty}%0A` +
      `Price: ₹${item.price}%0A` +
      `Subtotal: ₹${subtotal}%0A%0A`;
  });

  message += `💰 Total: ₹${total}`;

  window.open(
    `https://wa.me/919159842232?text=${message}`,
    "_blank"
  );
}

/* ================= LOAD PAGE ================= */

function loadPageData() {

  renderSubCategories(
    categoryData["flowers"],
    "flowersCategories"
  );

  renderSubCategories(
    categoryData["grocery"],
    "groceryCategories"
  );

  renderSubCategories(
    categoryData["dryfruits"],
    "dryfruitsCategories"
  );

  renderSubCategories(
    categoryData["gifts"],
    "giftsCategories"
  );

  renderSubCategories(
    categoryData["electronics"],
    "electronicsCategories"
  );

  renderSubCategories(
    categoryData["birthday"],
    "birthdayCategories"
  );

  renderNewArrivals();

  renderCartPage();

  updateCart();
}

/* ================= START ================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateCart();

    renderCartPage();

    fetchSheetData();
  }
);