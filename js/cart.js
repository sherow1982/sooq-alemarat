/**
 * نظام السلة المحسن - فتح الشريط فوراً عند الإضافة
 * Enhanced Cart System - Open Sidebar Immediately on Add
 */

class EmiratesCart {
    constructor() {
        this.items = [];
        this.storageKey = 'emirates_cart';
        this.isOpen = false;
        this.init();
    }

    init() {
        console.log('🛒 تفعيل سلة الإمارات المحسنة...');
        this.loadFromStorage();
        this.createCartUI();
        this.setupEventListeners();
        this.updateCartDisplay();
        console.log('✅ تم تفعيل السلة - جاهزة للاستخدام');
    }

    createCartUI() {
        // إزالة العناصر الموجودة لتجنب التضارب
        document.querySelectorAll('#cart-float, #cart-overlay, #cart-sidebar').forEach(el => el.remove());

        // زر السلة العائم
        const cartFloat = document.createElement('div');
        cartFloat.id = 'cart-float';
        cartFloat.className = 'cart-float';
        cartFloat.innerHTML = `
            <div class="cart-icon">🛒</div>
            <div class="cart-badge" id="cart-badge">0</div>
        `;
        document.body.appendChild(cartFloat);

        // الطبقة التغطية
        const overlay = document.createElement('div');
        overlay.id = 'cart-overlay';
        overlay.className = 'cart-overlay';
        document.body.appendChild(overlay);

        // الشريط الجانبي
        const sidebar = document.createElement('div');
        sidebar.id = 'cart-sidebar';
        sidebar.className = 'cart-sidebar';
        sidebar.innerHTML = `
            <div class="cart-header">
                <h3>🛒 سلة التسوق</h3>
                <button class="cart-close" id="cart-close">×</button>
            </div>
            <div class="cart-body" id="cart-items-container"></div>
            <div class="cart-footer">
                <div class="cart-summary">
                    <div class="total-row">العدد: <span id="total-items">0</span></div>
                    <div class="total-row">المجموع: <span id="total-price">0 درهم</span></div>
                    <div class="total-row final">الإجمالي: <span id="final-total">0 درهم</span></div>
                </div>
                <button class="checkout-btn" id="checkout-btn" disabled>
                    🚀 إتمام الطلب
                </button>
                <button class="clear-btn" id="clear-btn">🗑 تفريغ السلة</button>
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
                left: 30px;
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
                right: -450px;
                width: 420px;
                height: 100vh;
                background: white;
                z-index: 9999;
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2);
                display: flex;
                flex-direction: column;
                font-family: 'Cairo', sans-serif;
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
                    left: 20px;
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
        // فتح السلة
        const cartFloat = document.getElementById('cart-float');
        if (cartFloat) {
            cartFloat.addEventListener('click', () => {
                console.log('🛒 النقر على زر السلة');
                this.openCart();
            });
        }

        // إغلاق السلة
        const cartClose = document.getElementById('cart-close');
        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeCart());
        }

        // إغلاق بالنقر على الطبقة
        const overlay = document.getElementById('cart-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeCart());
        }

        // زر إتمام الطلب
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
        }

        // زر تفريغ السلة
        const clearBtn = document.getElementById('clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearCart());
        }

        // مستمع عام لأزرار الإضافة
        document.addEventListener('click', (e) => {
            if (e.target.matches('.add-to-cart') || e.target.closest('.add-to-cart')) {
                e.preventDefault();
                e.stopPropagation();
                
                const btn = e.target.matches('.add-to-cart') ? e.target : e.target.closest('.add-to-cart');
                const productId = btn.getAttribute('data-product-id');
                
                if (productId) {
                    console.log(`🛒 زر الإضافة: ${productId}`);
                    this.addToCart(productId, true); // true = فتح السلة فوراً
                } else {
                    console.warn('⚠️ لم يتم العثور على product-id');
                }
            }
        });

        console.log('✅ تم تفعيل مستمعات الأحداث');
    }

    // إضافة منتج للسلة مع فتح الشريط فوراً
    async addToCart(productId, openSidebarImmediately = true) {
        try {
            console.log(`🛒 إضافة منتج: ${productId}`);
            
            const product = await this.getProductData(productId);
            if (!product) {
                this.showNotification('❌ لم يتم العثور على المنتج', 'error');
                return false;
            }

            const existingItem = this.items.find(item => item.id === productId.toString());
            
            if (existingItem) {
                existingItem.quantity += 1;
                this.showNotification(`تم زيادة عدد "${product.title}" ✅`);
            } else {
                const cartItem = {
                    id: productId.toString(),
                    title: product.title,
                    price: product.sale_price || product.regular_price || 0,
                    image: product.image_url || 'https://via.placeholder.com/60x60/D4AF37/FFFFFF?text=صورة',
                    quantity: 1,
                    addedAt: Date.now()
                };
                
                this.items.push(cartItem);
                this.showNotification(`تم إضافة "${product.title}" للسلة ✅`);
            }

            this.saveToStorage();
            this.updateCartDisplay();
            this.animateCartButton();

            // فتح السلة فوراً لعرض المنتج الجديد
            if (openSidebarImmediately) {
                setTimeout(() => {
                    this.openCart();
                    console.log('✅ تم فتح السلة تلقائياً لعرض المنتج الجديد');
                }, 300);
            }

            return true;

        } catch (error) {
            console.error('خطأ في إضافة المنتج:', error);
            this.showNotification('حدث خطأ في الإضافة', 'error');
            return false;
        }
    }

    // فتح السلة
    openCart() {
        console.log('🛒 فتح شريط السلة...');
        
        const overlay = document.getElementById('cart-overlay');
        const sidebar = document.getElementById('cart-sidebar');
        
        if (!overlay || !sidebar) {
            console.error('❌ عناصر السلة غير موجودة');
            return;
        }

        // تحديث المحتوى قبل الفتح
        this.renderCartItems();
        
        overlay.classList.add('show');
        sidebar.classList.add('show');
        this.isOpen = true;
        
        document.body.style.overflow = 'hidden';
        
        console.log(`✅ تم فتح السلة - ${this.items.length} عنصر`);
    }

    closeCart() {
        const overlay = document.getElementById('cart-overlay');
        const sidebar = document.getElementById('cart-sidebar');
        
        if (overlay) overlay.classList.remove('show');
        if (sidebar) sidebar.classList.remove('show');
        
        this.isOpen = false;
        document.body.style.overflow = '';
        
        console.log('✅ تم إغلاق السلة');
    }

    // عرض المنتجات في السلة
    renderCartItems() {
        const container = document.getElementById('cart-items-container');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🛒</div>
                    <h4>السلة فارغة</h4>
                    <p>ابدأ بإضافة منتجات للسلة</p>
                </div>
            `;
            return;
        }

