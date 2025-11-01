/**
 * نظام السلة المحسن - دعم ثنائي اللغة
 * Enhanced Cart System - Bilingual Support (Arabic/English)
 */

class EmiratesCart {
    constructor() {
        this.items = [];
        this.storageKey = 'emirates_cart';
        this.isOpen = false;
        this.isEnglish = this.detectLanguage();
        this.texts = this.getTexts();
        this.init();
    }

    detectLanguage() {
        return window.location.pathname.includes('/en/');
    }

    getTexts() {
        if (this.isEnglish) {
            return {
                // Cart UI
                cartTitle: '🛒 Shopping Cart',
                emptyCartTitle: 'Your cart is empty',
                emptyCartDesc: 'Start shopping to add products to your cart',
                continueShoppingBtn: '🏠 Continue Shopping',
                
                // Stats
                items: 'Items',
                subtotal: 'Subtotal',
                vat: 'VAT (5%)',
                finalTotal: 'Total',
                aed: 'AED',
                
                // Actions
                addToCart: 'Add to Cart',
                proceedCheckout: '🚀 Proceed to Checkout',
                clearCart: '🗑 Clear Cart',
                removeItem: 'Remove',
                
                // Notifications
                addedToCart: 'added to cart successfully!',
                increasedQty: 'Increased quantity of',
                removedFromCart: 'removed from cart',
                cartCleared: 'Cart cleared successfully',
                cartEmpty: 'Cart is already empty',
                errorAdding: 'Error adding product to cart',
                errorLoading: 'Error loading product data',
                proceedingCheckout: 'Opening checkout page...',
                checkoutError: 'Error opening checkout page - check popup blocker',
                confirmClear: 'Are you sure you want to clear the entire cart?',
                confirmRemove: 'Do you want to remove',
                
                // Loading
                loadingProducts: 'Loading products...',
                loadingCart: 'Loading cart...',
                productNotFound: 'Product not found'
            };
        } else {
            return {
                // Cart UI
                cartTitle: '🛒 سلة التسوق',
                emptyCartTitle: 'السلة فارغة',
                emptyCartDesc: 'ابدأ بإضافة منتجات للسلة',
                continueShoppingBtn: '🏠 تابع التسوق',
                
                // Stats
                items: 'عنصر',
                subtotal: 'العدد',
                vat: 'ضريبة 5%',
                finalTotal: 'الإجمالي',
                aed: 'درهم',
                
                // Actions
                addToCart: 'إضافة للسلة',
                proceedCheckout: '🚀 إتمام الطلب',
                clearCart: '🗑 تفريغ السلة',
                removeItem: 'حذف',
                
                // Notifications
                addedToCart: 'تم إضافته للسلة ✅',
                increasedQty: 'تم زيادة عدد',
                removedFromCart: 'تم حذفه من السلة',
                cartCleared: 'تم تفريغ السلة ✅',
                cartEmpty: 'السلة فارغة بالفعل',
                errorAdding: 'حدث خطأ في الإضافة',
                errorLoading: 'خطأ في تحميل بيانات المنتج',
                proceedingCheckout: 'جاري فتح صفحة إتمام الطلب...',
                checkoutError: 'لم يتم فتح صفحة الطلب - تحقق من حاجب النوافذ',
                confirmClear: 'هل تريد تفريغ السلة بالكامل؟',
                confirmRemove: 'هل تريد حذف',
                
                // Loading
                loadingProducts: 'جاري تحميل المنتجات...',
                loadingCart: 'جاري تحميل السلة...',
                productNotFound: 'لم يتم العثور على المنتج'
            };
        }
    }

    init() {
        const lang = this.isEnglish ? 'English' : 'Arabic';
        console.log(`🛒 Initializing Emirates Cart (${lang})...`);
        
        this.loadFromStorage();
        this.createCartUI();
        this.setupEventListeners();
        this.updateCartDisplay();
        
        console.log(`✅ Emirates Cart ready (${lang}) - ${this.items.length} items`);
    }

