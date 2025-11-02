/**
 * محرر TinyMCE لسوق الإمارات
 * محرر عربي متخصص للمتاجر الإلكترونية
 */

// تحميل TinyMCE
function loadTinyMCE() {
  if (window.tinymce) return Promise.resolve();
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tinymce@7/tinymce.min.js';
    script.crossOrigin = 'anonymous';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// إعداد محرر سوق الإمارات
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
      'bullist numlist | link image table | preview fullscreen'
    ].join(' | '),
    
    menubar: 'edit view insert format table',
    
    // إعدادات عربية
    directionality: 'rtl',
    language: 'ar',
    
    height: 350,
    resize: 'vertical',
    
    branding: false,
    promotion: false,
    
    // حفظ تلقائي
    autosave_interval: '30s',
    autosave_retention: '20m',
    
    content_style: `
      body {
        font-family: 'Cairo', Arial, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        direction: rtl;
        text-align: right;
        color: #333;
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
    
    setup: function(editor) {
      // زر حفظ منتج
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
          
          editor.notificationManager.open({
            text: 'تم حفظ المنتج بنجاح! 🇦🇪',
            type: 'success'
          });
        }
      });
      
      // زر إضافة علم الإمارات
      editor.ui.registry.addButton('addUAEFlag', {
        text: '🇦🇪 علم',
        tooltip: 'إضافة علم الإمارات',
        onAction: function() {
          editor.insertContent('<span class="uae-flag"></span> ');
        }
      });
    }
  };
  
  tinymce.init(config);
}

// تهيئة تلقائية
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadTinyMCE().then(initSooqEditor).catch(console.error);
  });
} else {
  loadTinyMCE().then(initSooqEditor).catch(console.error);
}

// تصدير
window.SooqEditor = { loadTinyMCE, initSooqEditor };