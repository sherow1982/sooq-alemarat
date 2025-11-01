#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
مولد صفحات المنتجات الثابتة - سوق الإمارات
يقوم بإنشاء صفحة HTML منفصلة لكل منتج مع SEO وتصميم 3D
"""

import json
import re
import os
from urllib.parse import quote

def create_arabic_slug(title, product_id):
    """إنشاء رابط عربي للمنتج"""
    slug = title.strip()
    
    # تنظيف الرموز الخاصة مع الحفاظ على العربية
    slug = re.sub(r'[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0590-\u05FF\w\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    
    return f"{slug}-{product_id}"

def create_product_page_html(product):
    """إنشاء صفحة HTML كاملة للمنتج"""
    
    # حساب الخصم
    discount_percentage = 0
    if product.get('regular_price', 0) > product.get('sale_price', 0):
        regular = float(product.get('regular_price', 0))
        sale = float(product.get('sale_price', 0))
        discount_percentage = round(((regular - sale) / regular) * 100) if regular > 0 else 0
    
    # تنسيق السعر
    sale_price = product.get('sale_price', 0)
    regular_price = product.get('regular_price', 0)
    currency = product.get('currency', 'AED')
    
    # شارة الخصم
    discount_badge = f'<span class="discount-badge">خصم {discount_percentage}%</span>' if discount_percentage > 0 else ''
    
    # عرض السعر الأصلي
    original_price_display = f'<span class="old-price">{regular_price} {currency}</span>' if regular_price > sale_price else ''
    
    # وصف المنتج
    description = product.get('description', '').replace('•', '\n•')
    description_short = description[:150] + '...' if len(description) > 150 else description
    
    # رسالة واتساب
    whatsapp_message = quote(f'السلام عليكم ورحمة الله وبركاته\n\nأريد الاستفسار عن:\n{product.get("title", "")}\n\nالسعر: {sale_price} {currency}\nالفئة: {product.get("category", "")}\n\nأرجو التواصل معي لتأكيد الطلب وتفاصيل التوصيل.\n\nشكراً لكم')
    whatsapp_message_simple = quote(f'أريد الاستفسار عن {product.get("title", "")} - {sale_price} {currency}')
    
    # تشفير العنوان للرابط
    title_encoded = quote(product.get('title', '')[:20])
    
    template = f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{product.get('title', '')} - سوق الإمارات الإلكتروني</title>
    <meta name="description" content="اشتري {product.get('title', '')} بأفضل سعر في الإمارات. {description_short}">
    <meta name="keywords" content="{product.get('title', '')}, {product.get('category', '')}, تسوق, الإمارات, دبي, أبوظبي">
    
    <!-- Open Graph Tags -->
    <meta property="og:title" content="{product.get('title', '')}">
    <meta property="og:description" content="{description_short}">
    <meta property="og:image" content="{product.get('image_url', '')}">
    <meta property="og:type" content="product">
    <meta property="product:price:amount" content="{sale_price}">
    <meta property="product:price:currency" content="{currency}">
    
    <!-- JSON-LD Schema -->
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "{product.get('title', '')}",
        "description": "{description_short}",
        "image": "{product.get('image_url', '')}",
        "brand": "{product.get('brand', 'none')}",
        "category": "{product.get('category', '')}",
        "offers": {{
            "@type": "Offer",
            "price": "{sale_price}",
            "priceCurrency": "{currency}",
            "availability": "https://schema.org/InStock"
        }}
    }}
    </script>
    
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ 
            font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; 
            direction: rtl; 
            background: #f8f9fa; 
            color: #333;
            line-height: 1.6;
        }}
        
        .container {{ 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 15px; 
            padding: 30px; 
            margin-top: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
        }}
        
        .header {{
            background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
            color: white;
            padding: 1.5rem 0;
            margin: -30px -30px 30px -30px;
            border-radius: 15px 15px 0 0;
            text-align: center;
        }}
        
        .header h1 {{
            font-size: 1.8rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
        }}
        
        .breadcrumb {{
            background: #f8f9fa;
            padding: 15px;
            margin-bottom: 25px;
            border-radius: 10px;
            font-size: 0.9em;
            border: 2px solid #DAA520;
        }}
        
        .breadcrumb a {{ color: #DAA520; text-decoration: none; font-weight: 600; }}
        .breadcrumb a:hover {{ text-decoration: underline; }}
        
        .product-header {{ 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 40px; 
            margin-bottom: 40px; 
        }}
        
        .product-image {{ text-align: center; }}
        .product-image img {{ 
            width: 100%; 
            max-width: 450px; 
            border-radius: 15px; 
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            transition: transform 0.3s ease;
        }}
        
        .product-image img:hover {{
            transform: scale(1.05);
        }}
        
        .product-info h1 {{ 
            font-size: 2.4em; 
            color: #2c3e50; 
            margin-bottom: 20px; 
            font-weight: bold;
            line-height: 1.3;
        }}
        
        .product-meta {{
            display: flex;
            gap: 15px;
            margin-bottom: 25px;
            flex-wrap: wrap;
        }}
        
        .category {{ 
            background: linear-gradient(135deg, #4F46E5, #7C3AED); 
            color: white; 
            padding: 8px 20px; 
            border-radius: 25px; 
            font-size: 0.95em;
            font-weight: 600; 
        }}
        
        .brand {{ 
            background: #e9ecef; 
            padding: 8px 20px; 
            border-radius: 25px; 
            font-size: 0.95em;
            font-weight: 600; 
        }}
        
        .uae-badge {{
            background: linear-gradient(45deg, #ff0000, #00ff00, #000000);
            color: white;
            padding: 8px 15px;
            border-radius: 25px;
            font-size: 0.9em;
            font-weight: bold;
        }}
        
        .price-section {{ 
            background: linear-gradient(135deg, #f0fff4 0%, #dcfce7 100%);
            padding: 25px; 
            border-radius: 15px; 
            margin: 25px 0;
            border: 3px solid #10B981;
            text-align: center;
        }}
        
        .price {{ 
            font-size: 2.8em; 
            font-weight: 900; 
            color: #059669;
            margin-bottom: 10px; 
        }}
        
        .old-price {{ 
            font-size: 1.4em; 
            color: #6c757d; 
            text-decoration: line-through; 
            margin-left: 15px; 
        }}
        
        .discount-badge {{ 
            background: #dc3545; 
            color: white; 
            padding: 8px 15px; 
            border-radius: 8px; 
            font-size: 0.9em;
            font-weight: 700; 
            margin-left: 15px;
            display: inline-block;
            margin-bottom: 10px; 
        }}
        
        .shipping-info {{ 
            background: #cff4fc; 
            border: 2px solid #0dcaf0;
            padding: 20px; 
            border-radius: 15px; 
            margin: 25px 0; 
        }}
        
        .shipping-info h4 {{
            color: #055160;
            margin-bottom: 15px;
            font-size: 1.3em;
        }}
        
        .shipping-info p {{
            margin-bottom: 8px;
            color: #087990;
            font-weight: 500;
        }}
        
        .action-buttons {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 30px;
        }}
        
        .whatsapp-btn {{
            background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
            color: white; 
            border: none; 
            padding: 18px 25px; 
            font-size: 1.3em;
            font-weight: 700; 
            border-radius: 12px; 
            cursor: pointer;
            text-decoration: none;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(37, 211, 102, 0.3);
        }}
        
        .whatsapp-btn:hover {{
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(37, 211, 102, 0.4);
            color: white;
        }}
        
        .back-btn {{
            background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
            color: white; 
            border: none; 
            padding: 18px 25px; 
            font-size: 1.3em;
            font-weight: 700; 
            border-radius: 12px; 
            cursor: pointer;
            text-decoration: none;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(218, 165, 32, 0.3);
        }}
        
        .back-btn:hover {{
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(218, 165, 32, 0.4);
            color: white;
        }}
        
        .description {{ 
            margin-top: 40px; 
            line-height: 1.9;
            font-size: 1.15em;
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
            border-right: 5px solid #DAA520;
        }}
        
        .description h3 {{
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.6em;
            display: flex;
            align-items: center;
            gap: 10px;
        }}
        
        .features {{
            background: #f0f9ff;
            padding: 25px;
            border-radius: 15px;
            margin-top: 30px;
            border: 2px solid #0ea5e9;
        }}
        
        .features h3 {{
            color: #0369a1;
            margin-bottom: 20px;
            font-size: 1.4em;
        }}
        
        .features ul {{
            list-style: none;
            padding: 0;
        }}
        
        .features li {{
            padding: 12px 0;
            border-bottom: 1px solid #e0f2fe;
            position: relative;
            padding-right: 35px;
            font-size: 1.1em;
        }}
        
        .features li::before {{
            content: '✅';
            position: absolute;
            right: 0;
            font-size: 1.2em;
        }}
        
        .whatsapp-float {{
            position: fixed;
            bottom: 25px;
            left: 25px;
            z-index: 1000;
            background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
            color: white;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            text-decoration: none;
            box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
            transition: all 0.3s ease;
            animation: pulse-whatsapp 2s infinite;
        }}
        
        .whatsapp-float:hover {{
            transform: scale(1.1) translateY(-5px);
            color: white;
            box-shadow: 0 12px 35px rgba(37, 211, 102, 0.5);
        }}
        
        @keyframes pulse-whatsapp {{
            0%, 100% {{ transform: scale(1); }}
            50% {{ transform: scale(1.05); }}
        }}
        
        @media (max-width: 768px) {{ 
            .product-header {{ 
                grid-template-columns: 1fr; 
                gap: 25px;
            }} 
            
            .action-buttons {{
                grid-template-columns: 1fr;
            }}
            
            .product-info h1 {{ font-size: 1.9em; }}
            .price {{ font-size: 2.2em; }}
            .container {{ padding: 20px; margin: 10px; }}
        }}
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>🛍️ سوق الإمارات للهدايا</h1>
        <p>أفضل المنتجات بأسعار لا تقاوم</p>
    </div>
    
    <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
            <a href="../../index.html">🏠 الرئيسية</a> / 
            <a href="../../index.html#categories">{product.get('category', 'منتجات عامة')}</a> / 
            <span>{product.get('title', 'منتج')}</span>
        </nav>
        
        <!-- Product Header -->
        <div class="product-header">
            <div class="product-image">
                <img src="{product.get('image_url', '')}" 
                     alt="{product.get('title', '')}" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400x300/DAA520/FFFFFF?text={title_encoded}'">
            </div>
            
            <div class="product-info">
                <h1>{product.get('title', '')}</h1>
                
                <div class="product-meta">
                    <span class="brand">🏷️ {product.get('brand', 'غير محدد')}</span>
                    <span class="category">📂 {product.get('category', 'منتجات عامة')}</span>
                    <span class="uae-badge">🇦🇪 منتج إماراتي 100%</span>
                </div>
                
                <div class="price-section">
                    {discount_badge}
                    {original_price_display}
                    <div class="price">{sale_price} درهم إماراتي</div>
                </div>
                
                <div class="shipping-info">
                    <h4>🚚 معلومات الشحن والتوصيل</h4>
                    <p>✅ توصيل سريع في دبي وأبوظبي (نفس اليوم)</p>
                    <p>✅ شحن مجاني للطلبات أكثر من 100 درهم</p>
                    <p>✅ دفع عند الاستلام متاح في جميع الإمارات</p>
                    <p>✅ خدمة عملاء 24/7</p>
                </div>
                
                <div class="action-buttons">
                    <a href="../../index.html" class="back-btn">
                        🏠 العودة للرئيسية
                    </a>
                    <a href="https://wa.me/201110760081?text={whatsapp_message}" 
                       class="whatsapp-btn" target="_blank" rel="noopener">
                        📱 اطلب عبر واتساب
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Product Description -->
        <div class="description">
            <h3>📋 وصف المنتج التفصيلي</h3>
            <div style="white-space: pre-line;">{description}</div>
        </div>
        
        <!-- Product Features -->
        <div class="features">
            <h3>⭐ مميزات المنتج</h3>
            <ul>
                <li>جودة عالية ومواصفات ممتازة</li>
                <li>خدمة عملاء على مدار الساعة</li>
                <li>متوافق مع معايير الجودة الإماراتية</li>
                <li>دعم فني مجاني</li>
                <li>توصيل سريع وآمن</li>
                <li>منتج إماراتي أصلي 100%</li>
            </ul>
        </div>
    </div>
    
    <!-- WhatsApp Float Button -->
    <a href="https://wa.me/201110760081?text={whatsapp_message_simple}" 
       class="whatsapp-float" target="_blank" rel="noopener" title="تواصل معنا عبر واتساب">
        📱
    </a>
    
    <script>
        // Add smooth animations on page load
        document.addEventListener('DOMContentLoaded', function() {{
            const elements = document.querySelectorAll('.product-header, .description, .features');
            elements.forEach((el, index) => {{
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                setTimeout(() => {{
                    el.style.transition = 'all 0.6s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }}, index * 200);
            }});
            
            // Add click tracking for analytics
            document.querySelectorAll('a[href*="wa.me"]').forEach(btn => {{
                btn.addEventListener('click', function() {{
                    console.log('WhatsApp inquiry sent for product: {product.get("title", "")}');
                }});
            }});
        }});
    </script>
</body>
</html>'''
    
    return template

def generate_all_product_pages(products_data, output_folder='data/pruducts-pages'):
    """توليد جميع صفحات المنتجات"""
    
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    generated_files = []
    
    for product in products_data:
        try:
            # إنشاء slug عربي
            slug = create_arabic_slug(product.get('title', ''), product.get('id', ''))
            filename = f"{slug}.html"
            
            # إنشاء محتوى HTML
            html_content = create_product_page_html(product)
            
            # حفظ الملف
            file_path = os.path.join(output_folder, filename)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            generated_files.append({
                'id': product.get('id'),
                'title': product.get('title', ''),
                'slug': slug,
                'filename': filename,
                'path': file_path
            })
            
        except Exception as e:
            print(f"❌ خطأ في إنشاء صفحة المنتج {product.get('id', 'unknown')}: {e}")
    
    return generated_files

def create_sitemap(generated_files, base_url='https://sherow1982.github.io/sooq-alemarat'):
    """إنشاء sitemap.xml لمحركات البحث"""
    
    sitemap_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- الصفحة الرئيسية -->
    <url>
        <loc>{base_url}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    
    <!-- النسخة الإنجليزية -->
    <url>
        <loc>{base_url}/en/</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>'''
    
    # إضافة صفحات المنتجات
    for file_info in generated_files:
        sitemap_content += f'''
    <url>
        <loc>{base_url}/data/pruducts-pages/{file_info['filename']}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>'''
    
    sitemap_content += f'''
    
    <!-- الصفحات القانونية -->
    <url>
        <loc>{base_url}/legal/terms.html</loc>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>{base_url}/legal/privacy.html</loc>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
</urlset>'''
    
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(sitemap_content)
    
    print(f"✅ تم إنشاء sitemap.xml مع {len(generated_files) + 4} رابط")

def main():
    """تشغيل المولد الرئيسي"""
    try:
        # تحميل بيانات المنتجات
        with open('data/uae-products.json', 'r', encoding='utf-8') as f:
            products = json.load(f)
        
        print(f"📂 تم تحميل {len(products)} منتج من ملف البيانات")
        
        # توليد صفحات المنتجات
        generated = generate_all_product_pages(products)
        
        print(f"✅ تم إنشاء {len(generated)} صفحة منتج بنجاح")
        
        # إحصائيات
        categories = {}
        for product in products:
            cat = product.get('category', 'غير محدد')
            categories[cat] = categories.get(cat, 0) + 1
        
        print("\n📊 إحصائيات الفئات:")
        for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
            print(f"   {cat}: {count} منتج")
        
        # حفظ قائمة الملفات المولدة
        with open('data/generated-pages-list.json', 'w', encoding='utf-8') as f:
            json.dump(generated, f, ensure_ascii=False, indent=2)
        
        # إنشاء sitemap
        create_sitemap(generated)
        
        print(f"\n🎉 تم الانتهاء بنجاح! جميع صفحات المنتجات جاهزة في مجلد data/pruducts-pages/")
        print("📄 تم إنشاء sitemap.xml لمحركات البحث")
        
    except Exception as e:
        print(f"❌ حدث خطأ: {e}")

if __name__ == "__main__":
    main()
