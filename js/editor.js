/**
 * محرر TinyMCE لسوق الإمارات
 * محرر عربي متخصص للمتاجر الإلكترونية
 * تم إصلاح مشكلة التحميل
 */

// تحميل TinyMCE مع معالجة الأخطاء
function loadTinyMCE() {
  if (window.tinymce) return Promise.resolve();
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js';
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'origin';
    script.onload = () => {
      console.log('✅ TinyMCE تم تحميله بنجاح');
      resolve();
    };
    script.onerror = () => {
      console.error('❌ فشل في تحميل TinyMCE');
      reject(new Error('Failed to load TinyMCE'));
    };
    document.head.appendChild(script);
  });
}

// إعداد محرر سوق الإمارات مع إصلاح الأخطاء
function initSooqEditor() {
  const config = {
    selector: '.sooq-editor, .product-editor, textarea.arabic-text',
    
    plugins: [
      'autolink', 'autoresize', 'autosave', 'charmap', 'directionality',
      'emoticons', 'fullscreen', 'image', 'link', 'lists', 'media',
      'preview', 'quickbars', 'save', 'table', 'visualblocks', 'wordcount'
    ].join(' '),
    
    toolbar: [
      'undo redo | bold italic underline | fontsize',
      'forecolor backcolor | alignleft aligncenter alignright | ltr rtl',
      'bullist numlist | link image table | preview fullscreen | saveProduct'
    ].join(' | '),
    
    menubar: 'edit view insert format table',
    
    // إعدادات عربية محسنة
    directionality: 'rtl',
    language: 'ar',
    language_url: false, // تجنب تحميل ملف اللغة الخارجي
    
    height: 350,
    resize: 'vertical',
    
    branding: false,
    promotion: false,
    
    // حفظ تلقائي محسن
    autosave_interval: '30s',
    autosave_retention: '20m',
    autosave_ask_before_unload: true,
    
    // إعدادات المحتوى
    content_css: false,
    content_style: `
      body {
        font-family: 'Cairo', Arial, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        direction: rtl;
        text-align: right;
        color: #333;
        background: #fff;
        margin: 10px;
      }
      .product-highlight {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        padding: 8px 12px;
        border-radius: 6px;
        margin: 8px 0;
      }
      .price-box {
        background: #d4edda;
        border: 2px solid #28a745;
        padding: 10px;
        text-align: center;
        font-weight: bold;
        font-size: 16px;
        border-radius: 8px;
        color: #155724;
        margin: 10px 0;
      }
      .uae-flag {
        display: inline-block;
        width: 20px;
        height: 15px;
        background: linear-gradient(to bottom, #009639 33%, #ffffff 33%, #ffffff 66%, #ce1126 66%);
        margin-left: 5px;
        border: 1px solid #ccc;
        border-radius: 2px;
      }
      h1, h2, h3, h4, h5, h6 {
        color: #2c3e50;
        font-weight: bold;
      }
      blockquote {
        border-right: 4px solid #3498db;
        padding: 10px 15px;
        margin: 15px 0;
        background: #f8f9fa;
        border-radius: 4px;
      }
    `,
    
    style_formats: [
      {
        title: 'أنماط المتجر',
        items: [
          { title: 'معلومات منتج', block: 'div', classes: 'product-highlight' },
          { title: 'مربع السعر', block: 'div', classes: 'price-box' },
          { title: 'عنوان منتج', block: 'h3', styles: { color: '#e67e22', 'font-weight': 'bold' } }
        ]
      }
    ],
    
    // إعدادات التحميل
    init_instance_callback: function(editor) {
      console.log('✅ تم تهيئة المحرر:', editor.id);
      
      // إظهار رسالة نجاح
      setTimeout(() => {
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(45deg, #27ae60, #2ecc71);
          color: white;
          padding: 15px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
          z-index: 10000;
          font-weight: bold;
        `;
        notification.textContent = '✅ محرر سوق الإمارات جاهز للعمل! 🇦🇪';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.style.opacity = '0';
          notification.style.transition = 'opacity 0.5s ease';
          setTimeout(() => notification.remove(), 500);
        }, 3000);
      }, 500);
    },
    
    setup: function(editor) {
      // زر حفظ منتج إماراتي
      editor.ui.registry.addButton('saveProduct', {
        text: '💾 حفظ',
        tooltip: 'حفظ وصف المنتج',
        onAction: function() {
          const content = editor.getContent();
          const blob = new Blob([`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>منتج من سوق الإمارات</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            direction: rtl;
            text-align: right;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .product-highlight {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 8px 12px;
            border-radius: 6px;
            margin: 8px 0;
        }
        .price-box {
            background: #d4edda;
            border: 2px solid #28a745;
            padding: 10px;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            border-radius: 8px;
            color: #155724;
        }
        .uae-flag {
            display: inline-block;
            width: 20px;
            height: 15px;
            background: linear-gradient(to bottom, #009639 33%, #ffffff 33%, #ffffff 66%, #ce1126 66%);
            margin-left: 5px;
            border: 1px solid #ccc;
        }
    </style>
</head>
<body>
    ${content}
    <hr>
    <p style="text-align: center; color: #666; font-size: 12px;">
        🇦🇪 سوق الإمارات - ${new Date().toLocaleDateString('ar-AE')}
    </p>
</body>
</html>
          `], { type: 'text/html' });
          
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `uae-product-${Date.now()}.html`;
          link.click();
          URL.revokeObjectURL(url);
          
          // إشعار نجاح
          editor.notificationManager.open({
            text: 'تم حفظ المنتج الإماراتي بنجاح! 🇦🇪',
            type: 'success',
            timeout: 3000
          });
        }
      });
      
      // زر إضافة علم الإمارات
      editor.ui.registry.addButton('addUAEFlag', {
        text: '🇦🇪',
        tooltip: 'إضافة علم الإمارات',
        onAction: function() {
          editor.insertContent('🇦🇪 ');
        }
      });
      
      // زر إضافة الدرهم
      editor.ui.registry.addButton('addDirham', {
        text: 'AED',
        tooltip: 'إضافة رمز الدرهم الإماراتي',
        onAction: function() {
          editor.insertContent(' درهم ');
        }
      });
      
      // إضافة الأزرار للشريط
      editor.on('init', function() {
        console.log('🚀 محرر سوق الإمارات مُهيأ بنجاح');
      });
    }
  };
  
  // تهيئة TinyMCE مع معالجة الأخطاء
  try {
    tinymce.init(config);
    console.log('🔄 جاري تهيئة محرر سوق الإمارات...');
  } catch (error) {
    console.error('❌ خطأ في تهيئة المحرر:', error);
  }
}

// تهيئة تلقائية مع إعادة المحاولة
let retryCount = 0;
const maxRetries = 3;

function initWithRetry() {
  loadTinyMCE()
    .then(() => {
      initSooqEditor();
      console.log('✅ تم تهيئة محرر سوق الإمارات بنجاح');
    })
    .catch(error => {
      console.error('❌ خطأ في التحميل:', error);
      
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`🔄 إعادة المحاولة ${retryCount}/${maxRetries}...`);
        setTimeout(initWithRetry, 2000);
      } else {
        console.error('❌ فشل في تحميل المحرر بعد عدة محاولات');
        
        // عرض رسالة خطأ للمستخدم
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #e74c3c;
          color: white;
          padding: 20px 30px;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(231, 76, 60, 0.3);
          z-index: 10000;
          text-align: center;
          max-width: 400px;
        `;
        errorMsg.innerHTML = `
          <h3>⚠️ تعذر تحميل المحرر</h3>
          <p>يرجى إعادة تحميل الصفحة أو التحقق من الاتصال</p>
          <button onclick="this.parentElement.remove(); initWithRetry();" 
                  style="background: white; color: #e74c3c; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
            🔄 إعادة المحاولة
          </button>
        `;
        document.body.appendChild(errorMsg);
      }
    });
}

// تهيئة تلقائية
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWithRetry);
} else {
  initWithRetry();
}

// تصدير الوظائف
window.SooqEditor = { 
  loadTinyMCE, 
  initSooqEditor, 
  initWithRetry 
};

// وظائف مساعدة إضافية
window.SooqEditorHelpers = {
  // إدراج قالب منتج
  insertProductTemplate: function(editorId) {
    const editor = tinymce.get(editorId);
    if (editor) {
      const template = `
        <div class="product-highlight">
          <h3>🛍️ [اسم المنتج]</h3>
          <ul>
            <li><strong>النوع:</strong> [نوع المنتج]</li>
            <li><strong>المقاس:</strong> [المقاس المتاح]</li>
            <li><strong>اللون:</strong> [الألوان المتاحة]</li>
            <li><strong>الضمان:</strong> [فترة الضمان]</li>
          </ul>
        </div>
        
        <div class="price-box">
          السعر: [السعر] درهم إماراتي 🇦🇪
        </div>
      `;
      
      editor.insertContent(template);
      editor.notificationManager.open({
        text: 'تم إضافة قالب المنتج! 📦',
        type: 'success'
      });
    }
  },
  
  // تغيير اتجاه النص
  toggleDirection: function(editorId) {
    const editor = tinymce.get(editorId);
    if (editor) {
      const body = editor.getBody();
      const isRTL = body.style.direction === 'rtl';
      
      body.style.direction = isRTL ? 'ltr' : 'rtl';
      body.style.textAlign = isRTL ? 'left' : 'right';
      
      editor.notificationManager.open({
        text: `تم التبديل إلى ${isRTL ? 'الإنجليزية' : 'العربية'}`,
        type: 'info'
      });
    }
  }
};

console.log('📦 تم تحميل ملف محرر سوق الإمارات');