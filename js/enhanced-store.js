// ===== Enhanced Store App with All Features =====

class EmiratesStoreComplete {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.products = [];
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.isLoading = false;
        
        this.initializeApp();
        this.setupEventListeners();
        this.updateCartUI();
        this.loadProducts();
    }

    // INITIALIZATION
    initializeApp() {
        console.log('🚀 Emirates Store Complete - Premium Version Loaded');
        this.initializeAnimations();
        this.initializeResponsiveElements();
        this.updateWhatsAppLink();
        this.removePopups();
        this.setupOpenInNewTab();
    }

    setupEventListeners() {
        // Enhanced product card interactions
        document.addEventListener('click', (e) => {
            // Add to cart with animation
            if (e.target.matches('.add-to-cart') || e.target.closest('.add-to-cart')) {
                e.preventDefault();
                const btn = e.target.matches('.add-to-cart') ? e.target : e.target.closest('.add-to-cart');
                const productId = btn.dataset.productId;
                this.addToCartWithAnimation(productId, btn);
            }
            
            // WhatsApp product inquiry
            if (e.target.matches('.whatsapp-btn') || e.target.closest('.whatsapp-btn')) {
                e.preventDefault();
                const btn = e.target.matches('.whatsapp-btn') ? e.target : e.target.closest('.whatsapp-btn');
                const productId = btn.dataset.productId;
                this.sendWhatsAppInquiry(productId);
            }
            
            // View details - opens in new tab
            if (e.target.matches('.view-details') || e.target.closest('.view-details')) {
                e.preventDefault();
                const btn = e.target.matches('.view-details') ? e.target : e.target.closest('.view-details');
                const productId = btn.dataset.productId;
                this.openProductPage(productId);
            }
            
            // Product image click - opens product page
            if (e.target.matches('.product-image img')) {
                e.preventDefault();
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    const productId = productCard.querySelector('[data-product-id]').dataset.productId;
                    this.openProductPage(productId);
                }
            }
            
            // Cart button - opens cart
            if (e.target.matches('.cart-btn') || e.target.closest('.cart-btn, .cart-icon')) {
                e.preventDefault();
                this.openCart();
            }
            
            // Wishlist toggle
            if (e.target.matches('.wishlist-toggle')) {
                e.preventDefault();
                const productId = e.target.dataset.productId;
                this.toggleWishlist(productId, e.target);
            }
        });
    }

    // PRODUCT LOADING WITH UPDATED IMAGES
    async loadProducts() {
        try {
            this.showProductsLoading();
            
            this.products = [
                {
                    id: "1",
                    title: "غسالة محمولة قابلة للطي",
                    description: "غسالة الملابس المحمولة صغيرة الحجم المثالية للسفر والرحلات مع وظائف متقدمة للتنظيف الفعال وتوفير الطاقة والمياه",
                    category: "الأجهزة المنزلية والكهربائية",
                    brand: "HomeTech Pro",
                    regular_price: 200,
                    sale_price: 150,
                    currency: "AED",
                    discount_percentage: 25,
                    stock_status: "in stock",
                    condition: "new",
                    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format",
                    average_rating: 4.7,
                    review_count: 128,
                    features: [
                        "توفير الطاقة والمياه بنسبة 40%",
                        "سهلة الحمل والاستخدام",
                        "تنظيف تلقائي متقدم",
                        "قابلة للطي لتوفير المساحة",
                        "ضمان لمدة سنة كاملة"
                    ],
                    delivery_time: "1-3 أيام عمل",
                    free_shipping: true,
                    cod_available: true,
                    tags: ["منزلي", "محمول", "توفير", "عملي"]
                },
                {
                    id: "2",
                    title: "شاحن سيارة مع ضوء النجوم",
                    description: "شاحن سيارة فاخر مزود بضوء النجوم الساحر وتقنية الشحن السريع 66 واط مع حماية متقدمة وتصميم عصري أنيق",
                    category: "الإلكترونيات والتكنولوجيا",
                    brand: "StarTech Elite",
                    regular_price: 250,
                    sale_price: 170,
                    currency: "AED",
                    discount_percentage: 32,
                    stock_status: "in stock",
                    condition: "new",
                    image_url: "https://images.unsplash.com/photo-1609592806717-3a8f3b14e2a0?w=600&h=400&fit=crop&auto=format",
                    average_rating: 4.3,
                    review_count: 89,
                    features: [
                        "شحن سريع 66 واط فائق القوة",
                        "ضوء النجوم LED متعدد الألوان",
                        "منافذ متعددة USB-C و USB-A",
                        "حماية من الجهد الزائد والحرارة",
                        "تصميم قابل للسحب وعملي"
                    ],
                    delivery_time: "1-3 أيام عمل",
                    free_shipping: true,
                    cod_available: true,
                    tags: ["تقني", "سيارة", "شحن", "LED"]
                },
                {
                    id: "3",
                    title: "كاميرا أمنية بالطاقة الشمسية",
                    description: "كاميرا مراقبة متطورة تعمل بالطاقة الشمسية المستدامة مع دقة 4K ورؤية ليلية ملونة وذكاء اصطناعي لكشف الحركة",
                    category: "الإلكترونيات والتكنولوجيا",
                    brand: "SecureVision Pro",
                    regular_price: 400,
                    sale_price: 299,
                    currency: "AED",
                    discount_percentage: 25,
                    stock_status: "in stock",
                    condition: "new",
                    image_url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop&auto=format",
                    average_rating: 4.5,
                    review_count: 156,
                    features: [
                        "عدسة مزدوجة بدقة 4K فائقة الوضوح",
                        "طاقة شمسية مستدامة وصديقة للبيئة",
                        "رؤية ليلية ملونة متقدمة",
                        "ذكاء اصطناعي لكشف الحركة",
                        "مقاومة للطقس IP66"
                    ],
                    delivery_time: "1-3 أيام عمل",
                    free_shipping: true,
                    cod_available: true,
                    tags: ["أمان", "شمسي", "4K", "ذكي"]
                },
                {
                    id: "4",
                    title: "قلم مكياج متعدد الاستخدامات 4 في 1",
                    description: "قلم مكياج فاخر من كاتيليا بيوتي يجمع بين 4 استخدامات في منتج واحد مع تركيبة طبيعية آمنة وثبات يدوم طوال اليوم",
                    category: "العناية الشخصية والصحة والجمال",
                    brand: "Katilia Beauty Pro",
                    regular_price: 300,
                    sale_price: 199,
                    currency: "AED",
                    discount_percentage: 34,
                    stock_status: "in stock",
                    condition: "new",
                    image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop&auto=format",
                    average_rating: 4.6,
                    review_count: 203,
                    features: [
                        "4 استخدامات في منتج واحد فريد",
                        "تركيبة نباتية آمنة وخالية من الكيماويات",
                        "مقاوم للماء والعرق",
                        "قابل لإعادة الملء واقتصادي",
                        "سهل الاستخدام والحمل في السفر"
                    ],
                    delivery_time: "1-3 أيام عمل",
                    free_shipping: true,
                    cod_available: true,
                    tags: ["مكياج", "جمال", "طبيعي", "متعدد"]
                },
                {
                    id: "5",
                    title: "ماسك الشعر بالزنجبيل المجدد",
                    description: "قناع ترطيب الشعر الفاخر المدعم بالزنجبيل الطبيعي والزيوت العضوية لمحاربة التساقط وتحفيز النمو مع نتائج مذهلة",
                    category: "العناية الشخصية والصحة والجمال",
                    brand: "NaturalCare Premium",
                    regular_price: 200,
                    sale_price: 149,
                    currency: "AED",
                    discount_percentage: 26,
                    stock_status: "in stock",
                    condition: "new",
                    image_url: "https://images.unsplash.com/photo-1629198038967-0dc7b9ba5c5d?w=600&h=400&fit=crop&auto=format",
                    average_rating: 4.8,
                    review_count: 167,
                    features: [
                        "يحارب تساقط الشعر بفعالية عالية",
                        "يحفز النمو الطبيعي للشعر",
                        "تركيبة طبيعية 100% خالية من الكيماويات",
                        "مناسب لجميع أنواع الشعر",
                        "نتائج مرئية خلال أسبوعين فقط"
                    ],
                    delivery_time: "1-3 أيام عمل",
                    free_shipping: true,
                    cod_available: true,
                    tags: ["شعر", "طبيعي", "زنجبيل", "ترطيب"]
                }
            ];
            
            setTimeout(() => {
                this.hideProductsLoading();
                this.renderEnhancedProducts();
            }, 1500);
            
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('حدث خطأ في تحميل المنتجات');
        }
    }

    // ENHANCED PRODUCT RENDERING
    renderEnhancedProducts(productsToRender = this.products) {
        const container = document.querySelector('#products-container');
        if (!container) return;

        container.innerHTML = '';

        if (productsToRender.length === 0) {
            container.innerHTML = `
                <div class="no-products-found" style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: rgba(255,255,255,0.9); border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
                    <h3 style="color: var(--text-primary); margin-bottom: 1rem;">لا توجد منتجات متوفرة</h3>
                    <p style="color: var(--text-secondary);">جرب البحث بكلمات مختلفة أو تصفح الفئات الأخرى</p>
                    <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 1.5rem;">تحديث الصفحة</button>
                </div>
            `;
            return;
        }

        productsToRender.forEach((product, index) => {
            const productCard = this.createEnhancedProductCard(product);
            const cardElement = document.createElement('div');
            cardElement.innerHTML = productCard;
            cardElement.firstElementChild.style.animationDelay = `${index * 0.1}s`;
            cardElement.firstElementChild.classList.add('animate-fade-in');
            container.appendChild(cardElement.firstElementChild);
        });
    }

    createEnhancedProductCard(product) {
        const discount = product.discount_percentage > 0 
            ? `<div class="discount-badge">خصم ${product.discount_percentage}%</div>` 
            : '';
            
        const originalPrice = product.regular_price > product.sale_price 
            ? `<span class="original-price">${product.regular_price} ${product.currency}</span>` 
            : '';

        const stars = this.generateStars(product.average_rating);
        const isInWishlist = this.wishlist.includes(product.id);
        const wishlistClass = isInWishlist ? 'active' : '';

        return `
            <div class="product-card glass-card card-3d">
                <div class="product-image" onclick="window.open('products/product-${product.id}.html', '_blank')" style="cursor: pointer;">
                    <img src="${product.image_url}" 
                         alt="${product.title}" 
                         loading="lazy"
                         onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&auto=format'">
                    ${discount}
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-count">(${product.review_count} تقييم)</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">${product.sale_price} ${product.currency}</span>
                        ${originalPrice}
                    </div>
                    <div class="product-features">
                        <div class="feature">📦 شحن مجاني</div>
                        <div class="feature">🚚 ${product.delivery_time}</div>
                        <div class="feature">💳 دفع عند الاستلام</div>
                    </div>
                    <div class="product-actions">
                        <a href="https://wa.me/201110760081?text=أريد الاستفسار عن ${product.title} - ${product.sale_price} ${product.currency}" 
                           class="whatsapp-btn" target="_blank" rel="noopener">
                            📱 واتساب
                        </a>
                        <button class="view-details btn btn-primary" data-product-id="${product.id}">
                            👁 التفاصيل
                        </button>
                        <button class="add-to-cart btn btn-secondary" data-product-id="${product.id}">
                            🛒 السلة
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // CART FUNCTIONALITY
    addToCartWithAnimation(productId, button) {
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            this.showError('المنتج غير موجود');
            return;
        }

        // Animate button
        const originalText = button.innerHTML;
        button.innerHTML = '<div class="loading-spinner" style="width: 16px; height: 16px; display: inline-block; margin-left: 8px;"></div> جاري الإضافة...';
        button.disabled = true;

        setTimeout(() => {
            const existingItem = this.cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({
                    ...product,
                    quantity: 1,
                    addedAt: new Date().toISOString()
                });
            }

            this.updateCartStorage();
            this.updateCartUI();
            
            // Success animation
            button.innerHTML = '✅ تم الإضافة';
            button.style.background = 'var(--success-color)';
            
            this.showFloatingSuccess(`تم إضافة ${product.title} إلى السلة`, button);
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 2000);
            
        }, 1000);
    }

    // ENHANCED FUNCTIONS
    sendWhatsAppInquiry(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            const message = `أريد الاستفسار عن ${product.title} - ${product.sale_price} ${product.currency}`;
            const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank', 'noopener');
        }
    }

    openProductPage(productId) {
        window.open(`products/product-${productId}.html`, '_blank', 'noopener');
    }

    openCart() {
        window.open('cart/cart.html', '_blank', 'noopener');
    }

    updateWhatsAppLink() {
        // Update all WhatsApp links to new number
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
        whatsappLinks.forEach(link => {
            const href = link.getAttribute('href');
            const newHref = href.replace(/wa\.me\/\d+/, 'wa.me/201110760081');
            link.setAttribute('href', newHref);
        });

        // Update floating WhatsApp button
        const floatingBtn = document.querySelector('.whatsapp-float');
        if (floatingBtn) {
            floatingBtn.href = 'https://wa.me/201110760081';
        }
    }

    removePopups() {
        // Remove any existing popups
        const popups = document.querySelectorAll('.popup, .modal-overlay, [class*="popup"]');
        popups.forEach(popup => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        });

        // Disable popup scripts
        window.showPopup = function() { return false; };
        window.openModal = function() { return false; };
    }

    setupOpenInNewTab() {
        // Make all relevant links open in new tab
        document.querySelectorAll('a[href]:not([href*="wa.me"]):not([href^="#"])').forEach(link => {
            if (!link.hasAttribute('target')) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener');
            }
        });
    }

    initializeResponsiveElements() {
        // Responsive button adjustments
        const adjustButtonSizes = () => {
            const buttons = document.querySelectorAll('.btn');
            const screenWidth = window.innerWidth;
            
            buttons.forEach(btn => {
                if (screenWidth <= 480) {
                    btn.classList.add('btn-sm');
                } else if (screenWidth <= 768) {
                    btn.classList.add('btn-md');
                } else {
                    btn.classList.remove('btn-sm', 'btn-md');
                }
            });
        };

        adjustButtonSizes();
        window.addEventListener('resize', adjustButtonSizes);
    }

    // UTILITY FUNCTIONS
    updateCartStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
            if (totalItems > 0) {
                cartCount.classList.add('active');
            }
        }
    }

    showProductsLoading() {
        const container = document.querySelector('#products-container');
        if (container) {
            container.innerHTML = `
                <div class="products-loading" style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
                    <div class="loading-spinner" style="margin: 0 auto 1rem; width: 50px; height: 50px;"></div>
                    <h3 style="color: var(--text-primary);">جاري تحميل المنتجات...</h3>
                    <p style="color: var(--text-secondary);">يرجى الانتظار</p>
                </div>
            `;
        }
    }

    hideProductsLoading() {
        const loading = document.querySelector('.products-loading');
        if (loading && loading.parentNode) {
            loading.parentNode.removeChild(loading);
        }
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
    }

    showFloatingSuccess(message, targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const floating = document.createElement('div');
        floating.textContent = message;
        floating.style.cssText = `
            position: fixed;
            top: ${rect.top - 50}px;
            left: ${rect.left + rect.width/2}px;
            transform: translateX(-50%);
            background: var(--success-color);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            animation: floatUp 3s ease-out forwards;
            pointer-events: none;
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
        `;
        
        document.body.appendChild(floating);
        
        setTimeout(() => {
            if (floating.parentNode) {
                floating.parentNode.removeChild(floating);
            }
        }, 3000);
    }

    showError(message) {
        this.showFloatingMessage(message, 'error');
    }

    showFloatingMessage(message, type = 'info') {
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            info: '#3B82F6'
        };
        
        const floating = document.createElement('div');
        floating.textContent = message;
        floating.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(floating);
        
        setTimeout(() => {
            floating.style.animation = 'slideOutRight 0.5s ease-in forwards';
            setTimeout(() => {
                if (floating.parentNode) {
                    floating.parentNode.removeChild(floating);
                }
            }, 500);
        }, 3000);
    }

    initializeAnimations() {
        // CSS animations for enhanced effects
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                100% {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-100px);
                }
            }

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
        document.head.appendChild(style);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the enhanced store
document.addEventListener('DOMContentLoaded', function() {
    window.emiratesStore = new EmiratesStoreComplete();
    console.log('🎉 Emirates Store Complete - All features loaded successfully!');
});