// Category Page Handler - Fixed for proper loading
(function() {
    'use strict';
    
    function getCategoryFromPage() {
        const title = document.querySelector('.category-title, h1')?.textContent;
        if (!title) return null;
        
        const cleanTitle = title.replace(/[🏠📱💄👟🏅🛋🔧🛑]\s*/, '').trim();
        
        const reverseMap = {
            'Home Appliances & Electrical': 'الأجهزة المنزلية والكهربائية',
            'Electronics & Technology': 'الإلكترونيات والتكنولوجيا',
            'Personal Care, Health & Beauty': 'العناية الشخصية والصحة والجمال',
            'Shoes, Clothing & Accessories': 'الأحذية والملابس والإكسسوارات',
            'Sports, Fitness & Health': 'الرياضة واللياقة والصحة',
            'Furniture & Home Tools': 'الأثاث والأدوات المنزلية',
            'Tools & Maintenance': 'الأدوات والصيانة',
            'Miscellaneous Products': 'منتجات متنوعة'
        };
        
        return reverseMap[cleanTitle] || cleanTitle;
    }
    
    let allProducts = [];
    let categoryProducts = [];
    let filteredProducts = [];
    
    async function loadCategoryData() {
        try {
            console.log('📦 Loading category data...');
            
            const isInEnFolder = window.location.pathname.includes('/en/');
            const dataPath = isInEnFolder ? '../data/uae-products.json' : './data/uae-products.json';
            
            const response = await fetch(dataPath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            allProducts = await response.json();
            console.log(`✅ Loaded ${allProducts.length} total products`);
            
            const targetCategory = getCategoryFromPage();
            if (targetCategory) {
                categoryProducts = allProducts.filter(p => p.category === targetCategory);
                console.log(`🎯 Found ${categoryProducts.length} products in "${targetCategory}"`);
            } else {
                categoryProducts = allProducts;
                console.log('⚠️ No specific category found, showing all products');
            }
            
            filteredProducts = [...categoryProducts];
            renderCategoryProducts();
            updateProductCount();
            
        } catch (error) {
            console.error('❌ Error loading products:', error);
            showErrorState(error.message);
        }
    }
    
    function renderCategoryProducts() {
        const container = document.getElementById('category-products');
        if (!container) {
            console.error('❌ Container #category-products not found');
            return;
        }
        
        if (filteredProducts.length === 0) {
            const isEnglish = window.location.pathname.includes('/en/');
            const noResultsHTML = isEnglish ? `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📦</div>
                    <h3>No products found</h3>
                    <p>Try adjusting the price filter or return to homepage</p>
                    <a href="../" style="display: inline-block; margin-top: 1rem; padding: 1rem 2rem; background: var(--primary-blue); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">🏠 Back to Home</a>
                </div>
            ` : `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📦</div>
                    <h3>لم يتم العثور على منتجات</h3>
                    <p>جرب تغيير فلتر السعر أو العودة للرئيسية</p>
                    <a href="./" style="display: inline-block; margin-top: 1rem; padding: 1rem 2rem; background: var(--primary-blue); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">🏠 العودة للرئيسية</a>
                </div>
            `;
            container.innerHTML = noResultsHTML;
            return;
        }
        
        container.innerHTML = filteredProducts.map(createProductCard).join('');
        console.log(`✅ Rendered ${filteredProducts.length} products`);
    }
    
    function createProductCard(product) {
        const currentPrice = product.sale_price || product.regular_price || 0;
        const originalPrice = product.sale_price && product.regular_price > product.sale_price 
            ? `<span class="original-price">${product.regular_price} AED</span>` 
            : '';
        const discount = product.discount_percentage > 0 
            ? `<div class="discount-badge">-${Math.round(product.discount_percentage)}%</div>` 
            : '';
            
        const displayTitle = product.title.length > 65 
            ? product.title.substring(0, 65) + '...' 
            : product.title;
            
        const isEnglishPage = window.location.pathname.includes('/en/');
        const categoryTranslations = {
            'الأجهزة المنزلية والكهربائية': 'Home Appliances & Electrical',
            'الإلكترونيات والتكنولوجيا': 'Electronics & Technology',
            'العناية الشخصية والصحة والجمال': 'Personal Care, Health & Beauty',
            'الأحذية والملابس والإكسسوارات': 'Shoes, Clothing & Accessories',
            'الرياضة واللياقة والصحة': 'Sports, Fitness & Health',
            'الأثاث والأدوات المنزلية': 'Furniture & Home Tools',
            'الأدوات والصيانة': 'Tools & Maintenance',
            'منتجات متنوعة': 'Miscellaneous Products'
        };
        
        const categoryDisplay = isEnglishPage 
            ? (categoryTranslations[product.category] || product.category)
            : product.category;
        
        const whatsappMessage = isEnglishPage 
            ? `Hello, I'm interested in: ${product.title} (Price: ${currentPrice} AED)`
            : `مرحبا، أريد الاستفسار عن: ${product.title} (السعر: ${currentPrice} درهم)`;
        
        const buttonTexts = isEnglishPage 
            ? { add: '🛒 Add', whatsapp: '📱 WhatsApp', view: '👁 View' }
            : { add: '🛒 إضافة', whatsapp: '📱 واتساب', view: '👁 عرض' };
            
        const features = isEnglishPage 
            ? ['🇦🇪 UAE Product', '🚚 Free Shipping', '💰 Cash on Delivery']
            : ['🇦🇪 منتج إماراتي', '🚚 شحن مجاني', '💰 دفع عند الاستلام'];

        return `
            <div class="product-card" data-product-id="${product.id}">
                ${discount}
                
                <div class="product-image" style="cursor: pointer;" onclick="openProductPage('${product.id}')">
                    <img src="${product.image_url}" 
                         alt="${product.title}" 
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/400x300/1e40af/FFFFFF?text=Product+Image';">
                </div>
                
                <div class="product-info">
                    <div class="product-category">${categoryDisplay}</div>
                    <h3 class="product-title" onclick="openProductPage('${product.id}')" style="cursor: pointer;">${displayTitle}</h3>
                    <div class="product-price">
                        <span class="current-price">${currentPrice} AED</span>
                        ${originalPrice}
                    </div>
                    <div class="product-features">
                        ${features.map(f => `<div class="feature">${f}</div>`).join('')}
                    </div>
                    <div class="product-actions">
                        <button class="btn add-to-cart" onclick="addToCartFromCategory('${product.id}')">${buttonTexts.add}</button>
                        <a href="https://wa.me/201110760081?text=${encodeURIComponent(whatsappMessage)}" 
                           class="btn whatsapp-btn" target="_blank" rel="noopener">${buttonTexts.whatsapp}</a>
                        <button class="btn view-details" onclick="openProductPage('${product.id}')">${buttonTexts.view}</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    window.addToCartFromCategory = function(productId) {
        const product = allProducts.find(p => p.id == productId);
        if (!product) {
            showNotification('Product not found', 'error');
            return;
        }
        
        try {
            const cartItems = JSON.parse(localStorage.getItem('emirates_cart') || '[]');
            const existingItem = cartItems.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({
                    id: product.id,
                    title: product.title,
                    price: product.sale_price || product.regular_price,
                    image: product.image_url,
                    quantity: 1,
                    addedAt: Date.now()
                });
            }
            
            localStorage.setItem('emirates_cart', JSON.stringify(cartItems));
            showNotification('Product added to cart successfully!');
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            showNotification('Error adding product to cart', 'error');
        }
    };
    
    window.openProductPage = function(productId) {
        const isInEnFolder = window.location.pathname.includes('/en/');
        const productUrl = isInEnFolder 
            ? `../product.html?id=${encodeURIComponent(productId)}`
            : `./product.html?id=${encodeURIComponent(productId)}`;
        window.open(productUrl, '_blank', 'noopener,noreferrer');
    };
    
    function updateProductCount() {
        const countElement = document.getElementById('product-count');
        if (countElement && categoryProducts.length > 0) {
            countElement.textContent = categoryProducts.length;
        }
    }
    
    function showErrorState(errorMessage) {
        const container = document.getElementById('category-products');
        if (!container) return;
        
        const isEnglish = window.location.pathname.includes('/en/');
        const title = isEnglish ? '⚠️ Loading Error' : '⚠️ خطأ في التحميل';
        const description = isEnglish 
            ? 'Products could not be loaded successfully' 
            : 'لم يتم تحميل المنتجات بنجاح';
        const buttonText = isEnglish ? '🏠 Back to Home' : '🏠 العودة للرئيسية';
        const homeUrl = isEnglish ? '../' : './';
        
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-secondary); border-radius: 12px;">
                <h3 style="color: var(--accent-red); margin-bottom: 1rem;">${title}</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">${description}</p>
                <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 2rem;">Error: ${errorMessage}</p>
                <a href="${homeUrl}" style="
                    display: inline-block; 
                    padding: 1rem 2rem; 
                    background: var(--primary-blue); 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: 600;
                ">${buttonText}</a>
            </div>
        `;
    }
    
    function showNotification(message, type = 'success') {
        const colors = { success: '#10b981', error: '#ef4444' };
        
        document.querySelectorAll('.category-notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = 'category-notification';
        notification.style.cssText = `
            position: fixed; top: 100px; right: 24px; background: ${colors[type]};
            color: white; padding: 1rem 1.5rem; border-radius: 8px;
            font-weight: 600; z-index: 1060; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            cursor: pointer; max-width: 350px; border: 2px solid white;
        `;
        notification.textContent = message;
        
        notification.addEventListener('click', () => notification.remove());
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 4000);
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        const categoryName = getCategoryFromPage();
        console.log(`🏷️ Category page initialized: "${categoryName}"`);
        loadCategoryData();
    });
    
})();