// Category Page Handler - Complete Fix for Product Display + Enhanced Category Matching
(function() {
    'use strict';
    
    // Normalize Arabic text for consistent matching
    function normalizeArabic(str) {
        if (!str || typeof str !== 'string') return '';
        
        return str
            // Remove emojis and special chars
            .replace(/[🏠📱💄👟🏅🛋🔧🛑🚗🍳⚽🌟✨🎯]/g, '')
            // Remove extra spaces and trim
            .replace(/\s+/g, ' ')
            .trim()
            // Normalize common variations
            .replace(/أ/g, 'ا')
            .replace(/إ/g, 'ا')
            .replace(/آ/g, 'ا')
            .replace(/ة/g, 'ه')
            // Remove diacritics
            .replace(/[ً ٌ ٍ َ ُ ِ ّ ْ]/g, '');
    }
    
    // Map user-friendly names to exact JSON category names
    function mapToKnownCategory(userInput) {
        const cleanInput = normalizeArabic(userInput).toLowerCase();
        
        // Direct mappings based on exact JSON data
        const categoryMappings = {
            // Miscellaneous Products variations
            'منتجات متنوعه': 'منتجات متنوعة',
            'منتجات متنوعة': 'منتجات متنوعة',
            'متنوعة': 'منتجات متنوعة',
            'منوعات': 'منتجات متنوعة',
            'miscellaneous products': 'منتجات متنوعة',
            'miscellaneous': 'منتجات متنوعة',
            
            // Home Appliances & Electrical
            'الاجهزه المنزليه والكهربائيه': 'الأجهزة المنزلية والكهربائية',
            'الأجهزة المنزلية والكهربائية': 'الأجهزة المنزلية والكهربائية',
            'اجهزه منزليه': 'الأجهزة المنزلية والكهربائية',
            'أجهزة منزلية': 'الأجهزة المنزلية والكهربائية',
            'home appliances': 'الأجهزة المنزلية والكهربائية',
            
            // Electronics & Technology
            'الالكترونيات والتكنولوجيا': 'الإلكترونيات والتكنولوجيا',
            'الإلكترونيات والتكنولوجيا': 'الإلكترونيات والتكنولوجيا',
            'الكترونيات': 'الإلكترونيات والتكنولوجيا',
            'تكنولوجيا': 'الإلكترونيات والتكنولوجيا',
            'electronics': 'الإلكترونيات والتكنولوجيا',
            
            // Personal Care, Health & Beauty
            'العنايه الشخصيه والصحه والجمال': 'العناية الشخصية والصحة والجمال',
            'العناية الشخصية والصحة والجمال': 'العناية الشخصية والصحة والجمال',
            'العنايه الشخصيه': 'العناية الشخصية والصحة والجمال',
            'عنايه شخصيه': 'العناية الشخصية والصحة والجمال',
            'صحه وجمال': 'العناية الشخصية والصحة والجمال',
            'personal care': 'العناية الشخصية والصحة والجمال',
            
            // Shoes, Clothing & Accessories
            'الاحذيه والملابس والاكسسوارات': 'الأحذية والملابس والإكسسوارات',
            'الأحذية والملابس والإكسسوارات': 'الأحذية والملابس والإكسسوارات',
            'احذيه وملابس': 'الأحذية والملابس والإكسسوارات',
            'ملابس واحذيه': 'الأحذية والملابس والإكسسوارات',
            'shoes clothing': 'الأحذية والملابس والإكسسوارات',
            
            // Sports, Fitness & Health
            'الرياضه واللياقه والصحه': 'الرياضة واللياقة والصحة',
            'الرياضة واللياقة والصحة': 'الرياضة واللياقة والصحة',
            'رياضه ولياقه': 'الرياضة واللياقة والصحة',
            'لياقه بدنيه': 'الرياضة واللياقة والصحة',
            'sports fitness': 'الرياضة واللياقة والصحة',
            
            // Furniture & Home Tools
            'الاثاث والادوات المنزليه': 'الأثاث والأدوات المنزلية',
            'الأثاث والأدوات المنزلية': 'الأثاث والأدوات المنزلية',
            'اثاث منزلي': 'الأثاث والأدوات المنزلية',
            'ادوات منزليه': 'الأثاث والأدوات المنزلية',
            'furniture': 'الأثاث والأدوات المنزلية',
            
            // Tools & Maintenance
            'الادوات والصيانه': 'الأدوات والصيانة',
            'الأدوات والصيانة': 'الأدوات والصيانة',
            'ادوات صيانه': 'الأدوات والصيانة',
            'ادوات': 'الأدوات والصيانة',
            'tools': 'الأدوات والصيانة',
            
            // Additional categories from JSON data
            'السيارات والاكسسوارات': 'السيارات والإكسسوارات',
            'السيارات والإكسسوارات': 'السيارات والإكسسوارات',
            'اكسسوارات سيارات': 'السيارات والإكسسوارات',
            'car accessories': 'السيارات والإكسسوارات',
            
            'ادوات الطبخ والمطبخ': 'أدوات الطبخ والمطبخ',
            'أدوات الطبخ والمطبخ': 'أدوات الطبخ والمطبخ',
            'ادوات مطبخ': 'أدوات الطبخ والمطبخ',
            'cooking tools': 'أدوات الطبخ والمطبخ'
        };
        
        // Try direct mapping first
        if (categoryMappings[cleanInput]) {
            return categoryMappings[cleanInput];
        }
        
        // Try partial matching for complex names
        for (const [key, value] of Object.entries(categoryMappings)) {
            if (cleanInput.includes(key.split(' ')[0]) || key.includes(cleanInput)) {
                return value;
            }
        }
        
        // Return original if no mapping found
        return userInput;
    }
    
    function getCategoryFromPage() {
        // Try multiple sources for category name
        const sources = [
            document.querySelector('.category-title, h1')?.textContent,
            document.querySelector('.breadcrumb span:last-child')?.textContent,
            document.title?.split(' - ')[0],
            new URLSearchParams(window.location.search).get('category')
        ];
        
        for (const source of sources) {
            if (source && source.trim()) {
                const cleanTitle = normalizeArabic(source);
                const mappedCategory = mapToKnownCategory(cleanTitle);
                console.log(`🏷️ Category mapping: "${source}" → "${mappedCategory}"`);
                return mappedCategory;
            }
        }
        
        console.warn('⚠️ No category found from page sources');
        return null;
    }
    
    // Make variables global for filter access
    window.allProducts = [];
    window.categoryProducts = [];
    window.filteredProducts = [];
    
    async function loadCategoryData() {
        try {
            console.log('📦 Loading category data...');
            
            const isInEnFolder = window.location.pathname.includes('/en/');
            const dataPath = isInEnFolder ? '../data/uae-products.json' : './data/uae-products.json';
            
            const response = await fetch(dataPath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to fetch data`);
            }
            
            window.allProducts = await response.json();
            console.log(`✅ Loaded ${window.allProducts.length} total products`);
            
            // Get all unique categories from data for debugging
            const uniqueCategories = [...new Set(window.allProducts.map(p => p.category).filter(Boolean))];
            console.log('📋 Available categories in data:', uniqueCategories);
            
            const targetCategory = getCategoryFromPage();
            console.log(`🔍 Looking for category: "${targetCategory}"`);
            
            if (targetCategory) {
                // Try exact match first
                window.categoryProducts = window.allProducts.filter(p => p.category === targetCategory);
                console.log(`🎯 Exact match found ${window.categoryProducts.length} products`);
                
                // If no exact match, try fuzzy matching
                if (window.categoryProducts.length === 0) {
                    const normalizedTarget = normalizeArabic(targetCategory).toLowerCase();
                    window.categoryProducts = window.allProducts.filter(p => {
                        if (!p.category) return false;
                        const normalizedCategory = normalizeArabic(p.category).toLowerCase();
                        return normalizedCategory.includes(normalizedTarget) || 
                               normalizedTarget.includes(normalizedCategory) ||
                               normalizedCategory.split(' ').some(word => 
                                   normalizedTarget.includes(word) && word.length > 2
                               );
                    });
                    console.log(`🔍 Fuzzy match found ${window.categoryProducts.length} products`);
                }
                
                // Final fallback: show best products from multiple categories
                if (window.categoryProducts.length === 0) {
                    console.warn('⚠️ No products found, showing diverse selection');
                    const categoryGroups = {};
                    window.allProducts.forEach(p => {
                        if (p.category) {
                            if (!categoryGroups[p.category]) categoryGroups[p.category] = [];
                            categoryGroups[p.category].push(p);
                        }
                    });
                    
                    // Get 3-4 products from each category, prioritize high-rated
                    window.categoryProducts = [];
                    Object.values(categoryGroups).forEach(products => {
                        const sortedProducts = products
                            .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
                            .slice(0, 3);
                        window.categoryProducts.push(...sortedProducts);
                    });
                    
                    // Limit to reasonable number and shuffle
                    window.categoryProducts = window.categoryProducts
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 24);
                        
                    console.log(`🎲 Showing ${window.categoryProducts.length} diverse products as fallback`);
                }
            } else {
                window.categoryProducts = window.allProducts.slice(0, 30); // Limit for performance
                console.log('⚠️ No specific category found, showing limited product set');
            }
            
            window.filteredProducts = [...window.categoryProducts];
            
            // Immediate render
            setTimeout(() => {
                renderCategoryProducts();
                updateProductCount();
            }, 100);
            
        } catch (error) {
            console.error('❌ Error loading products:', error);
            showErrorState(error.message);
        }
    }
    
    function renderCategoryProducts() {
        const container = document.getElementById('category-products') || 
                         document.querySelector('.products-grid') ||
                         document.querySelector('[id*="products"]');
        
        if (!container) {
            console.error('❌ No container found for products');
            return;
        }
        
        console.log(`🎨 Rendering ${window.filteredProducts.length} products`);
        
        if (window.filteredProducts.length === 0) {
            const isEnglish = window.location.pathname.includes('/en/');
            const noResultsHTML = isEnglish ? `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #f9fafb; border-radius: 12px; border: 2px solid #e5e7eb;">
                    <div style="font-size: 4rem; margin-bottom: 1.5rem; opacity: 0.7;">🚫</div>
                    <h3 style="color: #111827; margin-bottom: 1rem; font-size: 1.5rem;">No Products Found</h3>
                    <p style="color: #6b7280; margin-bottom: 2rem;">No products available in this category or filter</p>
                    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                        <button onclick="window.filterByPrice('all', null)" style="
                            padding: 0.75rem 1.5rem; background: #10b981; color: white; 
                            border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
                        ">🔄 Show All</button>
                        <a href="../" style="
                            padding: 0.75rem 1.5rem; background: #1e40af; color: white; 
                            text-decoration: none; border-radius: 8px; font-weight: 600;
                        ">🏠 Home</a>
                    </div>
                </div>
            ` : `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #f9fafb; border-radius: 12px; border: 2px solid #e5e7eb;">
                    <div style="font-size: 4rem; margin-bottom: 1.5rem; opacity: 0.7;">🚫</div>
                    <h3 style="color: #111827; margin-bottom: 1rem; font-size: 1.5rem;">لم يتم العثور على منتجات</h3>
                    <p style="color: #6b7280; margin-bottom: 2rem;">لا توجد منتجات في هذه الفئة أو الفلتر الحالي</p>
                    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                        <button onclick="window.filterByPrice('all', null)" style="
                            padding: 0.75rem 1.5rem; background: #10b981; color: white; 
                            border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
                        ">🔄 عرض الكل</button>
                        <a href="./" style="
                            padding: 0.75rem 1.5rem; background: #1e40af; color: white; 
                            text-decoration: none; border-radius: 8px; font-weight: 600;
                        ">🏠 الرئيسية</a>
                    </div>
                </div>
            `;
            container.innerHTML = noResultsHTML;
            return;
        }
        
        try {
            const productsHTML = window.filteredProducts.map(createProductCard).join('');
            container.innerHTML = productsHTML;
            console.log(`✅ Successfully rendered ${window.filteredProducts.length} product cards`);
        } catch (renderError) {
            console.error('❌ Error rendering products:', renderError);
            const errorMsg = window.location.pathname.includes('/en/') 
                ? 'Error rendering products' 
                : 'خطأ في عرض المنتجات';
            container.innerHTML = `<div style="padding: 2rem; text-align: center; color: #dc2626;">${errorMsg}</div>`;
        }
    }
    
    function createProductCard(product) {
        if (!product || !product.id) {
            console.warn('⚠️ Invalid product data:', product);
            return '';
        }
        
        const currentPrice = product.sale_price || product.regular_price || 0;
        const originalPrice = product.sale_price && product.regular_price && product.regular_price > product.sale_price 
            ? `<span class="original-price">${product.regular_price} AED</span>` 
            : '';
        const discount = product.discount_percentage && product.discount_percentage > 0 
            ? `<div class="discount-badge">-${Math.round(product.discount_percentage)}%</div>` 
            : '';
            
        const safeTitle = product.title || 'منتج غير محدد';
        const displayTitle = safeTitle.length > 60 ? safeTitle.substring(0, 60) + '...' : safeTitle;
        const safeImageUrl = product.image_url || 'https://via.placeholder.com/400x300/1e40af/FFFFFF?text=Product';
            
        const isEnglishPage = window.location.pathname.includes('/en/');
        const categoryTranslations = {
            'الأجهزة المنزلية والكهربائية': 'Home Appliances & Electrical',
            'الإلكترونيات والتكنولوجيا': 'Electronics & Technology',
            'العناية الشخصية والصحة والجمال': 'Personal Care, Health & Beauty',
            'الأحذية والملابس والإكسسوارات': 'Shoes, Clothing & Accessories',
            'الرياضة واللياقة والصحة': 'Sports, Fitness & Health',
            'الأثاث والأدوات المنزلية': 'Furniture & Home Tools',
            'الأدوات والصيانة': 'Tools & Maintenance',
            'منتجات متنوعة': 'Miscellaneous Products',
            'السيارات والإكسسوارات': 'Car & Accessories',
            'أدوات الطبخ والمطبخ': 'Cooking & Kitchen Tools'
        };
        
        const categoryDisplay = isEnglishPage 
            ? (categoryTranslations[product.category] || product.category)
            : product.category;
        
        const whatsappMessage = isEnglishPage 
            ? `Hello, I'm interested in: ${safeTitle} (Price: ${currentPrice} AED)`
            : `مرحبا، أريد الاستفسار عن: ${safeTitle} (السعر: ${currentPrice} درهم)`;
        
        const buttonTexts = isEnglishPage 
            ? { add: '🛒 Add to Cart', whatsapp: '📱 WhatsApp', view: '👁 View Details' }
            : { add: '🛒 إضافة للسلة', whatsapp: '📱 واتساب', view: '👁 عرض التفاصيل' };
            
        const features = isEnglishPage 
            ? ['🇦🇪 UAE Product', '🚚 Free Shipping', '💰 Cash on Delivery']
            : ['🇦🇪 منتج إماراتي', '🚚 شحن مجاني', '💰 دفع عند الاستلام'];

        return `
            <div class="product-card" data-product-id="${product.id}">
                ${discount}
                
                <div class="product-image" style="cursor: pointer;" onclick="openProductPage('${product.id}')">
                    <img src="${safeImageUrl}" 
                         alt="${safeTitle}" 
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/400x300/1e40af/FFFFFF?text=Product+Image';">
                </div>
                
                <div class="product-info">
                    <div class="product-category">${categoryDisplay || 'عام'}</div>
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
    
    // GLOBAL FUNCTIONS - Available for onclick handlers
    window.addToCartFromCategory = function(productId) {
        const product = window.allProducts.find(p => p.id == productId);
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
            
            const isEnglish = window.location.pathname.includes('/en/');
            const message = isEnglish 
                ? `"${product.title}" added to cart successfully!` 
                : `تم إضافة "${product.title}" للسلة بنجاح!`;
                
            showNotification(message);
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            const message = window.location.pathname.includes('/en/') 
                ? 'Error adding product to cart' 
                : 'خطأ في إضافة المنتج للسلة';
            showNotification(message, 'error');
        }
    };
    
    window.openProductPage = function(productId) {
        const isInEnFolder = window.location.pathname.includes('/en/');
        const productUrl = isInEnFolder 
            ? `../product.html?id=${encodeURIComponent(productId)}`
            : `./product.html?id=${encodeURIComponent(productId)}`;
        window.open(productUrl, '_blank', 'noopener,noreferrer');
    };
    
    // GLOBAL FILTER FUNCTION - For onclick handlers
    window.filterByPrice = function(priceRange, buttonElement) {
        if (!window.categoryProducts || window.categoryProducts.length === 0) {
            console.warn('⚠️ No category products available for filtering');
            return;
        }
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        if (buttonElement) {
            buttonElement.classList.add('active');
        } else {
            // Find and activate the corresponding button
            const targetBtn = document.querySelector(`[data-filter="${priceRange}"]`);
            if (targetBtn) targetBtn.classList.add('active');
        }
        
        switch(priceRange) {
            case 'under-200':
                window.filteredProducts = window.categoryProducts.filter(p => (p.sale_price || p.regular_price || 0) < 200);
                break;
            case '200-300':
                window.filteredProducts = window.categoryProducts.filter(p => {
                    const price = p.sale_price || p.regular_price || 0;
                    return price >= 200 && price <= 300;
                });
                break;
            case 'over-300':
                window.filteredProducts = window.categoryProducts.filter(p => (p.sale_price || p.regular_price || 0) > 300);
                break;
            default: // 'all'
                window.filteredProducts = [...window.categoryProducts];
        }
        
        console.log(`📊 Filter "${priceRange}" applied: ${window.filteredProducts.length} results`);
        renderCategoryProducts();
        
        const isEnglish = window.location.pathname.includes('/en/');
        const filterLabels = {
            'all': isEnglish ? 'All Products' : 'جميع المنتجات',
            'under-200': isEnglish ? 'Under AED 200' : 'أقل من 200 درهم',
            '200-300': isEnglish ? 'AED 200-300' : '200-300 درهم',
            'over-300': isEnglish ? 'Over AED 300' : 'أكثر من 300 درهم'
        };
        
        const message = isEnglish 
            ? `Filter: ${filterLabels[priceRange]} (${window.filteredProducts.length} items)` 
            : `فلتر: ${filterLabels[priceRange]} (${window.filteredProducts.length} عنصر)`;
            
        showNotification(message);
    };
    
    function updateProductCount() {
        const countElement = document.getElementById('product-count');
        if (countElement && window.categoryProducts && window.categoryProducts.length > 0) {
            countElement.textContent = window.categoryProducts.length;
        }
    }
    
    function showErrorState(errorMessage) {
        const container = document.getElementById('category-products') || document.querySelector('.products-grid');
        if (!container) {
            console.error('❌ No container found to show error');
            return;
        }
        
        const isEnglish = window.location.pathname.includes('/en/');
        const title = isEnglish ? '⚠️ Loading Error' : '⚠️ خطأ في التحميل';
        const description = isEnglish 
            ? 'Unable to load products for this category' 
            : 'لم يتمكن من تحميل منتجات هذه الفئة';
        const buttonText = isEnglish ? '🏠 Back to Home' : '🏠 العودة للرئيسية';
        const homeUrl = isEnglish ? '../' : './';
        
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: #f9fafb; border-radius: 16px; border: 2px solid #dc2626;">
                <div style="font-size: 4rem; margin-bottom: 1.5rem;">❌</div>
                <h3 style="color: #dc2626; margin-bottom: 1rem; font-size: 1.5rem;">${title}</h3>
                <p style="color: #6b7280; margin-bottom: 1rem;">${description}</p>
                <p style="font-size: 14px; color: #9ca3af; margin-bottom: 2rem; font-family: monospace;">Technical: ${errorMessage}</p>
                <a href="${homeUrl}" style="
                    display: inline-block; padding: 1rem 2rem; 
                    background: #1e40af; color: white; text-decoration: none; 
                    border-radius: 12px; font-weight: 700; box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
                ">${buttonText}</a>
            </div>
        `;
    }
    
    function showNotification(message, type = 'success') {
        const colors = { success: '#10b981', error: '#ef4444' };
        
        // Clear existing notifications
        document.querySelectorAll('.category-notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = 'category-notification';
        notification.style.cssText = `
            position: fixed; top: 120px; right: 24px; background: ${colors[type]};
            color: white; padding: 1rem 1.5rem; border-radius: 12px;
            font-weight: 600; z-index: 1070; box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            cursor: pointer; max-width: 300px; border: 2px solid white;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        notification.addEventListener('click', () => notification.remove());
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 4000);
    }
    
    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        const categoryName = getCategoryFromPage();
        console.log(`🏷️ Category page initialized for: "${categoryName}"`);
        
        // Load data after small delay to ensure DOM is fully ready
        setTimeout(() => {
            loadCategoryData();
        }, 300);
    });
    
})();

// Add slideIn animation
if (!document.querySelector('#category-animation-styles')) {
    const styles = document.createElement('style');
    styles.id = 'category-animation-styles';
    styles.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(styles);
}