    createCartUI() {
        // Remove existing elements to avoid conflicts
        document.querySelectorAll('#cart-float, #cart-overlay, #cart-sidebar').forEach(el => el.remove());

        // Cart Float Button
        const cartFloat = document.createElement('div');
        cartFloat.id = 'cart-float';
        cartFloat.className = 'cart-float';
        cartFloat.innerHTML = `
            <div class="cart-icon">🛒</div>
            <div class="cart-badge" id="cart-badge">0</div>
        `;
        document.body.appendChild(cartFloat);

        // Overlay
        const overlay = document.createElement('div');
        overlay.id = 'cart-overlay';
        overlay.className = 'cart-overlay';
        document.body.appendChild(overlay);

        // Sidebar
        const sidebar = document.createElement('div');
        sidebar.id = 'cart-sidebar';
        sidebar.className = `cart-sidebar ${this.isEnglish ? 'ltr' : 'rtl'}`;
        sidebar.innerHTML = `
            <div class="cart-header">
                <h3>${this.texts.cartTitle}</h3>
                <button class="cart-close" id="cart-close">×</button>
            </div>
            <div class="cart-body" id="cart-items-container"></div>
            <div class="cart-footer">
                <div class="cart-summary">
                    <div class="total-row">${this.texts.items}: <span id="total-items">0</span></div>
                    <div class="total-row">${this.texts.subtotal}: <span id="total-price">0 ${this.texts.aed}</span></div>
                    <div class="total-row">${this.texts.vat}: <span id="vat-amount">0 ${this.texts.aed}</span></div>
                    <div class="total-row final">${this.texts.finalTotal}: <span id="final-total">0 ${this.texts.aed}</span></div>
                </div>
                <button class="checkout-btn" id="checkout-btn" disabled>
                    ${this.texts.proceedCheckout}
                </button>
                <button class="clear-btn" id="clear-btn">${this.texts.clearCart}</button>
            </div>
        `;
        document.body.appendChild(sidebar);

        this.addCartStyles();
    }

