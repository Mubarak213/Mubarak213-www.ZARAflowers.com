/* ================= API ================= */

const API_URL =
  "https://opensheet.elk.sh/1SzJ6PfHvEEJSkRN-Ne5uEVmOLrbst0OfdyPqVwRzkO8/Sheet2";

/* ================= STORAGE ================= */

let categoryData = {};
let newArrivalData = [];

let cart =
  JSON.parse(localStorage.getItem("cart")) || [];

/* ================= SUBCATEGORY IMAGES ================= */

const subCategoryImages = {

  flowers: {

    "👶 baby shower": {

      jadai:
        "https://drive.google.com/thumbnail?id=1b8O7xiRoIhDmGOKBxOU45bxFfeRlNbm4&sz=w1000",

      decoration:
        "https://drive.google.com/thumbnail?id=1VjO33t-Iq0NdsaXQN15RrL9sC9N_aM2h&sz=w1000",

      malai:
        "https://drive.google.com/thumbnail?id=1pm0Gxi9e0zl7IZDxXdjG5Qh7GQVxSlyD&sz=w1000"
    },

    "👶 puberty": {

      jadai:
        "https://drive.google.com/thumbnail?id=1BEMBYPUInCoRA45PhERvyEXi6PVUb47J&sz=w1000",

      decoration:
        "https://drive.google.com/thumbnail?id=1qFuBCaizn8WenvWPKnNTr4W9VORsxgB-&sz=w1000",

      malai:
        "https://drive.google.com/thumbnail?id=1jfNmjOg-pk9LdF3XOPeNrpPI3xudmcbJ&sz=w1000"
    },

    "👶 house warming": {

      jadai:
        "https://drive.google.com/thumbnail?id=1jYMhc-KqoL7oKd7wXrda_hEWsnvFBoyu&sz=w1000",

      decoration:
        "https://drive.google.com/thumbnail?id=1XOVsn3ENf-rMpfi5DfQ7h68bfC1y9ptf&sz=w1000",

      malai:
        "https://drive.google.com/thumbnail?id=1jfNmjOg-pk9LdF3XOPeNrpPI3xudmcbJ&sz=w1000"
    },

    "💍 engagement": {

      malai:
        "https://drive.google.com/thumbnail?id=1s6-LDMmFgDxpELMtEC85huzXgDWnHj3v&sz=w1000",

      decoration:
        "https://drive.google.com/thumbnail?id=1qFuBCaizn8WenvWPKnNTr4W9VORsxgB-&sz=w1000",

      jadai:
        "https://drive.google.com/thumbnail?id=1Mu36xdBEvEhoo8slv48_E7G2YQeRRida&sz=w1000"
    }
  }
};

/* ================= FETCH DATA ================= */

async function fetchSheetData() {

  try {

    const response =
      await fetch(API_URL);

    const rows =
      await response.json();

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

    const match =
      url.match(/\/d\/([a-zA-Z0-9_-]+)/);

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
      (row.type || "")
        .trim()
        .toLowerCase();

    const mainCategory =
      (row.main_category || "")
        .trim()
        .toLowerCase();

    const categoryTitle =
      (row.category_title || "")
        .trim();

    const subCategory =
      (row.sub_category || "")
        .trim();

    const image =
      convertDriveImage(row.image);

    const product = {

      name:
        row.product_name || "No Name",

      price:
        Number(row.price) || 0,

      img:
        image
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

          products: []
        };

        category.subcategories.push(sub);
      }

      sub.products.push(product);
    }
  });

  loadPageData();
}

/* ================= RENDER SUB CATEGORIES ================= */

