// ================= NEW ARRIVALS (SEPARATE DATA) =================

const newArrivals = [
  {
    category: "flowers",
    title: "🌸 Flowers New Arrivals",
    subcategories: [
      {
        name: "Jadai",
        products: [
          { name: "Jadai Premium", price: 400, img: "images/jadai.jpg" },
          { name: "Jadai Deluxe", price: 600, img: "images/jadai.jpg" }
        ]
      }
    ]
  },
  {
    category: "grocery",
    title: "🛒 Grocery New Arrivals",
    subcategories: [
      {
        name: "Oils",
        products: [
          { name: "Olive Oil", price: 250, img: "images/oil.jpg" },
          { name: "Groundnut Oil", price: 180, img: "images/oil.jpg" }
        ]
      }
    ]
  },
  {
    category: "dryfruits",
    title: "🥜 Dry Fruits New Arrivals",
    subcategories: [
      {
        name: "Premium Nuts",
        products: [
          { name: "Imported Almonds", price: 900, img: "images/almond.jpg" }
        ]
      }
    ]
  }
];

// ================= CATEGORY DATA =================

// FLOWERS
const flowerCategories = [
  {
    title: "👶 Baby Shower",
    subcategories: [
      {
        name: "Jadai",
        img: "images/jadai.jpg",
        products: [
          { name: "Jadai Small", price: 200, img: "images/jadai.jpg" },
          { name: "Jadai Premium", price: 400, img: "images/jadai.jpg" }
        ]
      },
      {
        name: "Malai",
        img: "images/malai.jpg",
        products: [
          { name: "Rose Malai", price: 300, img: "images/malai.jpg" },
          { name: "Jasmine Malai", price: 350, img: "images/malai.jpg" }
        ]
      }
    ]
  }
];

// GROCERY
const groceryCategories = [
  {
    title: "🌾 Dry Items",
    subcategories: [
      {
        name: "Grains",
        img: "images/rice.jpg",
        products: [
          { name: "Rice", price: 60, img: "images/rice.jpg" },
          { name: "Wheat", price: 50, img: "images/wheat.jpg" },
          { name: "Dal", price: 120, img: "images/dal.jpg" }
        ]
      }
    ]
  },
  {
    title: "🥬 Fresh / Wet",
    subcategories: [
      {
        name: "Vegetables",
        img: "images/veg.jpg",
        products: [
          { name: "Carrot", price: 40, img: "images/veg.jpg" },
          { name: "Tomato", price: 30, img: "images/veg.jpg" }
        ]
      }
    ]
  }
];

// DRY FRUITS
const dryfruitCategories = [
  {
    title: "🥜 Nuts",
    subcategories: [
      {
        name: "Premium Nuts",
        img: "images/almond.jpg",
        products: [
          { name: "Almonds", price: 700, img: "images/almond.jpg" },
          { name: "Cashew", price: 800, img: "images/cashew.jpg" }
        ]
      }
    ]
  }
];

// GIFTS
const giftCategories = [
  {
    title: "🎁 Combo Gifts",
    subcategories: [
      {
        name: "Combos",
        img: "images/choco.jpg",
        products: [
          { name: "Chocolate Combo", price: 499, img: "images/choco.jpg" },
          { name: "Flower + Cake Combo", price: 899, img: "images/combo.jpg" }
        ]
      }
    ]
  }
];

// ELECTRONICS
const electronicsCategories = [
  {
    title: "📱 Mobiles",
    subcategories: [
      {
        name: "Phones",
        img: "images/mobile.jpg",
        products: [
          { name: "Smartphone", price: 15000, img: "images/mobile.jpg" },
          { name: "Feature Phone", price: 2000, img: "images/mobile.jpg" }
        ]
      }
    ]
  }
];

// BIRTHDAY
const birthdayCategories = [
  {
    title: "🎂 Birthday Gifts",
    subcategories: [
      {
        name: "Cakes",
        img: "images/cake.jpg",
        products: [
          { name: "Birthday Cake", price: 600, img: "images/cake.jpg" },
          { name: "Gift Hamper", price: 1200, img: "images/hamper.jpg" }
        ]
      }
    ]
  }
];


// ================= CART =================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));

  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.innerText = totalQty;
  }
}

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  updateCart();
}

// ================= RENDER NEW ARRIVALS =================

function renderNewArrivals(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = "";

  newArrivals.forEach(cat => {

    html += `
      <div class="category-section">
        <h3>${cat.title}</h3>
        <div class="grid">
    `;

    cat.subcategories.forEach(sub => {
      sub.products.forEach(p => {

        const safeName = p.name.replace(/'/g, "\\'");

        html += `
          <div class="card">
            <button class="add-btn"
              onclick="addToCart('${safeName}', ${p.price})">➕</button>

            <img src="${p.img}">
            <h4>${p.name}</h4>
            <p>₹${p.price}</p>
            <small>${sub.name}</small>
          </div>
        `;
      });
    });

    html += `</div></div>`;
  });

  container.innerHTML = html;
}


// ================= RENDER SUBCATEGORIES =================

function renderSubCategories(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container || !data) return;

  container.innerHTML = "";

  data.forEach((cat, catIndex) => {
    let html = `
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

    html += `</div></div>`;
    container.innerHTML += html;
  });
}


// ================= SHOW PRODUCTS =================

function showProducts(containerId, catIndex, subIndex) {

  let dataMap = {
    flowersCategories: flowerCategories,
    groceryCategories: groceryCategories,
    dryfruitsCategories: dryfruitCategories,
    giftsCategories: giftCategories,
    electronicsCategories: electronicsCategories,
    birthdayCategories: birthdayCategories
  };

  const data = dataMap[containerId];
  if (!data) return;

  const container = document.getElementById(containerId);
  const sub = data[catIndex].subcategories[subIndex];

  let html = `
    <button onclick="goBack('${containerId}')">⬅ Back</button>
    <h3>${sub.name}</h3>
    <div class="grid">
  `;

  sub.products.forEach(p => {
    const safeName = p.name.replace(/'/g, "\\'");

    html += `
      <div class="card">
        <button class="add-btn"
          onclick="addToCart('${safeName}', ${p.price})">➕</button>

        <img src="${p.img}">
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}


// ================= BACK FUNCTION =================

function goBack(containerId) {

  const dataMap = {
    flowersCategories: flowerCategories,
    groceryCategories: groceryCategories,
    dryfruitsCategories: dryfruitCategories,
    giftsCategories: giftCategories,
    electronicsCategories: electronicsCategories,
    birthdayCategories: birthdayCategories
  };

  renderSubCategories(dataMap[containerId], containerId);
}


// ================= PAGE LOAD =================

document.addEventListener("DOMContentLoaded", () => {

  if (document.getElementById("flowersCategories")) {
    renderSubCategories(flowerCategories, "flowersCategories");
  }

  if (document.getElementById("groceryCategories")) {
    renderSubCategories(groceryCategories, "groceryCategories");
  }

  if (document.getElementById("dryfruitsCategories")) {
    renderSubCategories(dryfruitCategories, "dryfruitsCategories");
  }

  if (document.getElementById("giftsCategories")) {
    renderSubCategories(giftCategories, "giftsCategories");
  }

  if (document.getElementById("electronicsCategories")) {
    renderSubCategories(electronicsCategories, "electronicsCategories");
  }

  if (document.getElementById("birthdayCategories")) {
    renderSubCategories(birthdayCategories, "birthdayCategories");
  }
  
  

  // 🔥 NEW ARRIVALS (MAIN FEATURE)
  renderNewArrivals("new-arrivals");



  updateCart();
});