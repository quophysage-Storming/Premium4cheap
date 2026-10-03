// UI Elements Toggles
let searchForm = document.querySelector('.search-form');
let searchBox = document.querySelector('#search-box');

if (document.querySelector('#search-btn')) {
  document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active');
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
  setTimeout(loader, 300);
}

// Ensure loader is hidden quickly on DOMContentLoaded and fallback timeout
document.addEventListener('DOMContentLoaded', () => {
  fadeOut();
});

setTimeout(loader, 800);

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
  const itemKey = `${product.id}-${product.plan || 'default'}`;
  const existingIndex = cart.findIndex((item) => item.key === itemKey);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      key: itemKey,
      id: product.id,
      name: product.name,
      plan: product.plan || '',
      price: parseFloat(product.price),
      image: product.image,
      quantity: 1,
    });
  }
  saveCart();
  const label = product.plan ? ` (${product.plan})` : '';
  showNotification(`Added "${product.name}${label}" to cart!`);
}

function removeFromCart(key) {
  cart = cart.filter((item) => item.key !== key && item.id !== key);
  saveCart();
}

function changeQuantity(key, delta) {
  const item = cart.find((i) => i.key === key || i.id === key);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(key);
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
    totalPriceEl.innerText = 'GH₵0.00';
    return;
  }

  let total = 0;
  let html = '';

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    const planLabel = item.plan ? ` <span style="font-size:1.2rem; color:#e74c3c;">(${item.plan})</span>` : '';
    const itemKey = item.key || item.id;
    html += `
      <div class="cart-item" data-key="${itemKey}">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h4>${item.name}${planLabel}</h4>
          <div class="cart-item-price">GH₵${item.price.toFixed(2)}</div>
          <div class="cart-item-qty">
            <button class="qty-btn minus" onclick="changeQuantity('${itemKey}', -1)">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn plus" onclick="changeQuantity('${itemKey}', 1)">+</button>
          </div>
        </div>
        <div class="cart-item-remove" onclick="removeFromCart('${itemKey}')" title="Remove">
          <i class="fas fa-trash"></i>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  totalPriceEl.innerText = `GH₵${total.toFixed(2)}`;
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

  // Handle plan dropdown selection changes on product cards
  document.addEventListener('change', (e) => {
    if (e.target.classList.contains('plan-dropdown')) {
      const card = e.target.closest('.product-card');
      if (card) {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const price = selectedOption.getAttribute('data-price');
        const priceDisplay = card.querySelector('.card-price');
        if (priceDisplay) {
          priceDisplay.innerText = `GH₵${price}`;
        }
      }
    }
  });

  // Event Delegation for "Add to Cart" buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (btn) {
      e.preventDefault();
      const card = btn.closest('.product-card');
      if (card) {
        const dropdown = card.querySelector('.plan-dropdown');
        const selectedOption = dropdown ? dropdown.options[dropdown.selectedIndex] : null;
        const planName = selectedOption ? selectedOption.getAttribute('data-plan') : 'Standard';
        const price = selectedOption ? selectedOption.getAttribute('data-price') : '50';

        const product = {
          id: card.getAttribute('data-id'),
          name: card.getAttribute('data-base-name') || 'Subscription',
          plan: planName,
          price: price,
          image: card.getAttribute('data-image'),
        };
        addToCart(product);
      }
    }

    // Deal Combo Pass button handler
    const dealBtn = e.target.closest('.deal-add-to-cart-btn');
    if (dealBtn) {
      e.preventDefault();
      const product = {
        id: dealBtn.getAttribute('data-id'),
        name: dealBtn.getAttribute('data-name'),
        plan: dealBtn.getAttribute('data-plan'),
        price: dealBtn.getAttribute('data-price'),
        image: dealBtn.getAttribute('data-image'),
      };
      addToCart(product);
    }
  });

  // Quick View triggers (clicking product image)
  document.addEventListener('click', (e) => {
    const imageContainer = e.target.closest('.product-card .image');
    if (imageContainer) {
      const card = imageContainer.closest('.product-card');
      if (card) {
        openQuickView(card);
      }
    }
  });

  // Quick view add to cart
  const qvAddToCartBtn = document.querySelector('#qv-add-to-cart-btn');
  if (qvAddToCartBtn) {
    qvAddToCartBtn.onclick = () => {
      if (currentQuickViewProduct) {
        const qvPlanSelect = document.querySelector('#qv-plan-select');
        const selectedOpt = qvPlanSelect ? qvPlanSelect.options[qvPlanSelect.selectedIndex] : null;

        const fullProduct = {
          id: currentQuickViewProduct.id,
          name: currentQuickViewProduct.name,
          plan: selectedOpt ? selectedOpt.getAttribute('data-plan') : '',
          price: selectedOpt ? selectedOpt.getAttribute('data-price') : '50',
          image: currentQuickViewProduct.image,
        };
        addToCart(fullProduct);
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

function openQuickView(card) {
  const baseName = card.getAttribute('data-base-name') || 'Subscription';
  const image = card.getAttribute('data-image');
  const desc = card.getAttribute('data-desc');
  const dropdown = card.querySelector('.plan-dropdown');

  document.querySelector('#qv-img').src = image;
  document.querySelector('#qv-title').innerText = baseName;
  document.querySelector('#qv-desc').innerText = desc || 'Premium subscription service with instant account delivery.';

  const qvPlanSelect = document.querySelector('#qv-plan-select');
  if (qvPlanSelect && dropdown) {
    qvPlanSelect.innerHTML = dropdown.innerHTML;
    const selectedOption = qvPlanSelect.options[qvPlanSelect.selectedIndex];
    document.querySelector('#qv-price').innerText = `GH₵${selectedOption.getAttribute('data-price')}`;

    qvPlanSelect.onchange = () => {
      const opt = qvPlanSelect.options[qvPlanSelect.selectedIndex];
      document.querySelector('#qv-price').innerText = `GH₵${opt.getAttribute('data-price')}`;
    };
  }

  currentQuickViewProduct = {
    id: card.getAttribute('data-id'),
    name: baseName,
    image: image,
  };

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
    const planText = item.plan ? ` (${item.plan})` : '';
    html += `
      <div class="checkout-item-line">
        <span>${item.name}${planText} (x${item.quantity})</span>
        <span>GH₵${itemTotal.toFixed(2)}</span>
      </div>
    `;
  });

  summaryContainer.innerHTML = html;
  totalAmountEl.innerText = `GH₵${total.toFixed(2)}`;
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
        const name = card.getAttribute('data-base-name') || 'Subscription';
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
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach((card) => {
      const productName = (card.getAttribute('data-base-name') || '').toLowerCase();
      if (productName.includes(query)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
}
