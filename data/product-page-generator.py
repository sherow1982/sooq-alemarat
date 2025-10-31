# سكربت توليد صفحات المنتجات العربية - مُحدث ومُصحح
# Product Pages Generator - Arabic RTL with SEO optimization
# يقوم بتوليد 738 صفحة HTML كاملة لجميع المنتجات في ملف JSON

import json
import os
import re

def create_arabic_slug(text):
    """إنشاء سلج عربي صديق لمحركات البحث"""
    if not text:
        return "منتج"
    # إزالة HTML tags
    text = re.sub(r'<[^>]+>', '', str(text))
    # إزالة الرموز الخاصة والاحتفاظ بالعربية والإنجليزية والأرقام
    text = re.sub(r'[^\w\s\u0600-\u06FF-]', '-', text)
    # استبدال المسافات والشرطات المتعددة بشرطة واحدة
    text = re.sub(r'[-\s]+', '-', text)
    # إزالة الشرطات من البداية والنهاية
    text = text.strip('-')
    return text.lower()

def safe_filename(slug, product_id, max_len=100):
    """إنشاء اسم ملف آمن مع حد أقصى للطول"""
    if not slug:
        slug = "منتج"
    
    base = str(slug)[:max_len]
    suffix = f"-{product_id}"
    
    if len(base) + len(suffix) + 5 > max_len:
        base = base[:max_len - len(suffix) - 5]
    
    return f"{base}{suffix}.html"

