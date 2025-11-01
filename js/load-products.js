// تهيئة التحميل من ملف الداتا الرسمي
import {fetchUaeProducts} from './data-source.js';

(async()=>{
  try{
    const products = await fetchUaeProducts();
    window.__UAEP__ = products;
    if(window.emiratesStore && typeof window.emiratesStore.renderEnhancedProducts==='function'){
      window.emiratesStore.products = products;
      window.emiratesStore.renderEnhancedProducts();
    }
  }catch(e){
    console.error(e);
  }
})();
