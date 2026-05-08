/* ================= API ================= */

const API_URL =
  "https://opensheet.elk.sh/1SzJ6PfHvEEJSkRN-Ne5uEVmOLrbst0OfdyPqVwRzkO8/Sheet2";

/* ================= STORAGE ================= */

let categoryData = {};
let newArrivalData = [];

let cart =
  JSON.parse(localStorage.getItem("cart")) || [];

/* ================= SUBCATEGORY IMAGES ================= */
/*
FORMAT:

mainCategory -> categoryTitle -> subCategory

Example:
flowers -> 👶 Baby Shower -> Jadai
*/

const subCategoryImages = {

  flowers: {

    "👶 baby shower": {

      jadai:
        "https://drive.google.com/thumbnail?id=1BEMBYPUInCoRA45PhERvyEXi6PVUb47J&sz=w1000",

       decoration:
        "https://drive.google.com/thumbnail?id=1BEMBYPUInCoRA45PhERvyEXi6PVUb47J&sz=w1000",

      malai:
        "https://drive.google.com/thumbnail?id=1jfNmjOg-pk9LdF3XOPeNrpPI3xudmcbJ&sz=w1000"
    },

 "👶  Puberty": {

      jadai:
        "https://drive.google.com/thumbnail?id=1BEMBYPUInCoRA45PhERvyEXi6PVUb47J&sz=w1000",

       decoration:
        "https://drive.google.com/thumbnail?id=1BEMBYPUInCoRA45PhERvyEXi6PVUb47J&sz=w1000",

      malai:
        "https://drive.google.com/thumbnail?id=1jfNmjOg-pk9LdF3XOPeNrpPI3xudmcbJ&sz=w1000"
    },


    "💍 engagement": {

      malai:
        "https://drive.google.com/thumbnail?id=1jfNmjOg-pk9LdF3XOPeNrpPI3xudmcbJ&sz=w1000",

      decoration:
        "https://drive.google.com/thumbnail?id=1BEMBYPUInCoRA45PhERvyEXi6PVUb47J&sz=w1000",

      jadai:
        "https://drive.google.com/thumbnail?id=1BEMBYPUInCoRA45PhERvyEXi6PVUb47J&sz=w1000"
    }
  },

  grocery: {

    "🌾 dry items": {

      grains:
        "https://drive.google.com/thumbnail?id=1jfNmjOg-pk9LdF3XOPeNrpPI3xudmcbJ&sz=w1000",

      oils:
        "https://drive.google.com/thumbnail?id=1jfNmjOg-pk9LdF3XOPeNrpPI3xudmcbJ&sz=w1000"
    }
  },

  dryfruits: {

    "🌾 dry items": {

      guni:
        "https://drive.google.com/thumbnail?id=1jfNmjOg-pk9LdF3XOPeNrpPI3xudmcbJ&sz=w1000"
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

    console.log("SHEET:", rows);

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

  console.log("CATEGORY DATA:", categoryData);

  console.log("NEW ARRIVAL DATA:", newArrivalData);

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

function addToCart(name, price, img = "") {

  const existing =
    cart.find(
      item => item.name === name
    );

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

  updateCart();
}

/* ================= START ================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateCart();

    fetchSheetData();
  }
);