def generate_product_html(product):
    """توليد HTML كامل لصفحة المنتج"""
    
    # استخراج البيانات الأساسية مع القيم الافتراضية
    title = str(product.get('title', 'منتج غير محدد'))
    description = str(product.get('description', title))
    category = str(product.get('category', 'منتجات متنوعة'))
    regular_price = product.get('regular_price', 0) or 0
    sale_price = product.get('sale_price', regular_price) or regular_price
    image_url = str(product.get('image_url', '/images/placeholder.jpg'))
    brand = str(product.get('brand', 'علامة تجارية عامة'))
    product_id = str(product.get('id', ''))
    
    # حساب الخصم
    discount = 0
    try:
        if float(regular_price) > float(sale_price) and float(sale_price) > 0:
            discount = round(((float(regular_price) - float(sale_price)) / float(regular_price)) * 100)
    except:
        discount = 0
    
    # إنشاء HTML بسيط ومحسن
    html_content = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - متجر الإمارات الإلكتروني</title>
    <meta name="description" content="اشتري {title} بأفضل سعر في الإمارات. {description[:100]}...">
    <meta name="keywords" content="{title}, {category}, تسوق, الإمارات, دبي, أبوظبي">
    
    <!-- Open Graph Tags -->
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description[:150]}">
    <meta property="og:image" content="{image_url}">
    <meta property="og:type" content="product">
    <meta property="product:price:amount" content="{sale_price}">
    <meta property="product:price:currency" content="AED">
    
    <!-- JSON-LD Schema -->
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "{title}",
        "description": "{description}",
        "image": "{image_url}",
        "brand": "{brand}",
        "category": "{category}",
        "offers": {{
            "@type": "Offer",
            "price": "{sale_price}",
            "priceCurrency": "AED",
            "availability": "https://schema.org/InStock"
        }}
    }}
    </script>
    
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ 
            font-family: 'Segoe UI', Tahoma, Arial, sans-serif; 
            direction: rtl; 
            background: #f8f9fa; 
            color: #333;
            line-height: 1.6;
        }}
        
        .container {{ 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 10px; 
            padding: 30px; 
            margin-top: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }}
        
        .breadcrumb {{
            background: #f8f9fa;
            padding: 10px 15px;
            margin-bottom: 20px;
            border-radius: 5px;
            font-size: 0.9em;
        }}
        
        .breadcrumb a {{ color: #007bff; text-decoration: none; }}
        .breadcrumb a:hover {{ text-decoration: underline; }}
        
        .product-header {{ 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 30px; 
            margin-bottom: 30px; 
        }}
        
        .product-image {{ text-align: center; }}
        .product-image img {{ 
            width: 100%; 
            max-width: 400px; 
            border-radius: 10px; 
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }}
        
        .product-info h1 {{ 
            font-size: 2.2em; 
            color: #2c3e50; 
            margin-bottom: 15px; 
            font-weight: bold;
        }}
        
        .product-meta {{
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }}
        
        .category {{ 
            background: #007bff; 
            color: white; 
            padding: 5px 15px; 
            border-radius: 20px; 
            font-size: 0.9em; 
        }}
        
        .brand {{ 
            background: #e9ecef; 
            padding: 5px 15px; 
            border-radius: 20px; 
            font-size: 0.9em; 
        }}
        
        .uae-badge {{
            background: linear-gradient(45deg, #ff0000, #00ff00, #000000);
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: bold;
        }}
        
        .price-section {{ 
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 20px; 
            border-radius: 10px; 
            margin: 20px 0; 
        }}
        
        .price {{ 
            font-size: 2.2em; 
            font-weight: bold; 
            color: #28a745; 
        }}
        
        .old-price {{ 
            font-size: 1.2em; 
            color: #6c757d; 
            text-decoration: line-through; 
            margin-left: 10px; 
        }}
        
        .discount-badge {{ 
            background: #dc3545; 
            color: white; 
            padding: 5px 10px; 
            border-radius: 5px; 
            font-size: 0.8em; 
            margin-left: 10px; 
        }}
        
        .shipping-info {{ 
            background: #d4edda; 
            border: 1px solid #c3e6cb;
            padding: 15px; 
            border-radius: 5px; 
            margin: 20px 0; 
        }}
        
        .add-to-cart {{ 
            background: linear-gradient(45deg, #28a745, #20c997);
            color: white; 
            border: none; 
            padding: 15px 30px; 
            font-size: 1.2em; 
            border-radius: 8px; 
            cursor: pointer; 
            width: 100%; 
            margin-top: 20px; 
            transition: transform 0.2s;
        }}
        
        .add-to-cart:hover {{ 
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(40,167,69,0.3);
        }}
        
        .description {{ 
            margin-top: 30px; 
            line-height: 1.8;
            font-size: 1.1em;
        }}
        
        .description h3 {{
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.4em;
        }}
        
        .features {{
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }}
        
        .features ul {{
            list-style: none;
            padding: 0;
        }}
        
        .features li {{
            padding: 8px 0;
            border-bottom: 1px solid #eee;
            position: relative;
            padding-right: 25px;
        }}
        
        .features li::before {{
            content: '✓';
            position: absolute;
            right: 0;
            color: #28a745;
            font-weight: bold;
        }}
        
        .guarantee {{
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }}
        
        @media (max-width: 768px) {{ 
            .product-header {{ 
                grid-template-columns: 1fr; 
                gap: 20px;
            }} 
            
            .product-info h1 {{ font-size: 1.8em; }}
            .price {{ font-size: 1.8em; }}
            .container {{ padding: 20px; margin: 10px; }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <!-- مسار التنقل -->
        <nav class="breadcrumb">
            <a href="/">الرئيسية</a> / 
            <a href="/category/{create_arabic_slug(category)}">{category}</a> / 
            <span>{title}</span>
        </nav>
        
        <!-- رأس المنتج -->
        <div class="product-header">
            <div class="product-image">
                <img src="{image_url}" alt="{title}" loading="lazy">
            </div>
            
            <div class="product-info">
                <h1>{title}</h1>
                
                <div class="product-meta">
                    <span class="brand">🏷️ {brand}</span>
                    <span class="category">📂 {category}</span>
                    <span class="uae-badge">🇦🇪 متوافق مع الإمارات</span>
                </div>
                
                <div class="price-section">
                    {f'<span class="discount-badge">خصم {discount}%</span>' if discount > 0 else ''}
                    {f'<span class="old-price">{regular_price} درهم</span>' if discount > 0 else ''}
                    <div class="price">{sale_price} درهم إماراتي</div>
                </div>
                
                <div class="shipping-info">
                    <h4>🚚 معلومات الشحن والتوصيل</h4>
                    <p>✅ توصيل سريع في دبي وأبوظبي (نفس اليوم)</p>
                    <p>✅ شحن مجاني للطلبات أكثر من 100 درهم</p>
                    <p>✅ دفع عند الاستلام متاح في جميع الإمارات</p>
                    <p>✅ ضمان الاسترداد خلال 14 يوم</p>
                </div>
                
                <button class="add-to-cart" onclick="addToCart('{product_id}')">
                    🛒 أضف إلى السلة - اطلب الآن
                </button>
            </div>
        </div>
        
        <!-- وصف المنتج -->
        <div class="description">
            <h3>📋 وصف المنتج التفصيلي</h3>
            <p>{description}</p>
        </div>
        
        <!-- المميزات -->
        <div class="features">
            <h3>⭐ مميزات المنتج</h3>
            <ul>
                <li>جودة عالية ومواصفات ممتازة</li>
                <li>ضمان الشركة المصنعة</li>
                <li>خدمة عملاء على مدار الساعة</li>
                <li>متوافق مع معايير الجودة الإماراتية</li>
                <li>دعم فني مجاني</li>
            </ul>
        </div>
        
        <!-- الضمان والخدمات -->
        <div class="guarantee">
            <h3>🛡️ الضمان والخدمات</h3>
            <p><strong>الضمان:</strong> سنة واحدة ضمان شامل من الشركة المصنعة</p>
            <p><strong>الإرجاع:</strong> يمكن إرجاع المنتج خلال 14 يوم بدون أسئلة</p>
            <p><strong>الصيانة:</strong> خدمة صيانة معتمدة في جميع الإمارات</p>
            <p><strong>خدمة العملاء:</strong> دعم فني على مدار 24/7</p>
        </div>
    </div>
    
    <script>
        function addToCart(productId) {{
            // هنا يمكن إضافة منطق إضافة المنتج إلى السلة
            alert('تم إضافة المنتج إلى السلة بنجاح! 🎉\\n\\nسيتم تحويلك إلى صفحة الدفع...');
            
            // يمكن إضافة كود لتتبع Google Analytics
            // gtag('event', 'add_to_cart', {{ 'currency': 'AED', 'value': {sale_price} }});
        }}
        
        // تحسين تجربة المستخدم
        document.addEventListener('DOMContentLoaded', function() {{
            // إضافة تأثيرات بصرية عند التحميل
            const elements = document.querySelectorAll('.product-header, .description, .features, .guarantee');
            elements.forEach((el, index) => {{
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                setTimeout(() => {{
                    el.style.transition = 'all 0.5s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }}, index * 200);
            }});
        }});
    </script>
</body>
</html>"""
    
    return html_content

def build_all_product_pages(json_path='uae-products.json', output_dir='pruducts-pages'):
    """إنشاء جميع صفحات المنتجات"""
    
    print("🚀 بدء إنشاء صفحات المنتجات...")
    print("=" * 50)
    
    try:
        # قراءة ملف JSON
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # التعامل مع هياكل JSON المختلفة
        if isinstance(data, dict) and 'products' in data:
            products = data['products']
        elif isinstance(data, list):
            products = data
        else:
            products = [data]
        
        print(f"📦 تم العثور على {len(products)} منتج")
        
        # إنشاء المجلد وحذف الملفات القديمة
        if os.path.exists(output_dir):
            for file in os.listdir(output_dir):
                os.remove(os.path.join(output_dir, file))
            print(f"🧹 تم حذف الملفات القديمة من {output_dir}")
        else:
            os.makedirs(output_dir)
            print(f"📁 تم إنشاء مجلد {output_dir}")
        
        # توليد الصفحات
        existing_filenames = set()
        generated_count = 0
        errors = []
        
        for i, product in enumerate(products):
            try:
                # إنشاء العنوان والسلاج
                title = product.get('title', f'منتج-{i+1}')
                slug = product.get('url_slug') or create_arabic_slug(title)
                product_id = product.get('id', i+1)
                
                # إنشاء اسم الملف
                filename = safe_filename(slug, product_id)
                
                # التعامل مع الملفات المكررة
                original_filename = filename
                counter = 1
                while filename in existing_filenames:
                    base, ext = os.path.splitext(original_filename)
                    filename = f"{base}-{counter}{ext}"
                    counter += 1
                
                existing_filenames.add(filename)
                
                # توليد محتوى HTML
                html_content = generate_product_html(product)
                
                # كتابة الملف
                filepath = os.path.join(output_dir, filename)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(html_content)
                
                generated_count += 1
                
                # عرض التقدم كل 50 صفحة
                if generated_count % 50 == 0:
                    print(f"✅ تم إنشاء {generated_count} صفحة...")
                    
            except Exception as e:
                error_msg = f"خطأ في المنتج {i+1}: {str(e)}"
                errors.append(error_msg)
                print(f"❌ {error_msg}")
        
        # النتائج النهائية
        actual_files = os.listdir(output_dir)
        print(f"\\n🎉 تم إنشاء {len(actual_files)} صفحة بنجاح!")
        print(f"📁 المجلد: {output_dir}")
        
        # عرض عينة من الملفات
        print("\\n📋 عينة من الملفات المُنشأة:")
        for i, filename in enumerate(actual_files[:10]):
            print(f"   {i+1}. {filename}")
        
        if len(actual_files) > 10:
            print(f"   ... و {len(actual_files) - 10} ملف آخر")
        
        # عرض الأخطاء إن وجدت
        if errors:
            print(f"\\n⚠️ عدد الأخطاء: {len(errors)}")
            print("الأخطاء الأولى:")
            for error in errors[:3]:
                print(f"   - {error}")
                
        print(f"\\n✨ اكتمل إنشاء جميع صفحات المنتجات ({len(actual_files)} صفحة)!")
        print("🌐 الصفحات جاهزة للنشر وصديقة لمحركات البحث")
        
        return len(actual_files)
        
    except Exception as e:
        print(f"❌ خطأ عام: {str(e)}")
        return 0

# تشغيل السكربت
if __name__ == "__main__":
    print("🛍️ مرحباً بك في مُولد صفحات المنتجات العربية")
    print("💻 هذا السكربت سيقوم بإنشاء صفحات HTML لجميع المنتجات")
    print("🔧 الصفحات محسنة لمحركات البحث ومتوافقة مع الموبايل")
    print()
    
    total_pages = build_all_product_pages()
    
    if total_pages > 0:
        print(f"\\n🏆 تم بنجاح! إجمالي الصفحات: {total_pages}")
        print("📊 إحصائيات الإنجاز:")
        print(f"   ✓ صفحات HTML: {total_pages}")
        print("   ✓ تحسين SEO: مُفعل")
        print("   ✓ Schema markup: مُضاف")
        print("   ✓ Open Graph: مُضاف")
        print("   ✓ تصميم متجاوب: مُفعل")
        print("   ✓ اتجاه عربي RTL: مُفعل")
        print("\\n🚀 يمكنك الآن رفع المجلد 'pruducts-pages' إلى موقعك!")
    else:
        print("\\n💥 فشل في إنشاء الصفحات. تحقق من ملف JSON.")
    
