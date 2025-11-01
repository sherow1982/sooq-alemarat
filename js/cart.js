/**
 * نظام سلة التسوق المتطور
 * Shopping Cart System
 */

class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.init();
        this.updateCartUI();
    }

    init() {
        // إنشاء عناصر واجهة السلة
        this.createCartElements();
        this.bindEvents();
    }

    createCartElements() {
        // إنشاء زر السلة العائم
        const cartButton = document.createElement('div');
        cartButton.className = 'cart-float';
        cartButton.innerHTML = `
            <div class="cart-icon">
                🛒
                <span class="cart-count" id="cart-count">0</span>
            </div>
        `;
        document.body.appendChild(cartButton);

        // إنشاء زر الصعود لأعلى
        const scrollButton = document.createElement('div');
        scrollButton.className = 'scroll-to-top';
        scrollButton.innerHTML = '⬆️';
        document.body.appendChild(scrollButton);

        // إنشاء مودال السلة
        const cartModal = document.createElement('div');
        cartModal.className = 'cart-modal';
        cartModal.id = 'cart-modal';
        cartModal.innerHTML = this.getCartModalHTML();
        document.body.appendChild(cartModal);
    }

    getCartModalHTML() {
        return `
            <div class="cart-overlay">
                <div class="cart-content">
                    <div class="cart-header">
                        <h2>🛒 سلة التسوق</h2>
                        <button class="cart-close" id="cart-close">✖</button>
                    </div>
                    <div class="cart-body" id="cart-items-container">
                        <!-- سيتم ملء المحتوى ديناميكياً -->
                    </div>
                    <div class="cart-footer">
                        <div class="cart-total">
                            <strong>الإجمالي: <span id="cart-total">0</span> درهم</strong>
                        </div>
                        <div class="cart-actions">
                            <button class="btn clear-cart" id="clear-cart">🗑️ مسح السلة</button>
                            <button class="btn checkout-btn" id="checkout-btn">✅ إتمام الطلب</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // فتح السلة
        document.querySelector('.cart-float').addEventListener('click', () => {
            this.showCart();
        });

        // إغلاق السلة
        document.addEventListener('click', (e) => {
            if (e.target.id === 'cart-close' || e.target.classList.contains('cart-overlay')) {
                this.hideCart();
            }
        });

        // مسح السلة
        document.addEventListener('click', (e) => {
            if (e.target.id === 'clear-cart') {
                this.clearCart();
            }
        });

        // إتمام الطلب
        document.addEventListener('click', (e) => {
            if (e.target.id === 'checkout-btn') {
                this.proceedToCheckout();
            }
        });

        // الصعود لأعلى
        document.querySelector('.scroll-to-top').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // إظهار/إخفاء زر الصعود حسب التمرير
        window.addEventListener('scroll', () => {
            const scrollButton = document.querySelector('.scroll-to-top');
            if (window.pageYOffset > 300) {
                scrollButton.classList.add('visible');
            } else {
                scrollButton.classList.remove('visible');
            }
        });

        // إضافة للسلة من أزرار المنتجات
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = e.target.dataset.productId;
                this.addToCart(productId);
            }
        });
    }

    addToCart(productId) {
        // البحث عن المنتج في البيانات
        const product = this.findProduct(productId);
        if (!product) return;

        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                title: product.title,
                price: product.sale_price || product.regular_price,
                image: product.image_url,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification('تم إضافة المنتج للسلة ✅');
    }

    removeFromCart(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.renderCartItems();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartUI();
                this.renderCartItems();
            }
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartUI();
        this.renderCartItems();
        this.showNotification('تم مسح السلة 🗑️');
    }

    showCart() {
        this.renderCartItems();
        document.getElementById('cart-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideCart() {
        document.getElementById('cart-modal').classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    renderCartItems() {
        const container = document.getElementById('cart-items-container');
        
        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>السلة فارغة</h3>
                    <p>لم تضف أي منتجات بعد</p>
                    <button class="btn browse-products" onclick="cart.hideCart()">تصفح المنتجات</button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.title}" 
                         onerror="this.src='https://via.placeholder.com/80x80?text=صورة'">
                </div>
                <div class="item-details">
                    <h4>${item.title}</h4>
                    <div class="item-price">${item.price} درهم</div>
                </div>
                <div class="item-controls">
                    <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <div class="item-total">${item.price * item.quantity} درهم</div>
                <button class="remove-item" onclick="cart.removeFromCart('${item.id}')">🗑️</button>
            </div>
        `).join('');
    }

    updateCartUI() {
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        document.getElementById('cart-count').textContent = count;
        
        const totalElement = document.getElementById('cart-total');
        if (totalElement) {
            totalElement.textContent = total.toFixed(2);
        }
    }

    proceedToCheckout() {
        if (this.items.length === 0) {
            this.showNotification('السلة فارغة! أضف منتجات أولاً', 'warning');
            return;
        }

        // إنشاء رابط الواتساب للطلب
        const orderDetails = this.generateOrderMessage();
        const whatsappURL = `https://wa.me/201110760081?text=${encodeURIComponent(orderDetails)}`;
        
        // فتح صفحة الطلب الاحترافية
        this.openCheckoutPage();
    }

    generateOrderMessage() {
        let message = '🛒 *طلب جديد من سوق الإمارات*\n\n';
        message += '📋 *تفاصيل الطلب:*\n';
        
        this.items.forEach((item, index) => {
            message += `${index + 1}. ${item.title}\n`;
            message += `   📦 الكمية: ${item.quantity}\n`;
            message += `   💰 السعر: ${item.price} درهم\n`;
            message += `   📊 الإجمالي: ${(item.price * item.quantity).toFixed(2)} درهم\n\n`;
        });
        
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `💳 *إجمالي الطلب: ${total.toFixed(2)} درهم*\n\n`;
        message += '✅ *أرغب في إتمام هذا الطلب*\n';
        message += '📍 يرجى تأكيد العنوان وطريقة الدفع';
        
        return message;
    }

    openCheckoutPage() {
        // إنشاء صفحة الطلب ديناميكياً
        const checkoutWindow = window.open('', '_blank');
        checkoutWindow.document.write(this.getCheckoutHTML());
        checkoutWindow.document.close();
    }

    getCheckoutHTML() {
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderDetails = this.generateOrderMessage();
        const whatsappURL = `https://wa.me/201110760081?text=${encodeURIComponent(orderDetails)}`;
        
        return `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>إتمام الطلب - سوق الإمارات</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Cairo', sans-serif; background: #f8fafc; color: #1f2937; }
                .container { max-width: 800px; margin: 0 auto; padding: 20px; }
                .checkout-header { text-align: center; margin-bottom: 2rem; }
                .checkout-card { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); margin-bottom: 2rem; }
                .order-summary { border: 2px solid #daa520; border-radius: 12px; padding: 1rem; margin-bottom: 2rem; }
                .item { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #e5e7eb; }
                .total-section { background: linear-gradient(135deg, #daa520, #ffd700); color: white; padding: 1rem; border-radius: 8px; text-align: center; margin: 1rem 0; }
                .form-group { margin-bottom: 1rem; }
                .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
                .form-control { width: 100%; padding: 0.8rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem; }
                .form-control:focus { outline: none; border-color: #daa520; }
                .btn { padding: 1rem 2rem; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
                .whatsapp-btn { background: #25d366; color: white; width: 100%; margin: 1rem 0; }
                .whatsapp-btn:hover { background: #128c7e; transform: translateY(-2px); }
                .legal-links { text-align: center; margin-top: 2rem; }
                .legal-links a { color: #daa520; text-decoration: none; margin: 0 1rem; }
                .payment-methods { display: flex; justify-content: center; gap: 1rem; margin: 1rem 0; }
                .payment-method { padding: 0.5rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; background: white; }
                .payment-method.active { border-color: #daa520; background: #fffbeb; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="checkout-header">
                    <h1>🛒 إتمام الطلب</h1>
                    <p>اكمل بياناتك لإتمام الطلب</p>
                </div>

                <div class="checkout-card">
                    <h2>📋 ملخص الطلب</h2>
                    <div class="order-summary">
                        ${this.items.map(item => `
                            <div class="item">
                                <span>${item.title} × ${item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)} درهم</span>
                            </div>
                        `).join('')}
                        <div class="total-section">
                            <h3>💳 المبلغ الإجمالي: ${total.toFixed(2)} درهم</h3>
                        </div>
                    </div>
                </div>

                <div class="checkout-card">
                    <h2>📝 بيانات العميل</h2>
                    <form id="checkout-form">
                        <div class="form-group">
                            <label for="customer-name">الاسم الكامل *</label>
                            <input type="text" id="customer-name" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="customer-phone">رقم الهاتف في الإمارات *</label>
                            <input type="tel" id="customer-phone" class="form-control" placeholder="+971XXXXXXXXX" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="customer-address">العنوان التفصيلي *</label>
                            <textarea id="customer-address" class="form-control" rows="3" placeholder="الإمارة، المدينة، الشارع، رقم البناية..." required></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="order-notes">ملاحظات على الطلب (اختياري)</label>
                            <textarea id="order-notes" class="form-control" rows="2" placeholder="أي ملاحظات خاصة بالطلب..."></textarea>
                        </div>

                        <div class="form-group">
                            <label>طريقة الدفع</label>
                            <div class="payment-methods">
                                <div class="payment-method active">
                                    <input type="radio" name="payment" value="cod" id="cod" checked>
                                    <label for="cod">💰 دفع عند الاستلام</label>
                                </div>
                            </div>
                        </div>

                        <button type="button" class="btn whatsapp-btn" onclick="submitOrder()">
                            📱 إرسال الطلب عبر واتساب
                        </button>
                    </form>
                </div>

                <div class="legal-links">
                    <a href="../legal/terms.html" target="_blank">الشروط والأحكام</a>
                    <a href="../legal/privacy.html" target="_blank">سياسة الخصوصية</a>
                </div>
            </div>

            <script>
                function submitOrder() {
                    const name = document.getElementById('customer-name').value;
                    const phone = document.getElementById('customer-phone').value;
                    const address = document.getElementById('customer-address').value;
                    const notes = document.getElementById('order-notes').value;
                    
                    if (!name || !phone || !address) {
                        alert('يرجى ملء جميع الحقول المطلوبة');
                        return;
                    }
                    
                    let finalMessage = '${orderDetails}';
                    finalMessage += '\\n📋 *بيانات العميل:*\\n';
                    finalMessage += '👤 الاسم: ' + name + '\\n';
                    finalMessage += '📱 الهاتف: ' + phone + '\\n';
                    finalMessage += '📍 العنوان: ' + address + '\\n';
                    if (notes) {
                        finalMessage += '📝 ملاحظات: ' + notes + '\\n';
                    }
                    finalMessage += '\\n💳 *طريقة الدفع:* دفع عند الاستلام';
                    
                    const whatsappLink = 'https://wa.me/201110760081?text=' + encodeURIComponent(finalMessage);
                    window.open(whatsappLink, '_blank');
                }
            </script>
        </body>
        </html>
        `;
    }

    findProduct(productId) {
        // يجب ربطه بمتغير البيانات العام أو API
        return window.productsData?.find(p => p.id === productId);
    }

    loadCart() {
        try {
            return JSON.parse(localStorage.getItem('emirates_cart')) || [];
        } catch {
            return [];
        }
    }

    saveCart() {
        localStorage.setItem('emirates_cart', JSON.stringify(this.items));
    }

    showNotification(message, type = 'success') {
        // إنشاء تنبيه مؤقت
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">✖</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }
}

