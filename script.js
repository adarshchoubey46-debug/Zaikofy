/* ============================================================
   ZAIKOFY — script.js
   Features: Persistent Cart · Favorites · Search & Filter ·
             Category Tabs · Daily Special Countdown ·
             Combo Meals · Customizations · Skeleton Loaders ·
             Fly-to-Cart Animation · Dark/Light Mode ·
             Order History · Admin Panel · Revenue Tracker ·
             Order Tracking · WhatsApp Integration
============================================================ */

/* ============================================================
   MENU DATA
============================================================ */
let MENU = [
  {
    id: 1, name: "Paneer Butter Masala", price: 250,
    category: "VEG", mealtime: "Lunch",
    img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=80",
    desc: "Soft cottage cheese cubes simmered in a rich, velvety tomato-butter gravy. Slow-cooked with whole spices and finished with fresh cream."
  },
  {
    id: 2, name: "Dal Tadka", price: 150,
    category: "VEG", mealtime: "Lunch",
    img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
    desc: "Comfort in a bowl — yellow lentils tempered with cumin, garlic, dried chili and ghee. A staple of every loving household."
  },
  {
    id: 3, name: "Aloo Paratha", price: 80,
    category: "VEG", mealtime: "Breakfast",
    img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
    desc: "Flaky whole-wheat flatbread stuffed with spiced mashed potatoes. Served hot with white butter and homemade achaar."
  },
  {
    id: 4, name: "Chicken Curry", price: 320,
    category: "NON-VEG", mealtime: "Dinner",
    img: "https://images.unsplash.com/photo-1604908177522-429cbe3f82c2?w=600&q=80",
    desc: "Bone-in chicken pieces slow-braised in an aromatic onion-tomato masala. A recipe passed down through generations."
  },
  {
    id: 5, name: "Rajma Chawal", price: 180,
    category: "VEG", mealtime: "Lunch",
    img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
    desc: "Creamy kidney beans in a thick, spiced gravy served with steamed basmati rice. The ultimate Delhi comfort meal."
  },
  {
    id: 6, name: "Gajar Halwa", price: 120,
    category: "SWEET", mealtime: "Sweets",
    img: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&q=80",
    desc: "Slow-cooked carrot pudding with full-fat milk, sugar, ghee and garnished with roasted cashews and raisins."
  },
  {
    id: 7, name: "Poha", price: 60,
    category: "VEG", mealtime: "Breakfast",
    img: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80",
    desc: "Flattened rice tossed with mustard seeds, curry leaves, onion, peanuts and fresh coriander. A light morning delight."
  },
  {
    id: 8, name: "Samosa (2 pcs)", price: 40,
    category: "VEG", mealtime: "Snacks",
    img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80",
    desc: "Crispy golden pastry filled with spiced potato and peas. Served with mint chutney and tamarind sauce."
  },
  {
    id: 9, name: "Dal + Roti + Rice Combo", price: 199,
    category: "COMBO", mealtime: "Lunch",
    img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80",
    desc: "The complete thali deal — Dal Tadka + 2 Rotis + Steamed Rice. Best value for a wholesome homemade meal."
  },
  {
    id: 10, name: "Paneer + Paratha Combo", price: 280,
    category: "COMBO", mealtime: "Dinner",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    desc: "Paneer Butter Masala paired with 2 Aloo Parathas and a side of raita. A match made in food heaven."
  },
  {
    id: 11, name: "Mutton Rogan Josh", price: 420,
    category: "NON-VEG", mealtime: "Dinner",
    img: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=600&q=80",
    desc: "Tender mutton slow-cooked in a Kashmiri-style deep red gravy with whole spices, fennel and yogurt."
  },
  {
    id: 12, name: "Kheer", price: 90,
    category: "SWEET", mealtime: "Sweets",
    img: "https://images.unsplash.com/photo-1567575584290-7e9386a74e12?w=600&q=80",
    desc: "Traditional rice pudding simmered in full-fat milk, sweetened with sugar, flavored with cardamom and rose water."
  }
];

