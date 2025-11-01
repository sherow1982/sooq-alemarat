/**
 * كاشف امتدادات المتصفح المحسن - بدون أخطاء CSP
 * Enhanced Browser Extension Detector - CSP Safe
 * Version 2.0 - Production Ready
 */

(function() {
    'use strict';
    
    // تجنب أخطاء CSP باستخدام طرق آمنة
    class SafeExtensionDetector {
        constructor() {
            this.detectedExtensions = new Set();
            this.isReady = false;
            this.warningsCount = 0;
            this.hasShownWarning = false;
            this.originalConsoleError = console.error;
            this.originalConsoleWarn = console.warn;
            this.init();
        }
        
        init() {
            try {
                // تفعيل مراقبة آمنة للأخطاء
                this.setupSafeErrorMonitoring();
                
                // فقط إذا كان موقع آمن، نحاول الكشف
                if (this.isSafeToDetect()) {
                    this.detectSafeExtensions();
                }
                
                this.isReady = true;
                console.log('✅ Safe Extension Detector initialized');
            } catch (error) {
                console.info('🛡️ Extension detection skipped for security');
                this.isReady = true;
            }
        }
        
        isSafeToDetect() {
            const safeOrigins = [
                'localhost',
                '127.0.0.1',
                'sherow1982.github.io',
                'sooq-alemarat.github.io'
            ];
            
            return safeOrigins.some(origin => 
                window.location.hostname.includes(origin)
            );
        }
        
        setupSafeErrorMonitoring() {
            const self = this;
            
            // مراقبة آمنة للأخطاء
            console.error = function(...args) {
                const message = args.join(' ').toLowerCase();
                
                // فحص الأخطاء المتعلقة بالامتدادات
                const extensionPatterns = [
                    'extension', 'chrome-extension', 'moz-extension',
                    'runtime.lasterror', 'unchecked runtime', 'violates csp',
                    'refused to execute', 'content security policy'
                ];
                
                const isExtensionError = extensionPatterns.some(pattern => 
                    message.includes(pattern)
                );
                
                if (isExtensionError) {
                    self.warningsCount++;
                    
                    // عرض فقط في التطوير
                    if (self.isSafeToDetect()) {
                        self.originalConsoleError.apply(console, ['🔌 Extension Issue (filtered):', message.substring(0, 100)]);
                    }
                    
                    // عرض تحذير بعد عدة أخطاء
                    if (self.warningsCount >= 3 && !self.hasShownWarning) {
                        setTimeout(() => self.showExtensionWarning(), 1000);
                        self.hasShownWarning = true;
                    }
                    
                    return; // عدم عرض أخطاء الامتدادات المزعجة
                }
                
                // عرض الأخطاء الشرعية
                self.originalConsoleError.apply(console, args);
            };
            
            console.warn = function(...args) {
                const message = args.join(' ').toLowerCase();
                
                // تصفية تحذيرات الامتدادات
                const isExtensionWarning = ['extension', 'runtime', 'chrome-extension'].some(pattern => 
                    message.includes(pattern)
                );
                
                if (!isExtensionWarning) {
                    self.originalConsoleWarn.apply(console, args);
                }
            };
            
            // مراقبة الوعود المرفوضة
            window.addEventListener('unhandledrejection', (event) => {
                const errorMessage = event.reason?.message || event.reason?.toString() || '';
                
                if (errorMessage.toLowerCase().includes('extension') || 
                    errorMessage.toLowerCase().includes('runtime')) {
                    
                    event.preventDefault();
                    self.warningsCount++;
                    
                    if (self.warningsCount >= 2 && !self.hasShownWarning) {
                        setTimeout(() => self.showExtensionWarning(), 1500);
                        self.hasShownWarning = true;
                    }
                }
            });
            
            // مراقبة انتهاكات CSP
            document.addEventListener('securitypolicyviolation', (event) => {
                if (event.violatedDirective && event.violatedDirective.includes('script-src')) {
                    self.warningsCount++;
                    
                    if (self.warningsCount >= 2 && !self.hasShownWarning) {
                        setTimeout(() => {
                            if (!sessionStorage.getItem('extension_warning_dismissed')) {
                                self.showExtensionWarning();
                                self.hasShownWarning = true;
                            }
                        }, 2000);
                    }
                }
            });
        }
        
        detectSafeExtensions() {
            // كشف آمن للامتدادات الشائعة
            const safeChecks = [
                {
                    name: 'AdBlocker',
                    check: () => {
                        const testAd = document.createElement('div');
                        testAd.innerHTML = '&nbsp;';
                        testAd.className = 'adsbox ad-container';
                        testAd.style.cssText = 'position:absolute;left:-999px;width:1px;height:1px;';
                        document.body.appendChild(testAd);
                        
                        const isBlocked = testAd.offsetHeight === 0;
                        document.body.removeChild(testAd);
                        return isBlocked;
                    }
                },
                {
                    name: 'DarkReader',
                    check: () => {
                        return document.querySelector('meta[name="darkreader"]') !== null ||
                               document.documentElement.hasAttribute('data-darkreader-scheme') ||
                               document.documentElement.hasAttribute('data-darkreader');
                    }
                },
                {
                    name: 'Grammarly',
                    check: () => {
                        return document.querySelector('[data-gr-ext]') !== null ||
                               document.querySelector('.grammarly-desktop-integration') !== null;
                    }
                },
                {
                    name: 'Translation',
                    check: () => {
                        return document.querySelector('[class*="translate"]') !== null ||
                               document.querySelector('[id*="google_translate"]') !== null;
                    }
                }
            ];
            
            safeChecks.forEach(({name, check}) => {
                try {
                    if (check()) {
                        this.detectedExtensions.add(name);
                        console.log(`🔍 Detected extension: ${name}`);
                    }
                } catch (error) {
                    // تجاهل الأخطاء بصمت
                }
            });
        }
        
        showExtensionWarning() {
            // عدم عرض في الإنتاج إلا بصراحة
            if (!this.isSafeToDetect() && !sessionStorage.getItem('show_extension_warnings')) {
                return;
            }
            
            // تجنب التكرار
            if (sessionStorage.getItem('extension_warning_dismissed') === 'true') {
                return;
            }
            
            const isEnglish = window.location.pathname.includes('/en/');
            
            const warningHTML = isEnglish ? `
                <div id="extension-warning" style="
                    position: fixed; top: 80px; right: 20px; 
                    background: linear-gradient(135deg, #fbbf24, #f59e0b); 
                    color: #1f2937; padding: 1rem 1.5rem; border-radius: 15px;
                    box-shadow: 0 8px 32px rgba(251, 191, 36, 0.4);
                    font-weight: 600; z-index: 9999; max-width: 320px;
                    border: 2px solid rgba(255, 255, 255, 0.3); cursor: pointer;
                    animation: extensionSlideIn 0.5s ease-out;
                    font-family: 'Cairo', sans-serif;
                ">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.8rem;">
                        <span style="font-size: 1.3rem;">🔌</span>
                        <strong>Extensions Detected</strong>
                    </div>
                    <p style="margin: 0; font-size: 13px; line-height: 1.4; margin-bottom: 0.8rem;">
                        Browser extensions may affect store performance. Try incognito mode for best experience.
                    </p>
                    <div style="font-size: 11px; opacity: 0.8; text-align: center;">✨ Click to dismiss</div>
                </div>
            ` : `
                <div id="extension-warning" style="
                    position: fixed; top: 80px; right: 20px; 
                    background: linear-gradient(135deg, #fbbf24, #f59e0b); 
                    color: #1f2937; padding: 1rem 1.5rem; border-radius: 15px;
                    box-shadow: 0 8px 32px rgba(251, 191, 36, 0.4);
                    font-weight: 600; z-index: 9999; max-width: 320px;
                    border: 2px solid rgba(255, 255, 255, 0.3); cursor: pointer;
                    animation: extensionSlideIn 0.5s ease-out;
                    font-family: 'Cairo', sans-serif;
                ">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.8rem;">
                        <span style="font-size: 1.3rem;">🔌</span>
                        <strong>تم رصد إضافات متصفح</strong>
                    </div>
                    <p style="margin: 0; font-size: 13px; line-height: 1.4; margin-bottom: 0.8rem;">
                        إضافات المتصفح قد تؤثر على أداء المتجر. جرب الوضع الخاص لأفضل تجربة.
                    </p>
                    <div style="font-size: 11px; opacity: 0.8; text-align: center;">✨ اضغط للإغلاق</div>
                </div>
            `;
            
            // إزالة التحذير السابق
            const existingWarning = document.getElementById('extension-warning');
            if (existingWarning) {
                existingWarning.remove();
            }
            
            document.body.insertAdjacentHTML('beforeend', warningHTML);
            
            // معالج النقر للإغلاق
            const warningElement = document.getElementById('extension-warning');
            if (warningElement) {
                warningElement.addEventListener('click', () => {
                    warningElement.style.animation = 'extensionSlideOut 0.3s ease-in forwards';
                    setTimeout(() => warningElement.remove(), 300);
                    sessionStorage.setItem('extension_warning_dismissed', 'true');
                });
                
                // إغلاق تلقائي بعد 6 ثوان
                setTimeout(() => {
                    if (warningElement.parentNode) {
                        warningElement.style.animation = 'extensionSlideOut 0.3s ease-in forwards';
                        setTimeout(() => warningElement.remove(), 300);
                    }
                }, 6000);
            }
        }
        
        // واجهة برمجية آمنة
        hasExtension(extensionName) {
            return this.detectedExtensions.has(extensionName);
        }
        
        getDetectedExtensions() {
            return Array.from(this.detectedExtensions);
        }
        
        getExtensionCount() {
            return this.detectedExtensions.size;
        }
        
        getSafeReport() {
            return {
                ready: this.isReady,
                safe: this.isSafeToDetect(),
                detected: this.getExtensionCount(),
                extensions: this.getDetectedExtensions(),
                warnings: this.warningsCount,
                userAgent: navigator.userAgent.substring(0, 50) + '...',
                timestamp: new Date().toISOString(),
                url: window.location.href
            };
        }
    }
    
    // تفعيل آمن بدون انتظار DOM
    const detector = new SafeExtensionDetector();
    
    // تصدير آمن للنافذة العامة
    if (typeof window !== 'undefined') {
        window.extensionDetector = detector;
        
        // وظيفة تقرير محسنة
        window.reportStoreIssue = function(context = 'general') {
            const report = {
                context: context,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                detector: detector.getSafeReport(),
                browser: {
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                    cookieEnabled: navigator.cookieEnabled,
                    onLine: navigator.onLine
                },
                screen: {
                    width: screen.width,
                    height: screen.height,
                    devicePixelRatio: window.devicePixelRatio || 1
                },
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                store: {
                    allProducts: !!window.allProducts,
                    categoryProducts: !!window.categoryProducts,
                    cart: !!window.cart,
                    productsCount: window.allProducts?.length || 0
                },
                localStorage: {
                    cartItems: JSON.parse(localStorage.getItem('emirates_cart') || '[]').length,
                    storage: localStorage.length
                }
            };
            
            console.group('🏦 Store Debug Report - ' + context);
            console.log('Report:', report);
            console.groupEnd();
            
            // نسخ للحافظة
            const reportText = JSON.stringify(report, null, 2);
            
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(reportText).then(() => {
                        const message = window.location.pathname.includes('/en/') 
                            ? 'Debug report copied to clipboard!' 
                            : 'تم نسخ تقرير التشخيص للحافظة!';
                        
                        if (window.showNotification) {
                            window.showNotification(message);
                        } else {
                            alert(message);
                        }
                    }).catch(() => {
                        fallbackCopy(reportText);
                    });
                } else {
                    fallbackCopy(reportText);
                }
            } catch (error) {
                fallbackCopy(reportText);
            }
            
            function fallbackCopy(text) {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.cssText = 'position:fixed;opacity:0;left:-999px;';
                document.body.appendChild(textarea);
                textarea.select();
                
                try {
                    document.execCommand('copy');
                    const message = window.location.pathname.includes('/en/') 
                        ? 'Report copied to clipboard!' 
                        : 'تم نسخ التقرير!';
                    alert(message);
                } catch (err) {
                    const message = window.location.pathname.includes('/en/') 
                        ? 'Please copy manually:' 
                        : 'انسخ يدوياً:';
                    prompt(message, text);
                } finally {
                    document.body.removeChild(textarea);
                }
            }
            
            return report;
        };
        
        console.log('✅ Safe Extension Detector v2.0 loaded successfully');
    }
    
    // إضافة أنماط CSS آمنة
    if (!document.querySelector('#extension-detector-styles')) {
        const styles = document.createElement('style');
        styles.id = 'extension-detector-styles';
        styles.textContent = `
            @keyframes extensionSlideIn {
                from { 
                    transform: translateX(100%) scale(0.9); 
                    opacity: 0; 
                }
                to { 
                    transform: translateX(0) scale(1); 
                    opacity: 1; 
                }
            }
            
            @keyframes extensionSlideOut {
                from { 
                    transform: translateX(0) scale(1); 
                    opacity: 1; 
                }
                to { 
                    transform: translateX(100%) scale(0.9); 
                    opacity: 0; 
                }
            }
            
            #extension-warning:hover {
                transform: scale(1.02) translateY(-2px);
                transition: all 0.2s ease;
                box-shadow: 0 12px 40px rgba(251, 191, 36, 0.5);
            }
        `;
        document.head.appendChild(styles);
    }
    
})();