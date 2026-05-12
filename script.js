/* ================= API ================= */

const API_URL =
  "https://opensheet.elk.sh/1SzJ6PfHvEEJSkRN-Ne5uEVmOLrbst0OfdyPqVwRzkO8/Sheet2";

/* ================= STORAGE ================= */

let categoryData = {};
let newArrivalData = [];

let cart =
  JSON.parse(localStorage.getItem("cart")) || [];

/* ================= USER LOGIN ================= */

let userMobile =
  localStorage.getItem("userMobile") || "";

/* ================= SAVE MOBILE ================= */

function saveMobileNumber() {

  let mobile =
    prompt("Enter your mobile number");

  if (!mobile) return;

  mobile = mobile.trim();

  if (!/^[6-9]\d{9}$/.test(mobile)) {

    alert("Enter valid 10 digit mobile number");

    return;
  }

  userMobile = mobile;

  localStorage.setItem(
    "userMobile",
    mobile
  );

  alert("Mobile number saved successfully");
}

/* ================= AUTO LOGIN ================= */

function checkUserLogin() {

  if (!userMobile) {

    saveMobileNumber();
  }
}

/* ================= SUBCATEGORY IMAGES ================= */

const subCategoryImages = {

  flowers: {

    "🌸 raw flowers": {

      "rose":
        "https://drive.google.com/thumbnail?id=130_vgrEaMKH5WPb4F7rZfV5t8KQ7Hlql&sz=w1000",

      "chamanthi":
        "https://drive.google.com/thumbnail?id=1xtdQTVjiWgbO8sxNQwRsmd0rUC0efK8g&sz=w1000",

      "threaded":
        "https://drive.google.com/thumbnail?id=1rJk3_XHeVR0KLlUKscisiDyvNkp2X4X0&sz=w1000"
    },

    "👶 baby": {

      "jadai":
        "https://drive.google.com/thumbnail?id=1b8O7xiRoIhDmGOKBxOU45bxFfeRlNbm4&sz=w1000",

      "decoration":
        "https://drive.google.com/thumbnail?id=1VjO33t-Iq0NdsaXQN15RrL9sC9N_aM2h&sz=w1000",

      "malai":
        "https://drive.google.com/thumbnail?id=1pm0Gxi9e0zl7IZDxXdjG5Qh7GQVxSlyD&sz=w1000"
    },

    "👩 puberty": {

      "jadai":
        "https://drive.google.com/thumbnail?id=1bAYErvna1ajEf4-1XHUudYTYp7zKP65R&sz=w1000",

      "decoration":
        "https://drive.google.com/thumbnail?id=1qFuBCaizn8WenvWPKnNTr4W9VORsxgB-&sz=w1000",

      "malai":
        "https://drive.google.com/thumbnail?id=1tG4B6tL2U7HKwH2OLQy8SISG_XTWtfPe&sz=w1000"
    },

    "💍 engagement": {

      "malai":
        "https://drive.google.com/thumbnail?id=1s6-LDMmFgDxpELMtEC85huzXgDWnHj3v&sz=w1000",

      "decoration":
        "https://drive.google.com/thumbnail?id=1qFuBCaizn8WenvWPKnNTr4W9VORsxgB-&sz=w1000",

      "jadai":
        "https://drive.google.com/thumbnail?id=1Mu36xdBEvEhoo8slv48_E7G2YQeRRida&sz=w1000"
    },

    "👰🤵 wedding": {

      "malai":
        "https://drive.google.com/thumbnail?id=1s6-LDMmFgDxpELMtEC85huzXgDWnHj3v&sz=w1000",

      "decoration":
        "https://drive.google.com/thumbnail?id=1qFuBCaizn8WenvWPKnNTr4W9VORsxgB-&sz=w1000",

      "jadai":
        "https://drive.google.com/thumbnail?id=1Mu36xdBEvEhoo8slv48_E7G2YQeRRida&sz=w1000"
    },

    "🤰 baby shower": {

      "jadai":
        "https://drive.google.com/thumbnail?id=1b8O7xiRoIhDmGOKBxOU45bxFfeRlNbm4&sz=w1000",

      "decoration":
        "https://drive.google.com/thumbnail?id=1VjO33t-Iq0NdsaXQN15RrL9sC9N_aM2h&sz=w1000",

      "malai":
        "https://drive.google.com/thumbnail?id=1pm0Gxi9e0zl7IZDxXdjG5Qh7GQVxSlyD&sz=w1000"
    },

    "🏡 house warming": {

      "jadai":
        "https://drive.google.com/thumbnail?id=1jYMhc-KqoL7oKd7wXrda_hEWsnvFBoyu&sz=w1000",

      "decoration":
        "https://drive.google.com/thumbnail?id=1XOVsn3ENf-rMpfi5DfQ7h68bfC1y9ptf&sz=w1000",

      "malai":
        "https://drive.google.com/thumbnail?id=1OOu2BqXjp0_s0yUauXyKQVU6yCdgEDzf&sz=w1000"
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
        .trim()
        .toLowerCase();

    const subCategory =
      (row.sub_category || "")
        .trim()
        .toLowerCase();

    const image =
      convertDriveImage(row.image);

    const product = {

      id:
        Date.now() +
        Math.random(),

      name:
        row.product_name || "No Name",

      price:
        Number(row.price) || 0,

      img:
        image,

      description:
        row.description ||
        "Premium quality product available at ShopMart."
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

  /* ================= CATEGORY ORDER ================= */

  const desiredOrder = [
    "🌸 raw flowers",
    "👶 baby",
    "👩 puberty",
    "💍 engagement",
    "👰🤵 wedding",
    "🤰 baby shower",
    "🏡 house warming"
  ];

  Object.keys(categoryData).forEach(mainCategory => {

    categoryData[mainCategory].sort((a, b) => {

      const orderA =
        desiredOrder.indexOf(a.title);

      const orderB =
        desiredOrder.indexOf(b.title);

      return orderA - orderB;
    });
  });

  loadPageData();
}

/* ================= PRODUCT DETAILS ================= */

function openProductPage(product) {

  localStorage.setItem(
    "selectedProduct",
    JSON.stringify(product)
  );

  window.location.href =
    "product.html";
}

function loadProductDetails() {

  const container =
    document.getElementById("productDetails");

  if (!container) return;

  const product =
    JSON.parse(
      localStorage.getItem("selectedProduct")
    );

  if (!product) {

    container.innerHTML =
      "<h2>Product not found</h2>";

    return;
  }

  const safeName =
    product.name.replace(/'/g, "\\'");

  container.innerHTML = `

    <div class="product-details-page">

      <div class="product-image">

        <img
          src="${product.img}"
          alt="${product.name}"
        >

      </div>

      <div class="product-content">

        <h1>${product.name}</h1>

        <h2>₹${product.price}</h2>

        <p>${product.description}</p>

        <button
          class="btn"
          onclick="addToCart(
            '${safeName}',
            ${product.price},
            '${product.img}'
          )"
        >
          Add To Cart
        </button>

      </div>

    </div>
  `;
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

      <div
        class="card product-card"
        onclick='openProductPage(${JSON.stringify(p)})'
      >

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

    cat.subcategories.forEach(sub => {

      sub.products.forEach(p => {

        const safeName =
          p.name.replace(/'/g, "\\'");

        html += `

          <div
            class="card new-arrival-card"
            onclick='openProductPage(${JSON.stringify(p)})'
          >

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
            >

            <h4>${p.name}</h4>

            <p>₹${p.price}</p>

            <small>${sub.name}</small>

          </div>
        `;
      });
    });
  });

  container.innerHTML = html;
}

/* ================= UPDATE CART ================= */

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
        >

        <div class="cart-info">

          <h3>${item.name}</h3>

          <p>Price: ₹${item.price}</p>

          <div class="qty-controls">

            <button onclick="changeQty(${index}, 'minus')">
              ➖
            </button>

            <span>${item.qty}</span>

            <button onclick="changeQty(${index}, 'plus')">
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

    totalDiv.innerHTML =
      `Grand Total : ₹${total}`;
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

/* ================= CLEAR CART ================= */

function clearCart() {

  cart = [];

  localStorage.removeItem("cart");

  updateCart();

  renderCartPage();
}

/* ================= SEARCH ================= */

let searchInitialized = false;

function setupGlobalSearch() {

  if (searchInitialized) return;

  const searchInput =
    document.getElementById("searchInput");

  const resultsBox =
    document.getElementById("searchResults");

  if (!searchInput || !resultsBox) {

    return;
  }

  searchInitialized = true;

  searchInput.addEventListener(
    "input",
    function () {

      const query =
        this.value
          .trim()
          .toLowerCase();

      if (!query) {

        resultsBox.innerHTML = "";

        resultsBox.style.display = "none";

        return;
      }

      const allProducts =
        getAllProducts();

      const matchedProducts =
        allProducts.filter(product => {

          return (
            product.name &&
            product.name
              .toLowerCase()
              .includes(query)
          );
        });

      renderSearchSuggestions(
        matchedProducts.slice(0, 8),
        resultsBox
      );
    }
  );
}

/* ================= SEARCH SUGGESTIONS ================= */

function renderSearchSuggestions(products, container) {

  if (!products.length) {

    container.innerHTML = `
      <div class="search-empty">
        No products found
      </div>
    `;

    container.style.display = "block";

    return;
  }

  let html = "";

  products.forEach(product => {

    html += `

      <div
        class="search-suggestion"
        onclick='openProductPage(${JSON.stringify(product)})'
      >

        🔍 ${product.name}

      </div>
    `;
  });

  container.innerHTML = html;

  container.style.display = "block";
}

/* ================= GET ALL PRODUCTS ================= */

function getAllProducts() {

  let products = [];

  Object.keys(categoryData).forEach(mainCategory => {

    const categories =
      categoryData[mainCategory];

    if (!categories) return;

    categories.forEach(category => {

      category.subcategories.forEach(sub => {

        sub.products.forEach(product => {

          products.push({

            name:
              product.name || "No Name",

            price:
              product.price || 0,

            img:
              product.img ||
              "images/no-image.jpg",

            description:
              product.description ||
              "",

            category:
              category.title || "",

            subcategory:
              sub.name || ""
          });
        });
      });
    });
  });

  return products;
}

/* ================= LOAD PAGE ================= */

function loadPageData() {

  if (
    document.getElementById("flowersCategories")
  ) {

    renderSubCategories(
      categoryData["flowers"],
      "flowersCategories"
    );
  }

  if (
    document.getElementById("groceryCategories")
  ) {

    renderSubCategories(
      categoryData["grocery"],
      "groceryCategories"
    );
  }

  if (
    document.getElementById("dryfruitsCategories")
  ) {

    renderSubCategories(
      categoryData["dryfruits"],
      "dryfruitsCategories"
    );
  }

  if (
    document.getElementById("giftsCategories")
  ) {

    renderSubCategories(
      categoryData["gifts"],
      "giftsCategories"
    );
  }

  if (
    document.getElementById("electronicsCategories")
  ) {

    renderSubCategories(
      categoryData["electronics"],
      "electronicsCategories"
    );
  }

  if (
    document.getElementById("birthdayCategories")
  ) {

    renderSubCategories(
      categoryData["birthday"],
      "birthdayCategories"
    );
  }

  renderNewArrivals();

  updateCart();

  renderCartPage();

  setupGlobalSearch();

  loadProductDetails();
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