function renderSubCategories(data, containerId) {

  const container =
    document.getElementById(containerId);

  if (!container || !data) return;

  let html = "";

  data.forEach((cat, catIndex) => {

    html += `

      <div class="category-section">

        <h2 class="category-title">
          ${cat.title}
        </h2>

        <div class="grid">
    `;

    cat.subcategories.forEach((sub, subIndex) => {

      const mainCategory =
        containerId
          .replace("Categories", "")
          .trim()
          .toLowerCase();

      const categoryKey =
        cat.title
          .trim()
          .toLowerCase();

      const subKey =
        sub.name
          .trim()
          .toLowerCase();

      const image =
        subCategoryImages?.[mainCategory]?.[categoryKey]?.[subKey]
        || sub.products[0]?.img
        || "images/no-image.jpg";

      html += `

        <div
          class="card subcategory-card"
          onclick="showProducts('${containerId}', ${catIndex}, ${subIndex})"
        >

          <img
            src="${image}"
            alt="${sub.name}"
            onerror="this.src='images/no-image.jpg'"
          >

          <div class="subcategory-info">

            <h4>${sub.name}</h4>

            <p>Click to View</p>

          </div>

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

  const data =
    dataMap[containerId];

  if (!data) return;

  const sub =
    data[catIndex]
      .subcategories[subIndex];

  const container =
    document.getElementById(containerId);

  let html = `

    <button
      class="back-btn"
      onclick="goBack('${containerId}')"
    >
      ⬅ Back
    </button>

    <h2 class="product-title">
      ${sub.name}
    </h2>

    <div class="grid">
  `;

  sub.products.forEach(p => {

    const safeName =
      p.name.replace(/'/g, "\\'");

    html += `

      <div class="card product-card">

        <button
          class="add-btn"
          onclick="event.stopPropagation();
          addToCart('${safeName}', ${p.price}, '${p.img}')"
        >
          ➕
        </button>

        <img
          src="${p.img}"
          alt="${p.name}"
          onerror="this.src='images/no-image.jpg'"
        >

        <h4>${p.name}</h4>

        <p>₹${p.price}</p>

      </div>
    `;
  });

  html += `
    </div>
  `;

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

      <div class="new-arrival-section">

        <h2 class="new-arrival-title">
          ${cat.title}
        </h2>

        <div class="new-arrival-row">
    `;

    cat.subcategories.forEach(sub => {

      sub.products.forEach(p => {

        const safeName =
          p.name.replace(/'/g, "\\'");

        html += `

          <div class="card new-arrival-card">

            <button
              class="add-btn"
              onclick="addToCart('${safeName}', ${p.price}, '${p.img}')"
            >
              ➕
            </button>

            <img
              src="${p.img}"
              alt="${p.name}"
              onerror="this.src='images/no-image.jpg'"
            >

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

/* ================= ADD TO CART ================= */

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

  renderCartPage();

  alert(name + " added to cart");
}

/* ================= RENDER CART PAGE ================= */


/* ================= RENDER CART PAGE ================= */

function renderCartPage() {

  const container =
    document.getElementById("cart-items");

  const totalDiv =
    document.getElementById("cart-total");

  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {

    container.innerHTML = `

      <div class="empty-cart">

        <h3>🛒 Your cart is empty</h3>

        <a href="index.html" class="btn">
          Continue Shopping
        </a>

      </div>

    `;

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
          src="${item.img}"
          alt="${item.name}"
          onerror="this.src='images/no-image.jpg'"
        >

        <div class="cart-info">

          <h3>${item.name}</h3>

          <p>Price: ₹${item.price}</p>

          <div class="qty-controls">

            <button
              onclick="changeQty(${index}, 'minus')"
            >
              ➖
            </button>

            <span>${item.qty}</span>

            <button
              onclick="changeQty(${index}, 'plus')"
            >
              ➕
            </button>

          </div>

          <h4>
            Total: ₹${subtotal}
          </h4>

          <button
            class="remove-btn"
            onclick="removeFromCart(${index})"
          >
            Remove
          </button>

        </div>

      </div>

    `;
  });

  if (totalDiv) {

    totalDiv.innerHTML = `
      Grand Total : ₹${total}
    `;
  }
}

/* ================= CHANGE QUANTITY ================= */

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

/* ================= REMOVE ITEM ================= */

function removeFromCart(index) {

  cart.splice(index, 1);

  updateCart();

  renderCartPage();
}

/* ================= WHATSAPP CHECKOUT ================= */

function checkoutWhatsApp() {

  if (cart.length === 0) {

    alert("Your cart is empty");

    return;
  }

  let message =
    "🛒 *New Order*%0A%0A";

  let total = 0;

  cart.forEach(item => {

    const subtotal =
      item.price * item.qty;

    total += subtotal;

    message +=
      `📦 Product: ${item.name}%0A` +
      `Qty: ${item.qty}%0A` +
      `Price: ₹${item.price}%0A` +
      `Subtotal: ₹${subtotal}%0A%0A`;
  });

  message +=
    `💰 Total Amount: ₹${total}`;

  const phone =
    "919159842232";

  window.open(
    `https://wa.me/${phone}?text=${message}`,
    "_blank"
  );

  /* CLEAR CART */
  cart = [];

  localStorage.removeItem("cart");

  updateCart();

  renderCartPage();

  alert("Order placed successfully!");
}

/* ================= LOAD PAGE ================= */

function loadPageData() {

  renderSubCategories(
    categoryData["flowers"],
    "flowersCategories"
  );

  renderNewArrivals();

  updateCart();

  renderCartPage();
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