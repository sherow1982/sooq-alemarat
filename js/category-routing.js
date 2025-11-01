/**
 * Category routing script - map Arabic category names to SEO static pages
 */
(function(){
  const map = {
    'الأجهزة المنزلية والكهربائية': 'home-appliances-electrical.html',
    'الإلكترونيات والتكنولوجيا': 'electronics-technology.html',
    'العناية الشخصية والصحة والجمال': 'personal-care-health-beauty.html',
    'الأحذية والملابس والإكسسوارات': 'shoes-clothing-accessories.html',
    'الرياضة واللياقة والصحة': 'sports-fitness-health.html',
    'الأثاث والأدوات المنزلية': 'furniture-home-tools.html',
    'الأدوات والصيانة': 'tools-maintenance.html',
    'منتجات متنوعة': 'miscellaneous-products.html'
  };

  window.getCategoryPage = function(name){
    return map[name] || 'miscellaneous-products.html';
  }
})();