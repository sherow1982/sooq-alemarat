/**
 * Data Loader - Loads product data and builds the UI dynamically
 */

// Global variables
let allProducts = [];
let displayedProducts = [];
let categories = new Map();
let currentPage = 1;
const productsPerPage = 24;
let isLoading = false;

// Initialize the application
function initializeApp() {
    console.log('Initializing Emirates Souq...');
    loadProductData();
    setupEventListeners();
    handleUrlParameters();
}

// Load product data from JSON file
async function loadProductData() {
    try {
        showLoadingSpinner(true);
        
        const response = await fetch('./data/uae-products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        
        if (!Array.isArray(products)) {
            throw new Error('Invalid data format: expected array');
        }
        
        allProducts = products;
        processCategories();
        displayCategories();
        displayProducts();
        
        console.log(`Loaded ${allProducts.length} products`);
        
    } catch (error) {
        console.error('Error loading product data:', error);
        showError('حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
        showLoadingSpinner(false);
    }
}

// Process categories from product data
function processCategories() {
    categories.clear();
    
    allProducts.forEach(product => {
        if (product.category) {
            if (!categories.has(product.category)) {
                categories.set(product.category, {
                    name: product.category,
                    count: 0,
                    icon: getCategoryIcon(product.category)
                });
            }
            categories.get(product.category).count++;
        }
    });
    
    console.log(`Processed ${categories.size} categories`);
}

// Get category icon based on category name
function getCategoryIcon(categoryName) {
    const iconMap = {
        'الإلكترونيات والتكنولوجيا': '📱',
        'الأجهزة المنزلية والكهربائية': '🏠',
        'العناية الشخصية والصحة والجمال': '💄',
        'الأحذية والملابس والإكسسوارات': '👗',
        'الرياضة واللياقة والصحة': '⚽',
        'الأثاث والأدوات المنزلية': '🛋️',
        'الأدوات والصيانة': '🔧',
        'السيارات والإكسسوارات': '🚗',
        'منتجات متنوعة': '📦'
    };
    
    return iconMap[categoryName] || '📦';
}

// Display categories grid
function displayCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;
    
    categoriesGrid.innerHTML = '';
    
    // Sort categories by product count
    const sortedCategories = Array.from(categories.values())
        .sort((a, b) => b.count - a.count);
    
    sortedCategories.forEach(category => {
        const categoryCard = createCategoryCard(category);
        categoriesGrid.appendChild(categoryCard);
    });
}

// Create category card element
function createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'category-card floating-3d';
    card.onclick = () => filterByCategory(category.name);
    
    card.innerHTML = `
        <div class="category-icon">${category.icon}</div>
        <h3 class="category-title">${category.name}</h3>
        <p class="category-count">${category.count} منتج</p>
    `;
    
    return card;
}