const DAILY_SPECIAL = { itemId: 1, discountedPrice: 220, chefNote: "Chef's pick — extra creamy today!" };

/* ============================================================
   STATE
============================================================ */
let cart         = JSON.parse(localStorage.getItem('zaikofy_cart'))         || [];
let favorites    = JSON.parse(localStorage.getItem('zaikofy_favs'))         || [];
let orderHistory = JSON.parse(localStorage.getItem('zaikofy_orders'))       || [];
let adminOrders  = JSON.parse(localStorage.getItem('zaikofy_admin_orders')) || [];

let currentItem    = null;
let currentQty     = 1;
let activeFilter   = 'all';
let activeCategory = 'all';
let toastTimer     = null;
let adminUnlocked  = false;

/* ============================================================
   INIT
============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  const savedMenu = localStorage.getItem('zaikofy_menu');
  if (savedMenu) MENU = JSON.parse(savedMenu);

  // Show skeletons briefly, then real cards
  setTimeout(renderMenu, 700);

  updateCartBadge();
  startCountdown();
  initSpecialBanner();

  document.querySelectorAll('.page').forEach(p => {
    if (!p.classList.contains('active')) p.style.display = 'none';
  });

  const savedTheme = localStorage.getItem('zaikofy_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.getElementById('themeBtn').textContent = savedTheme === 'dark' ? '🌙' : '☀️';
});

/* ============================================================
   THEME
============================================================ */
function toggleTheme() {
  const html   = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('zaikofy_theme', next);
  document.getElementById('themeBtn').textContent = next === 'dark' ? '🌙' : '☀️';
  showToast(next === 'dark' ? '🌙 Dark mode on' : '☀️ Light mode on');
}

/* ============================================================
   PAGE NAVIGATION
============================================================ */
function goTo(pageId) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  const page = document.getElementById(pageId);
  page.style.display = 'block';
  setTimeout(() => page.classList.add('active'), 10);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (pageId === 'pg-history') renderHistory();
}

