const products = [
  { id: 1, name: "Ноутбук Lenovo IdeaPad 5", price: 24500, category: "Ноутбуки", inStock: true },
  { id: 2, name: "Смартфон Samsung Galaxy A55", price: 16999, category: "Смартфони", inStock: true },
  { id: 3, name: "Навушники Sony WH-CH720N", price: 4200, category: "Аудіо", inStock: true },
  { id: 4, name: "Миша Logitech G102", price: 1199, category: "Периферія", inStock: false },
  { id: 5, name: "Монітор Dell 24 IPS", price: 6800, category: "Монітори", inStock: true },
  { id: 6, name: "Клавіатура Keychron K2", price: 3900, category: "Периферія", inStock: true },
  { id: 7, name: "Смартфон Apple iPhone 15", price: 34999, category: "Смартфони", inStock: false },
  { id: 8, name: "Колонка JBL Flip 6", price: 4800, category: "Аудіо", inStock: true }
];

let cart = [];
let currentCategory = "all";

const productsList = document.querySelector("#products-list");
const totalPriceEl = document.querySelector("#total-price");
const cartCountEl = document.querySelector("#cart-count");
const cartListEl = document.querySelector("#cart-list");
const cartTotalEl = document.querySelector("#cart-total");
const filtersBox = document.querySelector("#category-filters");
const addForm = document.querySelector("#add-product-form");

function updateTotalWarehousePrice(items) {
  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    sum += items[i].price;
  }
  totalPriceEl.textContent = sum + " грн";
}

function renderProducts(list) {
  productsList.innerHTML = "";

  list.forEach(function (item) {
    const card = document.createElement("div");
    card.classList.add("product-card");

    if (!item.inStock) {
      card.classList.add("out-of-stock");
    }

    const categoryEl = document.createElement("span");
    categoryEl.classList.add("card-category");
    categoryEl.textContent = item.category;

    const titleEl = document.createElement("h3");
    titleEl.classList.add("card-title");
    titleEl.textContent = item.name;

    const priceEl = document.createElement("div");
    priceEl.classList.add("card-price");
    priceEl.textContent = item.price + " грн";

    card.append(categoryEl, titleEl, priceEl);

    if (!item.inStock) {
      const stockText = document.createElement("div");
      stockText.classList.add("stock-label");
      stockText.textContent = "Немає в наявності";
      card.append(stockText);
    }

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.classList.add("btn-add");
    addBtn.textContent = "Додати в кошик";
    addBtn.dataset.id = item.id;

    if (!item.inStock) {
      addBtn.disabled = true;
    }

    card.append(addBtn);
    productsList.append(card);
  });

  updateTotalWarehousePrice(list);
}

function renderCart() {
  cartCountEl.textContent = cart.length;
  cartListEl.innerHTML = "";

  if (cart.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.classList.add("empty-msg");
    emptyLi.textContent = "Кошик поки порожній";
    cartListEl.append(emptyLi);
    cartTotalEl.textContent = "0 грн";
    return;
  }

  let totalCartSum = 0;

  cart.forEach(function (item, index) {
    totalCartSum += item.price;

    const li = document.createElement("li");
    li.classList.add("cart-item");

    const info = document.createElement("span");
    info.textContent = item.name + " — " + item.price + " грн";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.classList.add("btn-remove");
    removeBtn.textContent = "Видалити";
    removeBtn.dataset.index = index;

    li.append(info, removeBtn);
    cartListEl.append(li);
  });

  cartTotalEl.textContent = totalCartSum + " грн";
}

function getFilteredProducts() {
  if (currentCategory === "all") {
    return products;
  }
  return products.filter(function (item) {
    return item.category === currentCategory;
  });
}

productsList.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-add")) {
    const productId = Number(event.target.dataset.id);
    const found = products.find(function (item) {
      return item.id === productId;
    });

    if (found && found.inStock) {
      cart.push(found);
      renderCart();
    }
  }
});

cartListEl.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-remove")) {
    const index = Number(event.target.dataset.index);
    cart.splice(index, 1);
    renderCart();
  }
});

filtersBox.addEventListener("click", function (event) {
  if (!event.target.classList.contains("filter-btn")) {
    return;
  }

  const allButtons = filtersBox.querySelectorAll(".filter-btn");
  allButtons.forEach(function (btn) {
    btn.classList.remove("active");
  });

  event.target.classList.add("active");
  currentCategory = event.target.dataset.category;

  renderProducts(getFilteredProducts());
});

addForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const nameInput = document.querySelector("#prod-name");
  const priceInput = document.querySelector("#prod-price");
  const categoryInput = document.querySelector("#prod-category");
  const stockInput = document.querySelector("#prod-stock");

  const newProduct = {
    id: Date.now(),
    name: nameInput.value.trim(),
    price: Number(priceInput.value),
    category: categoryInput.value,
    inStock: stockInput.checked
  };

  if (!newProduct.name || newProduct.price <= 0) {
    return;
  }

  products.push(newProduct);
  addForm.reset();
  stockInput.checked = true;

  renderProducts(getFilteredProducts());
});

renderProducts(products);
renderCart();