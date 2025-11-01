// ===== Fixed JavaScript for Categories and Products Navigation =====

class CategoriesHomepage3DFixed {
    constructor() {
        this.products = [];
        this.categories = [];
        this.featuredProducts = [];
        this.FEATURED_PRICE_THRESHOLD = 300;
        this.isLoading = false;
        
        this.initializeApp();
        this.setupEventListeners();
        this.loadProducts();
    }

    // INITIALIZATION
    initializeApp() {
        console.log('🚀 Categories Homepage 3D Fixed - Loading...');
        this.initializeAnimations();
        this.updateWhatsAppLinks();
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
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }

        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.matches('.tab-btn')) {
                this.switchTab(e.target.dataset.tab, e.target);
            }
            
            // Category card clicks - FIXED: Opens products in same page with category filter
            if (e.target.closest('.category-card')) {
                const categoryCard = e.target.closest('.category-card');
                const categoryName = categoryCard.dataset.category;
                this.viewCategory(categoryName);
            }
            
            // Product actions
            if (e.target.matches('.whatsapp-btn') || e.target.closest('.whatsapp-btn')) {
                const btn = e.target.matches('.whatsapp-btn') ? e.target : e.target.closest('.whatsapp-btn');
                const productId = btn.dataset.productId;
                this.sendWhatsAppInquiry(productId);
            }
            
            if (e.target.matches('.view-details') || e.target.closest('.view-details')) {
                const btn = e.target.matches('.view-details') ? e.target : e.target.closest('.view-details');
                const productId = btn.dataset.productId;
                this.viewProductDetails(productId);
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
                './data/products.json',
                'data/uae-products.json',
                'uae-products.json'
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
            
            console.log(`✅ تم تحميل ${this.products.length} منتج بنجاح من ${loadedFrom}`);
            
            // Process categories and featured products
            this.processCategories();
            this.processFeaturedProducts();
            
            setTimeout(() => {
                this.hideLoadingState();
                this.renderCategories();
                this.renderFeaturedProducts();
            }, 1500);
            
        } catch (error) {
            console.error('❌ خطأ في تحميل المنتجات:', error);
            this.showError('حدث خطأ في تحميل المنتجات. سيتم تحميل بيانات تجريبية.');
            
            // Load fallback data
            setTimeout(() => {
                this.loadFallbackData();
            }, 2000);
        }
    }

    // Get working image URL with multiple fallbacks
    getWorkingImageUrl(product) {
        const originalUrl = product.image_url;
        
        // If no URL or invalid URL, create a placeholder based on product name
        if (!originalUrl || typeof originalUrl !== 'string' || originalUrl.length < 10) {
            return this.createProductPlaceholder(product.title);
        }
        
        // Check if URL is accessible (basic validation)
        if (originalUrl.startsWith('http')) {
            return originalUrl;
        }
        
        // If relative URL, make it absolute
        if (originalUrl.startsWith('./') || originalUrl.startsWith('/')) {
            return window.location.origin + originalUrl.replace('./', '/');
        }
        
        // Otherwise return placeholder
        return this.createProductPlaceholder(product.title);
    }

    // Create a themed placeholder image based on product title
    createProductPlaceholder(productTitle) {
        // Create a category-based placeholder
        const cleanTitle = encodeURIComponent(productTitle.substring(0, 50));
        
        // Use different placeholder services for variety
        const placeholders = [
            `https://via.placeholder.com/400x300/DAA520/FFFFFF?text=${cleanTitle}`,
            `https://dummyimage.com/400x300/DAA520/FFFFFF&text=${cleanTitle}`,
            `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`
        ];
        
        return placeholders[Math.floor(Math.random() * placeholders.length)];
    }

    parsePrice(priceString) {
        if (typeof priceString === 'number') return priceString;
        if (!priceString) return 0;
        
        // Remove currency symbols and extract number
        const cleaned = String(priceString).replace(/[^\d.]/g, '');
        return parseFloat(cleaned) || 0;
    }

    generateProductFeatures(product) {
        const features = [];
        
        // Shipping
        if (product.free_shipping || (product.sale_price && product.sale_price > 100)) {
            features.push('📦 شحن مجاني');
        } else {
            features.push('🚚 شحن سريع');
        }
        
        // Delivery time
        features.push(`⏰ ${product.delivery_time || '1-3 أيام عمل'}`);
        
        // Payment method
        if (product.cod_available !== false) {
            features.push('💳 دفع عند الاستلام');
        }
        
        // Quality assurance
        if (product.uae_compliant !== false) {
            features.push('✅ معتمد في الإمارات');
        }
        
        // Stock status
        if (product.stock_status === 'in stock' || !product.stock_status) {
            features.push('⚡ متوفر الآن');
        }
        
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
            .sort((a, b) => b.count - a.count)
            .slice(0, 12);
        
        console.log(`📂 تم العثور على ${this.categories.length} فئة`);
    }

    processFeaturedProducts() {
        this.featuredProducts = this.products
            .filter(product => product.sale_price > this.FEATURED_PRICE_THRESHOLD)
            .sort((a, b) => b.sale_price - a.sale_price)
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
            'إلكترونيات وتكنولوجيا': '💻',
            'الهواتف وأجهزة الكمبيوتر': '💻',
            'الأحذية والملابس والإكسسوارات': '👗',
            'العناية الشخصية والصحة والجمال': '💄',
            'الرياضة واللياقة والصحة': '🏃',
            'الألعاب والهوايات': '🎮',
            'الأثاث والأدوات المنزلية': '🪑',
            'السيارات والإكسسوارات': '🚗',
            'الكتب والإعلام': '📚',
            'الطعام والمشروبات': '🍽️',
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
                    <button class="btn whatsapp-btn" onclick="window.open('https://wa.me/201110760081', '_blank')" style="margin-top: 1rem;">
                        📱 تواصل معنا للمنتجات الخاصة
                    </button>
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
        
        const productsToShow = this.products
            .sort((a, b) => a.title.localeCompare(b.title, 'ar'))
            .slice(0, 24);
        
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
        const discount = product.discount_percentage > 0 
            ? `<div class="discount-badge">خصم ${Math.round(product.discount_percentage)}%</div>` 
            : '';
            
        const originalPrice = product.regular_price > product.sale_price 
            ? `<span class="original-price">${product.regular_price} ${product.currency || 'AED'}</span>` 
            : '';

        const stars = this.generateStars(product.average_rating);
        
        // Enhanced image handling with multiple fallbacks
        const primaryImage = product.image_url;
        const fallback1 = this.createProductPlaceholder(product.title);
        const fallback2 = `https://via.placeholder.com/400x300/DAA520/FFFFFF?text=${encodeURIComponent(product.title.substring(0, 20))}`;
        
        const displayTitle = product.title.length > 65 
            ? product.title.substring(0, 65) + '...' 
            : product.title;
        
        const features = product.features || [];
        
        const featuredBadge = isFeatured 
            ? `<div class="discount-badge" style="background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%); left: 1rem;">⭐ مميز</div>`
            : '';

        return `
            <div class="product-card card-3d" data-product-id="${product.id}">
                <div class="card-3d-inner">
                    <div class="product-image">
                        <img src="${primaryImage}" 
                             alt="${product.title}" 
                             loading="lazy"
                             onerror="this.onerror=null;this.src='${fallback1}';this.onerror=function(){this.src='${fallback2}'};"
                             style="width: 100%; height: 100%; object-fit: cover;">
                        ${discount}
                        ${featuredBadge}
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-title" title="${product.title}">${displayTitle}</h3>
                        <div class="product-rating" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; font-size: 0.9rem; color: var(--text-secondary);">
                            <span style="color: #FCD34D;">${stars}</span>
                            <span>(${product.review_count || 0} تقييم)</span>
                        </div>
                        <div class="product-price">
                            <span class="current-price">${product.sale_price} ${product.currency || 'AED'}</span>
                            ${originalPrice}
                        </div>
                        <div class="product-features">
                            ${features.slice(0, 3).map(feature => `<div class="feature">${feature}</div>`).join('')}
                        </div>
                        <div class="product-actions">
                            <a href="https://wa.me/201110760081?text=${encodeURIComponent('أريد الاستفسار عن ' + product.title + ' - ' + product.sale_price + ' ' + (product.currency || 'AED'))}" 
                               class="whatsapp-btn" target="_blank" rel="noopener"
                               data-product-id="${product.id}">
                                📱 واتساب
                            </a>
                            <button class="view-details" data-product-id="${product.id}">
                                👁 التفاصيل
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // NAVIGATION FUNCTIONS - FIXED
    
    // FIXED: Category view now shows filtered products in same page
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
        
        // Update the active tab to "all products"
        this.switchTabProgrammatically('all-products');
        
        // Show filtered products
        this.renderFilteredProducts(categoryProducts, categoryName);
        
        // Scroll to products section
        document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
        
        // Update page title
        document.title = `${categoryName} - سوق الإمارات`;
        
        // Show success message
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
        
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; margin-bottom: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #DAA520, #FFD700); color: white; border-radius: 15px; box-shadow: 0 4px 15px rgba(218, 165, 32, 0.3);">
                <h3 style="margin-bottom: 0.5rem; font-size: 1.5rem;">${this.getCategoryIcon(categoryName)} ${categoryName}</h3>
                <p>${products.length} منتج متاح في هذه الفئة</p>
                <button onclick="window.categoriesHomepage.resetView()" style="background: rgba(255,255,255,0.2); border: 2px solid white; color: white; padding: 0.5rem 1rem; border-radius: 20px; margin-top: 1rem; cursor: pointer; font-weight: 600;">عودة لجميع الفئات</button>
            </div>
        `;
        
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
        // Reset to default view
        this.switchTabProgrammatically('featured-products');
        document.title = 'سوق الإمارات للهدايا - أفضل المنتجات بأسعار لا تقاوم';
        this.renderFeaturedProducts();
        document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
    }

    // FIXED: Product details now opens actual product page
    viewProductDetails(productId) {
        const product = this.products.find(p => p.id == productId);
        
        if (product) {
            // Create Arabic URL slug for product page
            const arabicSlug = this.createArabicSlug(product.title, productId);
            const productPageUrl = `data/pruducts-pages/${arabicSlug}.html`;
            
            console.log(`👁 فتح صفحة المنتج: ${productPageUrl}`);
            
            // Try to open the actual product page
            window.open(productPageUrl, '_blank', 'noopener');
        } else {
            this.showError('لم يتم العثور على تفاصيل المنتج');
        }
    }
    
    // Create Arabic URL slug matching the pattern used in product pages
    createArabicSlug(title, productId) {
        // Remove extra spaces and normalize
        let slug = title.trim();
        
        // Replace Arabic spaces and common characters
        slug = slug.replace(/\s+/g, '-');
        slug = slug.replace(/[_\s\/\\]/g, '-');
        
        // Remove multiple dashes
        slug = slug.replace(/-+/g, '-');
        
        // Remove leading/trailing dashes
        slug = slug.replace(/^-|-$/g, '');
        
        // Add product ID at the end
        return `${slug}-${productId}`;
    }

    // TAB FUNCTIONALITY
    switchTab(tabId, tabButton) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        tabButton.classList.add('active');
        document.getElementById(tabId).classList.add('active');
        
        if (tabId === 'all-products' && document.getElementById('all-container').children.length === 1) {
            setTimeout(() => {
                this.renderAllProducts();
            }, 300);
        }
    }

    // SEARCH FUNCTIONALITY - FIXED
    performSearch() {
        const searchInput = document.getElementById('main-search');
        const query = searchInput ? searchInput.value.trim() : '';
        
        if (query.length === 0) {
            this.showError('يرجى إدخال كلمة للبحث');
            return;
        }
        
        console.log(`🔍 البحث عن: ${query}`);
        
        // Filter products locally
        const searchResults = this.products.filter(product => 
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
        );
        
        if (searchResults.length === 0) {
            this.showError(`لا توجد نتائج للبحث عن "${query}"`);
            return;
        }
        
        // Show search results in the all products tab
        this.switchTabProgrammatically('all-products');
        this.renderSearchResults(searchResults, query);
        
        // Scroll to results
        document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
        
        this.showSuccess(`تم العثور على ${searchResults.length} منتج للبحث عن "${query}"`);
    }
    
    renderSearchResults(products, query) {
        const container = document.getElementById('all-container');
        if (!container) return;
        
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; margin-bottom: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; border-radius: 15px; box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);">
                <h3 style="margin-bottom: 0.5rem; font-size: 1.5rem;">🔍 نتائج البحث عن "${query}"</h3>
                <p>${products.length} منتج تم العثور عليه</p>
                <button onclick="window.categoriesHomepage.resetView()" style="background: rgba(255,255,255,0.2); border: 2px solid white; color: white; padding: 0.5rem 1rem; border-radius: 20px; margin-top: 1rem; cursor: pointer; font-weight: 600;">مسح البحث</button>
            </div>
        `;
        
        products.forEach((product, index) => {
            const productCard = this.createProductCard(product, false);
            const cardElement = document.createElement('div');
            cardElement.innerHTML = productCard;
            cardElement.firstElementChild.style.animationDelay = `${index * 0.1}s`;
            cardElement.firstElementChild.classList.add('animate-fade-in');
            container.appendChild(cardElement.firstElementChild);
        });
    }

    // PRODUCT ACTIONS - ENHANCED
    sendWhatsAppInquiry(productId) {
        const product = this.products.find(p => p.id == productId) || 
                       this.featuredProducts.find(p => p.id == productId);
        
        if (product) {
            const message = `السلام عليكم ورحمة الله وبركاته\n\nأريد الاستفسار عن:\n${product.title}\n\nالسعر: ${product.sale_price} ${product.currency || 'AED'}\nالفئة: ${product.category}\n\nأرجو التواصل معي لتأكيد الطلب وتفاصيل التوصيل.\n\nشكراً لكم`;
            const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank', 'noopener');
        } else {
            this.showError('لم يتم العثور على معلومات المنتج');
        }
    }

    // LOADING STATES
    showLoadingState() {
        const containers = ['categories-container', 'featured-container'];
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="loading" style="grid-column: 1 / -1;">
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
        
        const notificationDiv = document.createElement('div');
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
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            if (notificationDiv.parentNode) {
                notificationDiv.style.animation = 'slideOutRight 0.5s ease-in forwards';
                setTimeout(() => {
                    if (notificationDiv.parentNode) {
                        notificationDiv.parentNode.removeChild(notificationDiv);
                    }
                }, 500);
            }
        }, 5000);
    }

    // FALLBACK DATA
    loadFallbackData() {
        console.log('📂 تحميل بيانات احتياطية...');
        
        this.categories = [
            { name: 'الأجهزة المنزلية والكهربائية', count: 45 },
            { name: 'الإلكترونيات والتكنولوجيا', count: 38 },
            { name: 'العناية الشخصية والصحة والجمال', count: 52 },
            { name: 'الأحذية والملابس والإكسسوارات', count: 29 },
            { name: 'الرياضة واللياقة والصحة', count: 21 },
            { name: 'الأثاث والأدوات المنزلية', count: 33 },
            { name: 'منتجات متنوعة', count: 67 }
        ];
        
        this.featuredProducts = [
            {
                id: 'fallback-1',
                title: 'منتج تجريبي مميز',
                category: 'الأجهزة المنزلية والكهربائية',
                sale_price: 450,
                regular_price: 600,
                currency: 'AED',
                discount_percentage: 25,
                image_url: 'https://via.placeholder.com/400x300/DAA520/FFFFFF?text=منتج+تجريبي',
                average_rating: 4.8,
                review_count: 67,
                features: ['📦 شحن مجاني', '⏰ 1-3 أيام عمل', '💳 دفع عند الاستلام', '✅ معتمد في الإمارات']
            }
        ];
        
        this.products = this.featuredProducts.concat([
            {
                id: 'fallback-2',
                title: 'منتج عادي للاختبار',
                category: 'منتجات متنوعة',
                sale_price: 150,
                regular_price: 200,
                currency: 'AED',
                discount_percentage: 25,
                image_url: 'https://via.placeholder.com/400x300/6B7280/FFFFFF?text=منتج+عادي',
                average_rating: 4.2,
                review_count: 23,
                features: ['🚚 شحن سريع', '⏰ 2-4 أيام عمل', '💳 دفع عند الاستلام', '✅ معتمد في الإمارات']
            }
        ]);
        
        this.hideLoadingState();
        this.renderCategories();
        this.renderFeaturedProducts();
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

// Initialize with enhanced particle effects
document.addEventListener('DOMContentLoaded', function() {
    // Create floating particles for 3D effect
    const particles = document.querySelector('.particles');
    if (particles) {
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.opacity = (0.3 + Math.random() * 0.7).toFixed(2);
            particles.appendChild(particle);
        }
    }

    // Initialize the enhanced 3D homepage
    window.categoriesHomepage = new CategoriesHomepage3DFixed();
    console.log('🎉 Enhanced 3D Homepage loaded successfully!');
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.pageYOffset > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
});