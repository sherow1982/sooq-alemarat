/**
 * نظام بطاقات المنتج المتجاوبة والاحترافية - محسّن
 * Responsive Professional Product Cards System
 */

class ResponsiveProductCards {
    constructor() {
        this.init();
    }
    
    init() {
        this.addResponsiveStyles();
        this.setupProductCardEvents();
        console.log('✨ تم تفعيل بطاقات المنتج المتجاوبة');
    }
    
    addResponsiveStyles() {
        if (document.getElementById('responsive-cards-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'responsive-cards-styles';
        styles.textContent = `
            /* بطاقات المنتج الاحترافية والمتجاوبة */
            .products-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 2rem;
                padding: 1rem 0;
            }
            
            .product-card {
                background: var(--bg-white, white);
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                border: 2px solid rgba(212, 175, 55, 0.1);
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                position: relative;
                backdrop-filter: blur(10px);
                isolation: isolate;
            }
            
            .product-card:hover {
                transform: translateY(-8px) scale(1.02);
                box-shadow: 0 15px 40px rgba(212, 175, 55, 0.25);
                border-color: var(--gold-primary, #d4af37);
            }
            
            .product-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #d4af37, #b8941f, #87ceeb);
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 1;
            }
            
            .product-card:hover::before {
                opacity: 1;
            }
            
            /* صورة المنتج */
            .product-image {
                width: 100%;
                height: 240px;
                position: relative;
                overflow: hidden;
                cursor: pointer;
                border-bottom: 2px solid rgba(212, 175, 55, 0.1);
            }
            
            .product-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: all 0.4s ease;
                border: none;
            }
            
            .product-image:hover img {
                transform: scale(1.05);
            }
            
            /* شارات الخصم والمميز */
            .discount-badge {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: linear-gradient(135deg, #FF6B6B, #EE5A24);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 25px;
                font-size: 0.9rem;
                font-weight: 800;
                z-index: 2;
                box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            
            /* معلومات المنتج */
            .product-info {
                padding: 1.5rem;
                position: relative;
            }
            
            .product-category {
                font-size: 0.85rem;
                color: var(--gold-primary, #d4af37);
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 0.8rem;
                opacity: 0.9;
            }
            
            .product-title {
                font-size: 1.1rem;
                font-weight: 800;
                color: var(--text-dark, #111827);
                margin-bottom: 1rem;
                line-height: 1.4;
                cursor: pointer;
                transition: color 0.3s ease;
                min-height: 2.8rem;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            
            .product-title:hover {
                color: var(--gold-primary, #d4af37);
            }
            
            /* تقييم المنتج */
            .product-rating {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
                font-size: 0.9rem;
                color: var(--text-secondary, #6b7280);
            }
            
            .product-rating .stars {
                color: #FCD34D;
                font-size: 1rem;
                letter-spacing: 2px;
            }
            
            /* أسعار المنتج */
            .product-price {
                margin-bottom: 1.2rem;
            }
            
            .current-price {
                font-size: 1.4rem;
                font-weight: 900;
                background: linear-gradient(135deg, #d4af37, #b8941f);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-left: 0.5rem;
            }
            
            .original-price {
                font-size: 1rem;
                color: var(--text-secondary, #6b7280);
                text-decoration: line-through;
                font-weight: 600;
            }
            
            /* ميزات المنتج */
            .product-features {
                margin-bottom: 1.5rem;
            }
            
            .feature {
                font-size: 0.85rem;
                color: var(--success-green, #10b981);
                margin-bottom: 0.4rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 0.3rem;
            }
            
            /* أزرار المنتج - متجاوبة ومحترفة */
            .product-actions {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.8rem;
                margin-top: auto;
            }
            
            .product-actions .btn {
                padding: 0.9rem 1.2rem;
                border: 2px solid;
                border-radius: 15px;
                font-weight: 700;
                font-size: 0.95rem;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                text-decoration: none;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                text-align: center;
                position: relative;
                overflow: hidden;
                z-index: 1;
            }
            
            .product-actions .btn::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                transition: all 0.4s ease;
                transform: translate(-50%, -50%);
                z-index: -1;
            }
            
            .product-actions .btn:hover::before {
                width: 300px;
                height: 300px;
            }
            
            /* زر إضافة للسلة */
            .add-to-cart {
                background: linear-gradient(135deg, #d4af37, #b8941f);
                color: white;
                border-color: #d4af37;
                box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
            }
            
            .add-to-cart:hover {
                transform: translateY(-2px) scale(1.05);
                box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
                background: linear-gradient(135deg, #b8941f, #996f1a);
            }
            
            /* زر واتساب */
            .whatsapp-btn {
                background: linear-gradient(135deg, #25D366, #128C7E);
                color: white;
                border-color: #25D366;
                box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
            }
            
            .whatsapp-btn:hover {
                transform: translateY(-2px) scale(1.05);
                box-shadow: 0 8px 25px rgba(37, 211, 102, 0.5);
                background: linear-gradient(135deg, #128C7E, #0d6c5d);
            }
            
            /* زر عرض التفاصيل - محسّن واحترافي */
            .view-details {
                background: linear-gradient(135deg, #6366f1, #4f46e5);
                color: white;
                border-color: #6366f1;
                box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                grid-column: 1 / -1;
                margin-top: 0.5rem;
                font-size: 1rem;
                padding: 1rem 1.5rem;
                position: relative;
            }
            
            .view-details:hover {
                transform: translateY(-3px) scale(1.02);
                box-shadow: 0 10px 30px rgba(99, 102, 241, 0.5);
                background: linear-gradient(135deg, #4f46e5, #3730a3);
            }
            
            .view-details::after {
                content: '→';
                position: absolute;
                right: 1.5rem;
                transition: transform 0.3s ease;
                font-size: 1.2rem;
            }
            
            .view-details:hover::after {
                transform: translateX(5px);
            }
            
            /* تخطيط متجاوب للأزرار */
            @media (max-width: 768px) {
                .product-actions {
                    grid-template-columns: 1fr;
                    gap: 0.6rem;
                }
                
                .product-actions .btn {
                    padding: 0.8rem 1rem;
                    font-size: 0.9rem;
                }
                
                .view-details {
                    grid-column: 1;
                    margin-top: 0;
                    padding: 0.8rem 1rem;
                    font-size: 0.9rem;
                }
            }
            
            @media (max-width: 480px) {
                .products-grid {
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                    padding: 0.5rem;
                }
                
                .product-card {
                    margin: 0 auto;
                    max-width: 100%;
                }
                
                .product-image {
                    height: 200px;
                }
                
                .product-info {
                    padding: 1.2rem;
                }
                
                .product-title {
                    font-size: 1rem;
                    min-height: 2.4rem;
                }
                
                .current-price {
                    font-size: 1.2rem;
                }
            }
            
            /* تحسينات إضافية للشاشات الكبيرة */
            @media (min-width: 1200px) {
                .products-grid {
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 2.5rem;
                }
                
                .product-image {
                    height: 260px;
                }
                
                .product-title {
                    font-size: 1.2rem;
                }
                
                .current-price {
                    font-size: 1.5rem;
                }
            }
            
            /* تأثيرات تحويم متقدمة */
            .product-card .card-3d-inner {
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                transform-style: preserve-3d;
            }
            
            .product-card:hover .card-3d-inner {
                transform: perspective(1000px) rotateX(5deg) rotateY(-5deg);
            }
            
            /* تحسينات النص */
            .product-info {
                display: flex;
                flex-direction: column;
                height: 100%;
                min-height: 280px;
            }
            
            .product-actions {
                margin-top: auto;
            }
            
            /* شارات الحالة */
            .status-badges {
                position: absolute;
                top: 1rem;
                left: 1rem;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                z-index: 3;
            }
            
            .status-badge {
                padding: 0.3rem 0.8rem;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: 700;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
            
            .badge-new {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
            }
            
            .badge-bestseller {
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: white;
            }
            
            /* تحسين النصوص العربية */
            .product-card * {
                font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            /* Loading state محسّن */
            .product-card.loading {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
            }
            
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            
            /* أزرار أكثر احترافية */
            .btn {
                font-family: 'Cairo', sans-serif;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                border: none;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                position: relative;
                overflow: hidden;
                text-align: center;
                user-select: none;
                white-space: nowrap;
            }
            
            .btn:focus {
                outline: 3px solid rgba(212, 175, 55, 0.5);
                outline-offset: 2px;
            }
            
            /* تأثيرات اللمس للهواتف */
            @media (hover: none) {
                .product-card:hover {
                    transform: none;
                }
                
                .product-card:active {
                    transform: scale(0.98);
                }
                
                .btn:active {
                    transform: scale(0.95);
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    setupProductCardEvents() {
        // Global event delegation for better performance
        document.addEventListener('click', (e) => {
            const target = e.target;
            const card = target.closest('.product-card');
            
            if (!card) return;
            
            const productId = card.getAttribute('data-product-id');
            if (!productId) return;
            
            // زر "شاهد التفاصيل" المحسّن
            if (target.matches('.view-details') || target.closest('.view-details')) {
                e.preventDefault();
                e.stopPropagation();
                this.openProductDetails(productId, card);
                return;
            }
            
            // النقر على الصورة أو العنوان
            if (target.matches('.product-image') || target.closest('.product-image') ||
                target.matches('.product-title') || target.closest('.product-title')) {
                e.preventDefault();
                e.stopPropagation();
                this.openProductDetails(productId, card);
                return;
            }
        });
    }
    
    openProductDetails(productId, cardElement) {
        try {
            // إضافة تأثير بصري للبطاقة
            cardElement.style.transform = 'scale(0.95)';
            cardElement.style.opacity = '0.8';
            
            setTimeout(() => {
                cardElement.style.transform = '';
                cardElement.style.opacity = '';
            }, 200);
            
            // الحصول على بيانات المنتج
            const product = this.getProductData(productId);
            
            if (!product) {
                this.showNotification('❌ لم يتم العثور على بيانات المنتج', 'error');
                return;
            }
            
            // فتح صفحة التفاصيل في تبويب جديد
            const detailsUrl = `./product.html?id=${encodeURIComponent(productId)}`;
            const newWindow = window.open(detailsUrl, '_blank', 'noopener,noreferrer');
            
            if (newWindow) {
                this.showNotification(`🎯 جاري فتح تفاصيل "${product.title}"`, 'success');
            } else {
                // Fallback: show modal if popup blocked
                this.showProductModal(product);
            }
            
        } catch (error) {
            console.error('خطأ في فتح تفاصيل المنتج:', error);
            this.showNotification('❌ حدث خطأ في فتح تفاصيل المنتج', 'error');
        }
    }
    
    getProductData(productId) {
        // Try multiple sources for product data
        const sources = [
            window.productsData,
            window.allProducts,
            window.categoryProducts,
            window.filteredProducts,
            window.categoriesHomepage?.products
        ];
        
        for (const source of sources) {
            if (Array.isArray(source)) {
                const product = source.find(p => p.id == productId);
                if (product) return product;
            }
        }
        
        return null;
    }
    
    showProductModal(product) {
        // Create modal for blocked popups
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 2rem;
            max-width: 500px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        `;
        
        modalContent.innerHTML = `
            <button onclick="this.closest('div[style*="position: fixed"]').remove()" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: #ff6b6b;
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
                font-weight: bold;
            ">×</button>
            
            <div style="text-align: center;">
                <img src="${product.image_url}" alt="${product.title}" style="
                    width: 200px;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 15px;
                    margin-bottom: 1.5rem;
                    border: 3px solid #d4af37;
                ">
                <h3 style="color: #111827; margin-bottom: 1rem;">${product.title}</h3>
                <div style="font-size: 1.5rem; color: #d4af37; font-weight: 800; margin-bottom: 2rem;">
                    ${product.sale_price || product.regular_price} درهم
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <button onclick="
                        if(window.cart) window.cart.addToCart('${product.id}');
                        this.closest('div[style*=\"position: fixed\"]').remove();
                    " style="
                        padding: 1rem;
                        background: linear-gradient(135deg, #d4af37, #b8941f);
                        color: white;
                        border: none;
                        border-radius: 15px;
                        font-weight: 700;
                        cursor: pointer;
                    ">🛒 إضافة للسلة</button>
                    
                    <a href="https://wa.me/201110760081?text=${encodeURIComponent(`أريد الاستفسار عن: ${product.title}`)}"
                       target="_blank" style="
                        padding: 1rem;
                        background: linear-gradient(135deg, #25D366, #128C7E);
                        color: white;
                        text-decoration: none;
                        border-radius: 15px;
                        font-weight: 700;
                        text-align: center;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">📱 واتساب</a>
                </div>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    showNotification(message, type = 'info') {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            right: 24px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 15px;
            font-weight: 700;
            z-index: 10001;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.4s ease-out;
            max-width: 350px;
            word-wrap: break-word;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.4s ease-in forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 400);
            }
        }, 4000);
        
        // Add animation styles if not exist
        if (!document.getElementById('notification-animations')) {
            const animStyles = document.createElement('style');
            animStyles.id = 'notification-animations';
            animStyles.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(animStyles);
        }
    }
}

// تفعيل النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.responsiveCards = new ResponsiveProductCards();
});