/* ============================================================
   RENDER MENU
============================================================ */
function renderMenu() {
  const grid      = document.getElementById('menuGrid');
  const noResults = document.getElementById('noResults');
  const searchVal = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();

  const filtered = MENU.filter(item => {
    const matchFilter   = activeFilter   === 'all' || item.category === activeFilter;
    const matchCategory = activeCategory === 'all' || item.mealtime === activeCategory;
    const matchSearch   = !searchVal ||
      item.name.toLowerCase().includes(searchVal) ||
      item.desc.toLowerCase().includes(searchVal);
    return matchFilter && matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }
  noResults.style.display = 'none';

  grid.innerHTML = filtered.map((item, idx) => `
    <div class="menu-card" style="animation-delay:${idx * 0.055}s" onclick="openProduct(${item.id})">
      <div class="card-img-wrap">
        <img src="${item.img}" alt="${item.name}"
          onerror="this.src='https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80'">
        <span class="card-badge">${item.category}</span>
        <button class="fav-btn" onclick="event.stopPropagation(); toggleFav(${item.id}, this)"
          title="Favourite">
          ${favorites.includes(item.id) ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="card-body">
        <h3>${item.name}</h3>
        <p class="card-desc">${item.desc.substring(0, 72)}…</p>
        <div class="card-footer">
          <span class="card-price">₹${item.price}</span>
          <button class="add-btn" onclick="event.stopPropagation(); quickAddToCart(${item.id}, event)" title="Add to cart">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ============================================================
   SEARCH & FILTER
============================================================ */
function filterMenu() {
  const val = document.getElementById('searchInput').value;
  document.getElementById('clearSearch').style.display = val ? 'block' : 'none';
  renderMenu();
}

function clearSearchInput() {
  document.getElementById('searchInput').value = '';
  document.getElementById('clearSearch').style.display = 'none';
  renderMenu();
}

function setFilter(filter, el) {
  activeFilter = filter;
  document.querySelectorAll('.fchip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderMenu();
}

function setCategory(cat, el) {
  activeCategory = cat;
  document.querySelectorAll('.ctab').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderMenu();
}

function resetFilters() {
  activeFilter = activeCategory = 'all';
  document.querySelectorAll('.fchip').forEach((c, i) => c.classList.toggle('active', i === 0));
  document.querySelectorAll('.ctab').forEach((c, i) => c.classList.toggle('active', i === 0));
  clearSearchInput();
}

/* ============================================================
   FAVORITES
============================================================ */
function toggleFav(id, btn) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
    if (btn) btn.textContent = '🤍';
    showToast('Removed from favorites');
  } else {
    favorites.push(id);
    if (btn) btn.textContent = '❤️';
    showToast('Added to favorites ❤️');
  }
  localStorage.setItem('zaikofy_favs', JSON.stringify(favorites));
  const large = document.getElementById('pFavBtn');
  if (large && currentItem && currentItem.id === id) {
    large.textContent = favorites.includes(id) ? '❤️' : '🤍';
  }
}

function toggleFavFromProduct() {
  if (!currentItem) return;
  toggleFav(currentItem.id, document.getElementById('pFavBtn'));
  renderMenu();
}

/* ============================================================
   PRODUCT PAGE
============================================================ */
function openProduct(id) {
  currentItem = MENU.find(m => m.id === id);
  if (!currentItem) return;
  currentQty = 1;

  document.getElementById('pImg').src              = currentItem.img;
  document.getElementById('pName').textContent     = currentItem.name;
  document.getElementById('pPrice').textContent    = '₹' + currentItem.price;
  document.getElementById('pDesc').textContent     = currentItem.desc;
  document.getElementById('pCategory').textContent = currentItem.category;
  document.getElementById('qtyNum').textContent    = '1';
  document.getElementById('pFavBtn').textContent   = favorites.includes(currentItem.id) ? '❤️' : '🤍';
  updateItemTotal();

  // Reset customizations
  document.querySelectorAll('#spiceRow .chip').forEach((c, i)  => c.classList.toggle('selected', i === 0));
  document.querySelectorAll('.addon-chip').forEach(c  => c.classList.remove('selected'));
  document.querySelectorAll('.remove-chip').forEach(c => c.classList.remove('selected'));

  goTo('pg-product');
}

/* ============================================================
   QUANTITY & CUSTOMIZATIONS
============================================================ */
function changeQty(d) {
  currentQty = Math.max(1, Math.min(9, currentQty + d));
  document.getElementById('qtyNum').textContent = currentQty;
  updateItemTotal();
}

function updateItemTotal() {
  if (!currentItem) return;
  document.getElementById('itemTotal').textContent =
    '₹' + (currentItem.price + getAddonTotal()) * currentQty;
}

function getAddonTotal() {
  let sum = 0;
  document.querySelectorAll('.addon-chip.selected').forEach(c => { sum += parseInt(c.dataset.price) || 0; });
  return sum;
}

function getSelectedAddons()   { return [...document.querySelectorAll('.addon-chip.selected')].map(c  => c.textContent.replace('+','').trim()); }
function getSelectedRemovals() { return [...document.querySelectorAll('.remove-chip.selected')].map(c => c.textContent.trim()); }

function selectChip(el) {
  el.closest('.chip-row').querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function toggleAddon(el)  { el.classList.toggle('selected'); updateItemTotal(); }
function toggleRemove(el) { el.classList.toggle('selected'); }

/* ============================================================
   CART CORE
============================================================ */
function buildCartItem(overrides = {}) {
  const spice    = document.querySelector('#spiceRow .chip.selected')?.textContent.trim() || 'Mild';
  const addons   = getSelectedAddons();
  const removals = getSelectedRemovals();
  const unitPrice= currentItem.price + getAddonTotal();
  const key      = `${currentItem.id}-${spice}-${addons.join(',')}-${removals.join(',')}`;
  return { key, id: currentItem.id, name: currentItem.name, img: currentItem.img,
           price: unitPrice, qty: currentQty, spice, addons, removals, ...overrides };
}

function mergeIntoCart(newItem) {
  const ex = cart.find(c => c.key === newItem.key);
  if (ex) { ex.qty = Math.min(ex.qty + newItem.qty, 9); }
  else    { cart.push(newItem); }
  saveCart();
  updateCartBadge();
}

function saveCart() { localStorage.setItem('zaikofy_cart', JSON.stringify(cart)); }

function getCartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }

function updateCartBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartCount');
  badge.textContent = total;
  badge.classList.remove('bump');
  void badge.offsetWidth;
  if (total > 0) badge.classList.add('bump');
}

/* ============================================================
   CART ACTIONS (product page)
============================================================ */
function addToCart() {
  if (!currentItem) return;
  mergeIntoCart(buildCartItem());
  animateFlyFromEl(document.getElementById('pImg'));
  showToast(`${currentItem.name} added to cart 🛒`);
}

function addToCartAndCheckout() {
  addToCart();
  setTimeout(() => { closeCart(); buildCheckoutPage(); goTo('pg-checkout'); }, 600);
}

function quickAddToCart(id, event) {
  const item = MENU.find(m => m.id === id);
  if (!item) return;
  const key = `${id}-quick`;
  const ex  = cart.find(c => c.key === key);
  if (ex) { ex.qty = Math.min(ex.qty + 1, 9); saveCart(); }
  else    { cart.push({ key, id: item.id, name: item.name, img: item.img, price: item.price, qty: 1, spice: 'Mild', addons: [], removals: [] }); saveCart(); }
  updateCartBadge();
  if (event?.target) animateFlyFromEl(event.target);
  showToast(`${item.name} added 🛒`);
}

function removeFromCart(key) { cart = cart.filter(c => c.key !== key); saveCart(); updateCartBadge(); renderCartDrawer(); }

function changeCartQty(key, d) {
  const item = cart.find(c => c.key === key);
  if (!item) return;
  item.qty = Math.max(1, Math.min(9, item.qty + d));
  saveCart(); updateCartBadge(); renderCartDrawer();
}

function clearCart() { cart = []; saveCart(); updateCartBadge(); renderCartDrawer(); showToast('Cart cleared'); }

/* ============================================================
   CART DRAWER
============================================================ */
function openCart() {
  renderCartDrawer();
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCartDrawer() {
  const cont   = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (cart.length === 0) {
    cont.innerHTML = `<div class="cart-empty"><div>🍽️</div><p>Your cart is empty</p><p style="font-size:0.8rem;margin-top:6px;color:var(--text-muted)">Add something delicious!</p></div>`;
    footer.innerHTML = '';
    return;
  }

  cont.innerHTML = cart.map(item => {
    const lines = [item.spice];
    if (item.addons?.length)   lines.push(item.addons.join(', '));
    if (item.removals?.length) lines.push('Remove: ' + item.removals.join(', '));
    return `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1567337710282-00832b415979?w=200&q=60'">
        <div class="ci-info">
          <div class="ci-name">${item.name}</div>
          <div class="ci-custom">${lines.join(' · ')}</div>
          <div class="ci-price">₹${item.price * item.qty}</div>
        </div>
        <div class="ci-controls">
          <button class="ci-btn" onclick="changeCartQty('${item.key}',-1)">−</button>
          <span class="ci-qty">${item.qty}</span>
          <button class="ci-btn" onclick="changeCartQty('${item.key}',1)">+</button>
          <button class="ci-remove" onclick="removeFromCart('${item.key}')">🗑</button>
        </div>
      </div>`;
  }).join('');

  const subtotal   = getCartTotal();
  const delivery   = subtotal >= 300 ? 0 : 30;
  const grandTotal = subtotal + delivery;

  footer.innerHTML = `
    <div class="cart-total-row">
      <span class="cart-total-label">Subtotal (${cart.reduce((s,i)=>s+i.qty,0)} items)</span>
      <span class="cart-total-amount">₹${subtotal}</span>
    </div>
    ${delivery === 0
      ? `<div style="font-size:0.78rem;color:#32c864;margin-bottom:12px;text-align:right">🎉 Free delivery applied!</div>`
      : `<div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:12px;text-align:right">+ ₹30 delivery · Free above ₹300</div>`}
    <button class="checkout-from-cart" onclick="proceedToCheckout()">Checkout — ₹${grandTotal} →</button>
    <button class="clear-cart-btn" onclick="clearCart()">Clear Cart</button>`;
}

function proceedToCheckout() { closeCart(); buildCheckoutPage(); goTo('pg-checkout'); }

/* ============================================================
   CHECKOUT PAGE BUILD
============================================================ */
function buildCheckoutPage() {
  if (cart.length === 0) { goTo('pg-home'); return; }

  document.getElementById('checkoutItems').innerHTML = cart.map(item => `
    <div class="checkout-item">
      <img src="${item.img}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1567337710282-00832b415979?w=200&q=60'">
      <div class="checkout-item-info">
        <div class="checkout-item-name">${item.name} ×${item.qty}</div>
        <div class="checkout-item-meta">${item.spice}${item.addons?.length ? ' · ' + item.addons.join(', ') : ''}</div>
      </div>
      <div class="checkout-item-price">₹${item.price * item.qty}</div>
    </div>`).join('');

  const sub   = getCartTotal();
  const del   = sub >= 300 ? 0 : 30;
  const grand = sub + del;
  document.getElementById('checkoutTotals').innerHTML = `
    <div class="total-line"><span>Subtotal</span><span>₹${sub}</span></div>
    <div class="total-line"><span>Delivery</span><span>${del === 0 ? '🎉 FREE' : '₹' + del}</span></div>
    <div class="total-line grand"><span>Total</span><span>₹${grand}</span></div>`;
}

/* ============================================================
   PLACE ORDER
============================================================ */
function placeOrder() {
  const firstName = document.getElementById('firstName').value.trim();
  const phone     = document.getElementById('phone').value.trim();
  const address   = document.getElementById('address').value.trim();

  if (!firstName || !phone || !address) { showToast('Please fill required fields ⚠️'); return; }

  const lastName  = document.getElementById('lastName').value.trim();
  const notes     = document.getElementById('notes').value.trim();
  const sub       = getCartTotal();
  const del       = sub >= 300 ? 0 : 30;
  const grand     = sub + del;
  const orderId   = '#ZKF' + Math.floor(1000 + Math.random() * 9000);
  const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  const order = {
    id: orderId, items: JSON.parse(JSON.stringify(cart)),
    total: grand, name: firstName + ' ' + lastName,
    phone, address, notes, date: timestamp, status: 'pending'
  };

  orderHistory.unshift(order);
  adminOrders.unshift(order);
  localStorage.setItem('zaikofy_orders',       JSON.stringify(orderHistory));
  localStorage.setItem('zaikofy_admin_orders', JSON.stringify(adminOrders));

  document.getElementById('successDetail').innerHTML = `
    <div>Order ID: <span>${orderId}</span></div>
    <div>Items: <span>${cart.map(i => i.name + ' ×' + i.qty).join(', ')}</span></div>
    <div>Total: <span>₹${grand}</span></div>
    <div>Name: <span>${firstName} ${lastName}</span></div>
    <div>Phone: <span>${phone}</span></div>
    ${notes ? `<div>Note: <span>${notes}</span></div>` : ''}`;

  window._lastOrder = order;

  // Reset tracking bar
  document.querySelectorAll('.track-step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.track-line').forEach(l => l.classList.remove('active'));
  document.getElementById('ts1').classList.add('active');

  goTo('pg-success');
  startOrderTracking();

  cart = [];
  saveCart();
  updateCartBadge();
  ['firstName','lastName','phone','address','notes'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}

/* ============================================================
   ORDER TRACKING SIMULATION
============================================================ */
function startOrderTracking() {
  [{ s:'ts2', l:'tl1', d:8000 }, { s:'ts3', l:'tl2', d:18000 }, { s:'ts4', l:'tl3', d:32000 }]
    .forEach(({ s, l, d }) => setTimeout(() => {
      document.getElementById(s)?.classList.add('active');
      document.getElementById(l)?.classList.add('active');
    }, d));
}

/* ============================================================
   WHATSAPP
============================================================ */
function sendWhatsApp() {
  const o = window._lastOrder;
  if (!o) return;
  const items = o.items.map(i => `${i.name} x${i.qty}`).join(', ');
  const msg = `🍛 *Zaikofy Order ${o.id}*\n\nItems: ${items}\nTotal: ₹${o.total}\nName: ${o.name}\nPhone: ${o.phone}\nAddress: ${o.address}\n\nThank you for ordering! 🙏`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

/* ============================================================
   ORDER HISTORY
============================================================ */
function renderHistory() {
  const list = document.getElementById('historyList');
  const orders = JSON.parse(localStorage.getItem('zaikofy_orders') || '[]');

  if (orders.length === 0) {
    list.innerHTML = `<div class="history-empty"><div>📋</div><p>No orders yet!</p><p style="font-size:0.82rem;margin-top:6px">Your past orders will appear here.</p></div>`;
    return;
  }

  list.innerHTML = orders.map(order => `
    <div class="history-card">
      <div class="hc-header">
        <span class="hc-id">${order.id}</span>
        <span class="hc-date">${order.date}</span>
      </div>
      <div class="hc-items">
        ${order.items.map(i => `<span class="hc-item-tag">${i.name} ×${i.qty}</span>`).join('')}
      </div>
      <div class="hc-footer">
        <span class="hc-total">₹${order.total}</span>
        <button class="reorder-btn" onclick='reorder(${JSON.stringify(order.items)})'>↩ Reorder</button>
      </div>
    </div>`).join('');
}

function reorder(items) {
  items.forEach(item => {
    const ex = cart.find(c => c.key === item.key);
    if (ex) { ex.qty = Math.min(ex.qty + item.qty, 9); }
    else    { cart.push({ ...item }); }
  });
  saveCart(); updateCartBadge();
  showToast('Items added to cart 🛒');
  goTo('pg-home');
  setTimeout(openCart, 400);
}

/* ============================================================
   DAILY SPECIAL
============================================================ */
function initSpecialBanner() {
  const special = MENU.find(m => m.id === DAILY_SPECIAL.itemId);
  if (!special) return;
  document.getElementById('specialName').textContent  = special.name;
  document.getElementById('specialDesc').textContent  = DAILY_SPECIAL.chefNote;
  document.getElementById('specialPrice').textContent = '₹' + DAILY_SPECIAL.discountedPrice;
}

function orderSpecial() {
  const item = MENU.find(m => m.id === DAILY_SPECIAL.itemId);
  if (!item) return;
  const key = `${item.id}-special`;
  const ex  = cart.find(c => c.key === key);
  if (ex) { ex.qty = Math.min(ex.qty + 1, 9); saveCart(); }
  else { cart.push({ key, id: item.id, name: item.name + ' ★ Special', img: item.img, price: DAILY_SPECIAL.discountedPrice, qty: 1, spice: 'Mild', addons: [], removals: [] }); saveCart(); }
  updateCartBadge();
  showToast('Special added to cart 🌟');
  openCart();
}

/* ============================================================
   COUNTDOWN
============================================================ */
function startCountdown() {
  const tick = () => {
    const now  = new Date();
    const end  = new Date(); end.setHours(24, 0, 0, 0);
    let diff   = Math.max(0, Math.floor((end - now) / 1000));
    const h    = Math.floor(diff / 3600); diff -= h * 3600;
    const m    = Math.floor(diff / 60);
    const s    = diff % 60;
    const pad  = n => String(n).padStart(2, '0');
    const cdH  = document.getElementById('cdH');
    const cdM  = document.getElementById('cdM');
    const cdS  = document.getElementById('cdS');
    if (cdH) cdH.textContent = pad(h);
    if (cdM) cdM.textContent = pad(m);
    if (cdS) cdS.textContent = pad(s);
  };
  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   FLY-TO-CART ANIMATION
============================================================ */
function animateFlyFromEl(el) {
  const cartBtn = document.querySelector('.cart-btn');
  const flyEl   = document.getElementById('flyItem');
  if (!cartBtn || !flyEl || !el) return;

  const start = el.getBoundingClientRect();
  const end   = cartBtn.getBoundingClientRect();

  flyEl.style.cssText = `
    position:fixed;
    top:${start.top + start.height / 2}px;
    left:${start.left + start.width / 2}px;
    font-size:1.8rem;
    z-index:9999;
    pointer-events:none;
    transform:translate(-50%,-50%) scale(1);
    opacity:1;
    transition:none;
  `;
  flyEl.textContent = '🍛';

  requestAnimationFrame(() => requestAnimationFrame(() => {
    flyEl.style.transition = 'all 0.65s cubic-bezier(0.4,0,0.2,1)';
    flyEl.style.top    = (end.top  + end.height / 2) + 'px';
    flyEl.style.left   = (end.left + end.width  / 2) + 'px';
    flyEl.style.transform = 'translate(-50%,-50%) scale(0.2)';
    flyEl.style.opacity = '0';
  }));
}

/* ============================================================
   ADMIN PANEL
============================================================ */
function openAdmin() {
  document.getElementById('adminDrawer').classList.add('open');
  document.getElementById('adminOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (adminUnlocked) renderAdminOrders();
}

function closeAdmin() {
  document.getElementById('adminDrawer').classList.remove('open');
  document.getElementById('adminOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function checkAdmin() {
  if (document.getElementById('adminPass').value === 'zaikofy123') {
    adminUnlocked = true;
    document.getElementById('adminLock').style.display  = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    renderAdminOrders();
    renderAdminMenu();
    renderRevenue();
  } else {
    showToast('Wrong password ❌');
    document.getElementById('adminPass').value = '';
  }
}

function switchAdminTab(tab, el) {
  document.querySelectorAll('.atab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.atab-content').forEach(c => c.style.display = 'none');
  document.getElementById('atab-' + tab).style.display = 'block';
  if (tab === 'orders')  renderAdminOrders();
  if (tab === 'menu')    renderAdminMenu();
  if (tab === 'revenue') renderRevenue();
}

function renderAdminOrders() {
  const orders = JSON.parse(localStorage.getItem('zaikofy_admin_orders') || '[]');
  const cont   = document.getElementById('adminOrders');
  if (!orders.length) {
    cont.innerHTML = `<p style="color:var(--text-muted);padding:20px 0;font-size:0.9rem">No orders yet.</p>`;
    return;
  }
  cont.innerHTML = orders.map((o, idx) => `
    <div class="admin-order-card">
      <div class="aoc-header">
        <span class="aoc-id">${o.id}</span>
        <span class="aoc-status ${o.status === 'delivered' ? 'status-delivered' : 'status-pending'}">
          ${o.status === 'delivered' ? '✓ Delivered' : '⏳ Pending'}
        </span>
      </div>
      <div class="aoc-name">${o.items.map(i => i.name + ' ×' + i.qty).join(', ')}</div>
      <div style="font-size:0.8rem;color:var(--text-muted);margin-top:4px">${o.name} · ${o.phone} · ₹${o.total}</div>
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px">${o.date}</div>
      <div class="aoc-actions">
        ${o.status !== 'delivered' ? `<button class="aoc-btn deliver" onclick="markDelivered(${idx})">✓ Mark Delivered</button>` : ''}
        <button class="aoc-btn" onclick="deleteAdminOrder(${idx})">🗑 Delete</button>
      </div>
    </div>`).join('');
}

function markDelivered(idx) {
  const orders = JSON.parse(localStorage.getItem('zaikofy_admin_orders') || '[]');
  if (orders[idx]) { orders[idx].status = 'delivered'; localStorage.setItem('zaikofy_admin_orders', JSON.stringify(orders)); renderAdminOrders(); showToast('Marked as delivered ✓'); }
}

function deleteAdminOrder(idx) {
  const orders = JSON.parse(localStorage.getItem('zaikofy_admin_orders') || '[]');
  orders.splice(idx, 1);
  localStorage.setItem('zaikofy_admin_orders', JSON.stringify(orders));
  renderAdminOrders();
}

function renderAdminMenu() {
  document.getElementById('adminMenuList').innerHTML =
    `<h4 style="margin-bottom:10px;font-size:0.9rem;color:var(--text-muted)">Current Items (${MENU.length})</h4>` +
    MENU.map((item, idx) => `
      <div class="admin-menu-item">
        <img src="${item.img}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1567337710282-00832b415979?w=100&q=60'">
        <div class="ami-info">
          <div class="ami-name">${item.name}</div>
          <div class="ami-price">₹${item.price} · ${item.category} · ${item.mealtime}</div>
        </div>
        <button class="ami-del" onclick="adminDeleteItem(${idx})">🗑</button>
      </div>`).join('');
}

function adminAddItem() {
  const name     = document.getElementById('ai-name').value.trim();
  const price    = parseInt(document.getElementById('ai-price').value);
  const category = document.getElementById('ai-cat').value;
  const mealtime = document.getElementById('ai-mealtime').value;
  const img      = document.getElementById('ai-img').value.trim() || 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80';
  const desc     = document.getElementById('ai-desc').value.trim();

  if (!name || !price || !desc) { showToast('Fill all required fields ⚠️'); return; }

  MENU.push({ id: Date.now(), name, price, category, mealtime, img, desc });
  localStorage.setItem('zaikofy_menu', JSON.stringify(MENU));
  ['ai-name','ai-price','ai-img','ai-desc'].forEach(id => { document.getElementById(id).value = ''; });
  renderMenu(); renderAdminMenu();
  showToast(`${name} added to menu ✓`);
}

function adminDeleteItem(idx) {
  const name = MENU[idx].name;
  MENU.splice(idx, 1);
  localStorage.setItem('zaikofy_menu', JSON.stringify(MENU));
  renderMenu(); renderAdminMenu();
  showToast(`${name} removed`);
}

function renderRevenue() {
  const orders = JSON.parse(localStorage.getItem('zaikofy_admin_orders') || '[]');
  const cont   = document.getElementById('revenueStats');
  const total  = orders.reduce((s, o) => s + (o.total || 0), 0);
  const count  = orders.length;
  const delivered = orders.filter(o => o.status === 'delivered').length;
  const avg    = count ? Math.round(total / count) : 0;

  const freq = {};
  orders.forEach(o => o.items.forEach(i => { freq[i.name] = (freq[i.name] || 0) + i.qty; }));
  const top   = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,5);
  const maxF  = top[0]?.[1] || 1;

  cont.innerHTML = `
    <div class="rev-card"><div><div class="rev-label">Total Revenue</div><div class="rev-value">₹${total}</div></div><div style="font-size:2rem">💰</div></div>
    <div class="rev-card"><div><div class="rev-label">Total Orders</div><div class="rev-value">${count}</div></div><div style="font-size:2rem">📦</div></div>
    <div class="rev-card"><div><div class="rev-label">Delivered</div><div class="rev-value">${delivered}</div></div><div style="font-size:2rem">✅</div></div>
    <div class="rev-card"><div><div class="rev-label">Avg. Order Value</div><div class="rev-value">₹${avg}</div></div><div style="font-size:2rem">📊</div></div>
    ${top.length ? `
      <div style="margin-top:8px">
        <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:10px;text-transform:uppercase;letter-spacing:1px">Top Items</div>
        ${top.map(([name, n]) => `
          <div class="rev-bar-label"><span>${name}</span><span>${n} orders</span></div>
          <div class="rev-bar-bg"><div class="rev-bar-fill" style="width:${Math.round(n/maxF*100)}%"></div></div>
        `).join('')}
      </div>` : `<p style="color:var(--text-muted);font-size:0.85rem;padding:16px 0">No orders yet. Revenue will appear here.</p>`}`;
}

/* ============================================================
   MISC
============================================================ */
function goHome() { currentItem = null; goTo('pg-home'); }
function scrollToMenu() { document.getElementById('menuSection')?.scrollIntoView({ behavior: 'smooth' }); }

let toastT;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2800);
}
