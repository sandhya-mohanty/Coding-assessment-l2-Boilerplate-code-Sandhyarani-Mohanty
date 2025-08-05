// Product list (id, name, price, image)
const products = [
  { id: 1, name: "Tie-Dye Lounge Set", price: 150, image: "assets/photo-1.jpg" },
  { id: 2, name: "Sunburst Tracksuit", price: 150, image: "assets/photo-2.jpg" },
  { id: 3, name: "Retro Red Streetwear", price: 150, image: "assets/photo-3.jpg" },
  { id: 4, name: "Urban Sportwear Combo", price: 150, image: "assets/photo-4.jpg" },
  { id: 5, name: "Oversized Knit & Coat", price: 150, image: "assets/photo-5.jpg" },
  { id: 6, name: "Chic Monochrome Blazer", price: 150, image: "assets/photo-6.jpg" },
  { id: 7, name: "Chic Monochrome Blazer", price: 150, image: "assets/photo-7.jpg" }
];

// State variables
let selectedProducts = [];
const MINIMUM_PRODUCTS = 3;           
const DISCOUNT_PERCENTAGE = 0.3;      // 30% discount

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const selectedProductsContainer = document.getElementById('selectedProducts');
const progressFill = document.getElementById('progressFill');
const discountRow = document.getElementById('discountRow');
const discountAmount = document.getElementById('discountAmount');
const subtotal = document.getElementById('subtotal');
const ctaButton = document.getElementById('ctaButton');
const ctaText = document.getElementById('ctaText');

// Initialize the app
function init() {
    renderProducts();
    updateBundle();
}

// Render all products to the grid
function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img class="product-image" src="${product.image}">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-bundle-btn" onclick="toggleProduct(${product.id})">
                    <span class="btn-text">Add to Bundle</span>
                    <img class="btn-icon" src="assets/Plus.svg" alt="Plus Icon">
                </button>
            </div>
        </div>
    `).join('');
}

// Add or remove a product from selection
function toggleProduct(productId) {
    const product = products.find(p => p.id === productId);
    const existingIndex = selectedProducts.findIndex(p => p.id === productId);

    if (existingIndex > -1) {
        // If already selected → remove
        selectedProducts.splice(existingIndex, 1);
    } else {
        // Add product with quantity 1
        selectedProducts.push({ ...product, quantity: 1 });
    }

    updateProductButton(productId);
    updateBundle();
}

// Update button state (text + icon) based on selection
function updateProductButton(productId) {
    const isSelected = selectedProducts.some(p => p.id === productId);
    const button = document.querySelector(`[onclick="toggleProduct(${productId})"]`);
    const btnText = button.querySelector('.btn-text');
    const icon = button.querySelector('.btn-icon');

    if (isSelected) {
        button.classList.add('added');
        btnText.textContent = 'Added to Bundle';
        icon.src = 'assets/Check.svg'; // Tick icon
    } else {
        button.classList.remove('added');
        btnText.textContent = 'Add to Bundle';
        icon.src = 'assets/Plus.svg'; // Plus icon
    }
}

// Update quantity for a selected product
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        toggleProduct(productId); // Remove if quantity < 1
        return;
    }

    const productIndex = selectedProducts.findIndex(p => p.id === productId);
    if (productIndex > -1) {
        selectedProducts[productIndex].quantity = newQuantity;
        updateBundle();
    }
}

// Update all UI parts after any change
function updateBundle() {
    updateProgress();
    updateSelectedProducts();
    updatePricing();
    updateCTA();
}

// Update progress bar based on number of products
function updateProgress() {
    const progress = Math.min(selectedProducts.length / MINIMUM_PRODUCTS * 100, 100);
    progressFill.style.width = `${progress}%`;
}

// Render selected products in the cart section
function updateSelectedProducts() {
    selectedProductsContainer.innerHTML = selectedProducts.map(product => `
        <div class="selected-item">
            <img class="selected-item-image" src="${product.image}">
            <div class="selected-item-info">
                <div class="selected-item-name">${product.name}</div>
                <div class="selected-item-price">$${product.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <div class="quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${product.id}, ${product.quantity - 1})">−</button>
                        <input type="number" class="quantity-input" value="${product.quantity}" 
                               onchange="updateQuantity(${product.id}, parseInt(this.value))" min="1">
                        <button class="quantity-btn" onclick="updateQuantity(${product.id}, ${product.quantity + 1})">+</button>
                    </div>
                    <button class="remove-btn" onclick="toggleProduct(${product.id})">
                        <img class="img" src="assets/bin.png">
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update pricing and discount
function updatePricing() {
    const totalItems = selectedProducts.reduce((sum, product) => sum + product.quantity, 0);
    const originalTotal = selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);

    let finalTotal = originalTotal;
    let discount = 0;

    if (selectedProducts.length > 0) {
        // Apply flat 30% discount if at least 1 product
        discount = originalTotal * DISCOUNT_PERCENTAGE;
        finalTotal = originalTotal - discount;
        discountAmount.textContent = `- $${discount.toFixed(2)} (30%)`;
    } else {
        discountAmount.textContent = `- $0.00`;
    }

    discountRow.style.display = 'flex';
    subtotal.textContent = `$${finalTotal.toFixed(2)}`;
}

// Update CTA button state
function updateCTA() {
    const isEligible = selectedProducts.length >= MINIMUM_PRODUCTS;
    ctaButton.disabled = !isEligible;

    if (isEligible) {
        ctaText.textContent = `Add ${MINIMUM_PRODUCTS} Items to Proceed`;
        ctaButton.onclick = handleAddToCart;
    } else {
        const remaining = MINIMUM_PRODUCTS - selectedProducts.length;
        ctaText.textContent = `Add ${remaining} Items to Proceed`;
        ctaButton.onclick = null;
    }
}

// Handle "Add to Cart" click
function handleAddToCart() {
    ctaText.textContent = 'Added to Cart'; // Change button text after click
}

// Start app on page load
document.addEventListener('DOMContentLoaded', init);
