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

      jadai:
        "https://drive.google.com/thumbnail?id=1bAYErvna1ajEf4-1XHUudYTYp7zKP65R&sz=w1000",

       decoration:
        "https://drive.google.com/thumbnail?id=1qFuBCaizn8WenvWPKnNTr4W9VORsxgB-&sz=w1000",

      malai:
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

      products: []
    };

    newArrivalData.push(main);
  }

  main.products.push({

    ...product,

    subcategory: subCategory,

    title: categoryTitle
  });
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

  /* ================= CUSTOM CATEGORY ORDER ================= */

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

      const finalA =
        orderA === -1 ? 999 : orderA;

      const finalB =
        orderB === -1 ? 999 : orderB;

      return finalA - finalB;
    });
  });

 

  /* ================= LOAD PAGE ================= */

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

      <div
  class="card product-card"
  onclick="openProductPage(
    '${safeName}',
    ${p.price},
    '${p.img}',
    '${containerId}',
    '${sub.name}'
  )"
>

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

/* ================= RENDER NEW ARRIVALS ================= */

function renderNewArrivals() {

  const container =
    document.getElementById("new-arrivals");

  if (!container) return;

  let html = "";

  newArrivalData.forEach(category => {

    html += `

      <div class="latest-category-wrapper">

        <h2 class="latest-category-title">

          ${category.category} New Arrivals

        </h2>

        <div class="new-arrival-row">
    `;

    category.products.forEach(product => {

      const safeName =
        product.name.replace(/'/g, "\\'");

      html += `

        <div
  class="card new-arrival-card"
  onclick="openProductPage(
    '${safeName}',
    ${product.price},
    '${product.img}',
    '${category.category}',
    '${product.subcategory}'
  )"
>

          <button
            class="add-btn"
            onclick="event.stopPropagation(); addToCart(
              '${safeName}',
              ${product.price},
              '${product.img}'
            )"
          >
            ➕
          </button>

          <img
            src="${product.img}"
            alt="${product.name}"
            onerror="this.src='images/no-image.jpg'"
          >

          <h4>
            ${product.name}
          </h4>

          <p>
            ₹${product.price}
          </p>

          <small>
            ${product.subcategory}
          </small>

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

/* ================= RENDER CART PAGE ================= */

function renderCartPage() {

  const container =
    document.getElementById("cart-items");

  const totalDiv =
    document.getElementById("cart-total");

  const emptyCart =
    document.getElementById("empty-cart");

  const summaryItems =
    document.getElementById("summary-items");

  if (!container) return;

  container.innerHTML = "";

  /* ================= EMPTY CART ================= */

  if (cart.length === 0) {

    if (emptyCart) {
      emptyCart.style.display = "block";
    }

    if (totalDiv) {
      totalDiv.innerHTML = "";
    }

    if (summaryItems) {
      summaryItems.innerHTML = "0";
    }

    return;

  } else {

    if (emptyCart) {
      emptyCart.style.display = "none";
    }
  }

  /* ================= CART ITEMS ================= */

  let total = 0;

  let totalQty = 0;

  cart.forEach((item, index) => {

    const subtotal =
      item.price * item.qty;

    total += subtotal;

    totalQty += item.qty;

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

  /* ================= UPDATE TOTAL ================= */

  if (totalDiv) {

    totalDiv.innerHTML =
      `₹${total}`;
  }

  /* ================= UPDATE ITEM COUNT ================= */

  if (summaryItems) {

    summaryItems.innerHTML =
      totalQty;
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

  if (!userMobile) {

    saveMobileNumber();

    if (!userMobile) return;
  }

  let total = 0;

  let message =
    "🛒 *New Order* \n\n";

  message +=
    `📱 Mobile: ${userMobile}\n\n`;

  cart.forEach(item => {

    const subtotal =
      item.price * item.qty;

    total += subtotal;

    message +=
      `📦 Product: ${item.name}\n` +
      `Qty: ${item.qty}\n` +
      `Price: ₹${item.price}\n` +
      `Subtotal: ₹${subtotal}\n\n`;
  });

  message +=
    `💰 Total Amount: ₹${total}`;

  const encodedMessage =
    encodeURIComponent(message);

  const phone =
    "919159842232";

  window.open(
    `https://wa.me/${phone}?text=${encodedMessage}`,
    "_blank"
  );

  clearCart();
}

/* ================= RAZORPAY PAYMENT ================= */

function payNow() {

  if (cart.length === 0) {

    alert("Your cart is empty");

    return;
  }

  if (!userMobile) {

    saveMobileNumber();

    if (!userMobile) return;
  }

  let total = 0;

  cart.forEach(item => {

    total += item.price * item.qty;
  });

  const options = {

    key: "rzp_live_SnUXDw3jo9tMFs",

    amount: total * 100,

    currency: "INR",

    name: "ShopMart",

    description: "ShopMart Order Payment",

    image: "images/logo.png",

    handler: function(response) {

      alert(
        "Payment Successful!\nPayment ID: " +
        response.razorpay_payment_id
      );

      sendPaymentWhatsApp(
        response.razorpay_payment_id,
        total
      );

      clearCart();
    },

    prefill: {

      name: "ShopMart Customer",

      email: "",

      contact: userMobile
    },

    notes: {

      mobile: userMobile
    },

    theme: {

      color: "#3399cc"
    }
  };

  const rzp =
    new Razorpay(options);

  rzp.open();
}

/* ================= SEND PAYMENT TO WHATSAPP ================= */

function sendPaymentWhatsApp(paymentId, total) {

  let message =
    "✅ *Payment Successful* \n\n";

  message +=
    `📱 Mobile: ${userMobile}\n\n`;

  cart.forEach(item => {

    message +=
      `📦 Product: ${item.name}\n` +
      `Qty: ${item.qty}\n` +
      `Price: ₹${item.price}\n\n`;
  });

  message +=
    `💰 Total Amount: ₹${total}\n\n`;

  message +=
    `🆔 Payment ID: ${paymentId}`;

  const encodedMessage =
    encodeURIComponent(message);

  const phone =
    "919159842232";

  window.open(
    `https://wa.me/${phone}?text=${encodedMessage}`,
    "_blank"
  );
}

/* ================= CLEAR CART ================= */

function clearCart() {

  cart = [];

  localStorage.removeItem("cart");

  updateCart();

  renderCartPage();
}

/* ================= LOAD PAGE ================= */

function loadPageData() {

  /* FLOWERS PAGE */

  if (
    document.getElementById("flowersCategories")
  ) {

    renderSubCategories(
      categoryData["flowers"],
      "flowersCategories"
    );
  }

  /* GROCERY PAGE */

  if (
    document.getElementById("groceryCategories")
  ) {

    renderSubCategories(
      categoryData["grocery"],
      "groceryCategories"
    );
  }

  /* DRY FRUITS PAGE */

  if (
    document.getElementById("dryfruitsCategories")
  ) {

    renderSubCategories(
      categoryData["dryfruits"],
      "dryfruitsCategories"
    );
  }

  /* GIFTS PAGE */

  if (
    document.getElementById("giftsCategories")
  ) {

    renderSubCategories(
      categoryData["gifts"],
      "giftsCategories"
    );
  }

  /* ELECTRONICS PAGE */

  if (
    document.getElementById("electronicsCategories")
  ) {

    renderSubCategories(
      categoryData["electronics"],
      "electronicsCategories"
    );
  }

  /* BIRTHDAY PAGE */

  if (
    document.getElementById("birthdayCategories")
  ) {

    renderSubCategories(
      categoryData["birthday"],
      "birthdayCategories"
    );
  }

  /* HOME PAGE */

  renderNewArrivals();

  updateCart();

  renderCartPage();

  /* SEARCH */

  setupGlobalSearch();
}

/* ================= GLOBAL SEARCH ================= */

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

      /* EMPTY */

      if (!query) {

        resultsBox.innerHTML = "";

        resultsBox.style.display = "none";

        return;
      }

      /* GET PRODUCTS */

      const allProducts =
        getAllProducts();

      /* FILTER ONLY NAMES */

      const matchedProducts =
        allProducts.filter(product => {

          return (
            product.name &&
            product.name
              .toLowerCase()
              .includes(query)
          );
        });

      /* REMOVE DUPLICATE NAMES */

      const uniqueNames = [];

      const used = new Set();

      matchedProducts.forEach(product => {

        const name =
          product.name.trim();

        if (!used.has(name)) {

          used.add(name);

          uniqueNames.push(product);
        }
      });

      /* LIMIT */

      const suggestions =
        uniqueNames.slice(0, 8);

      renderSearchSuggestions(
        suggestions,
        resultsBox
      );
    }
  );

  /* CLICK OUTSIDE */

  document.addEventListener(
    "click",
    function (e) {

      if (
        !searchInput.contains(e.target) &&
        !resultsBox.contains(e.target)
      ) {

        resultsBox.style.display = "none";
      }
    }
  );

  /* FOCUS */

  searchInput.addEventListener(
    "focus",
    function () {

      if (
        resultsBox.innerHTML.trim() !== ""
      ) {

        resultsBox.style.display = "block";
      }
    }
  );
}

/* ================= SEARCH SUGGESTIONS ================= */

function renderSearchSuggestions(products, container) {

  /* EMPTY */

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

    const safeName =
      product.name.replace(/'/g, "\\'");

    html += `

      <div
  class="search-suggestion"
  onclick="openProductPage(
    '${safeName}',
    ${product.price},
    '${product.img}',
    '${product.category}',
    '${product.subcategory}'
  )"
>

        <span class="search-icon">
          🔍
        </span>

        <span class="search-text">
          ${product.name}
        </span>

      </div>

    `;
  });

  container.innerHTML = html;

  container.style.display = "block";
}

