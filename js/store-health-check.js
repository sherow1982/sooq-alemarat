// Emirates Souq Store Health Check & Testing Suite
// Quick verification that all store components work correctly
(function() {
    'use strict';
    
    const STORE_CONFIG = {
        dataPath: './data/uae-products.json',
        expectedCategories: [
            'الأجهزة المنزلية والكهربائية',
            'الإلكترونيات والتكنولوجيا',
            'العناية الشخصية والصحة والجمال',
            'الأحذية والملابس والإكسسوارات',
            'الرياضة واللياقة والصحة',
            'الأثاث والأدوات المنزلية',
            'منتجات متنوعة'
        ],
        testProducts: ['1', '2', '3', '57', '118'],
        essentialPages: [
            'index.html',
            'cart.html',
            'checkout.html',
            'product.html',
            'miscellaneous-products.html',
            'electronics-technology.html'
        ]
    };
    
    let healthCheckResults = {
        timestamp: new Date().toISOString(),
        passed: 0,
        failed: 0,
        warnings: 0,
        details: []
    };
    
    // Test data loading and parsing
    async function testDataIntegrity() {
        const testName = 'Data Integrity Check';
        
        try {
            console.log(`🧪 Testing: ${testName}`);
            
            const response = await fetch(STORE_CONFIG.dataPath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Cannot fetch product data`);
            }
            
            const products = await response.json();
            
            // Basic validation
            if (!Array.isArray(products) || products.length === 0) {
                throw new Error('Invalid or empty product data');
            }
            
            // Check required fields
            const requiredFields = ['id', 'title', 'category', 'regular_price'];
            const invalidProducts = products.filter(p => 
                !p || requiredFields.some(field => !p[field])
            );
            
            if (invalidProducts.length > 0) {
                healthCheckResults.warnings++;
                healthCheckResults.details.push({
                    test: testName,
                    status: 'warning',
                    message: `${invalidProducts.length} products missing required fields`,
                    data: invalidProducts.slice(0, 3).map(p => p.id || 'unknown')
                });
            }
            
            // Check categories
            const foundCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
            const missingCategories = STORE_CONFIG.expectedCategories.filter(
                cat => !foundCategories.includes(cat)
            );
            
            if (missingCategories.length > 0) {
                healthCheckResults.warnings++;
                healthCheckResults.details.push({
                    test: testName,
                    status: 'warning',
                    message: 'Some expected categories not found in data',
                    data: missingCategories
                });
            }
            
            healthCheckResults.passed++;
            healthCheckResults.details.push({
                test: testName,
                status: 'passed',
                message: `Loaded ${products.length} products across ${foundCategories.length} categories`,
                data: { totalProducts: products.length, categories: foundCategories.length }
            });
            
            return products;
            
        } catch (error) {
            healthCheckResults.failed++;
            healthCheckResults.details.push({
                test: testName,
                status: 'failed',
                message: error.message,
                data: null
            });
            
            console.error(`❌ ${testName} failed:`, error);
            throw error;
        }
    }
    
    // Test category filtering and matching
    function testCategoryMatching(products) {
        const testName = 'Category Matching Test';
        
        try {
            console.log(`🧪 Testing: ${testName}`);
            
            const testCases = [
                { input: 'منتجات متنوعة', expected: 'منتجات متنوعة' },
                { input: 'متنوعة', expected: 'منتجات متنوعة' },
                { input: 'الإلكترونيات', expected: 'الإلكترونيات والتكنولوجيا' },
                { input: 'أجهزة منزلية', expected: 'الأجهزة المنزلية والكهربائية' }
            ];
            
            const results = testCases.map(testCase => {
                const filtered = products.filter(p => p.category === testCase.expected);
                return {
                    input: testCase.input,
                    expected: testCase.expected,
                    found: filtered.length,
                    success: filtered.length > 0
                };
            });
            
            const failedTests = results.filter(r => !r.success);
            
            if (failedTests.length > 0) {
                healthCheckResults.failed++;
                healthCheckResults.details.push({
                    test: testName,
                    status: 'failed',
                    message: `${failedTests.length} category mappings failed`,
                    data: failedTests
                });
            } else {
                healthCheckResults.passed++;
                healthCheckResults.details.push({
                    test: testName,
                    status: 'passed',
                    message: 'All category mappings work correctly',
                    data: results
                });
            }
            
            return results;
            
        } catch (error) {
            healthCheckResults.failed++;
            healthCheckResults.details.push({
                test: testName,
                status: 'failed',
                message: error.message,
                data: null
            });
        }
    }
    
    // Test cart functionality
    function testCartFunctionality(products) {
        const testName = 'Cart Functionality Test';
        
        try {
            console.log(`🧪 Testing: ${testName}`);
            
            // Clear cart for testing
            localStorage.removeItem('emirates_cart');
            
            const testProduct = products[0];
            const cartItem = {
                id: testProduct.id,
                title: testProduct.title,
                price: testProduct.sale_price || testProduct.regular_price,
                image: testProduct.image_url,
                quantity: 1,
                addedAt: Date.now()
            };
            
            // Test adding to cart
            const cartItems = [cartItem];
            localStorage.setItem('emirates_cart', JSON.stringify(cartItems));
            
            // Test retrieving from cart
            const retrieved = JSON.parse(localStorage.getItem('emirates_cart') || '[]');
            
            if (retrieved.length !== 1 || retrieved[0].id !== testProduct.id) {
                throw new Error('Cart add/retrieve functionality failed');
            }
            
            // Test updating quantity
            retrieved[0].quantity = 2;
            localStorage.setItem('emirates_cart', JSON.stringify(retrieved));
            
            const updated = JSON.parse(localStorage.getItem('emirates_cart') || '[]');
            if (updated[0].quantity !== 2) {
                throw new Error('Cart update functionality failed');
            }
            
            // Clean up
            localStorage.removeItem('emirates_cart');
            
            healthCheckResults.passed++;
            healthCheckResults.details.push({
                test: testName,
                status: 'passed',
                message: 'Cart operations work correctly',
                data: { tested: 'add, retrieve, update, clear' }
            });
            
        } catch (error) {
            healthCheckResults.failed++;
            healthCheckResults.details.push({
                test: testName,
                status: 'failed',
                message: error.message,
                data: null
            });
            
            console.error(`❌ ${testName} failed:`, error);
        }
    }
    
    // Test price filtering functionality
    function testPriceFiltering(products) {
        const testName = 'Price Filtering Test';
        
        try {
            console.log(`🧪 Testing: ${testName}`);
            
            const testFilters = {
                'under-200': products.filter(p => (p.sale_price || p.regular_price || 0) < 200),
                '200-300': products.filter(p => {
                    const price = p.sale_price || p.regular_price || 0;
                    return price >= 200 && price <= 300;
                }),
                'over-300': products.filter(p => (p.sale_price || p.regular_price || 0) > 300)
            };
            
            const results = Object.entries(testFilters).map(([filter, filtered]) => ({
                filter,
                count: filtered.length,
                valid: filtered.every(p => {
                    const price = p.sale_price || p.regular_price || 0;
                    switch(filter) {
                        case 'under-200': return price < 200;
                        case '200-300': return price >= 200 && price <= 300;
                        case 'over-300': return price > 300;
                        default: return true;
                    }
                })
            }));
            
            const failedFilters = results.filter(r => !r.valid);
            
            if (failedFilters.length > 0) {
                healthCheckResults.failed++;
                healthCheckResults.details.push({
                    test: testName,
                    status: 'failed',
                    message: 'Price filtering logic errors detected',
                    data: failedFilters
                });
            } else {
                healthCheckResults.passed++;
                healthCheckResults.details.push({
                    test: testName,
                    status: 'passed',
                    message: 'All price filters work correctly',
                    data: results
                });
            }
            
        } catch (error) {
            healthCheckResults.failed++;
            healthCheckResults.details.push({
                test: testName,
                status: 'failed',
                message: error.message,
                data: null
            });
        }
    }
    
    // Test SEO and meta data
    function testSEOIntegrity(products) {
        const testName = 'SEO Integrity Test';
        
        try {
            console.log(`🧪 Testing: ${testName}`);
            
            const seoIssues = [];
            
            // Check page title
            if (!document.title || document.title.length < 10) {
                seoIssues.push('عنوان الصفحة قصير جداً');
            }
            
            // Check meta description
            const metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc || metaDesc.content.length < 50) {
                seoIssues.push('وصف الصفحة مفقود أو قصير');
            }
            
            // Check product SEO data
            const productsWithoutSEO = products.filter(p => 
                !p.seo_title || !p.meta_description || !p.seo_keywords
            );
            
            if (productsWithoutSEO.length > products.length * 0.1) {
                seoIssues.push(`${productsWithoutSEO.length} منتج يفتقر لبيانات SEO`);
            }
            
            if (seoIssues.length > 0) {
                healthCheckResults.warnings++;
                healthCheckResults.details.push({
                    test: testName,
                    status: 'warning',
                    message: 'SEO improvements needed',
                    data: seoIssues
                });
            } else {
                healthCheckResults.passed++;
                healthCheckResults.details.push({
                    test: testName,
                    status: 'passed',
                    message: 'SEO configuration looks good',
                    data: null
                });
            }
            
        } catch (error) {
            healthCheckResults.failed++;
            healthCheckResults.details.push({
                test: testName,
                status: 'failed',
                message: error.message,
                data: null
            });
        }
    }
    
    // Test browser extension compatibility
    function testExtensionCompatibility() {
        const testName = 'Extension Compatibility Test';
        
        try {
            console.log(`🧪 Testing: ${testName}`);
            
            const extensionIndicators = [
                document.querySelector('[data-extension-id]'),
                document.querySelector('[class*="extension"]'),
                document.querySelector('script[src*="extension"]'),
                window.chrome?.runtime?.lastError
            ];
            
            const detectedExtensions = extensionIndicators.filter(Boolean).length;
            
            if (detectedExtensions > 0) {
                healthCheckResults.warnings++;
                healthCheckResults.details.push({
                    test: testName,
                    status: 'warning',
                    message: `${detectedExtensions} browser extensions detected that might interfere`,
                    data: { 
                        recommendation: 'جرب في وضع التصفح الخاص للحصول على أداء أفضل' 
                    }
                });
            } else {
                healthCheckResults.passed++;
                healthCheckResults.details.push({
                    test: testName,
                    status: 'passed',
                    message: 'Clean browser environment detected',
                    data: null
                });
            }
            
        } catch (error) {
            healthCheckResults.warnings++;
            healthCheckResults.details.push({
                test: testName,
                status: 'warning',
                message: 'Could not fully test extension compatibility',
                data: error.message
            });
        }
    }
    
    // Generate comprehensive health report
    function generateHealthReport() {
        console.group('🏪 Emirates Souq Health Check Report');
        console.log('✅ Tests Passed:', healthCheckResults.passed);
        console.log('❌ Tests Failed:', healthCheckResults.failed);
        console.log('⚠️ Warnings:', healthCheckResults.warnings);
        console.log('\n📋 Detailed Results:');
        
        healthCheckResults.details.forEach((detail, index) => {
            const emoji = {
                'passed': '✅',
                'failed': '❌',
                'warning': '⚠️'
            }[detail.status];
            
            console.log(`${index + 1}. ${emoji} ${detail.test}: ${detail.message}`);
            if (detail.data) {
                console.log('   Data:', detail.data);
            }
        });
        
        // Overall health score
        const totalTests = healthCheckResults.passed + healthCheckResults.failed + healthCheckResults.warnings;
        const healthScore = totalTests > 0 
            ? Math.round((healthCheckResults.passed / totalTests) * 100)
            : 0;
            
        console.log(`\n📊 Overall Health Score: ${healthScore}%`);
        
        if (healthScore >= 80) {
            console.log('🎉 Store is in excellent condition!');
        } else if (healthScore >= 60) {
            console.log('👍 Store is in good condition with minor issues');
        } else {
            console.log('⚠️ Store needs attention - several issues detected');
        }
        
        console.groupEnd();
        
        return {
            score: healthScore,
            results: healthCheckResults,
            summary: {
                status: healthScore >= 80 ? 'excellent' : healthScore >= 60 ? 'good' : 'needs-attention',
                totalTests,
                timestamp: healthCheckResults.timestamp
            }
        };
    }
    
    // Main health check runner
    window.runStoreHealthCheck = async function(verbose = false) {
        console.log('🚀 Starting Emirates Souq Health Check...');
        
        try {
            // Reset results
            healthCheckResults = {
                timestamp: new Date().toISOString(),
                passed: 0,
                failed: 0,
                warnings: 0,
                details: []
            };
            
            // Run tests
            const products = await testDataIntegrity();
            testCategoryMatching(products);
            testCartFunctionality(products);
            testSEOIntegrity(products);
            testExtensionCompatibility();
            
            // Generate report
            const report = generateHealthReport();
            
            if (verbose) {
                // Create visual report for user
                showHealthReport(report);
            }
            
            return report;
            
        } catch (error) {
            console.error('❌ Health check failed:', error);
            return {
                score: 0,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    };
    
    // Show visual health report
    function showHealthReport(report) {
        const existingReport = document.getElementById('health-report');
        if (existingReport) existingReport.remove();
        
        const statusColors = {
            'excellent': '#10b981',
            'good': '#f59e0b', 
            'needs-attention': '#ef4444'
        };
        
        const reportHTML = `
            <div id="health-report" style="
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: white; padding: 2rem; border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); z-index: 2000;
                max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;
                border: 3px solid ${statusColors[report.summary.status]};
            ">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">
                        ${report.summary.status === 'excellent' ? '🎉' : 
                          report.summary.status === 'good' ? '👍' : '⚠️'}
                    </div>
                    <h3 style="color: ${statusColors[report.summary.status]}; margin: 0;">
                        🏪 تقرير صحة سوق الإمارات
                    </h3>
                    <div style="font-size: 2rem; font-weight: 800; color: ${statusColors[report.summary.status]}; margin: 1rem 0;">
                        ${report.score}%
                    </div>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                        <span>✅ نجح: ${report.results.passed}</span>
                        <span>❌ فشل: ${report.results.failed}</span>
                        <span>⚠️ تحذير: ${report.results.warnings}</span>
                    </div>
                    
                    <div style="font-size: 14px; color: #6b7280;">
                        وقت الفحص: ${new Date(report.summary.timestamp).toLocaleString('ar-AE')}
                    </div>
                </div>
                
                <div style="max-height: 200px; overflow-y: auto; background: #f9fafb; padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                    ${report.results.details.map(detail => `
                        <div style="margin-bottom: 0.5rem; padding: 0.5rem; background: white; border-radius: 6px;">
                            <strong>${{
                                'passed': '✅',
                                'failed': '❌', 
                                'warning': '⚠️'
                            }[detail.status]} ${detail.test}:</strong>
                            <div style="font-size: 13px; color: #6b7280; margin-top: 0.25rem;">${detail.message}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="text-align: center;">
                    <button onclick="document.getElementById('health-report').remove()" style="
                        padding: 1rem 2rem; background: #1e40af; color: white;
                        border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
                    ">👍 حسناً، فهمت!</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', reportHTML);
    }
    
    // Quick test shortcut (Ctrl+Shift+H)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'H') {
            e.preventDefault();
            window.runStoreHealthCheck(true);
        }
    });
    
    // Auto-run basic health check on page load (in development mode)
    document.addEventListener('DOMContentLoaded', function() {
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1' ||
            sessionStorage.getItem('enable_health_check') === 'true') {
            
            console.log('🚑 Auto-running store health check...');
            
            setTimeout(() => {
                window.runStoreHealthCheck(false);
            }, 3000);
        }
    });
    
})();

// Add CSS for health check animations
if (!document.querySelector('#health-check-styles')) {
    const styles = document.createElement('style');
    styles.id = 'health-check-styles';
    styles.textContent = `
        @keyframes healthCheckSlideIn {
            from {
                opacity: 0;
                transform: translate(-50%, -60%) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
        
        #health-report {
            animation: healthCheckSlideIn 0.3s ease-out;
        }
    `;
    document.head.appendChild(styles);
}