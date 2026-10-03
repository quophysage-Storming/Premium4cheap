// UI Elements Toggles
let searchForm = document.querySelector('.search-form');
let searchBox = document.querySelector('#search-box');

if (document.querySelector('#search-btn')) {
  document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active');
  };
}

let loginForm = document.querySelector('.login-form-container');

if (document.querySelector('#login-btn')) {
  document.querySelector('#login-btn').onclick = () => {
    loginForm.classList.toggle('active');
  };
}

if (document.querySelector('#close-login-btn')) {
  document.querySelector('#close-login-btn').onclick = () => {
    loginForm.classList.remove('active');
  };
}

// Window Scroll & Load Events
window.onscroll = () => {
  if (searchForm) searchForm.classList.remove('active');

  if (window.scrollY > 80) {
    document.querySelector('.header .header-2')?.classList.add('active');
  } else {
    document.querySelector('.header .header-2')?.classList.remove('active');
  }
};

window.onload = () => {
  if (window.scrollY > 80) {
    document.querySelector('.header .header-2')?.classList.add('active');
  } else {
    document.querySelector('.header .header-2')?.classList.remove('active');
  }

  fadeOut();
  initCartUI();
  initWishlistUI();
};

function loader() {
  let loaderEl = document.querySelector('.loader-container');
  if (loaderEl) {
    loaderEl.classList.add('active');
  }
}

function fadeOut() {
  setTimeout(loader, 800);
}

// Swiper Sliders Initialization
var booksSwiper = new Swiper('.books-slider', {
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

var featuredSwiper = new Swiper('.featured-slider', {
  spaceBetween: 15,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    450: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 4 },
  },
});

