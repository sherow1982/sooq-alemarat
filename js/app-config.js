// Centralized App Config for Emirates Souq
// Use this to control global settings and constants across pages
(function(){
  'use strict';
  window.appConfig = {
    whatsappNumber: '201110760081',
    currency: 'AED',
    dataPath: function(){
      const isInEn = window.location.pathname.includes('/en/');
      return isInEn ? '../data/uae-products.json' : './data/uae-products.json';
    },
    showExtensionWarnings: false,
    enableHealthCheck: false,
    legal:{
      terms:'legal/terms.html',
      privacy:'legal/privacy.html',
      shipping:'legal/shipping.html',
      returns:'legal/returns.html'
    }
  };
})();