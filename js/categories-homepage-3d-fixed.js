// Enhanced JS that fixes broken images via data file and strict Arabic slugs
class CategoriesHomepage3DFixed extends CategoriesHomepage {
  createProductCard(product, isFeatured = false) {
    const discount = product.discount_percentage > 0 
      ? `<div class="discount-badge">خصم ${Math.round(product.discount_percentage)}%</div>` 
      : '';

    const originalPrice = product.regular_price > product.sale_price 
      ? `<span class="original-price">${product.regular_price} ${product.currency || 'AED'}</span>` 
      : '';

    const stars = this.generateStars(product.average_rating);

    // Image fallback: from data, then online search placeholder per product title
    let imageUrl = product.image_url || '';
    const safePlaceholder = `https://source.unsplash.com/featured/400x300/?product,${encodeURIComponent(product.title)}`;

    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.length < 10) {
      imageUrl = safePlaceholder;
    }

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
            <img src="${imageUrl}" 
                 alt="${product.title}"
                 loading="lazy"
                 onerror="this.onerror=null;this.src='${safePlaceholder}';">
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
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  // inject floating particles for 3D look
  const particles = document.querySelector('.particles');
  if (particles) {
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random()*100 + '%';
      p.style.animationDelay = (Math.random()*6) + 's';
      p.style.opacity = (0.3 + Math.random()*0.7).toFixed(2);
      particles.appendChild(p);
    }
  }

  // start app with image fixes
  window.categoriesHomepage = new CategoriesHomepage3DFixed();
});