        const itemsHTML = this.items.map(item => `
            <div class="cart-item" data-item-id="${item.id}">
                <img class="item-image" src="${item.image}" alt="${item.title}"
                     onerror="this.src='https://via.placeholder.com/60x60/D4AF37/FFFFFF?text=صورة'">
                <div class="item-info">
                    <div class="item-title">${item.title.length > 30 ? item.title.substring(0, 30) + '...' : item.title}</div>
                    <div class="item-price">${(item.price * item.quantity).toFixed(0)} درهم</div>
                    <div class="item-controls" style="margin-top: 0.5rem;">
                        <button class="qty-btn" onclick="window.cart.decreaseQuantity('${item.id}')">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="window.cart.increaseQuantity('${item.id}')">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="window.cart.removeItem('${item.id}')" title="حذف">×</button>
            </div>
        `).join('');

        container.innerHTML = itemsHTML;
        console.log(`✅ تم عرض ${this.items.length} عنصر في السلة`);
    }

    // تحديث عرض السلة
    updateCartDisplay() {
        const badge = document.getElementById('cart-badge');
        const totalItems = document.getElementById('total-items');
        const totalPrice = document.getElementById('total-price');
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
        if (totalPrice) totalPrice.textContent = `${subtotal} درهم`;
        if (finalTotal) finalTotal.textContent = `${total} درهم`;

        if (checkoutBtn) {
            checkoutBtn.disabled = itemCount === 0;
        }
    }

    // إتمام الطلب
    proceedToCheckout() {
        if (this.items.length === 0) {
            this.showNotification('❌ السلة فارغة!', 'error');
            return;
        }

        try {
            const cartData = {
                items: this.items,
                totalItems: this.getTotalItems(),
                totalPrice: this.getTotalPrice()
            };

            sessionStorage.setItem('checkout_cart_data', JSON.stringify(cartData));
            
            const checkoutWindow = window.open('./checkout.html', '_blank', 'noopener,noreferrer');
            
            if (checkoutWindow) {
                this.showNotification('🚀 جاري فتح صفحة إتمام الطلب...');
                this.closeCart();
            } else {
                this.showNotification('❌ لم يتم فتح صفحة الطلب - تحقق من حاجب النوافذ', 'error');
            }

        } catch (error) {
            console.error('خطأ في إتمام الطلب:', error);
            this.showNotification('❌ حدث خطأ في فتح صفحة الطلب', 'error');
        }
    }

    // الحصول على بيانات المنتج
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
                    console.log(`✅ وُجد المنتج: ${product.title}`);
                    return product;
                }
            }
        }

        // تحميل مباشر إذا لم يوجد
        try {
            const response = await fetch('./data/uae-products.json');
            if (response.ok) {
                const products = await response.json();
                const product = products.find(p => p.id == productId);
                if (product) return product;
            }
        } catch (error) {
            console.warn('خطأ في تحميل بيانات المنتج:', error);
        }

        return null;
    }

    // زيادة الكمية
    increaseQuantity(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.quantity += 1;
            this.saveToStorage();
            this.updateCartDisplay();
            this.renderCartItems();
        }
    }

    // تقليل الكمية
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

    // حذف عنصر
    removeItem(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (item && confirm(`هل تريد حذف "${item.title}"؟`)) {
            this.items = this.items.filter(i => i.id !== itemId);
            this.saveToStorage();
            this.updateCartDisplay();
            this.renderCartItems();
            this.showNotification(`تم حذف "${item.title}" ✅`);
        }
    }

    // تفريغ السلة
    clearCart() {
        if (this.items.length === 0) {
            this.showNotification('السلة فارغة بالفعل', 'info');
            return;
        }
        
        if (confirm('هل تريد تفريغ السلة بالكامل؟')) {
            this.items = [];
            this.saveToStorage();
            this.updateCartDisplay();
            this.renderCartItems();
            this.showNotification('تم تفريغ السلة ✅');
        }
    }

    // تحريك زر السلة
    animateCartButton() {
        const cartFloat = document.getElementById('cart-float');
        if (cartFloat) {
            cartFloat.style.animation = 'bounce 0.6s ease';
            setTimeout(() => {
                cartFloat.style.animation = '';
            }, 600);
        }
    }

    // عرض إشعار
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
            font-family: 'Cairo', sans-serif;
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

    // الدوال المساعدة
    getTotalItems() {
        return this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }

    getTotalPrice() {
        return this.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    }

    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
            console.log(`✅ تم حفظ ${this.items.length} عنصر`);
        } catch (error) {
            console.error('خطأ في الحفظ:', error);
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            this.items = saved ? JSON.parse(saved) : [];
            console.log(`✅ تم تحميل ${this.items.length} عنصر`);
        } catch (error) {
            console.error('خطأ في التحميل:', error);
            this.items = [];
        }
    }

    getCartData() {
        return {
            items: this.items,
            totalItems: this.getTotalItems(),
            totalPrice: this.getTotalPrice()
        };
    }
}

// تفعيل فوري
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.cart = new EmiratesCart();
        console.log('✅ تم تفعيل سلة الإمارات');
    });
} else {
    window.cart = new EmiratesCart();
    console.log('✅ تم تفعيل سلة الإمارات (فوري)');
}

// دوال عامة للتوافق
window.addToCart = (productId) => {
    if (window.cart) {
        window.cart.addToCart(productId, true);
    } else {
        console.error('❌ نظام السلة غير مفعل');
    }
};

window.openCart = () => {
    if (window.cart) {
        window.cart.openCart();
    }
};