var arrivalsSwiper = new Swiper('.arrivals-slider', {
  spaceBetween: 15,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

var reviewsSwiper = new Swiper('.reviews-slider', {
  spaceBetween: 15,
  grabCursor: true,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

var blogsSwiper = new Swiper('.blogs-slider', {
  spaceBetween: 15,
  grabCursor: true,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

// ==========================================
// E-COMMERCE SHOPPING CART & SELLING SYSTEM
// ==========================================

let cart = JSON.parse(localStorage.getItem('fx_sub_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('fx_sub_wishlist')) || [];
let currentQuickViewProduct = null;

function saveCart() {
  localStorage.setItem('fx_sub_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCart();
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badge) {
    badge.innerText = totalCount;
    badge.style.display = totalCount > 0 ? 'inline-block' : 'none';
  }
}

function addToCart(product) {
  const existingIndex = cart.findIndex((item) => item.id === product.id);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image,
      quantity: 1,
    });
  }
  saveCart();
  showNotification(`Added "${product.name}" to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
}

function changeQuantity(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      saveCart();
    }
  }
}

function renderCart() {
  const container = document.querySelector('.cart-items-container');
  const totalPriceEl = document.querySelector('#cart-total-price');
  if (!container || !totalPriceEl) return;

  if (cart.length === 0) {
    container.innerHTML = `<div class="empty-cart-msg"><i class="fas fa-shopping-basket"></i><p>Your cart is empty.</p></div>`;
    totalPriceEl.innerText = '$0.00';
    return;
  }

  let total = 0;
  let html = '';

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    html += `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="cart-item-qty">
            <button class="qty-btn minus" onclick="changeQuantity('${item.id}', -1)">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn plus" onclick="changeQuantity('${item.id}', 1)">+</button>
          </div>
        </div>
        <div class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove">
          <i class="fas fa-trash"></i>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  totalPriceEl.innerText = `$${total.toFixed(2)}`;
}

// Notification Toast
function showNotification(message) {
  const existingToast = document.querySelector('.shop-toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = 'shop-toast';
  toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Initialize Cart Event Listeners
function initCartUI() {
  const cartBtn = document.querySelector('#cart-btn');
  const cartModalContainer = document.querySelector('.cart-modal-container');
  const closeCartBtn = document.querySelector('#close-cart-btn');
  const clearCartBtn = document.querySelector('#clear-cart-btn');

  if (cartBtn) {
    cartBtn.onclick = (e) => {
      e.preventDefault();
      renderCart();
      cartModalContainer?.classList.add('active');
    };
  }

  if (closeCartBtn) {
    closeCartBtn.onclick = () => {
      cartModalContainer?.classList.remove('active');
    };
  }

  if (clearCartBtn) {
    clearCartBtn.onclick = () => {
      if (cart.length > 0 && confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
      }
    };
  }

  // Event Delegation for "Add to Cart" buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (btn) {
      e.preventDefault();
      const card = btn.closest('[data-id]') || btn;
      const product = {
        id: card.getAttribute('data-id') || btn.getAttribute('data-id') || 'sub-' + Date.now(),
        name: card.getAttribute('data-name') || btn.getAttribute('data-name') || 'Subscription Item',
        price: card.getAttribute('data-price') || btn.getAttribute('data-price') || '4.99',
        image: card.getAttribute('data-image') || btn.getAttribute('data-image') || 'image/IMG_4277.webp',
      };
      addToCart(product);
    }
  });

  // Quick View triggers
  document.addEventListener('click', (e) => {
    const qvTrigger = e.target.closest('.quick-view-trigger');
    if (qvTrigger) {
      e.preventDefault();
      const card = qvTrigger.closest('[data-id]');
      if (card) {
        openQuickView({
          id: card.getAttribute('data-id'),
          name: card.getAttribute('data-name'),
          price: card.getAttribute('data-price'),
          image: card.getAttribute('data-image'),
          desc: card.getAttribute('data-desc'),
        });
      }
    }
  });

  // Quick view add to cart
  const qvAddToCartBtn = document.querySelector('#qv-add-to-cart-btn');
  if (qvAddToCartBtn) {
    qvAddToCartBtn.onclick = () => {
      if (currentQuickViewProduct) {
        addToCart(currentQuickViewProduct);
        document.querySelector('.quick-view-modal-container')?.classList.remove('active');
      }
    };
  }

  const closeQvBtn = document.querySelector('#close-quickview-btn');
  if (closeQvBtn) {
    closeQvBtn.onclick = () => {
      document.querySelector('.quick-view-modal-container')?.classList.remove('active');
    };
  }

  // Checkout modal
  const openCheckoutBtn = document.querySelector('#open-checkout-btn');
  const checkoutModal = document.querySelector('.checkout-modal-container');
  const closeCheckoutBtn = document.querySelector('#close-checkout-btn');
  const checkoutForm = document.querySelector('#checkout-form');

  if (openCheckoutBtn) {
    openCheckoutBtn.onclick = () => {
      if (cart.length === 0) {
        alert('Your cart is empty! Please add subscriptions to cart first.');
        return;
      }
      cartModalContainer?.classList.remove('active');
      renderCheckoutSummary();
      checkoutModal?.classList.add('active');
    };
  }

  if (closeCheckoutBtn) {
    closeCheckoutBtn.onclick = () => {
      checkoutModal?.classList.remove('active');
    };
  }

  if (checkoutForm) {
    checkoutForm.onsubmit = (e) => {
      e.preventDefault();
      const name = document.querySelector('#checkout-name').value;
      const email = document.querySelector('#checkout-email').value;

      alert(`Thank you for your order, ${name}!\n\nYour subscription activation details have been dispatched to ${email}.\nOrder status: CONFIRMED`);

      cart = [];
      saveCart();
      checkoutForm.reset();
      checkoutModal?.classList.remove('active');
    };
  }

  updateCartBadge();
  renderCart();
}

function openQuickView(product) {
  currentQuickViewProduct = product;
  document.querySelector('#qv-img').src = product.image;
  document.querySelector('#qv-title').innerText = product.name;
  document.querySelector('#qv-price').innerText = `$${parseFloat(product.price).toFixed(2)}`;
  document.querySelector('#qv-desc').innerText = product.desc || 'Premium subscription service with instant account delivery.';
  document.querySelector('.quick-view-modal-container')?.classList.add('active');
}

function renderCheckoutSummary() {
  const summaryContainer = document.querySelector('#checkout-items-summary');
  const totalAmountEl = document.querySelector('#checkout-total-amount');

  if (!summaryContainer || !totalAmountEl) return;

  let total = 0;
  let html = '';

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    html += `
      <div class="checkout-item-line">
        <span>${item.name} (x${item.quantity})</span>
        <span>$${itemTotal.toFixed(2)}</span>
      </div>
    `;
  });

  summaryContainer.innerHTML = html;
  totalAmountEl.innerText = `$${total.toFixed(2)}`;
}

// Wishlist System
function initWishlistUI() {
  updateWishlistBadge();

  document.addEventListener('click', (e) => {
    const heartBtn = e.target.closest('.wishlist-trigger');
    if (heartBtn) {
      e.preventDefault();
      const card = heartBtn.closest('[data-id]');
      if (card) {
        const id = card.getAttribute('data-id');
        const name = card.getAttribute('data-name');
        if (wishlist.includes(id)) {
          wishlist = wishlist.filter((item) => item !== id);
          heartBtn.style.color = '';
          showNotification(`Removed "${name}" from Wishlist.`);
        } else {
          wishlist.push(id);
          heartBtn.style.color = '#e74c3c';
          showNotification(`Saved "${name}" to Wishlist!`);
        }
        localStorage.setItem('fx_sub_wishlist', JSON.stringify(wishlist));
        updateWishlistBadge();
      }
    }
  });
}

function updateWishlistBadge() {
  const badge = document.querySelector('.wishlist-badge');
  if (badge) {
    badge.innerText = wishlist.length;
    badge.style.display = wishlist.length > 0 ? 'inline-block' : 'none';
  }
}

// Search Filter Functionality
if (searchBox) {
  searchBox.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const productCards = document.querySelectorAll('[data-name]');

    productCards.forEach((card) => {
      const productName = card.getAttribute('data-name').toLowerCase();
      if (productName.includes(query)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
}