// تهيئة سلة التسوق عند تحميل الصفحة
let cart;
document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
});

// إضافة الأنماط للسلة
const cartStyles = `
/* أنماط سلة التسوق */
.cart-float {
    position: fixed;
    bottom: 90px;
    left: 20px;
    z-index: 1000;
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
    animation: bounce-cart 2s infinite;
}

.cart-float:hover {
    transform: scale(1.1) translateY(-3px);
    box-shadow: 0 12px 35px rgba(218, 165, 32, 0.5);
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
    width: 20px;
    height: 20px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.scroll-to-top {
    position: fixed;
    bottom: 160px;
    left: 20px;
    z-index: 1000;
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
}

.scroll-to-top.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.scroll-to-top:hover {
    transform: scale(1.1) translateY(-3px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.cart-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.cart-modal.active {
    opacity: 1;
    visibility: visible;
}

.cart-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.cart-content {
    background: white;
    border-radius: 16px;
    width: 100%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    transform: scale(0.8);
    transition: transform 0.3s ease;
}

.cart-modal.active .cart-content {
    transform: scale(1);
}

.cart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 2px solid #f3f4f6;
    background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
    color: white;
    border-radius: 16px 16px 0 0;
}

.cart-header h2 {
    margin: 0;
    font-size: 1.5rem;
}

.cart-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background 0.3s ease;
}

.cart-close:hover {
    background: rgba(255, 255, 255, 0.2);
}

.cart-body {
    padding: 1rem;
    max-height: 400px;
    overflow-y: auto;
}

.cart-item {
    display: grid;
    grid-template-columns: 80px 1fr auto auto auto;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #f3f4f6;
    transition: background 0.3s ease;
}

.cart-item:hover {
    background: #f9fafb;
}

.item-image img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
}

.item-details h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    color: #1f2937;
}

.item-price {
    color: #DAA520;
    font-weight: 600;
}

.item-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.quantity-btn {
    width: 30px;
    height: 30px;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    transition: all 0.3s ease;
}

.quantity-btn:hover:not(:disabled) {
    background: #DAA520;
    color: white;
    border-color: #DAA520;
}

.quantity-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.quantity {
    font-weight: 600;
    min-width: 30px;
    text-align: center;
}

.item-total {
    font-weight: 700;
    color: #059669;
}

.remove-item {
    background: #fee2e2;
    border: 1px solid #fca5a5;
    color: #dc2626;
    border-radius: 6px;
    width: 35px;
    height: 35px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.remove-item:hover {
    background: #dc2626;
    color: white;
}

.cart-footer {
    padding: 1.5rem;
    border-top: 2px solid #f3f4f6;
    background: #f9fafb;
    border-radius: 0 0 16px 16px;
}

.cart-total {
    text-align: center;
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #059669;
}

.cart-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.clear-cart {
    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
    color: white;
}

.checkout-btn {
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    color: white;
}

.empty-cart {
    text-align: center;
    padding: 3rem 1rem;
    color: #6b7280;
}

.empty-cart-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.browse-products {
    background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
    color: white;
    margin-top: 1rem;
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 11000;
    padding: 1rem 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #10B981;
    animation: slideInRight 0.3s ease-out;
}

.notification.warning {
    border-left-color: #F59E0B;
}

.notification.error {
    border-left-color: #EF4444;
}

.notification-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.notification button {
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    opacity: 0.7;
    transition: opacity 0.3s ease;
}

.notification button:hover {
    opacity: 1;
    background: #f3f4f6;
}

@keyframes bounce-cart {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* أزرار إضافة للسلة في بطاقات المنتجات */
.add-to-cart {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    color: white;
    border: none;
    padding: 0.8rem 1rem;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);
}

.add-to-cart:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(5, 150, 105, 0.4);
}

@media (max-width: 768px) {
    .cart-content {
        max-width: 95vw;
        margin: 10px;
    }
    
    .cart-item {
        grid-template-columns: 60px 1fr auto;
        grid-template-areas: 
            "image details controls"
            "image total remove";
    }
    
    .item-image { grid-area: image; }
    .item-details { grid-area: details; }
    .item-controls { grid-area: controls; }
    .item-total { grid-area: total; }
    .remove-item { grid-area: remove; }
    
    .cart-actions {
        grid-template-columns: 1fr;
    }
    
    .notification {
        right: 10px;
        left: 10px;
        top: 10px;
    }
}
`;

// إضافة الأنماط للصفحة
const styleSheet = document.createElement('style');
styleSheet.textContent = cartStyles;
document.head.appendChild(styleSheet);