// Display products grid
function displayProducts(productsToShow = null) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    if (productsToShow === null) {
        productsToShow = allProducts;
    }
    
    // Pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    displayedProducts = productsToShow.slice(0, endIndex);
    
    productsGrid.innerHTML = '';
    
    if (displayedProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <h3>لم يتم العثور على منتجات</h3>
                <p>جرب البحث بكلمات مفتاحية أخرى</p>
            </div>
        `;
        return;
    }
    
    displayedProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    // Update load more button
    updateLoadMoreButton(productsToShow.length);
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card floating-3d';
    card.onclick = () => goToProduct(product);
    
    const discountPercentage = product.discount_percentage || 
        Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100);
    
    const hasDiscount = discountPercentage > 0;
    
    card.innerHTML = `
        <div class="product-image-container">
            <img src="${product.image_url}" 
                 alt="${product.title}" 
                 class="product-image"
                 loading="lazy"
                 onerror="this.src='assets/img/placeholder.webp'">
            ${hasDiscount ? `<span class="discount-badge">-${discountPercentage}%</span>` : ''}
        </div>
        
        <div class="product-content">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${truncateText(product.meta_description || product.description, 100)}</p>
            
            <div class="product-price">
                <span class="price-current">${product.sale_price} ${product.currency}</span>
                ${hasDiscount ? `<span class="price-original">${product.regular_price} ${product.currency}</span>` : ''}
            </div>
            
            <div class="product-features">
                ${product.cod_available ? '<span class="feature-tag cod">💰 دفع عند الاستلام</span>' : ''}
                <span class="feature-tag shipping">🚚 ${product.delivery_time}</span>
                ${product.uae_compliant ? '<span class="feature-tag">🇦🇪 متوافق مع الإمارات</span>' : ''}
            </div>
            
            <div class="product-rating">
                <span class="rating-stars">${generateStars(product.average_rating)}</span>
                <span class="rating-count">(${product.review_count} تقييم)</span>
            </div>
        </div>
    `;
    
    return card;
}

// Generate star rating display
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '⭐'.repeat(fullStars);
    if (hasHalfStar) stars += '⭐';
    stars += '☆'.repeat(emptyStars);
    
    return stars;
}

// Truncate text to specified length
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Filter products by category
function filterByCategory(categoryName) {
    const filteredProducts = allProducts.filter(product => 
        product.category === categoryName
    );
    
    currentPage = 1;
    displayProducts(filteredProducts);
    
    // Update page title and meta
    document.title = `${categoryName} - سوق الإمارات`;
    updateUrlParams({ category: categoryName });
    
    // Scroll to products section
    document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' });
}

// Search products
function searchProducts(query) {
    if (!query.trim()) {
        displayProducts();
        return;
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    const filteredProducts = allProducts.filter(product => {
        const title = product.title.toLowerCase();
        const description = (product.description || '').toLowerCase();
        const keywords = (product.seo_keywords || '').toLowerCase();
        const category = (product.category || '').toLowerCase();
        
        return title.includes(searchTerm) ||
               description.includes(searchTerm) ||
               keywords.includes(searchTerm) ||
               category.includes(searchTerm);
    });
    
    currentPage = 1;
    displayProducts(filteredProducts);
    
    // Update page title and meta
    document.title = `البحث: ${query} - سوق الإمارات`;
    updateUrlParams({ q: query });
    
    // Show search results count
    showSearchResults(filteredProducts.length, query);
}

// Show search results message
function showSearchResults(count, query) {
    const productsSection = document.querySelector('.products-section .container');
    const existingMessage = productsSection.querySelector('.search-results-message');
    
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const message = document.createElement('div');
    message.className = 'search-results-message';
    message.style.cssText = `
        background: var(--primary-color);
        color: white;
        padding: var(--spacing-md);
        border-radius: var(--radius-lg);
        margin-bottom: var(--spacing-lg);
        text-align: center;
    `;
    message.innerHTML = `
        <p>تم العثور على <strong>${count}</strong> منتج للبحث عن "<strong>${query}</strong>"</p>
        <button onclick="clearSearch()" style="background: transparent; border: 1px solid white; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; margin-top: 0.5rem; cursor: pointer;">مسح البحث</button>
    `;
    
    const sectionTitle = productsSection.querySelector('.section-title');
    sectionTitle.insertAdjacentElement('afterend', message);
}

// Clear search and show all products
function clearSearch() {
    document.getElementById('searchInput').value = '';
    currentPage = 1;
    displayProducts();
    
    // Remove search results message
    const message = document.querySelector('.search-results-message');
    if (message) message.remove();
    
    // Reset page title
    document.title = 'سوق الإمارات | أفضل المنتجات والعروض الحصرية 2025';
    updateUrlParams({});
}

// Go to product page
function goToProduct(product) {
    const slug = product.url_slug || createSlug(product.title);
    const productUrl = `product.html?id=${product.id}&slug=${slug}`;
    window.location.href = productUrl;
}

// Create URL slug from title
function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0590-\u05FF\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Load more products
function loadMoreProducts() {
    if (isLoading) return;
    
    currentPage++;
    displayProducts();
}

// Update load more button visibility
function updateLoadMoreButton(totalProducts) {
    const loadMoreButton = document.querySelector('.btn-load-more');
    if (!loadMoreButton) return;
    
    const hasMoreProducts = displayedProducts.length < totalProducts;
    loadMoreButton.style.display = hasMoreProducts ? 'block' : 'none';
    
    if (hasMoreProducts) {
        loadMoreButton.textContent = `عرض المزيد (${totalProducts - displayedProducts.length} منتج متبقي)`;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            searchProducts(e.target.value);
        }, 300));
    }
    
    // Intersection Observer for lazy loading
    setupLazyLoading();
}

// Setup lazy loading for images
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('skeleton');
                observer.unobserve(img);
            }
        });
    });
    
    // Apply to existing images
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Handle URL parameters
function handleUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const query = urlParams.get('q');
    
    if (category) {
        setTimeout(() => filterByCategory(category), 1000);
    } else if (query) {
        setTimeout(() => {
            document.getElementById('searchInput').value = query;
            searchProducts(query);
        }, 1000);
    }
}

// Update URL parameters without page reload
function updateUrlParams(params) {
    const url = new URL(window.location);
    
    // Clear existing params
    url.searchParams.delete('category');
    url.searchParams.delete('q');
    
    // Add new params
    Object.keys(params).forEach(key => {
        if (params[key]) {
            url.searchParams.set(key, params[key]);
        }
    });
    
    window.history.replaceState({}, '', url.toString());
}

// Show/hide loading spinner
function showLoadingSpinner(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.toggle('hidden', !show);
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--error-color);
        color: white;
        padding: var(--spacing-lg);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: var(--z-modal);
        text-align: center;
        max-width: 400px;
    `;
    
    errorDiv.innerHTML = `
        <h3>خطأ</h3>
        <p>${message}</p>
        <button onclick="this.parentElement.remove()" style="background: white; color: var(--error-color); border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; margin-top: 1rem; cursor: pointer;">حسناً</button>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// Debounce function for search
function debounce(func, wait) {
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

// Export functions for global access
window.initializeApp = initializeApp;
window.searchProducts = searchProducts;
window.filterByCategory = filterByCategory;
window.loadMoreProducts = loadMoreProducts;
window.clearSearch = clearSearch;
window.goToProduct = goToProduct;

// Initialize on DOM content loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}