/* ================= SHOW SEARCH PRODUCTS ================= */

function showSearchProducts(productName) {

  const resultsBox =
    document.getElementById("searchResults");

  const searchInput =
    document.getElementById("searchInput");

  searchInput.value = productName;

  const allProducts =
    getAllProducts();

  const filteredProducts =
    allProducts.filter(product => {

      return (
        product.name &&
        product.name
          .toLowerCase()
          .includes(
            productName.toLowerCase()
          )
      );
    });

  renderFullSearchResults(
    filteredProducts,
    resultsBox
  );
}

/* ================= FULL SEARCH RESULTS ================= */

function renderFullSearchResults(products, container) {

  if (!products.length) {

    container.innerHTML = `

      <div class="search-empty">

        No products found

      </div>

    `;

    return;
  }

  let html = "";

  products.forEach(product => {

    const safeName =
      product.name.replace(/'/g, "\\'");

    html += `

      <div
  class="search-item"
  onclick="openProductPage(
    '${safeName}',
    ${product.price},
    '${product.img}',
    '${product.category}',
    '${product.subcategory}'
  )"
>

        <img
          src="${product.img}"
          alt="${product.name}"
          onerror="this.src='images/no-image.jpg'"
        >

        <div class="search-info">

          <h4>
            ${product.name}
          </h4>

          <p>
            ₹${product.price}
          </p>

          <small>
            ${product.subcategory}
          </small>

        </div>

        <button
          class="search-add-btn"
          onclick="event.stopPropagation(); addToCart(
  '${safeName}',
  ${product.price},
  '${product.img}'
)"
        >
          ➕
        </button>

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

      if (!category.subcategories) return;

      category.subcategories.forEach(sub => {

        if (!sub.products) return;

        sub.products.forEach(product => {

          products.push({

  name:
    product.name || "No Name",

  price:
    product.price || 0,

  img:
    product.img ||
    "images/no-image.jpg",

  category:
    mainCategory || "",

  subcategory:
    sub.name || ""
});
        });
      });
    });
  });

  /* REMOVE DUPLICATES */

  const uniqueProducts = [];

  const seen = new Set();

  products.forEach(product => {

    const key =
      product.name + "-" + product.price;

    if (!seen.has(key)) {

      seen.add(key);

      uniqueProducts.push(product);
    }
  });

  return uniqueProducts;
}


/* ================= PRODUCT DETAILS PAGE ================= */

function openProductPage(name, price, img, category, subcategory) {

  const product = {

    name,
    price,
    img,
    category,
    subcategory
  };

  localStorage.setItem(
    "selectedProduct",
    JSON.stringify(product)
  );

  window.location.href =
    "product.html";
}

/* ================= LOAD PRODUCT DETAILS ================= */

function loadProductDetails() {

  const container =
    document.getElementById(
      "product-details"
    );

  if (!container) return;

  const product =
    JSON.parse(
      localStorage.getItem(
        "selectedProduct"
      )
    );

  if (!product) {

    container.innerHTML = `

      <div class="section">

        <h2>
          Product not found
        </h2>

      </div>
    `;

    return;
  }

  const safeName =
    product.name.replace(/'/g, "\\'");

  container.innerHTML = `

    <div class="product-details-container">

      <div class="product-details-image">

        <img
          src="${product.img}"
          alt="${product.name}"
          onerror="this.src='images/no-image.jpg'"
        >

      </div>

      <div class="product-details-info">

        <h1>
          ${product.name}
        </h1>

        <div class="product-price">
          ₹${product.price}
        </div>

        <div class="product-category">

          Category:
          ${product.category}

          <br><br>

          Subcategory:
          ${product.subcategory}

        </div>

        <div class="product-description">

          Premium quality product from ShopMart.

          Fresh and high-quality items available
          for fast delivery.

        </div>

        <div class="details-buttons">

          <button
            class="details-btn cart-btn"
            onclick="addToCart(
              '${safeName}',
              ${product.price},
              '${product.img}'
            )"
          >
            Add To Cart
          </button>

          <button
            class="details-btn buy-btn"
            onclick="buyNowSingleProduct(
              '${safeName}',
              ${product.price},
              '${product.img}'
            )"
          >
            Buy Now
          </button>

        </div>

      </div>

    </div>
  `;
}

/* ================= BUY NOW SINGLE PRODUCT ================= */

function buyNowSingleProduct(name, price, img) {

  cart = [];

  cart.push({

    name,
    price,
    img,
    qty: 1
  });

  updateCart();

  window.location.href =
    "cart.html";
}



/* ================= RENDER SEARCH RESULTS ================= */

function renderSearchResults(products, container) {

  /* NO RESULTS */

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

    const safeName =
      product.name.replace(/'/g, "\\'");

    html += `

      <div class="search-item">

        <img
          src="${product.img}"
          alt="${product.name}"
          onerror="this.src='images/no-image.jpg'"
        >

        <div class="search-info">

          <h4>
            ${product.name}
          </h4>

          <p>
            ₹${product.price}
          </p>

          <small>
            ${product.subcategory}
          </small>

        </div>

        <button
          class="search-add-btn"
          onclick="addToCart(
            '${safeName}',
            ${product.price},
            '${product.img}'
          )"
        >
          ➕
        </button>

      </div>
    `;
  });

  container.innerHTML = html;

  container.style.display = "block";
}



/* ================= FOUNDERS SLIDER ================= */

/* ================= FOUNDERS SLIDER ================= */

let currentSlide = 0;

function nextSlide() {

  const slides =
    document.querySelectorAll(".slide");

  if (slides.length === 0) return;

  /* REMOVE OLD CLASSES */

  slides.forEach((slide) => {

    slide.classList.remove("active", "exit");

  });

  /* CURRENT SLIDE EXIT */

  slides[currentSlide].classList.add("exit");

  /* NEXT SLIDE */

  currentSlide =
    (currentSlide + 1) % slides.length;

  /* SHOW NEXT */

  slides[currentSlide].classList.add("active");
}

/* ================= INITIALIZE ================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const slides =
      document.querySelectorAll(".slide");

    if (slides.length > 0) {

      slides[0].classList.add("active");

      /* AUTO SLIDE */

      setInterval(nextSlide, 3000);
    }
  }
);



/* ================= START ================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /* REMOVE AUTO LOGIN POPUP */

    // checkUserLogin();

    updateCart();

    renderCartPage();

    fetchSheetData();
  }
);