/**
 * نظام سلة التسوق الشامل - محدث بأسلوب دخون
 * Complete Shopping Cart System - Updated with Dkhoon Style
 */

class ShoppingCart {
    constructor() {
        this.items = [];
        this.storageKey = 'emirates_cart';
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.createFloatingElements();
        this.setupEventListeners();
        this.updateCartDisplay();
        console.log('🛒 تم تفعيل نظام سلة التسوق الفاخر');
    }

    // إنشاء العناصر العائمة
    createFloatingElements() {
        // زر السلة العائم
        if (!document.getElementById('cart-float')) {
            const cartFloat = document.createElement('div');
            cartFloat.id = 'cart-float';
            cartFloat.className = 'cart-float';
            cartFloat.innerHTML = `
                <div class="cart-icon">
                    🛒
                    <span class="cart-count" id="cart-count">0</span>
                </div>
            `;
            cartFloat.setAttribute('title', 'فتح سلة التسوق');
            document.body.appendChild(cartFloat);
        }

        // زر العودة لأعلى
        if (!document.getElementById('scroll-to-top')) {
            const scrollTop = document.createElement('div');
            scrollTop.id = 'scroll-to-top';
            scrollTop.className = 'scroll-to-top';
            scrollTop.innerHTML = '⬆️';
            scrollTop.setAttribute('title', 'العودة لأعلى');
            document.body.appendChild(scrollTop);
        }

        // إضافة الأنماط CSS للعناصر العائمة
        this.addFloatingStyles();
    }