    addCartStyles() {
        if (document.getElementById('emirates-cart-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'emirates-cart-styles';
        styles.textContent = `
            .cart-float {
                position: fixed;
                bottom: 30px;
                ${this.isEnglish ? 'left' : 'right'}: 30px;
                width: 70px;
                height: 70px;
                background: linear-gradient(135deg, #d4af37, #b8941f);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 1000;
                box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
                transition: all 0.3s ease;
                border: 3px solid rgba(255, 255, 255, 0.9);
                user-select: none;
                font-family: ${this.isEnglish ? "'Inter', sans-serif" : "'Cairo', sans-serif"};
            }

            .cart-float:hover {
                transform: scale(1.1) translateY(-3px);
                box-shadow: 0 12px 35px rgba(212, 175, 55, 0.6);
                background: linear-gradient(135deg, #1e40af, #3b82f6);
            }

            .cart-icon {
                font-size: 2rem;
                position: relative;
            }

            .cart-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 25px;
                height: 25px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                font-weight: 800;
                border: 2px solid white;
                transform: scale(0);
                transition: transform 0.3s ease;
            }

            .cart-badge.show {
                transform: scale(1);
                animation: bounce 0.6s ease;
            }

            @keyframes bounce {
                0%, 20%, 53%, 80%, 100% { transform: scale(1); }
                40%, 43% { transform: scale(1.2); }
                70% { transform: scale(1.1); }
            }

            .cart-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
                z-index: 9998;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .cart-overlay.show {
                opacity: 1;
                visibility: visible;
            }

            .cart-sidebar {
                position: fixed;
                top: 0;
                ${this.isEnglish ? 'right: -450px' : 'right: -450px'};
                width: 420px;
                height: 100vh;
                background: white;
                z-index: 9999;
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2);
                display: flex;
                flex-direction: column;
                font-family: ${this.isEnglish ? "'Inter', sans-serif" : "'Cairo', sans-serif"};
                direction: ${this.isEnglish ? 'ltr' : 'rtl'};
                text-align: ${this.isEnglish ? 'left' : 'right'};
            }

            .cart-sidebar.show {
                right: 0;
            }

            .cart-header {
                padding: 2rem;
                background: linear-gradient(135deg, #1e40af, #3b82f6);
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
            }

            .cart-header h3 {
                margin: 0;
                font-size: 1.5rem;
                font-weight: 800;
            }

            .cart-close {
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.5rem;
                font-weight: bold;
                transition: all 0.3s ease;
            }

            .cart-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .cart-body {
                flex: 1;
                overflow-y: auto;
                padding: 1rem;
            }

            .cart-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: #f8fafc;
                border-radius: 12px;
                border: 2px solid rgba(212, 175, 55, 0.1);
                margin-bottom: 1rem;
                transition: all 0.3s ease;
                ${this.isEnglish ? 'text-align: left;' : 'text-align: right;'}
            }

            .cart-item:hover {
                border-color: #d4af37;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
            }

            .item-image {
                width: 60px;
                height: 60px;
                border-radius: 8px;
                object-fit: cover;
                border: 2px solid #d4af37;
            }

            .item-info {
                flex: 1;
            }

            .item-title {
                font-weight: 700;
                color: #111827;
                font-size: 0.95rem;
                margin-bottom: 0.5rem;
                line-height: 1.3;
            }

            .item-price {
                color: #d4af37;
                font-weight: 800;
                font-size: 1.1rem;
            }

            .item-controls {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-top: 0.5rem;
            }

            .qty-btn {
                width: 30px;
                height: 30px;
                border: 2px solid #d4af37;
                background: white;
                color: #d4af37;
                border-radius: 50%;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.2s ease;
            }

            .qty-btn:hover {
                background: #d4af37;
                color: white;
                transform: scale(1.1);
            }

            .qty-display {
                padding: 0.3rem 0.8rem;
                background: #1e40af;
                color: white;
                border-radius: 15px;
                font-weight: 700;
                min-width: 35px;
                text-align: center;
            }

            .cart-footer {
                padding: 1.5rem;
                background: #f8fafc;
                border-top: 3px solid #1e40af;
            }

            .cart-summary {
                margin-bottom: 1.5rem;
            }

            .total-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5rem;
                font-weight: 600;
            }

            .total-row.final {
                font-size: 1.2rem;
                font-weight: 900;
                color: #1e40af;
                border-top: 2px solid #d4af37;
                padding-top: 0.5rem;
                margin-top: 0.5rem;
            }

            .checkout-btn {
                width: 100%;
                padding: 1.2rem;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                border: none;
                border-radius: 12px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1.1rem;
                margin-bottom: 0.8rem;
                font-family: inherit;
            }

            .checkout-btn:enabled:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
            }

            .checkout-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .clear-btn {
                width: 100%;
                padding: 0.8rem;
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
                border: 2px solid #ef4444;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: inherit;
            }

            .clear-btn:hover {
                background: #ef4444;
                color: white;
            }

            /* Empty state */
            .empty-cart {
                text-align: center;
                padding: 3rem 1rem;
                color: #6b7280;
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .cart-sidebar {
                    width: 100vw;
                    right: -100vw;
                }
                
                .cart-float {
                    bottom: 20px;
                    ${this.isEnglish ? 'left' : 'right'}: 20px;
                    width: 60px;
                    height: 60px;
                }
                
                .cart-icon {
                    font-size: 1.8rem;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    setupEventListeners() {
        // Open cart
        const cartFloat = document.getElementById('cart-float');
        if (cartFloat) {
            cartFloat.addEventListener('click', () => {
                console.log(`🛒 Opening cart (${this.isEnglish ? 'English' : 'Arabic'})`);
                this.openCart();
            });
        }

        // Close cart
        const cartClose = document.getElementById('cart-close');
        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeCart());
        }

        // Close on overlay click
        const overlay = document.getElementById('cart-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeCart());
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
        }

        // Clear cart button
        const clearBtn = document.getElementById('clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearCart());
        }

        // Global add to cart listener
        document.addEventListener('click', (e) => {
            if (e.target.matches('.add-to-cart') || e.target.closest('.add-to-cart')) {
                e.preventDefault();
                e.stopPropagation();
                
                const btn = e.target.matches('.add-to-cart') ? e.target : e.target.closest('.add-to-cart');
                const productId = btn.getAttribute('data-product-id');
                
                if (productId) {
                    console.log(`🛒 Add to cart button clicked: ${productId}`);
                    this.addToCart(productId, true); // true = open cart immediately
                } else {
                    console.warn('⚠️ No product ID found on add to cart button');
                }
            }
        });

        console.log('✅ Event listeners setup complete');
    }

    // Add product to cart with immediate sidebar opening
    async addToCart(productId, openSidebarImmediately = true) {
        try {
            console.log(`🛒 Adding product: ${productId}`);
            
            const product = await this.getProductData(productId);
            if (!product) {
                this.showNotification(`❌ ${this.texts.productNotFound}`, 'error');
                return false;
            }

            const existingItem = this.items.find(item => item.id === productId.toString());
            
            if (existingItem) {
                existingItem.quantity += 1;
                this.showNotification(`${this.texts.increasedQty} "${product.title}" ✅`);
            } else {
                const cartItem = {
                    id: productId.toString(),
                    title: product.title,
                    price: product.sale_price || product.regular_price || 0,
                    image: product.image_url || 'https://via.placeholder.com/60x60/D4AF37/FFFFFF?text=Product',
                    quantity: 1,
                    addedAt: Date.now()
                };
                
                this.items.push(cartItem);
                this.showNotification(`"${product.title}" ${this.texts.addedToCart}`);
            }

            this.saveToStorage();
            this.updateCartDisplay();
            this.animateCartButton();

            // Open cart sidebar immediately to show the new product
            if (openSidebarImmediately) {
                setTimeout(() => {
                    this.openCart();
                    console.log('✅ Cart opened automatically to show new product');
                }, 300);
            }

            return true;

        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification(this.texts.errorAdding, 'error');
            return false;
        }
    }

    openCart() {
        console.log(`🛒 Opening cart sidebar...`);
        
        const overlay = document.getElementById('cart-overlay');
        const sidebar = document.getElementById('cart-sidebar');
        
        if (!overlay || !sidebar) {
            console.error('❌ Cart elements not found');
            return;
        }

        // Update content before opening
        this.renderCartItems();
        
        overlay.classList.add('show');
        sidebar.classList.add('show');
        this.isOpen = true;
        
        document.body.style.overflow = 'hidden';
        
        console.log(`✅ Cart opened - ${this.items.length} items`);
    }

    closeCart() {
        const overlay = document.getElementById('cart-overlay');
        const sidebar = document.getElementById('cart-sidebar');
        
        if (overlay) overlay.classList.remove('show');
        if (sidebar) sidebar.classList.remove('show');
        
        this.isOpen = false;
        document.body.style.overflow = '';
        
        console.log('✅ Cart closed');
    }

    renderCartItems() {
        const container = document.getElementById('cart-items-container');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🛒</div>
                    <h4>${this.texts.emptyCartTitle}</h4>
                    <p>${this.texts.emptyCartDesc}</p>
                    <button onclick="window.cart.closeCart()" style="
                        margin-top: 1.5rem; padding: 1rem 1.5rem;
                        background: linear-gradient(135deg, #d4af37, #b8941f);
                        color: white; border: none; border-radius: 12px;
                        cursor: pointer; font-weight: 700; font-size: 1rem;
                        transition: all 0.3s ease; font-family: inherit;
                    " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(212, 175, 55, 0.4)';" 
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                        ${this.texts.continueShoppingBtn}
                    </button>
                </div>
            `;
            return;
        }

        const itemsHTML = this.items.map(item => `
            <div class="cart-item" data-item-id="${item.id}">
                <img class="item-image" src="${item.image}" alt="${item.title}"
                     onerror="this.src='https://via.placeholder.com/60x60/D4AF37/FFFFFF?text=Product'">
                <div class="item-info">
                    <div class="item-title">${item.title.length > 30 ? item.title.substring(0, 30) + '...' : item.title}</div>
                    <div class="item-price">${(item.price * item.quantity).toFixed(0)} ${this.texts.aed}</div>
                    <div class="item-controls" style="margin-top: 0.5rem;">
                        <button class="qty-btn" onclick="window.cart.decreaseQuantity('${item.id}')">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="window.cart.increaseQuantity('${item.id}')">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="window.cart.removeItem('${item.id}')" title="${this.texts.removeItem}" style="
                    background: rgba(239, 68, 68, 0.1); color: #ef4444; border: none;
                    width: 30px; height: 30px; border-radius: 50%; cursor: pointer;
                    font-weight: bold; transition: all 0.2s ease;
                " onmouseover="this.style.background='#ef4444'; this.style.color='white';" 
                   onmouseout="this.style.background='rgba(239, 68, 68, 0.1)'; this.style.color='#ef4444';">×</button>
            </div>
        `).join('');

        container.innerHTML = itemsHTML;
        console.log(`✅ Rendered ${this.items.length} cart items`);
    }

    updateCartDisplay() {
        const badge = document.getElementById('cart-badge');
        const totalItems = document.getElementById('total-items');
        const totalPrice = document.getElementById('total-price');
        const vatAmount = document.getElementById('vat-amount');
        const finalTotal = document.getElementById('final-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        const itemCount = this.getTotalItems();
        const subtotal = this.getTotalPrice();
        const vat = Math.round(subtotal * 0.05);
        const total = subtotal + vat;

        if (badge) {
            badge.textContent = itemCount;
            if (itemCount > 0) {
                badge.classList.add('show');
            } else {
                badge.classList.remove('show');
            }
        }

        if (totalItems) totalItems.textContent = itemCount;
        if (totalPrice) totalPrice.textContent = `${subtotal} ${this.texts.aed}`;
        if (vatAmount) vatAmount.textContent = `${vat} ${this.texts.aed}`;
        if (finalTotal) finalTotal.textContent = `${total} ${this.texts.aed}`;

        if (checkoutBtn) {
            checkoutBtn.disabled = itemCount === 0;
        }
    }

    proceedToCheckout() {
        if (this.items.length === 0) {
            this.showNotification(`❌ ${this.texts.cartEmpty}`, 'error');
            return;
        }

        try {
            const cartData = {
                items: this.items,
                totalItems: this.getTotalItems(),
                totalPrice: this.getTotalPrice(),
                language: this.isEnglish ? 'en' : 'ar'
            };

            sessionStorage.setItem('checkout_cart_data', JSON.stringify(cartData));
            
            // Determine checkout URL based on current language
            const checkoutUrl = this.isEnglish ? '../checkout.html' : '../checkout.html';
            const checkoutWindow = window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
            
            if (checkoutWindow) {
                this.showNotification(this.texts.proceedingCheckout);
                this.closeCart();
            } else {
                this.showNotification(this.texts.checkoutError, 'error');
            }

        } catch (error) {
            console.error('Error proceeding to checkout:', error);
            this.showNotification(this.texts.checkoutError, 'error');
        }
    }

    // Get product data from various sources
    async getProductData(productId) {
        const sources = [
            window.allProducts,
            window.categoryProducts, 
            window.filteredProducts,
            window.categoriesHomepage?.products,
            window.categoryPage?.products,
            window.categoryPage?.filteredProducts
        ];

        for (const source of sources) {
            if (Array.isArray(source)) {
                const product = source.find(p => p.id == productId);
                if (product) {
                    console.log(`✅ Found product: ${product.title}`);
                    return product;
                }
            }
        }

        // Try direct fetch if not found in memory
        try {
            const dataPath = this.isEnglish ? '../data/uae-products.json' : './data/uae-products.json';
            const response = await fetch(dataPath);
            if (response.ok) {
                const products = await response.json();
                const product = products.find(p => p.id == productId);
                if (product) return product;
            }
        } catch (error) {
            console.warn('Error loading product data:', error);
        }

        return null;
    }

    increaseQuantity(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.quantity += 1;
            this.saveToStorage();
            this.updateCartDisplay();
            this.renderCartItems();
        }
    }

    decreaseQuantity(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                this.removeItem(itemId);
                return;
            }
            this.saveToStorage();
            this.updateCartDisplay();
            this.renderCartItems();
        }
    }

    removeItem(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (item && confirm(`${this.texts.confirmRemove} "${item.title}"?`)) {
            this.items = this.items.filter(i => i.id !== itemId);
            this.saveToStorage();
            this.updateCartDisplay();
            this.renderCartItems();
            this.showNotification(`"${item.title}" ${this.texts.removedFromCart} ✅`);
        }
    }

    clearCart() {
        if (this.items.length === 0) {
            this.showNotification(this.texts.cartEmpty, 'info');
            return;
        }
        
        if (confirm(this.texts.confirmClear)) {
            this.items = [];
            this.saveToStorage();
            this.updateCartDisplay();
            this.renderCartItems();
            this.showNotification(this.texts.cartCleared);
        }
    }

    animateCartButton() {
        const cartFloat = document.getElementById('cart-float');
        if (cartFloat) {
            cartFloat.style.animation = 'bounce 0.6s ease';
            setTimeout(() => {
                cartFloat.style.animation = '';
            }, 600);
        }
    }

    showNotification(message, type = 'success') {
        document.querySelectorAll('.emirates-notification').forEach(n => n.remove());

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        const notification = document.createElement('div');
        notification.className = 'emirates-notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 24px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 15px;
            font-weight: 700;
            z-index: 10000;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            animation: slideInRight 0.4s ease;
            max-width: 300px;
            cursor: pointer;
            font-family: ${this.isEnglish ? "'Inter', sans-serif" : "'Cairo', sans-serif"};
            direction: ${this.isEnglish ? 'ltr' : 'rtl'};
            text-align: ${this.isEnglish ? 'left' : 'right'};
        `;
        
        notification.textContent = message;
        notification.addEventListener('click', () => notification.remove());
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.4s ease forwards';
                setTimeout(() => notification.remove(), 400);
            }
        }, 4000);

        if (!document.getElementById('notification-animations')) {
            const animStyles = document.createElement('style');
            animStyles.id = 'notification-animations';
            animStyles.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(animStyles);
        }
    }

    // Helper functions
    getTotalItems() {
        return this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }

    getTotalPrice() {
        return this.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    }

    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
            console.log(`✅ Saved ${this.items.length} items to storage`);
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            this.items = saved ? JSON.parse(saved) : [];
            console.log(`✅ Loaded ${this.items.length} items from storage`);
        } catch (error) {
            console.error('Error loading from storage:', error);
            this.items = [];
        }
    }

    getCartData() {
        return {
            items: this.items,
            totalItems: this.getTotalItems(),
            totalPrice: this.getTotalPrice(),
            language: this.isEnglish ? 'en' : 'ar'
        };
    }
}

// Initialize cart when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.cart = new EmiratesCart();
        console.log('✅ Emirates Cart initialized on DOMContentLoaded');
    });
} else {
    window.cart = new EmiratesCart();
    console.log('✅ Emirates Cart initialized immediately');
}

// Global functions for compatibility
window.addToCart = (productId) => {
    if (window.cart) {
        window.cart.addToCart(productId, true);
    } else {
        console.error('❌ Cart system not initialized');
    }
};

window.openCart = () => {
    if (window.cart) {
        window.cart.openCart();
    }
};