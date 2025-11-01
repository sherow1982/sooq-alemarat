/**
 * نظام سلة التسوق الشامل
 * Complete Shopping Cart System
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
        console.log('🛒 تم تفعيل نظام سلة التسوق');
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
            cartFloat.setAttribute('title', 'سلة التسوق');
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
            /* Cart Float Button */
            .cart-float {
                position: fixed;
                bottom: 90px;
                left: 20px;
                z-index: 1001;
                background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
                color: white;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 8px 25px rgba(218, 165, 32, 0.4);
                transition: all 0.3s ease;
                animation: bounce-cart 3s infinite;
                user-select: none;
            }

            .cart-float:hover {
                transform: scale(1.1) translateY(-3px);
                box-shadow: 0 12px 35px rgba(218, 165, 32, 0.6);
                animation: none;
            }

            .cart-icon {
                position: relative;
                font-size: 24px;
            }

            .cart-count {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #EF4444;
                color: white;
                border-radius: 50%;
                width: 22px;
                height: 22px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                min-width: 22px;
                box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
                transform: scale(0);
                transition: transform 0.3s ease;
            }

            .cart-count.show {
                transform: scale(1);
            }

            @keyframes bounce-cart {
                0%, 100% { transform: translateY(0); }
                25% { transform: translateY(-8px); }
                50% { transform: translateY(0); }
                75% { transform: translateY(-4px); }
            }

            /* Scroll to Top Button */
            .scroll-to-top {
                position: fixed;
                bottom: 160px;
                left: 20px;
                z-index: 1001;
                background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
                color: white;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px);
                transition: all 0.3s ease;
                font-size: 20px;
                box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                user-select: none;
            }

            .scroll-to-top.visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .scroll-to-top:hover {
                transform: scale(1.15) translateY(-3px);
                box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
            }

            /* Cart Sidebar */
            .cart-sidebar {
                position: fixed;
                top: 0;
                left: -400px;
                width: 400px;
                height: 100vh;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(20px);
                box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                transition: left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                display: flex;
                flex-direction: column;
                border-right: 1px solid #E5E7EB;
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
                background: rgba(0, 0, 0, 0.5);
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
                padding: 2rem;
                background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
                color: white;
                position: relative;
                box-shadow: 0 4px 15px rgba(218, 165, 32, 0.3);
            }

            .cart-header h2 {
                font-size: 1.5rem;
                font-weight: 800;
                margin-bottom: 0.5rem;
            }

            .cart-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 1.2rem;
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
                border: 1px solid #E5E7EB;
                border-radius: 12px;
                margin-bottom: 1rem;
                background: white;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
            }

            .cart-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
            }

            .cart-item-image {
                width: 60px;
                height: 60px;
                border-radius: 8px;
                object-fit: cover;
                border: 2px solid #DAA520;
            }

            .cart-item-info {
                flex: 1;
            }

            .cart-item-title {
                font-size: 0.9rem;
                font-weight: 600;
                margin-bottom: 0.25rem;
                color: #1F2937;
            }

            .cart-item-price {
                font-size: 1rem;
                font-weight: 700;
                color: #DAA520;
            }

            .cart-item-controls {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .quantity-btn {
                width: 30px;
                height: 30px;
                border: 1px solid #DAA520;
                background: white;
                color: #DAA520;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                transition: all 0.3s ease;
            }

            .quantity-btn:hover {
                background: #DAA520;
                color: white;
                transform: scale(1.1);
            }

            .cart-quantity {
                font-weight: 600;
                color: #1F2937;
                min-width: 20px;
                text-align: center;
            }

            .remove-item {
                background: #EF4444;
                color: white;
                border: none;
                width: 25px;
                height: 25px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s ease;
            }

            .remove-item:hover {
                transform: scale(1.2);
                box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);
            }

            .cart-footer {
                padding: 1.5rem;
                background: rgba(248, 250, 252, 0.95);
                border-top: 1px solid #E5E7EB;
            }

            .cart-total {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                padding: 1rem;
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                border: 2px solid #DAA520;
            }

            .cart-total-label {
                font-size: 1.1rem;
                font-weight: 700;
                color: #1F2937;
            }

            .cart-total-price {
                font-size: 1.5rem;
                font-weight: 900;
                background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .checkout-btn {
                width: 100%;
                padding: 1.2rem;
                background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
                color: white;
                border: none;
                border-radius: 15px;
                font-size: 1.1rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(218, 165, 32, 0.3);
                position: relative;
                overflow: hidden;
            }

            .checkout-btn::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.4s ease, height 0.4s ease;
            }

            .checkout-btn:hover::before {
                width: 400px;
                height: 400px;
            }

            .checkout-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(218, 165, 32, 0.4);
            }

            .checkout-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }

            .empty-cart {
                text-align: center;
                padding: 3rem 2rem;
                color: #6B7280;
            }

            .empty-cart-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
                opacity: 0.5;
            }

            /* Mobile adjustments */
            @media (max-width: 768px) {
                .cart-sidebar {
                    width: 100vw;
                    left: -100vw;
                }

                .cart-float {
                    bottom: 80px;
                    left: 15px;
                    width: 55px;
                    height: 55px;
                }

                .cart-icon {
                    font-size: 20px;
                }

                .scroll-to-top {
                    bottom: 145px;
                    left: 15px;
                    width: 45px;
                    height: 45px;
                    font-size: 18px;
                }
            }

            /* Success animation */
            @keyframes addToCartSuccess {
                0% { transform: scale(1); }
                50% { transform: scale(1.3); background: #10B981; }
                100% { transform: scale(1); }
            }

            .cart-float.success {
                animation: addToCartSuccess 0.6s ease;
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
                const productId = btn.dataset.productId;
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
                    price: product.sale_price || product.regular_price,
                    image: product.image_url,
                    category: product.category,
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

        // محاولة من الفئة إذا كانت متاحة
        if (window.categoriesHomepage && window.categoriesHomepage.products) {
            const product = window.categoriesHomepage.products.find(p => p.id == productId);
            if (product) return product;
        }

        // بيانات احتياطية
        return {
            id: productId,
            title: 'منتج غير محدد',
            price: 0,
            image: 'https://via.placeholder.com/100x100/DAA520/FFFFFF?text=منتج',
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
    }

    // إغلاق السلة
    closeCart() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');

        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        
        document.body.style.overflow = 'auto';
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
                <h2>🛒 سلة التسوق</h2>
                <p>قائمة منتجاتك المختارة</p>
                <button class="cart-close" onclick="window.cart.closeCart()">×</button>
            </div>
            <div class="cart-body" id="cart-items-container"></div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span class="cart-total-label">إجمالي المبلغ:</span>
                    <span class="cart-total-price" id="cart-total-price">0 درهم</span>
                </div>
                <button class="checkout-btn" id="checkout-btn" onclick="window.cart.proceedToCheckout()">
                    💳 إتمام الطلب
                </button>
                <button onclick="window.cart.clearCart()" style="
                    width: 100%;
                    padding: 0.8rem;
                    background: transparent;
                    color: #EF4444;
                    border: 2px solid #EF4444;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 0.5rem;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='#EF4444'; this.style.color='white';" 
                   onmouseout="this.style.background='transparent'; this.style.color='#EF4444';">
                    🗑️ تفريغ السلة
                </button>
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
                        margin-top: 1rem;
                        padding: 0.8rem 1.5rem;
                        background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        cursor: pointer;
                        font-weight: 600;
                    ">🏠 تابع التسوق</button>
                </div>
            `;
            return;
        }

        const itemsHTML = this.items.map(item => `
            <div class="cart-item" data-item-id="${item.id}">
                <img class="cart-item-image" src="${item.image}" alt="${item.title}" 
                     onerror="this.src='https://via.placeholder.com/60x60/DAA520/FFFFFF?text=صورة'">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title.length > 40 ? item.title.substring(0, 40) + '...' : item.title}</div>
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
        }
    }

    // إزالة من السلة
    removeFromCart(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            this.items = this.items.filter(item => item.id !== productId);
            this.saveToStorage();
            this.updateCartDisplay();
            this.renderCartItems();
            this.showNotification(`تم إزالة "${item.title}" من السلة`, 'info');
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
    }

    // الانتقال لصفحة إتمام الطلب
    proceedToCheckout() {
        if (this.items.length === 0) {
            this.showNotification('سلتك فارغة! أضف منتجات أولاً', 'warning');
            return;
        }

        // فتح صفحة إتمام الطلب
        const checkoutUrl = './checkout.html';
        window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
        
        this.showNotification('جاري فتح صفحة إتمام الطلب...', 'info');
    }

    // حساب إجمالي العناصر
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // حساب إجمالي السعر
    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // حفظ في التخزين المحلي
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        } catch (error) {
            console.error('خطأ في حفظ السلة:', error);
        }
    }

    // تحميل معن التخزين
    loadFromStorage() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            this.items = saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('خطأ في تحميل السلة:', error);
            this.items = [];
        }
    }

    // تنظيف السلة
    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.updateCartDisplay();
        this.renderCartItems();
        this.showNotification('تم تفريغ السلة ✅', 'success');
    }

    // تأثير عند الإضافة
    animateCartButton() {
        const cartFloat = document.getElementById('cart-float');
        if (cartFloat) {
            cartFloat.classList.add('success');
            setTimeout(() => {
                cartFloat.classList.remove('success');
            }, 600);
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

    // عرض إشعار
    showNotification(message, type = 'success') {
        const colors = {
            success: { bg: '#10B981', shadow: 'rgba(16, 185, 129, 0.3)' },
            error: { bg: '#EF4444', shadow: 'rgba(239, 68, 68, 0.3)' },
            warning: { bg: '#F59E0B', shadow: 'rgba(245, 158, 11, 0.3)' },
            info: { bg: '#3B82F6', shadow: 'rgba(59, 130, 246, 0.3)' }
        };
        
        const color = colors[type] || colors.success;
        
        // إزالة الإشعارات السابقة
        document.querySelectorAll('.cart-notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10001;
            background: ${color.bg};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            box-shadow: 0 4px 20px ${color.shadow};
            animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            cursor: pointer;
            max-width: 320px;
            word-wrap: break-word;
        `;
        notification.textContent = message;
        
        // إغلاق عند النقر
        notification.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        document.body.appendChild(notification);
        
        // إغلاق تلقائي بعد 4 ثوانٍ
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
        
        // إضافة الأنماط المتحركة
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes slideOutRight {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(100px);
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
}

// تفعيل النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إنشاء مثيل عام للسلة
    window.cart = new ShoppingCart();
    
    console.log('✅ تم تفعيل نظام السلة بنجاح');
});