    addFloatingStyles() {
        if (document.getElementById('floating-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'floating-styles';
        styles.textContent = `
            /* زر السلة العائم - نمط دخون */
            .cart-float {
                position: fixed;
                bottom: 100px;
                left: 24px;
                z-index: 1002;
                background: var(--gradient-gold);
                color: white;
                width: 70px;
                height: 70px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: var(--shadow-gold);
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                animation: floatCart 4s ease-in-out infinite;
                user-select: none;
                border: 3px solid rgba(255, 255, 255, 0.8);
            }

            .cart-float:hover {
                transform: scale(1.2) translateY(-8px) rotateZ(-10deg);
                box-shadow: var(--shadow-premium);
                background: var(--gradient-royal);
                animation: none;
            }

            @keyframes floatCart {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                25% { transform: translateY(-8px) rotate(2deg); }
                50% { transform: translateY(0) rotate(0deg); }
                75% { transform: translateY(-4px) rotate(-2deg); }
            }

            .cart-icon {
                position: relative;
                font-size: 28px;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
            }

            .cart-count {
                position: absolute;
                top: -10px;
                right: -10px;
                background: linear-gradient(135deg, #FF6B6B, #EE5A24);
                color: white;
                border-radius: 50%;
                width: 26px;
                height: 26px;
                font-size: 13px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 900;
                min-width: 26px;
                box-shadow: 0 4px 15px rgba(255, 107, 107, 0.5);
                transform: scale(0);
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 2px solid white;
            }

            .cart-count.show {
                transform: scale(1);
                animation: bounceIn 0.6s ease;
            }

            @keyframes bounceIn {
                0% { transform: scale(0); }
                50% { transform: scale(1.3); }
                100% { transform: scale(1); }
            }

            /* زر العودة لأعلى */
            .scroll-to-top {
                position: fixed;
                bottom: 180px;
                left: 24px;
                z-index: 1002;
                background: var(--gradient-sky);
                color: white;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transform: translateY(30px) scale(0.8);
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                font-size: 24px;
                box-shadow: 0 8px 25px rgba(135, 206, 235, 0.4);
                user-select: none;
                border: 3px solid rgba(255, 255, 255, 0.8);
            }

            .scroll-to-top.visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0) scale(1);
            }

            .scroll-to-top:hover {
                transform: scale(1.2) translateY(-8px) rotateZ(15deg);
                box-shadow: 0 15px 40px rgba(135, 206, 235, 0.6);
                background: linear-gradient(135deg, #4682B4 0%, #1E90FF 100%);
            }

            /* شريط السلة الجانبي */
            .cart-sidebar {
                position: fixed;
                top: 0;
                left: -450px;
                width: 450px;
                height: 100vh;
                background: 
                    linear-gradient(135deg, var(--pearl-white) 0%, var(--cream-white) 100%),
                    radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
                backdrop-filter: blur(30px);
                box-shadow: 8px 0 40px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                transition: left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                display: flex;
                flex-direction: column;
                border-right: 3px solid var(--gold-primary);
            }

            .cart-sidebar.open {
                left: 0;
            }

            .cart-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(44, 24, 16, 0.4);
                backdrop-filter: blur(8px);
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .cart-overlay.show {
                opacity: 1;
                visibility: visible;
            }

            .cart-header {
                padding: 2.5rem;
                background: var(--gradient-gold);
                color: white;
                position: relative;
                box-shadow: 0 6px 25px rgba(212, 175, 55, 0.4);
            }

            .cart-header h2 {
                font-size: 1.8rem;
                font-weight: 900;
                margin-bottom: 0.8rem;
                text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }

            .cart-close {
                position: absolute;
                top: 1.2rem;
                right: 1.2rem;
                background: rgba(255, 255, 255, 0.25);
                border: 2px solid rgba(255, 255, 255, 0.4);
                color: white;
                width: 45px;
                height: 45px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 1.4rem;
                font-weight: bold;
                transition: all 0.3s ease;
            }

            .cart-close:hover {
                background: rgba(255, 255, 255, 0.4);
                transform: scale(1.1) rotate(90deg);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            }

            /* عناصر السلة */
            .cart-body {
                flex: 1;
                overflow-y: auto;
                padding: 1.5rem;
            }

            .cart-item {
                display: flex;
                align-items: center;
                gap: 1.2rem;
                padding: 1.5rem;
                border: 2px solid rgba(212, 175, 55, 0.2);
                border-radius: 20px;
                margin-bottom: 1.2rem;
                background: var(--bg-card);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                transition: all 0.3s ease;
            }

            .cart-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 30px rgba(212, 175, 55, 0.2);
                border-color: var(--gold-primary);
            }

            .cart-item-image {
                width: 70px;
                height: 70px;
                border-radius: 15px;
                object-fit: cover;
                border: 3px solid var(--gold-light);
                box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
            }

            .cart-item-info {
                flex: 1;
            }

            .cart-item-title {
                font-size: 1rem;
                font-weight: 700;
                margin-bottom: 0.4rem;
                color: var(--text-primary);
                line-height: 1.3;
            }

            .cart-item-price {
                font-size: 1.1rem;
                font-weight: 800;
                background: var(--gradient-gold);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            /* أزرار الكمية */
            .cart-item-controls {
                display: flex;
                align-items: center;
                gap: 0.8rem;
            }

            .quantity-btn {
                width: 35px;
                height: 35px;
                border: 2px solid var(--gold-primary);
                background: white;
                color: var(--gold-primary);
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 900;
                font-size: 16px;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-shadow: 0 3px 10px rgba(212, 175, 55, 0.2);
            }

            .quantity-btn:hover {
                background: var(--gradient-gold);
                color: white;
                transform: scale(1.15);
                box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
            }

            .cart-quantity {
                font-weight: 800;
                color: var(--text-primary);
                min-width: 25px;
                text-align: center;
                font-size: 1.1rem;
            }

            .remove-item {
                background: linear-gradient(135deg, #FF6B6B, #EE5A24);
                color: white;
                border: none;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.3s ease;
                box-shadow: 0 3px 10px rgba(255, 107, 107, 0.3);
            }

            .remove-item:hover {
                transform: scale(1.2) rotate(90deg);
                box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5);
            }

            /* ذيل السلة */
            .cart-footer {
                padding: 2rem;
                background: 
                    var(--gradient-pearl),
                    radial-gradient(circle at 50% 100%, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
                border-top: 2px solid rgba(212, 175, 55, 0.3);
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
            }

            .cart-total {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                padding: 1.5rem;
                background: white;
                border-radius: 20px;
                box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
                border: 3px solid var(--gold-light);
            }

            .cart-total-label {
                font-size: 1.2rem;
                font-weight: 800;
                color: var(--text-primary);
            }

            .cart-total-price {
                font-size: 1.8rem;
                font-weight: 900;
                background: var(--gradient-gold);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
            }

            /* أزرار إتمام الطلب */
            .checkout-btn {
                width: 100%;
                padding: 1.6rem;
                background: var(--gradient-gold);
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 1.3rem;
                font-weight: 800;
                cursor: pointer;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4);
                position: relative;
                overflow: hidden;
                text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                border: 3px solid transparent;
            }

            .checkout-btn::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.5s ease;
                z-index: 1;
            }

            .checkout-btn:hover::before {
                width: 500px;
                height: 500px;
            }

            .checkout-btn:hover {
                transform: translateY(-5px) scale(1.02);
                box-shadow: 0 15px 50px rgba(212, 175, 55, 0.6);
                background: var(--gradient-royal);
                border-color: rgba(255, 255, 255, 0.5);
            }

            .checkout-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                background: linear-gradient(135deg, #9CA3AF, #6B7280);
            }

            /* حالة فارغة */
            .empty-cart {
                text-align: center;
                padding: 4rem 2rem;
                color: var(--text-secondary);
                background: var(--bg-card);
                border-radius: 20px;
                border: 2px solid rgba(212, 175, 55, 0.1);
            }

            .empty-cart-icon {
                font-size: 5rem;
                margin-bottom: 1.5rem;
                opacity: 0.6;
                filter: drop-shadow(0 4px 15px rgba(212, 175, 55, 0.2));
            }

            .empty-cart h3 {
                font-size: 1.5rem;
                font-weight: 700;
                margin-bottom: 0.8rem;
                color: var(--text-primary);
            }

            .empty-cart p {
                font-size: 1.1rem;
                color: var(--text-secondary);
                margin-bottom: 2rem;
            }

            /* استجابة للهواتف */
            @media (max-width: 768px) {
                .cart-sidebar {
                    width: 100vw;
                    left: -100vw;
                }

                .cart-float {
                    bottom: 90px;
                    left: 20px;
                    width: 60px;
                    height: 60px;
                }

                .scroll-to-top {
                    bottom: 160px;
                    left: 20px;
                    width: 50px;
                    height: 50px;
                    font-size: 20px;
                }
            }

            /* تأثيرات النجاح */
            .cart-float.success {
                animation: cartSuccessLuxury 0.8s ease;
            }

            @keyframes cartSuccessLuxury {
                0% { transform: scale(1); background: var(--gradient-gold); }
                25% { transform: scale(1.3) rotate(15deg); background: var(--gradient-emerald); }
                50% { transform: scale(1.1) rotate(-10deg); background: var(--gradient-gold); }
                75% { transform: scale(1.2) rotate(5deg); background: var(--gradient-emerald); }
                100% { transform: scale(1); background: var(--gradient-gold); }
            }
        `;
        document.head.appendChild(styles);
    }

    setupEventListeners() {
        // فتح السلة
        const cartFloat = document.getElementById('cart-float');
        if (cartFloat) {
            cartFloat.addEventListener('click', () => this.openCart());
        }

        // العودة لأعلى
        const scrollTop = document.getElementById('scroll-to-top');
        if (scrollTop) {
            scrollTop.addEventListener('click', () => this.scrollToTop());
        }

        // مراقبة التمرير
        window.addEventListener('scroll', () => this.handleScroll());

        // مستمعي أزرار إضافة للسلة
        document.addEventListener('click', (e) => {
            if (e.target.matches('.add-to-cart') || e.target.closest('.add-to-cart')) {
                const btn = e.target.matches('.add-to-cart') ? e.target : e.target.closest('.add-to-cart');
                const productId = btn.dataset.productId || btn.getAttribute('data-product-id');
                if (productId) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.addToCart(productId);
                }
            }
        });
    }

    // إضافة منتج للسلة
    addToCart(productId) {
        try {
            console.log(`🛒 محاولة إضافة منتج: ${productId}`);
            
            // الحصول على بيانات المنتج
            const product = this.getProductById(productId);
            if (!product) {
                this.showNotification('خطأ: لم يتم العثور على بيانات المنتج', 'error');
                return;
            }

            // فحص وجود العنصر
            const existingItem = this.items.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
                this.showNotification(`تم زيادة عدد "${product.title}" في السلة ✅`, 'success');
            } else {
                const cartItem = {
                    id: product.id,
                    title: product.title,
                    price: product.sale_price || product.regular_price || 0,
                    image: product.image_url || 'https://via.placeholder.com/70x70/D4AF37/FFFFFF?text=صورة',
                    category: product.category || 'غير محدد',
                    quantity: 1,
                    addedAt: Date.now()
                };
                
                this.items.push(cartItem);
                this.showNotification(`تم إضافة "${product.title}" للسلة ✅`, 'success');
            }

            this.saveToStorage();
            this.updateCartDisplay();
            this.animateCartButton();

        } catch (error) {
            console.error('خطأ في إضافة المنتج للسلة:', error);
            this.showNotification('حدث خطأ في إضافة المنتج', 'error');
        }
    }

