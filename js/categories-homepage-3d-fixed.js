/**
 * نظام إدارة المنتجات والفئات للصفحة الرئيسية - محدث
 * Homepage Products and Categories Management System - Updated
 */

class CategoriesHomepage3DFixed {
    constructor() {
        this.products = [];
        this.categories = [];
        this.featuredProducts = [];
        this.FEATURED_PRICE_THRESHOLD = 300;
        this.isLoading = false;
        this.currentFilter = null;
        
        this.initializeApp();
        this.setupEventListeners();
        this.loadProducts();
    }

    // INITIALIZATION
    initializeApp() {
        console.log('🚀 Categories Homepage 3D Fixed - Loading...');
        this.initializeAnimations();
        this.updateWhatsAppLinks();
        this.addScrollEffects();
        this.addParticles();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('main-search');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
            
            // Real-time search
            searchInput.addEventListener('input', () => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    if (searchInput.value.trim().length > 2) {
                        this.performSearch();
                    }
                }, 500);
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }

        // Global click handler for all product interactions
        document.addEventListener('click', (e) => {
            // Prevent default for specific elements
            const target = e.target;
            const card = target.closest('.product-card');
            
            // Tab switching
            if (target.matches('.tab-btn')) {
                e.preventDefault();
                this.switchTab(target.dataset.tab, target);
                return;
            }
            
            // Category card clicks - Shows products in same page with filter
            if (target.closest('.category-card')) {
                e.preventDefault();
                const categoryCard = target.closest('.category-card');
                const categoryName = categoryCard.dataset.category;
                if (categoryName) {
                    this.viewCategory(categoryName);
                }
                return;
            }
            
            // Product card interactions
            if (card) {
                const productId = card.dataset.productId;
                
                // Add to cart button - highest priority
                if (target.matches('.add-to-cart') || target.closest('.add-to-cart')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.addToCartHandler(productId);
                    return;
                }
                
                // WhatsApp button
                if (target.matches('.whatsapp-btn') || target.closest('.whatsapp-btn')) {
                    // Let default behavior handle WhatsApp link
                    return;
                }
                
                // View details button
                if (target.matches('.view-details') || target.closest('.view-details')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.viewProductDetails(productId);
                    return;
                }
                
                // Product image or title click - open details in new tab
                if (target.matches('.product-image') || target.closest('.product-image') ||
                    target.matches('.product-title') || target.closest('.product-title') ||
                    target.tagName === 'IMG' && target.closest('.product-card')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.viewProductDetails(productId);
                    return;
                }
            }
            
            // Back to categories button
            if (target.id === 'back-to-categories' || target.closest('#back-to-categories')) {
                e.preventDefault();
                this.resetView();
                return;
            }
        });
    }

    // PRODUCT LOADING with multiple fallbacks
    async loadProducts() {
        try {
            this.showLoadingState();
            console.log('📂 Attempting to load products...');
            
            // Try multiple data sources
            const dataSources = [
                './data/uae-products.json',
                'data/uae-products.json'
            ];
            
            let rawProducts = null;
            let loadedFrom = '';
            
            for (const source of dataSources) {
                try {
                    console.log(`🔄 Trying to load from: ${source}`);
                    const response = await fetch(source);
                    if (response.ok) {
                        rawProducts = await response.json();
                        loadedFrom = source;
                        console.log(`✅ Successfully loaded from: ${source}`);
                        break;
                    }
                } catch (err) {
                    console.warn(`❌ Failed to load from ${source}:`, err.message);
                }
            }
            
            if (!rawProducts || rawProducts.length === 0) {
                throw new Error('No product data could be loaded from any source');
            }
            
            // Process and clean product data
            this.products = rawProducts.map(product => ({
                ...product,
                // Clean price data
                sale_price: this.parsePrice(product.sale_price),
                regular_price: this.parsePrice(product.regular_price),
                discount_percentage: parseFloat(product.discount_percentage) || 0,
                average_rating: parseFloat(product.average_rating) || 4.0,
                review_count: parseInt(product.review_count) || Math.floor(Math.random() * 50) + 10,
                
                // Ensure category exists
                category: product.category || 'منتجات عامة',
                
                // Add features for display
                features: this.generateProductFeatures(product),
                
                // Fix image URL
                image_url: this.getWorkingImageUrl(product)
            }));
            
            // Make products available globally for cart
            window.productsData = this.products;
            
            console.log(`✅ تم تحميل ${this.products.length} منتج بنجاح من ${loadedFrom}`);
            
            // Process categories and featured products
            this.processCategories();
            this.processFeaturedProducts();
            
            setTimeout(() => {
                this.hideLoadingState();
                this.renderCategories();
                this.renderFeaturedProducts();
                this.renderAllProducts();
            }, 1000);
            
        } catch (error) {
            console.error('❌ خطأ في تحميل المنتجات:', error);
            this.showError('حدث خطأ في تحميل المنتجات. سيتم تحميل بيانات تجريبية.');
            
            // Load fallback data
            setTimeout(() => {
                this.loadFallbackData();
            }, 2000);
        }
    }

    // ADD TO CART HANDLER
    addToCartHandler(productId) {
        console.log(`🛒 إضافة المنتج للسلة: ${productId}`);
        
        // Use global cart if available
        if (window.cart && typeof window.cart.addToCart === 'function') {
            window.cart.addToCart(productId);
            return;
        }
        
        // Fallback: manual cart handling
        try {
            const product = this.getProductById(productId);
            if (!product) {
                this.showError('لم يتم العثور على بيانات المنتج');
                return;
            }
            
            const cartItems = JSON.parse(localStorage.getItem('emirates_cart') || '[]');
            const existingItem = cartItems.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
                this.showSuccess(`تم زيادة عدد "${product.title}" في السلة ✅`);
            } else {
                const cartItem = {
                    id: product.id,
                    title: product.title,
                    price: product.sale_price || product.regular_price,
                    image: product.image_url,
                    quantity: 1,
                    addedAt: Date.now()
                };
                cartItems.push(cartItem);
                this.showSuccess(`تم إضافة "${product.title}" للسلة ✅`);
            }
            
            localStorage.setItem('emirates_cart', JSON.stringify(cartItems));
            
            // Update cart display if function exists
            if (window.cart && typeof window.cart.updateCartDisplay === 'function') {
                window.cart.updateCartDisplay();
            }
            
        } catch (error) {
            console.error('خطأ في إضافة المنتج للسلة:', error);
            this.showError('حدث خطأ في إضافة المنتج للسلة');
        }
    }

    getProductById(productId) {
        return this.products.find(p => p.id == productId);
    }

    parsePrice(priceString) {
        if (typeof priceString === 'number') return priceString;
        if (!priceString) return 0;
        
        // Remove currency symbols and extract number
        const cleaned = String(priceString).replace(/[^\d.]/g, '');
        return parseFloat(cleaned) || 0;
    }

    getWorkingImageUrl(product) {
        const originalUrl = product.image_url;
        
        // If no URL or invalid URL, create a placeholder
        if (!originalUrl || typeof originalUrl !== 'string' || originalUrl.length < 10) {
            return this.createProductPlaceholder(product.title);
        }
        
        // Return original URL - fallbacks handled in HTML
        return originalUrl;
    }

    createProductPlaceholder(productTitle) {
        const cleanTitle = encodeURIComponent(productTitle.substring(0, 30));
        return `https://via.placeholder.com/400x300/DAA520/FFFFFF?text=${cleanTitle}`;
    }

    generateProductFeatures(product) {
        const features = [];
        
        // UAE compliant
        if (product.uae_compliant !== false) {
            features.push('🇦🇪 منتج إماراتي 100%');
        }
        
        // Free shipping
        const price = product.sale_price || product.regular_price;
        if (!product.free_shipping_threshold || price >= (product.free_shipping_threshold || 100)) {
            features.push('🚚 شحن مجاني');
        }
        
        // Cash on delivery
        if (product.cod_available !== false) {
            features.push('💰 دفع عند الاستلام');
        }
        
        // Delivery time
        features.push(`⏰ ${product.delivery_time || '1-3 أيام عمل'}`);
        
        return features.slice(0, 4);
    }

    processCategories() {
        const categoryCount = {};
        this.products.forEach(product => {
            const category = product.category || 'منتجات عامة';
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
        
        this.categories = Object.entries(categoryCount)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
        
        console.log(`📂 تم العثور على ${this.categories.length} فئة`);
    }

    processFeaturedProducts() {
        this.featuredProducts = this.products
            .filter(product => {
                const price = product.sale_price || product.regular_price;
                return price >= this.FEATURED_PRICE_THRESHOLD;
            })
            .sort((a, b) => (b.sale_price || b.regular_price) - (a.sale_price || a.regular_price))
            .slice(0, 12);
        
        console.log(`💎 تم العثور على ${this.featuredProducts.length} منتج مميز (أكثر من ${this.FEATURED_PRICE_THRESHOLD} درهم)`);
    }

    // RENDERING FUNCTIONS
    renderCategories() {
        const container = document.getElementById('categories-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (this.categories.length === 0) {
            container.innerHTML = `
                <div class="no-categories" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <h3>🔍 لا توجد فئات متاحة</h3>
                    <p>يرجى تحديث الصفحة أو المحاولة لاحقاً</p>
                </div>
            `;
            return;
        }
        
        this.categories.forEach((category, index) => {
            const categoryCard = this.createCategoryCard(category);
            const cardElement = document.createElement('div');
            cardElement.innerHTML = categoryCard;
            cardElement.firstElementChild.style.animationDelay = `${index * 0.1}s`;
            cardElement.firstElementChild.classList.add('animate-fade-in');
            container.appendChild(cardElement.firstElementChild);
        });
    }

    createCategoryCard(category) {
        const icon = this.getCategoryIcon(category.name);
        
        return `
            <div class="category-card card-3d" data-category="${category.name}">
                <div class="card-3d-inner">
                    <div class="category-icon">${icon}</div>
                    <h3 class="category-name">${category.name}</h3>
                    <div class="category-count">${category.count} منتج</div>
                </div>
            </div>
        `;
    }

    getCategoryIcon(categoryName) {
        const icons = {
            'الأجهزة المنزلية والكهربائية': '🏠',
            'الإلكترونيات والتكنولوجيا': '📱',
            'العناية الشخصية والصحة والجمال': '💄',
            'الأحذية والملابس والإكسسوارات': '👟',
            'الرياضة واللياقة والصحة': '🏋️',
            'الأثاث والأدوات المنزلية': '🛋️',
            'الأدوات والصيانة': '🔧',
            'منتجات متنوعة': '🛍️'
        };
        
        return icons[categoryName] || '🛍️';
    }

    renderFeaturedProducts() {
        const container = document.getElementById('featured-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (this.featuredProducts.length === 0) {
            container.innerHTML = `
                <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">💎</div>
                    <h3>لا توجد منتجات مميزة حالياً</h3>
                    <p>المنتجات المميزة هي التي يزيد سعرها عن ${this.FEATURED_PRICE_THRESHOLD} درهم</p>
                    <a href="https://wa.me/201110760081" target="_blank" class="btn whatsapp-btn" style="margin-top: 1rem; text-decoration: none; display: inline-block;">
                        📱 تواصل معنا للمنتجات الخاصة
                    </a>
                </div>
            `;
            return;
        }
        
        this.featuredProducts.forEach((product, index) => {
            const productCard = this.createProductCard(product, true);
            const cardElement = document.createElement('div');
            cardElement.innerHTML = productCard;
            cardElement.firstElementChild.style.animationDelay = `${index * 0.1}s`;
            cardElement.firstElementChild.classList.add('animate-fade-in');
            container.appendChild(cardElement.firstElementChild);
        });
    }

    renderAllProducts() {
        const container = document.getElementById('all-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (this.products.length === 0) {
            container.innerHTML = `
                <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <h3>🔍 لا توجد منتجات متاحة</h3>
                    <p>يرجى تحديث الصفحة أو المحاولة لاحقاً</p>
                </div>
            `;
            return;
        }
        
        // Show all products sorted by title
        const productsToShow = this.products
            .sort((a, b) => a.title.localeCompare(b.title, 'ar'));
        
        productsToShow.forEach((product, index) => {
            const productCard = this.createProductCard(product, false);
            const cardElement = document.createElement('div');
            cardElement.innerHTML = productCard;
            cardElement.firstElementChild.style.animationDelay = `${index * 0.05}s`;
            cardElement.firstElementChild.classList.add('animate-fade-in');
            container.appendChild(cardElement.firstElementChild);
        });
    }

    createProductCard(product, isFeatured = false) {
        const currentPrice = product.sale_price || product.regular_price;
        const originalPrice = product.sale_price && product.regular_price > product.sale_price ? product.regular_price : null;
        const discount = product.discount_percentage > 0 
            ? `<div class="discount-badge">-${Math.round(product.discount_percentage)}%</div>` 
            : '';
            
        const originalPriceHTML = originalPrice 
            ? `<span class="original-price">${originalPrice} درهم</span>` 
            : '';

        const stars = this.generateStars(product.average_rating);
        
        // Image with multiple fallbacks
        const primaryImage = product.image_url;
        const fallback1 = this.createProductPlaceholder(product.title);
        const fallback2 = `https://dummyimage.com/400x300/daa520/ffffff?text=صورة+المنتج`;
        
        const displayTitle = product.title.length > 65 
            ? product.title.substring(0, 65) + '...' 
            : product.title;
        
        const features = product.features || [];
        
        const featuredBadge = isFeatured 
            ? `<div class="discount-badge" style="background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%); left: 1rem; top: 3rem;">⭐ مميز</div>`
            : '';

        // WhatsApp message
        const whatsappMessage = `مرحبا، أريد الاستفسار عن:

▶️ ${product.title}
💰 السعر: ${currentPrice} درهم
📎 الفئة: ${product.category}

أرجو إرسال التفاصيل وطريقة التوصيل.`;

        return `
            <div class="product-card card-3d" data-product-id="${product.id}">
                <div class="card-3d-inner">
                    ${discount}
                    ${featuredBadge}
                    
                    <div class="product-image" style="cursor: pointer;" title="اضغط لعرض تفاصيل المنتج">
                        <img src="${primaryImage}" 
                             alt="${product.title}" 
                             loading="lazy"
                             onerror="this.onerror=null;this.src='${fallback1}';this.onerror=function(){this.src='${fallback2}'};"
                             style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-title" title="${product.title} - اضغط لعرض التفاصيل" style="cursor: pointer;">${displayTitle}</h3>
                        <div class="product-rating" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; font-size: 0.9rem; color: var(--text-secondary);">
                            <span style="color: #FCD34D;">${stars}</span>
                            <span>(${product.review_count || 0} تقييم)</span>
                        </div>
                        <div class="product-price">
                            <span class="current-price">${currentPrice} درهم</span>
                            ${originalPriceHTML}
                        </div>
                        <div class="product-features">
                            ${features.slice(0, 3).map(feature => `<div class="feature">${feature}</div>`).join('')}
                        </div>
                        <div class="product-actions">
                            <button class="btn add-to-cart" data-product-id="${product.id}" title="إضافة المنتج للسلة">
                                🛒 إضافة
                            </button>
                            <a href="https://wa.me/201110760081?text=${encodeURIComponent(whatsappMessage)}" 
                               class="btn whatsapp-btn" target="_blank" rel="noopener" title="طلب عبر واتساب">
                                📱 واتساب
                            </a>
                            <button class="btn view-details" data-product-id="${product.id}" title="عرض تفاصيل المنتج">
                                👁 تفاصيل
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // NAVIGATION FUNCTIONS
    
    // Category view shows filtered products in same page
    viewCategory(categoryName) {
        console.log(`🏷️ عرض فئة: ${categoryName}`);
        
        // Filter products by category
        const categoryProducts = this.products.filter(product => 
            product.category === categoryName
        );
        
        if (categoryProducts.length === 0) {
            this.showError(`لا توجد منتجات في فئة "${categoryName}"`);
            return;
        }
        
        this.currentFilter = categoryName;
        
        // Show filter bar
        const filterBar = document.getElementById('filter-bar');
        const filterText = document.getElementById('filter-text');
        
        if (filterBar && filterText) {
            filterBar.style.display = 'block';
            filterText.innerHTML = `
                <span style="color: var(--primary-color); font-weight: bold;">${this.getCategoryIcon(categoryName)} ${categoryName}</span>
                <span style="color: var(--text-secondary);">(تم العثور على ${categoryProducts.length} منتج)</span>
            `;
        }
        
        // Switch to all products tab
        this.switchTabProgrammatically('all-products');
        
        // Render filtered products
        this.renderFilteredProducts(categoryProducts, categoryName);
        
        // Scroll to products section
        document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
        
        this.showSuccess(`تم عرض ${categoryProducts.length} منتج من فئة "${categoryName}"`);
    }
    
    switchTabProgrammatically(tabId) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        const targetTab = document.querySelector(`[data-tab="${tabId}"]`);
        const targetContent = document.getElementById(tabId);
        
        if (targetTab) targetTab.classList.add('active');
        if (targetContent) targetContent.classList.add('active');
    }
    
    renderFilteredProducts(products, categoryName) {
        const container = document.getElementById('all-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        products.forEach((product, index) => {
            const productCard = this.createProductCard(product, false);
            const cardElement = document.createElement('div');
            cardElement.innerHTML = productCard;
            cardElement.firstElementChild.style.animationDelay = `${index * 0.1}s`;
            cardElement.firstElementChild.classList.add('animate-fade-in');
            container.appendChild(cardElement.firstElementChild);
        });
    }
    
    resetView() {
        // Reset filter
        this.currentFilter = null;
        
        // Hide filter bar
        const filterBar = document.getElementById('filter-bar');
        if (filterBar) {
            filterBar.style.display = 'none';
        }
        
        // Clear search
        const searchInput = document.getElementById('main-search');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Switch to featured tab
        this.switchTabProgrammatically('featured-products');
        
        // Re-render all products in all-products tab
        this.renderAllProducts();
        
        // Scroll to categories
        document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
        
        this.showSuccess('تم العودة لعرض جميع الفئات');
    }

    // Product details opens in new tab with proper URL
    viewProductDetails(productId) {
        console.log(`👁 فتح معاينة المنتج: ${productId}`);
        
        // Find the product to get its URL slug
        const product = this.getProductById(productId);
        if (!product) {
            this.showError('لم يتم العثور على المنتج');
            return;
        }
        
        // Try to use the product's URL slug if available
        let productUrl;
        
        if (product.url_slug) {
            // Use existing URL slug
            productUrl = `./data/pruducts-pages/${product.url_slug}.html`;
        } else {
            // Generate URL slug
            const slug = this.createArabicSlug(product.title, productId);
            productUrl = `./data/pruducts-pages/${slug}.html`;
        }
        
        // Open in new tab
        window.open(productUrl, '_blank', 'noopener,noreferrer');
        
        this.showSuccess(`جاري فتح تفاصيل "${product.title}" في تبويب جديد`);
    }
    
    createArabicSlug(title, productId) {
        // Create Arabic-friendly slug
        let slug = title.trim();
        slug = slug.replace(/\s+/g, '-');
        slug = slug.replace(/[^\u0600-\u06FF\u0750-\u077F\w\-]/g, '');
        slug = slug.replace(/--+/g, '-');
        slug = slug.replace(/^-+|-+$/g, '');
        
        return `${slug}-${productId}`;
    }

    // TAB FUNCTIONALITY
    switchTab(tabId, tabButton) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        tabButton.classList.add('active');
        document.getElementById(tabId).classList.add('active');
        
        console.log(`📑 تم التبديل للتبويب: ${tabId}`);
    }

    // SEARCH FUNCTIONALITY
    performSearch() {
        const searchInput = document.getElementById('main-search');
        const query = searchInput ? searchInput.value.trim() : '';
        
        if (query.length === 0) {
            this.showError('يرجى إدخال كلمة للبحث');
            return;
        }
        
        if (query.length < 2) {
            this.showError('يرجى إدخال حرفين على الأقل للبحث');
            return;
        }
        
        console.log(`🔍 البحث عن: ${query}`);
        
        // Filter products locally
        const searchResults = this.products.filter(product => 
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(query.toLowerCase())) ||
            (product.seo_keywords && product.seo_keywords.toLowerCase().includes(query.toLowerCase()))
        );
        
        if (searchResults.length === 0) {
            this.showError(`لا توجد نتائج للبحث عن "${query}"`);
            return;
        }
        
        // Update filter bar for search
        const filterBar = document.getElementById('filter-bar');
        const filterText = document.getElementById('filter-text');
        
        if (filterBar && filterText) {
            filterBar.style.display = 'block';
            filterText.innerHTML = `
                <span style="color: var(--primary-color); font-weight: bold;">🔍 نتائج البحث: "${query}"</span>
                <span style="color: var(--text-secondary);">(تم العثور على ${searchResults.length} منتج)</span>
            `;
        }
        
        // Show search results in the all products tab
        this.switchTabProgrammatically('all-products');
        this.renderFilteredProducts(searchResults, `بحث: ${query}`);
        
        // Scroll to results
        document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
        
        this.showSuccess(`تم العثور على ${searchResults.length} منتج للبحث عن "${query}"`);
    }

    // SCROLL EFFECTS
    addScrollEffects() {
        const header = document.querySelector('.header');
        
        window.addEventListener('scroll', () => {
            if (header) {
                if (window.pageYOffset > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });
    }

    // PARTICLES EFFECT
    addParticles() {
        const particlesContainer = document.querySelector('.particles');
        if (!particlesContainer) return;
        
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            particle.style.opacity = Math.random() * 0.5 + 0.3;
            
            particlesContainer.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 6000);
        }
        
        // Create new particle every 2 seconds
        setInterval(createParticle, 2000);
    }

    // LOADING STATES
    showLoadingState() {
        const containers = ['categories-container', 'featured-container', 'all-container'];
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="loading" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                        <div class="loading-spinner"></div>
                        <h3>جاري التحميل...</h3>
                        <p>يرجى الانتظار قليلاً</p>
                    </div>
                `;
            }
        });
    }

    hideLoadingState() {
        document.querySelectorAll('.loading').forEach(loading => {
            if (loading.parentNode) {
                loading.parentNode.removeChild(loading);
            }
        });
    }

    // NOTIFICATION FUNCTIONS
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    showNotification(message, type = 'info') {
        const colors = {
            error: { bg: '#EF4444', shadow: 'rgba(239, 68, 68, 0.3)' },
            success: { bg: '#10B981', shadow: 'rgba(16, 185, 129, 0.3)' },
            info: { bg: '#3B82F6', shadow: 'rgba(59, 130, 246, 0.3)' }
        };
        
        const color = colors[type] || colors.info;
        
        // Remove existing notifications
        document.querySelectorAll('.homepage-notification').forEach(n => n.remove());
        
        const notificationDiv = document.createElement('div');
        notificationDiv.className = 'homepage-notification';
        notificationDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${color.bg};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 25px;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
            box-shadow: 0 4px 20px ${color.shadow};
            max-width: 300px;
            cursor: pointer;
        `;
        notificationDiv.textContent = message;
        
        // Click to dismiss
        notificationDiv.addEventListener('click', () => {
            notificationDiv.style.animation = 'slideOutRight 0.5s ease-in forwards';
            setTimeout(() => {
                if (notificationDiv.parentNode) {
                    notificationDiv.parentNode.removeChild(notificationDiv);
                }
            }, 500);
        });
        
        document.body.appendChild(notificationDiv);
        
        // Auto dismiss after 4 seconds
        setTimeout(() => {
            if (notificationDiv.parentNode) {
                notificationDiv.style.animation = 'slideOutRight 0.5s ease-in forwards';
                setTimeout(() => {
                    if (notificationDiv.parentNode) {
                        notificationDiv.parentNode.removeChild(notificationDiv);
                    }
                }, 500);
            }
        }, 4000);
    }

    // FALLBACK DATA
    loadFallbackData() {
        console.log('📂 تحميل بيانات احتياطية...');
        
        // Sample data with proper structure
        this.products = [
            {
                id: 'sample-1',
                title: 'غسالة محمولة قابلة للطي - توفير مساحة ووقت',
                category: 'الأجهزة المنزلية والكهربائية',
                sale_price: 150,
                regular_price: 200,
                currency: 'AED',
                discount_percentage: 25,
                image_url: 'https://via.placeholder.com/400x300/DAA520/FFFFFF?text=غسالة+محمولة',
                average_rating: 4.7,
                review_count: 70,
                features: ['🇦🇪 منتج إماراتي 100%', '🚚 شحن مجاني', '💰 دفع عند الاستلام', '⏰ 1-3 أيام عمل']
            },
            {
                id: 'sample-2',
                title: 'مرطب كهربائي بزيت طبيعي - صحة وراحة',
                category: 'العناية الشخصية والصحة والجمال',
                sale_price: 175,
                regular_price: 250,
                currency: 'AED',
                discount_percentage: 30,
                image_url: 'https://via.placeholder.com/400x300/25D366/FFFFFF?text=مرطب+كهربائي',
                average_rating: 5.0,
                review_count: 85,
                features: ['🇦🇪 منتج إماراتي 100%', '🚚 شحن مجاني', '💰 دفع عند الاستلام', '⏰ 1-3 أيام عمل']
            },
            {
                id: 'sample-3',
                title: 'مكنسة كهربائية لاسلكية - قوة شفط عالية',
                category: 'الأجهزة المنزلية والكهربائية',
                sale_price: 350,
                regular_price: 450,
                currency: 'AED',
                discount_percentage: 22,
                image_url: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=مكنسة+كهربائية',
                average_rating: 4.5,
                review_count: 120,
                features: ['🇦🇪 منتج إماراتي 100%', '🚚 شحن مجاني', '💰 دفع عند الاستلام', '⏰ 1-3 أيام عمل']
            }
        ];
        
        this.processCategories();
        this.processFeaturedProducts();
        
        // Make available globally
        window.productsData = this.products;
        
        this.hideLoadingState();
        this.renderCategories();
        this.renderFeaturedProducts();
        this.renderAllProducts();
        
        this.showSuccess('تم تحميل بيانات تجريبية - 3 منتجات');
    }

    // UTILITY FUNCTIONS
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
    }

    updateWhatsAppLinks() {
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
        whatsappLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href.includes('201110760081')) {
                const newHref = href.replace(/wa\.me\/\d+/, 'wa.me/201110760081');
                link.setAttribute('href', newHref);
            }
        });
    }

    initializeAnimations() {
        const style = document.createElement('style');
        style.textContent = `
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 بدء تحميل المتجر...');
    
    // Initialize the enhanced homepage
    window.categoriesHomepage = new CategoriesHomepage3DFixed();
    console.log('🎉 تم تحميل المتجر بنجاح!');
});