    // الحصول على بيانات المنتج
    getProductById(productId) {
        // محاولة الحصول من المتغير العام
        if (window.productsData && Array.isArray(window.productsData)) {
            const product = window.productsData.find(p => p.id == productId);
            if (product) return product;
        }

        // محاولة مع فئة الصفحة الرئيسية
        if (window.categoriesHomepage && window.categoriesHomepage.products) {
            const product = window.categoriesHomepage.products.find(p => p.id == productId);
            if (product) return product;
        }

        // بيانات احتياطية
        console.warn(`لم يتم العثور على بيانات المنتج: ${productId}`);
        return {
            id: productId,
            title: 'منتج غير محدد',
            price: 0,
            image: 'https://via.placeholder.com/70x70/DAA520/FFFFFF?text=منتج',
            category: 'عام'
        };
    }

    // فتح شريط السلة الجانبي
    openCart() {
        let sidebar = document.getElementById('cart-sidebar');
        let overlay = document.getElementById('cart-overlay');

        if (!sidebar) {
            this.createCartSidebar();
            sidebar = document.getElementById('cart-sidebar');
            overlay = document.getElementById('cart-overlay');
        }

        this.renderCartItems();
        
        overlay.classList.add('show');
        sidebar.classList.add('open');
        
        // منع التمرير في الخلفية
        document.body.style.overflow = 'hidden';
        
        console.log('✅ تم فتح سلة التسوق');
    }

    // إغلاق السلة
    closeCart() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');

        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        
        document.body.style.overflow = 'auto';
        
        console.log('✅ تم إغلاق سلة التسوق');
    }

    // إنشاء شريط السلة
    createCartSidebar() {
        const overlay = document.createElement('div');
        overlay.id = 'cart-overlay';
        overlay.className = 'cart-overlay';
        overlay.addEventListener('click', () => this.closeCart());
        document.body.appendChild(overlay);

        const sidebar = document.createElement('div');
        sidebar.id = 'cart-sidebar';
        sidebar.className = 'cart-sidebar';
        sidebar.innerHTML = `
            <div class="cart-header">
                <h2>🛒 سلة التسوق الفاخرة</h2>
                <p>قائمة منتجاتك المختارة</p>
                <button class="cart-close" onclick="window.cart.closeCart()">×</button>
            </div>
            <div class="cart-body" id="cart-items-container"></div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span class="cart-total-label">المجموع النهائي:</span>
                    <span class="cart-total-price" id="cart-total-price">0 درهم</span>
                </div>
                <button class="checkout-btn" id="checkout-btn" onclick="window.cart.proceedToCheckout()">
                    🚀 إتمام الطلب
                </button>
                <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                    <button onclick="window.cart.clearCart()" style="
                        flex: 1;
                        padding: 0.8rem;
                        background: transparent;
                        color: #FF6B6B;
                        border: 2px solid #FF6B6B;
                        border-radius: 15px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#FF6B6B'; this.style.color='white';" 
                       onmouseout="this.style.background='transparent'; this.style.color='#FF6B6B';">
                        🗑️ تفريغ
                    </button>
                    <a href="./cart.html" target="_blank" style="
                        flex: 1;
                        padding: 0.8rem;
                        background: rgba(212, 175, 55, 0.1);
                        color: var(--gold-primary);
                        border: 2px solid var(--gold-primary);
                        border-radius: 15px;
                        font-weight: 600;
                        text-decoration: none;
                        text-align: center;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='var(--gradient-gold)'; this.style.color='white';" 
                       onmouseout="this.style.background='rgba(212, 175, 55, 0.1)'; this.style.color='var(--gold-primary)';">
                        📋 عرض مفصل
                    </a>
                </div>
            </div>
        `;
        document.body.appendChild(sidebar);
    }

    // عرض عناصر السلة
    renderCartItems() {
        const container = document.getElementById('cart-items-container');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>سلتك فارغة</h3>
                    <p>ابدأ بإضافة منتجات من المتجر</p>
                    <button onclick="window.cart.closeCart()" style="
                        margin-top: 2rem;
                        padding: 1rem 2rem;
                        background: var(--gradient-gold);
                        color: white;
                        border: none;
                        border-radius: 20px;
                        cursor: pointer;
                        font-weight: 700;
                        font-size: 1.1rem;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(212, 175, 55, 0.4)';" 
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                        🏠 تابع التسوق
                    </button>
                </div>
            `;
            return;
        }

        const itemsHTML = this.items.map(item => `
            <div class="cart-item" data-item-id="${item.id}">
                <img class="cart-item-image" src="${item.image}" alt="${item.title}" 
                     onerror="this.src='https://via.placeholder.com/70x70/D4AF37/FFFFFF?text=صورة'">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title.length > 35 ? item.title.substring(0, 35) + '...' : item.title}</div>
                    <div class="cart-item-price">${item.price} درهم</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="window.cart.decreaseQuantity('${item.id}')">−</button>
                    <span class="cart-quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="window.cart.increaseQuantity('${item.id}')">+</button>
                    <button class="remove-item" onclick="window.cart.removeFromCart('${item.id}')" title="إزالة من السلة">×</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = itemsHTML;
    }

    // زيادة العدد
    increaseQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += 1;
            this.saveToStorage();
            this.updateCartDisplay();
            this.renderCartItems();
            console.log(`✅ زيادة كمية ${item.title}`);
        }
    }

    // تقليل العدد
    decreaseQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            this.saveToStorage();
            this.updateCartDisplay();
            this.renderCartItems();
            console.log(`✅ تقليل كمية ${item.title}`);
        }
    }

    // إزالة من السلة
    removeFromCart(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (confirm(`هل تريد إزالة "${item.title}" من السلة؟`)) {
                this.items = this.items.filter(item => item.id !== productId);
                this.saveToStorage();
                this.updateCartDisplay();
                this.renderCartItems();
                this.showNotification(`تم إزالة "${item.title}" من السلة ✅`, 'info');
            }
        }
    }

    // تحديث عرض السلة
    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const totalItems = this.getTotalItems();
        const totalPrice = this.getTotalPrice();
        
        if (cartCount) {
            cartCount.textContent = totalItems > 99 ? '99+' : totalItems;
            if (totalItems > 0) {
                cartCount.classList.add('show');
            } else {
                cartCount.classList.remove('show');
            }
        }

        // تحديث الإجمالي في الشريط الجانبي
        const totalPriceElement = document.getElementById('cart-total-price');
        if (totalPriceElement) {
            totalPriceElement.textContent = `${totalPrice} درهم`;
        }

        // تفعيل/تعطيل زر الدفع
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.disabled = totalItems === 0;
        }
        
        // تحديث أي عناصر أخرى
        this.updateCheckoutPage();
    }

    // تحديث صفحة إتمام الطلب
    updateCheckoutPage() {
        // في صفحة checkout.html
        const checkoutItemsContainer = document.getElementById('order-items');
        const subtotalElement = document.getElementById('subtotal');
        const finalTotalElement = document.getElementById('final-total');
        
        if (checkoutItemsContainer) {
            this.renderCheckoutItems(checkoutItemsContainer);
        }
        
        if (subtotalElement) {
            subtotalElement.textContent = `${this.getTotalPrice()} درهم`;
        }
        
        if (finalTotalElement) {
            finalTotalElement.textContent = `${this.getTotalPrice()} درهم`;
        }
    }

    renderCheckoutItems(container) {
        if (this.items.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🛒</div>
                    <h4>لا توجد منتجات في السلة</h4>
                    <p>يرجى إضافة منتجات قبل إتمام الطلب</p>
                    <a href="./" style="
                        display: inline-block;
                        margin-top: 1rem;
                        padding: 0.8rem 1.5rem;
                        background: var(--gradient-gold);
                        color: white;
                        text-decoration: none;
                        border-radius: 15px;
                        font-weight: 700;
                        transition: all 0.3s ease;
                    " target="_blank">🏠 اذهب للمتجر</a>
                </div>
            `;
            return;
        }
        
        const itemsHTML = this.items.map(item => `
            <div class="order-item">
                <img class="item-image" src="${item.image}" alt="${item.title}" 
                     onerror="this.src='https://via.placeholder.com/60x60/D4AF37/FFFFFF?text=صورة'">
                <div class="item-details">
                    <div class="item-title">${item.title.length > 40 ? item.title.substring(0, 40) + '...' : item.title}</div>
                    <div class="item-price">${item.price * item.quantity} درهم</div>
                </div>
                <div class="item-quantity">×${item.quantity}</div>
            </div>
        `).join('');
        
        container.innerHTML = itemsHTML;
    }

    // الانتقال لصفحة إتمام الطلب
    proceedToCheckout() {
        if (this.items.length === 0) {
            this.showNotification('سلتك فارغة! أضف منتجات أولاً', 'warning');
            return;
        }

        // فتح صفحة إتمام الطلب في تبويب جديد
        const checkoutUrl = './checkout.html';
        window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
        
        this.showNotification('جاري فتح صفحة إتمام الطلب...', 'info');
        
        // إغلاق الشريط الجانبي
        this.closeCart();
    }

    // حساب إجمالي العناصر
    getTotalItems() {
        return this.items.reduce((total, item) => total + (item.quantity || 1), 0);
    }

    // حساب إجمالي السعر
    getTotalPrice() {
        return this.items.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
    }

    // حفظ في التخزين المحلي
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
            console.log(`✅ تم حفظ ${this.items.length} عنصر في السلة`);
        } catch (error) {
            console.error('خطأ في حفظ السلة:', error);
        }
    }

    // تحميل من التخزين
    loadFromStorage() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            this.items = saved ? JSON.parse(saved) : [];
            console.log(`✅ تم تحميل ${this.items.length} عنصر من التخزين`);
        } catch (error) {
            console.error('خطأ في تحميل السلة:', error);
            this.items = [];
        }
    }

    // تنظيف السلة
    clearCart() {
        if (confirm('هل تريد تفريغ سلة التسوق بالكامل؟')) {
            this.items = [];
            this.saveToStorage();
            this.updateCartDisplay();
            this.renderCartItems();
            this.showNotification('تم تفريغ السلة ✅', 'success');
        }
    }

    // تأثير عند الإضافة
    animateCartButton() {
        const cartFloat = document.getElementById('cart-float');
        if (cartFloat) {
            cartFloat.classList.add('success');
            setTimeout(() => {
                cartFloat.classList.remove('success');
            }, 800);
        }
    }

    // معالجة التمرير
    handleScroll() {
        const scrollTop = document.getElementById('scroll-to-top');
        if (scrollTop) {
            if (window.pageYOffset > 300) {
                scrollTop.classList.add('visible');
            } else {
                scrollTop.classList.remove('visible');
            }
        }
    }

    // العودة لأعلى
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // عرض إشعار فاخر
    showNotification(message, type = 'success') {
        const colors = {
            success: { bg: '#50C878', shadow: 'rgba(80, 200, 120, 0.3)' },
            error: { bg: '#FF6B6B', shadow: 'rgba(255, 107, 107, 0.3)' },
            warning: { bg: '#F59E0B', shadow: 'rgba(245, 158, 11, 0.3)' },
            info: { bg: '#87CEEB', shadow: 'rgba(135, 206, 235, 0.3)' }
        };
        
        const color = colors[type] || colors.success;
        
        // إزالة الإشعارات السابقة
        document.querySelectorAll('.cart-notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            right: 24px;
            z-index: 10001;
            background: ${color.bg};
            color: white;
            padding: 1.2rem 1.8rem;
            border-radius: 20px;
            font-weight: 700;
            box-shadow: 0 8px 35px ${color.shadow};
            cursor: pointer;
            max-width: 350px;
            word-wrap: break-word;
            backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            animation: luxurySlideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;
        notification.textContent = message;
        
        // إغلاق عند النقر
        notification.addEventListener('click', () => {
            notification.style.animation = 'luxurySlideOut 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards';
            setTimeout(() => {
                if (notification.parentNode) notification.remove();
            }, 400);
        });
        
        document.body.appendChild(notification);
        
        // إغلاق تلقائي بعد 4 ثوانِ
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'luxurySlideOut 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards';
                setTimeout(() => {
                    if (notification.parentNode) notification.remove();
                }, 400);
            }
        }, 4000);
        
        // إضافة الأنماط المتحركة الفاخرة
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                @keyframes luxurySlideIn {
                    0% {
                        opacity: 0;
                        transform: translateX(100px) rotateY(90deg) scale(0.8);
                    }
                    50% {
                        opacity: 0.8;
                        transform: translateX(10px) rotateY(10deg) scale(1.05);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0) rotateY(0deg) scale(1);
                    }
                }
                
                @keyframes luxurySlideOut {
                    0% {
                        opacity: 1;
                        transform: translateX(0) rotateY(0deg) scale(1);
                    }
                    50% {
                        opacity: 0.6;
                        transform: translateX(20px) rotateY(-10deg) scale(0.95);
                    }
                    100% {
                        opacity: 0;
                        transform: translateX(150px) rotateY(-90deg) scale(0.7);
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }

    // حصول على بيانات السلة للخارج
    getCartData() {
        return {
            items: this.items,
            totalItems: this.getTotalItems(),
            totalPrice: this.getTotalPrice(),
            timestamp: Date.now()
        };
    }

    // ربط مباشر بمتجر السلة المنفصل
    openFullCartPage() {
        window.open('./cart.html', '_blank', 'noopener,noreferrer');
        this.closeCart();
    }
}

// تفعيل النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إنشاء مثيل عام للسلة
    window.cart = new ShoppingCart();
    
    console.log('✨ تم تفعيل نظام سلة التسوق الفاخر بنجاح!');
});