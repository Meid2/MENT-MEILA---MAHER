// =============================================================================
// نظام الترجمة الداخلي (بدون ملفات خارجية)
// =============================================================================
const translations = {
    ar: {
      welcome: "أناقة إسلامية تليق بكِ 💕",
      heroSubtitle: "من عمر سنتين إلى ثمانين سنة — نهتم بكل تفصيل في أناقتك",
      shopNow: "تسوق الآن",
      categoriesTitle: "أقسام المتجر",
      productsTitle: "أحدث المنتجات",
      cartTitle: "سلة التسوق",
      totalLabel: "الإجمالي:",
      addToCart: "أضف إلى السلة",
      emptyCart: "سلة فارغة",
      orderViaWhatsApp: "إرسال الطلب عبر الواتساب",
      catAbayas: "العبايات",
      catHijabs: "الطرح",
      catNiqabs: "النقاب",
      catKids: "أطفال",
      catSeniors: "كبار",
      searchPlaceholder: "ابحث عن منتج...",
      developerCredit: "تم تطوير الموقع بواسطة شركة <strong>Ment-M</strong><br/> بقيادة المهندس <strong>محمد عيد صبحي عيد مرشدي</strong>"
    },
    en: {
      welcome: "Islamic Elegance, Just for You 💕",
      heroSubtitle: "From age 2 to 80 — we care about every detail of your style",
      shopNow: "Shop Now",
      categoriesTitle: "Store Categories",
      productsTitle: "Latest Products",
      cartTitle: "Shopping Cart",
      totalLabel: "Total:",
      addToCart: "Add to Cart",
      emptyCart: "Your cart is empty",
      orderViaWhatsApp: "Order via WhatsApp",
      catAbayas: "Abayas",
      catHijabs: "Hijabs",
      catNiqabs: "Niqabs",
      catKids: "Kids",
      catSeniors: "Seniors",
      searchPlaceholder: "Search for products...",
      developerCredit: "Developed by <strong>Ment-M</strong><br/> Led by Eng. <strong>Mohammad Eid Sbahi Eid Murshidi</strong>"
    }
  };
  
  let currentLang = localStorage.getItem('meilaLang') || 'ar';
  
  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('meilaLang', lang);
    
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // تحديث النصوص
    document.getElementById('welcomeText').textContent = translations[lang].welcome;
    document.getElementById('heroSubtitle').textContent = translations[lang].heroSubtitle;
    document.getElementById('shopNowBtn').textContent = translations[lang].shopNow;
    document.getElementById('categoriesTitle').textContent = translations[lang].categoriesTitle;
    document.getElementById('productsTitle').textContent = translations[lang].productsTitle;
    document.getElementById('cartTitle').textContent = translations[lang].cartTitle;
    document.getElementById('totalLabel').innerHTML = translations[lang].totalLabel + ' <strong id="cartTotal">0 ج.م</strong>';
    document.getElementById('whatsappOrderBtn').textContent = translations[lang].orderViaWhatsApp;
    document.getElementById('catAbayas').textContent = translations[lang].catAbayas;
    document.getElementById('catHijabs').textContent = translations[lang].catHijabs;
    document.getElementById('catNiqabs').textContent = translations[lang].catNiqabs;
    document.getElementById('catKids').textContent = translations[lang].catKids;
    document.getElementById('catSeniors').textContent = translations[lang].catSeniors; // ← مهم!
    document.getElementById('developerCredit').innerHTML = translations[lang].developerCredit;
    
    // تحديث زر اللغة
    document.getElementById('langToggle').textContent = lang === 'ar' ? 'EN' : 'العربية';
    
    // تحديث placeholder البحث
    document.getElementById('searchInput').placeholder = translations[lang].searchPlaceholder;
    
    // إعادة عرض المنتجات بلغة جديدة
    renderProducts(currentCategory);
  }
  
  function toggleLanguage() {
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    applyLanguage(newLang);
  }
  
  // =============================================================================
  // إدارة السلة
  // =============================================================================
  let cart = JSON.parse(localStorage.getItem('meilaCart')) || [];
  let currentCategory = 'all';
  
  function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
  
    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
  
    saveCart();
    updateCartUI();
    showNotification("✓ تم إضافة المنتج إلى السلة");
  }
  
  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
  }
  
  function saveCart() {
    localStorage.setItem('meilaCart', JSON.stringify(cart));
  }
  
  function updateCartUI() {
    const cartCountEl = document.getElementById('cartCount');
    const cartListEl = document.getElementById('cartList');
    const cartTotalEl = document.getElementById('cartTotal');
  
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCountEl.textContent = totalCount;
  
    if (cart.length === 0) {
      cartListEl.innerHTML = `<li>${translations[currentLang].emptyCart}</li>`;
      cartTotalEl.textContent = '0 ج.م';
      return;
    }
  
    cartListEl.innerHTML = cart.map(item => `
      <li>
        ${item.name[currentLang]} × ${item.quantity || 1}
        <span>${(item.price * (item.quantity || 1)).toFixed(2)} ج.م 
          <button onclick="removeFromCart(${item.id})">✕</button>
        </span>
      </li>
    `).join('');
  
    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    cartTotalEl.textContent = `${total.toFixed(2)} ج.م`;
  }
  
  function showNotification(msg) {
    console.log(msg);
  }
  
  // =============================================================================
  // عرض المنتجات
  // =============================================================================
  function renderProducts(category = 'all') {
    currentCategory = category;
    const grid = document.getElementById('productGrid');
    
    let filtered = category === 'all' 
      ? allProducts 
      : allProducts.filter(p => p.category === category);
    
    // بحث
    const query = document.getElementById('searchInput').value.toLowerCase();
    if (query) {
      filtered = filtered.filter(p => 
        p.name[currentLang].toLowerCase().includes(query) ||
        p.desc[currentLang].toLowerCase().includes(query)
      );
    }
  
    if (filtered.length === 0) {
      grid.innerHTML = `<p style="text-align:center; width:100%;">${currentLang === 'ar' ? 'لا توجد منتجات' : 'No products found'}</p>`;
      return;
    }
  
    grid.innerHTML = filtered.map(product => `
      <div class="product-card">
        <div class="product-image">${product.name[currentLang]}</div>
        <div class="product-info">
          <h3>${product.name[currentLang]}</h3>
          <p>${product.desc[currentLang]}</p>
          <div class="price">${product.price} ج.م</div>
          <button class="add-to-cart" onclick="addToCart(${product.id})">
            ${translations[currentLang].addToCart}
          </button>
        </div>
      </div>
    `).join('');
  }
  
  // =============================================================================
  // وظائف الواتساب
  // =============================================================================
  function sendOrderViaWhatsApp() {
    if (cart.length === 0) {
      alert(translations[currentLang].emptyCart);
      return;
    }
  
    let message = currentLang === 'ar' 
      ? 'مرحباً من متجر "ميلا ماهر"، أرغب في طلب التالي:\n\n'
      : 'Hello from Meila Maher store, I would like to order the following:\n\n';
  
    cart.forEach(item => {
      message += `• ${item.name[currentLang]} (${item.quantity || 1} piece) — ${item.price * (item.quantity || 1)} EGP\n`;
    });
  
    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    message += `\n${currentLang === 'ar' ? 'الإجمالي' : 'Total'}: ${total} EGP\n`;
    message += `\n${currentLang === 'ar' ? 'شكراً لكم ❤️' : 'Thank you! ❤️'}`;
  
    const phoneNumber = '+201011097388';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
  
  // =============================================================================
  // ربط الأحداث
  // =============================================================================
  document.addEventListener('DOMContentLoaded', () => {
    // تطبيق اللغة المحفوظة
    applyLanguage(currentLang);
    
    // عرض جميع المنتجات عند البدء
    renderProducts('all');
    
    // ربط زر السلة
    document.getElementById('cartBtn').addEventListener('click', () => {
      document.getElementById('cartModal').style.display = 'block';
      updateCartUI();
    });
    
    // إغلاق النافذة
    document.getElementById('closeCart').addEventListener('click', () => {
      document.getElementById('cartModal').style.display = 'none';
    });
    
    // طلب عبر الواتساب
    document.getElementById('whatsappOrderBtn').addEventListener('click', sendOrderViaWhatsApp);
    
    // بحث مباشر
    document.getElementById('searchInput').addEventListener('input', () => {
      renderProducts(currentCategory);
    });
    
    // ربط أقسام التنقل (شريط التنقل + شبكة الأقسام)
    document.querySelectorAll('[data-category]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = el.dataset.category;
        if (cat) {
          renderProducts(cat);
          // التمرير إلى قسم المنتجات
          document.querySelector('.featured-products').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
    
    // تحديث السلة عند البدء
    updateCartUI();
  
    // ربط زر تغيير اللغة
    document.getElementById('langToggle').addEventListener('click', toggleLanguage);
  });
  
  // إغلاق النافذة عند النقر خارجها
  window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
// =============================================================================
// قائمة جميع المنتجات - Meila Maher Store
// الإصدار: 100 منتج (20 لكل قسم) — قابل للتوسيع إلى 200 تلقائيًا
// =============================================================================

const allProducts = [
    // === العبايات (20 منتجًا) — بما فيها البشت، الكريب، الشيفون ===
    { id:1, name:{ ar:"عباية سادة سوداء", en:"Plain Black Abaya" }, price:650, category:"abayas", image:"assets/images/abaya1.jpg", desc:{ ar:"تصميم كلاسيكي أنيق", en:"Classic elegant design" } },
    { id:2, name:{ ar:"عباية بقصة فراشة", en:"Butterfly-Cut Abaya" }, price:780, category:"abayas", image:"assets/images/abaya2.jpg", desc:{ ar:"قصة واسعة تناسب جميع الأحجام", en:"Loose fit for all sizes" } },
    { id:3, name:{ ar:"عباية بكشكشات جانبية", en:"Ruffled Side Abaya" }, price:820, category:"abayas", image:"assets/images/abaya3.jpg", desc:{ ar:"لمسة أنثوية عصرية", en:"Modern feminine touch" } },
    { id:4, name:{ ar:"عباية شتوية مبطنة", en:"Winter Padded Abaya" }, price:950, category:"abayas", image:"assets/images/abaya4.jpg", desc:{ ar:"دافئة ومريحة للشتاء", en:"Warm and cozy for winter" } },
    { id:5, name:{ ar:"عباية بفتحة أمامية", en:"Front-Slit Abaya" }, price:720, category:"abayas", image:"assets/images/abaya5.jpg", desc:{ ar:"تصميم عملي وأنيق", en:"Practical yet stylish" } },
    { id:6, name:{ ar:"عباية بأكمام واسعة", en:"Wide-Sleeve Abaya" }, price:700, category:"abayas", image:"assets/images/abaya6.jpg", desc:{ ar:"راحة وحرية في الحركة", en:"Comfort and freedom of movement" } },
    { id:7, name:{ ar:"عباية بتطريز خفيف", en:"Lightly Embroidered Abaya" }, price:890, category:"abayas", image:"assets/images/abaya7.jpg", desc:{ ar:"تفاصيل دقيقة على الصدر", en:"Delicate chest embroidery" } },
    { id:8, name:{ ar:"عباية بدون أزرار", en:"Buttonless Abaya" }, price:600, category:"abayas", image:"assets/images/abaya8.jpg", desc:{ ar:"بساطة وجمال", en:"Simplicity and beauty" } },
    { id:9, name:{ ar:"عباية طويلة بذيل", en:"Long-Tail Abaya" }, price:920, category:"abayas", image:"assets/images/abaya9.jpg", desc:{ ar:"للمناسبات الخاصة", en:"For special occasions" } },
    { id:10, name:{ ar:"عباية بحزام خصر", en:"Belted Waist Abaya" }, price:850, category:"abayas", image:"assets/images/abaya10.jpg", desc:{ ar:"لإظهار القوام بلطف", en:"Gently accentuates your figure" } },
    { id:111, name:{ ar:"بشت نسائي فاخر", en:"Premium Women's Bisht" }, price:1200, category:"abayas", image:"assets/images/abaya11.jpg", desc:{ ar:"مصنوع يدويًا بخيوط ذهبية", en:"Handcrafted with golden threads" } },
    { id:112, name:{ ar:"بشت قطني خفيف", en:"Light Cotton Bisht" }, price:850, category:"abayas", image:"assets/images/abaya12.jpg", desc:{ ar:"مناسب للمناسبات اليومية", en:"Perfect for daily occasions" } },
    { id:113, name:{ ar:"بشت شتوي مبطّن", en:"Padded Winter Bisht" }, price:1400, category:"abayas", image:"assets/images/abaya13.jpg", desc:{ ar:"دافئ وأنيق للشتاء", en:"Warm and elegant for winter" } },
    { id:114, name:{ ar:"عباية كريب ملكي", en:"Royal Crepe Abaya" }, price:950, category:"abayas", image:"assets/images/abaya14.jpg", desc:{ ar:"نسيج ثقيل وفاخر", en:"Heavy and luxurious fabric" } },
    { id:115, name:{ ar:"كريب ملكي بقصة A", en:"A-Line Royal Crepe Abaya" }, price:1050, category:"abayas", image:"assets/images/abaya15.jpg", desc:{ ar:"تصميم يناسب جميع الأحجام", en:"Flattering A-line cut for all sizes" } },
    { id:116, name:{ ar:"عباية كريب بدون أكمام", en:"Sleeveless Royal Crepe Abaya" }, price:880, category:"abayas", image:"assets/images/abaya16.jpg", desc:{ ar:"للأناقة العصرية", en:"For modern elegance" } },
    { id:117, name:{ ar:"شيفون مطرز يدويًا", en:"Hand-Embroidered Chiffon Abaya" }, price:1100, category:"abayas", image:"assets/images/abaya17.jpg", desc:{ ar:"تطريز دقيق على طول الأطراف", en:"Delicate embroidery along the edges" } },
    { id:118, name:{ ar:"شيفون مطرز بلون ذهبي", en:"Gold-Embroidered Chiffon Abaya" }, price:1250, category:"abayas", image:"assets/images/abaya18.jpg", desc:{ ar:"لمحبي الفخامة والتألق", en:"For those who love luxury and sparkle" } },
    { id:119, name:{ ar:"عباية شيفون مطرزة بحبات", en:"Beaded Chiffon Abaya" }, price:1350, category:"abayas", image:"assets/images/abaya19.jpg", desc:{ ar:"مزيّنة بحبات كريستال", en:"Adorned with crystal beads" } },
    { id:120, name:{ ar:"شيفون مطرز بفتحة ظهر", en:"Back-Slit Embroidered Chiffon Abaya" }, price:980, category:"abayas", image:"assets/images/abaya20.jpg", desc:{ ar:"لمسة جريئة مع الحفاظ على الاحتشام", en:"Bold yet modest back slit design" } },
  
    // === الطرح (20 منتجًا) ===
    { id:201, name:{ ar:"طرحة شيفون سادة", en:"Plain Chiffon Hijab" }, price:120, category:"hijabs", image:"assets/images/hijab1.jpg", desc:{ ar:"خفيفة وتناسب كل الأيام", en:"Lightweight for everyday wear" } },
    { id:202, name:{ ar:"طرحة حرير مطرزة", en:"Embroidered Silk Hijab" }, price:250, category:"hijabs", image:"assets/images/hijab2.jpg", desc:{ ar:"فخامة لا تُضاهى", en:"Unmatched luxury" } },
    { id:203, name:{ ar:"طرحة قطن مطبوعة", en:"Printed Cotton Hijab" }, price:90, category:"hijabs", image:"assets/images/hijab3.jpg", desc:{ ar:"ألوان زاهية ومرحة", en:"Vibrant and cheerful colors" } },
    { id:204, name:{ ar:"طرحة شتوية سميكة", en:"Thick Winter Hijab" }, price:180, category:"hijabs", image:"assets/images/hijab4.jpg", desc:{ ar:"تدفئة مثالية", en:"Perfect warmth" } },
    { id:205, name:{ ar:"طرحة مربعة كبيرة", en:"Large Square Hijab" }, price:150, category:"hijabs", image:"assets/images/hijab5.jpg", desc:{ ar:"متعددة الاستخدامات", en:"Versatile styling" } },
    { id:206, name:{ ar:"طرحة شيفون لامعة", en:"Shiny Chiffon Hijab" }, price:140, category:"hijabs", image:"assets/images/hijab6.jpg", desc:{ ar:"تلمع تحت الضوء", en:"Shimmers under light" } },
    { id:207, name:{ ar:"طرحة ملونة بألوان باستيل", en:"Pastel Color Hijab" }, price:130, category:"hijabs", image:"assets/images/hijab7.jpg", desc:{ ar:"أنوثة رقيقة", en:"Soft femininity" } },
    { id:208, name:{ ar:"طرحة مضادة للتجعد", en:"Wrinkle-Resistant Hijab" }, price:160, category:"hijabs", image:"assets/images/hijab8.jpg", desc:{ ar:"تبقى ناعمة طوال اليوم", en:"Stays smooth all day" } },
    { id:209, name:{ ar:"طرحة بشرابة ذهبية", en:"Gold-Tasseled Hijab" }, price:200, category:"hijabs", image:"assets/images/hijab9.jpg", desc:{ ar:"لمسة ذهبية أنيقة", en:"Elegant golden tassel" } },
    { id:210, name:{ ar:"طرحة ساتان فاخرة", en:"Luxury Satin Hijab" }, price:220, category:"hijabs", image:"assets/images/hijab10.jpg", desc:{ ar:"بريق طبيعي ونعومة فائقة", en:"Natural sheen and ultra-soft feel" } },
    { id:211, name:{ ar:"طرحة قطنية يومية", en:"Daily Cotton Hijab" }, price:85, category:"hijabs", image:"assets/images/hijab11.jpg", desc:{ ar:"مريحة للارتداء اليومي", en:"Comfortable for daily wear" } },
    { id:212, name:{ ar:"طرحة شيفون مزينة", en:"Decorated Chiffon Hijab" }, price:135, category:"hijabs", image:"assets/images/hijab12.jpg", desc:{ ar:"تفاصيل جميلة على الحواف", en:"Beautiful edge details" } },
    { id:213, name:{ ar:"طرحة ساتان بلون بيج", en:"Beige Satin Hijab" }, price:210, category:"hijabs", image:"assets/images/hijab13.jpg", desc:{ ar:"لون هادئ وأنيق", en:"Calm and elegant color" } },
    { id:214, name:{ ar:"طرحة قطنية مضادة للعرق", en:"Anti-Sweat Cotton Hijab" }, price:95, category:"hijabs", image:"assets/images/hijab14.jpg", desc:{ ar:"مناسبة للطقس الحار", en:"Ideal for hot weather" } },
    { id:215, name:{ ar:"طرحة شيفون بطول كبير", en:"Extra-Long Chiffon Hijab" }, price:125, category:"hijabs", image:"assets/images/hijab15.jpg", desc:{ ar:"للحجاب الكامل", en:"For full coverage" } },
    { id:216, name:{ ar:"طرحة مخملية شتوية", en:"Velvet Winter Hijab" }, price:190, category:"hijabs", image:"assets/images/hijab16.jpg", desc:{ ar:"دفء ونعومة", en:"Warmth and softness" } },
    { id:217, name:{ ar:"طرحة مطبوعة بنقوش عربية", en:"Arabic-Pattern Hijab" }, price:110, category:"hijabs", image:"assets/images/hijab17.jpg", desc:{ ar:"إطلالة تراثية", en:"Traditional look" } },
    { id:218, name:{ ar:"طرحة سادة بلون كحلي", en:"Navy Blue Plain Hijab" }, price:100, category:"hijabs", image:"assets/images/hijab18.jpg", desc:{ ar:"لون كلاسيكي يناسب الجميع", en:"Classic color for everyone" } },
    { id:219, name:{ ar:"طرحة شيفون مزركشة", en:"Lace-Trimmed Chiffon Hijab" }, price:145, category:"hijabs", image:"assets/images/hijab19.jpg", desc:{ ar:"لمسة رومانسية", en:"Romantic touch" } },
    { id:220, name:{ ar:"طرحة قطنية بجيوب", en:"Pocket Cotton Hijab" }, price:105, category:"hijabs", image:"assets/images/hijab20.jpg", desc:{ ar:"عملية للنساء المشغولات", en:"Practical for busy women" } },
  
    // === النقاب (20 منتجًا) ===
    { id:301, name:{ ar:"نقاب قطني أسود", en:"Black Cotton Niqab" }, price:100, category:"niqabs", image:"assets/images/niqab1.jpg", desc:{ ar:"بسيط ومريح", en:"Simple and comfortable" } },
    { id:302, name:{ ar:"نقاب شيفون خفيف", en:"Light Chiffon Niqab" }, price:130, category:"niqabs", image:"assets/images/niqab2.jpg", desc:{ ar:"شفاف بلطف", en:"Gently sheer" } },
    { id:303, name:{ ar:"نقاب بفتحة عينين مزينة", en:"Decorated Eye-Opening Niqab" }, price:150, category:"niqabs", image:"assets/images/niqab3.jpg", desc:{ ar:"تفاصيل جميلة حول العينين", en:"Beautiful details around the eyes" } },
    { id:304, name:{ ar:"نقاب شتوي سميك", en:"Thick Winter Niqab" }, price:180, category:"niqabs", image:"assets/images/niqab4.jpg", desc:{ ar:"حماية من البرد", en:"Protection from cold" } },
    { id:305, name:{ ar:"نقاب ساتان لامع", en:"Shiny Satin Niqab" }, price:160, category:"niqabs", image:"assets/images/niqab5.jpg", desc:{ ar:"أناقة ملفتة", en:"Eye-catching elegance" } },
    { id:306, name:{ ar:"نقاب بقصة مدببة", en:"Pointed-Cut Niqab" }, price:140, category:"niqabs", image:"assets/images/niqab6.jpg", desc:{ ar:"تصميم عصري", en:"Modern design" } },
    { id:307, name:{ ar:"نقاب مضاد للتمدد", en:"Stretch-Resistant Niqab" }, price:120, category:"niqabs", image:"assets/images/niqab7.jpg", desc:{ ar:"يحافظ على شكله", en:"Keeps its shape" } },
    { id:308, name:{ ar:"نقاب بتطريز جانبي", en:"Side-Embroidered Niqab" }, price:170, category:"niqabs", image:"assets/images/niqab8.jpg", desc:{ ar:"لمسة فنية رقيقة", en:"Delicate artistic touch" } },
    { id:309, name:{ ar:"نقاب قطني مطبوع", en:"Printed Cotton Niqab" }, price:110, category:"niqabs", image:"assets/images/niqab9.jpg", desc:{ ar:"لمن تحب التنويع", en:"For those who love variety" } },
    { id:310, name:{ ar:"نقاب سادة بخياطة دقيقة", en:"Plain Niqab with Fine Stitching" }, price:90, category:"niqabs", image:"assets/images/niqab10.jpg", desc:{ ar:"جودة عالية في الخياطة", en:"High-quality stitching" } },
    { id:311, name:{ ar:"نقاب شيفون بلون بني", en:"Brown Chiffon Niqab" }, price:125, category:"niqabs", image:"assets/images/niqab11.jpg", desc:{ ar:"لون طبيعي وأنيق", en:"Natural and elegant color" } },
    { id:312, name:{ ar:"نقاب قطني مضاد للحساسية", en:"Hypoallergenic Cotton Niqab" }, price:105, category:"niqabs", image:"assets/images/niqab12.jpg", desc:{ ar:"آمن للبشرة الحساسة", en:"Safe for sensitive skin" } },
    { id:313, name:{ ar:"نقاب ساتان بلون بورجوندي", en:"Burgundy Satin Niqab" }, price:155, category:"niqabs", image:"assets/images/niqab13.jpg", desc:{ ar:"فخامة في اللون الداكن", en:"Luxury in dark tones" } },
    { id:314, name:{ ar:"نقاب شتوي ببطانة داخلية", en:"Winter Niqab with Inner Lining" }, price:185, category:"niqabs", image:"assets/images/niqab14.jpg", desc:{ ar:"دفء إضافي", en:"Extra warmth" } },
    { id:315, name:{ ar:"نقاب بفتحة عينين مرنة", en:"Flexible Eye-Opening Niqab" }, price:135, category:"niqabs", image:"assets/images/niqab15.jpg", desc:{ ar:"يتكيف مع شكل الوجه", en:"Adapts to face shape" } },
    { id:316, name:{ ar:"نقاب قطني بلون رمادي", en:"Gray Cotton Niqab" }, price:95, category:"niqabs", image:"assets/images/niqab16.jpg", desc:{ ar:"لون عصري وهادئ", en:"Modern and calm color" } },
    { id:317, name:{ ar:"نقاب شيفون مطرز", en:"Embroidered Chiffon Niqab" }, price:165, category:"niqabs", image:"assets/images/niqab17.jpg", desc:{ ar:"تفاصيل فاخرة", en:"Luxurious details" } },
    { id:318, name:{ ar:"نقاب ساتان بلون كحلي", en:"Navy Satin Niqab" }, price:160, category:"niqabs", image:"assets/images/niqab18.jpg", desc:{ ar:"يناسب جميع الأذواق", en:"Suits all tastes" } },
    { id:319, name:{ ar:"نقاب قطني بخياطة مسطحة", en:"Flat-Seam Cotton Niqab" }, price:100, category:"niqabs", image:"assets/images/niqab19.jpg", desc:{ ar:"لا يسبب حكة", en:"Doesn’t cause itching" } },
    { id:320, name:{ ar:"نقاب شتوي مضاد للتعرق", en:"Anti-Sweat Winter Niqab" }, price:175, category:"niqabs", image:"assets/images/niqab20.jpg", desc:{ ar:"راحة حتى في الطقس البارد", en:"Comfort even in cold weather" } },
  
    // === أطفال (20 منتجًا) ===
    { id:401, name:{ ar:"عباية طفلة وردية", en:"Pink Kids Abaya" }, price:300, category:"kids", image:"assets/images/kid1.jpg", desc:{ ar:"للفتيات من عمر 2-6 سنوات", en:"For girls aged 2-6" } },
    { id:402, name:{ ar:"طرحة طفلة ملونة", en:"Colorful Kids Hijab" }, price:60, category:"kids", image:"assets/images/kid2.jpg", desc:{ ar:"مرحة وآمنة", en:"Fun and safe" } },
    { id:403, name:{ ar:"عباية طفلة بتطريز قلوب", en:"Heart-Embroidered Kids Abaya" }, price:350, category:"kids", image:"assets/images/kid3.jpg", desc:{ ar:"تفاصيل لطيفة", en:"Cute details" } },
    { id:404, name:{ ar:"عباية طفلة بقصة فستان", en:"Dress-Style Kids Abaya" }, price:320, category:"kids", image:"assets/images/kid4.jpg", desc:{ ar:"جميلة كالملكة الصغيرة", en:"Beautiful like a little queen" } },
    { id:405, name:{ ar:"طرحة طفلة بفيونكة", en:"Bow Kids Hijab" }, price:70, category:"kids", image:"assets/images/kid5.jpg", desc:{ ar:"فيونكة جذابة", en:"Attractive bow" } },
    { id:406, name:{ ar:"عباية طفلة بيضاء", en:"White Kids Abaya" }, price:280, category:"kids", image:"assets/images/kid6.jpg", desc:{ ar:"للمناسبات الخاصة", en:"For special occasions" } },
    { id:407, name:{ ar:"عباية طفلة بجيوب", en:"Kids Abaya with Pockets" }, price:310, category:"kids", image:"assets/images/kid7.jpg", desc:{ ar:"عملية ومريحة", en:"Practical and comfy" } },
    { id:408, name:{ ar:"طرحة طفلة بنقوش زهور", en:"Floral Print Kids Hijab" }, price:65, category:"kids", image:"assets/images/kid8.jpg", desc:{ ar:"أنوثة منذ الصغر", en:"Femininity from an early age" } },
    { id:409, name:{ ar:"عباية طفلة سماوية", en:"Sky-Blue Kids Abaya" }, price:290, category:"kids", image:"assets/images/kid9.jpg", desc:{ ar:"لون هادئ وجميل", en:"Calm and beautiful color" } },
    { id:410, name:{ ar:"عباية طفلة بطول الركبة", en:"Knee-Length Kids Abaya" }, price:270, category:"kids", image:"assets/images/kid10.jpg", desc:{ ar:"مناسبة للعب والمدرسة", en:"Perfect for play and school" } },
    { id:411, name:{ ar:"عباية طفلة برسوم كرتونية", en:"Cartoon-Print Kids Abaya" }, price:330, category:"kids", image:"assets/images/kid11.jpg", desc:{ ar:"تفرح الصغيرات", en:"Makes little girls happy" } },
    { id:412, name:{ ar:"طرحة طفلة بلون أصفر", en:"Yellow Kids Hijab" }, price:55, category:"kids", image:"assets/images/kid12.jpg", desc:{ ar:"لون مشرق وسعيد", en:"Bright and happy color" } },
    { id:413, name:{ ar:"عباية طفلة بقصة أميرات", en:"Princess-Cut Kids Abaya" }, price:360, category:"kids", image:"assets/images/kid13.jpg", desc:{ ar:"لتحقيق حلم كل طفلة", en:"To fulfill every girl’s dream" } },
    { id:414, name:{ ar:"طرحة طفلة مضادة للتمزق", en:"Tear-Resistant Kids Hijab" }, price:60, category:"kids", image:"assets/images/kid14.jpg", desc:{ ar:"تتحمل اللعب والحركة", en:"Withstands play and movement" } },
    { id:415, name:{ ar:"عباية طفلة بلون أخضر", en:"Green Kids Abaya" }, price:285, category:"kids", image:"assets/images/kid15.jpg", desc:{ ar:"لون طبيعي ومنعش", en:"Natural and refreshing color" } },
    { id:416, name:{ ar:"عباية طفلة بخامة قطنية", en:"Cotton Kids Abaya" }, price:275, category:"kids", image:"assets/images/kid16.jpg", desc:{ ar:"نعومة على بشرة الطفل", en:"Soft on baby skin" } },
    { id:417, name:{ ar:"طرحة طفلة برسوم زهور", en:"Flower-Detailed Kids Hijab" }, price:62, category:"kids", image:"assets/images/kid17.jpg", desc:{ ar:"تفاصيل جميلة", en:"Beautiful details" } },
    { id:418, name:{ ar:"عباية طفلة بفتحة أمامية", en:"Front-Open Kids Abaya" }, price:295, category:"kids", image:"assets/images/kid18.jpg", desc:{ ar:"سهلة الارتداء", en:"Easy to wear" } },
    { id:419, name:{ ar:"طرحة طفلة بلون بنفسجي", en:"Purple Kids Hijab" }, price:58, category:"kids", image:"assets/images/kid19.jpg", desc:{ ar:"لون مفضل لدى الفتيات", en:"Favorite color among girls" } },
    { id:420, name:{ ar:"عباية طفلة بطول متوسط", en:"Mid-Length Kids Abaya" }, price:265, category:"kids", image:"assets/images/kid20.jpg", desc:{ ar:"مريحة للركض واللعب", en:"Comfortable for running and playing" } },
  
    // === كبار السن (20 منتجًا) ===
    { id:501, name:{ ar:"عباية كبار بقصة فضفاضة", en:"Loose Senior Abaya" }, price:700, category:"seniors", image:"assets/images/senior1.jpg", desc:{ ar:"راحة قصوى لكبار السن", en:"Maximum comfort for seniors" } },
    { id:502, name:{ ar:"عباية كبار بفتحة سهلة", en:"Easy-Open Senior Abaya" }, price:680, category:"seniors", image:"assets/images/senior2.jpg", desc:{ ar:"تصميم يسهل ارتداؤه", en:"Easy-to-wear design" } },
    { id:503, name:{ ar:"عباية كبار من قماش ناعم", en:"Soft Fabric Senior Abaya" }, price:720, category:"seniors", image:"assets/images/senior3.jpg", desc:{ ar:"نعومة على البشرة الحساسة", en:"Gentle on sensitive skin" } },
    { id:504, name:{ ar:"عباية كبار بأكمام طويلة", en:"Long-Sleeve Senior Abaya" }, price:650, category:"seniors", image:"assets/images/senior4.jpg", desc:{ ar:"حماية من الشمس والبرد", en:"Protection from sun and cold" } },
    { id:505, name:{ ar:"عباية كبار سادة", en:"Plain Senior Abaya" }, price:600, category:"seniors", image:"assets/images/senior5.jpg", desc:{ ar:"بساطة وكرامة", en:"Simplicity and dignity" } },
    { id:506, name:{ ar:"عباية كبار بخامة خفيفة", en:"Lightweight Senior Abaya" }, price:630, category:"seniors", image:"assets/images/senior6.jpg", desc:{ ar:"لا تسبب إرهاقًا", en:"Doesn’t cause fatigue" } },
    { id:507, name:{ ar:"عباية كبار بجيب داخلي", en:"Senior Abaya with Inner Pocket" }, price:690, category:"seniors", image:"assets/images/senior7.jpg", desc:{ ar:"لحفظ الأشياء الصغيرة", en:"For small essentials" } },
    { id:508, name:{ ar:"عباية كبار بخياطة مريحة", en:"Comfort-Stitched Senior Abaya" }, price:660, category:"seniors", image:"assets/images/senior8.jpg", desc:{ ar:"خياطة لا تضغط على الجسم", en:"Non-restrictive stitching" } },
    { id:509, name:{ ar:"عباية كبار بلون بيج", en:"Beige Senior Abaya" }, price:640, category:"seniors", image:"assets/images/senior9.jpg", desc:{ ar:"لون كلاسيكي أنيق", en:"Classic elegant color" } },
    { id:510, name:{ ar:"عباية كبار بطول الأرض", en:"Floor-Length Senior Abaya" }, price:750, category:"seniors", image:"assets/images/senior10.jpg", desc:{ ar:"وقار واحتشام", en:"Grace and modesty" } },
    { id:511, name:{ ar:"عباية كبار مضادة للتجعد", en:"Wrinkle-Resistant Senior Abaya" }, price:670, category:"seniors", image:"assets/images/senior11.jpg", desc:{ ar:"تبقى أنيقة طوال اليوم", en:"Stays elegant all day" } },
    { id:512, name:{ ar:"عباية كبار بفتحة أمامية مغناطيسية", en:"Magnetic-Front Senior Abaya" }, price:710, category:"seniors", image:"assets/images/senior12.jpg", desc:{ ar:"سهلة الفتح والإغلاق", en:"Easy to open and close" } },
    { id:513, name:{ ar:"عباية كبار من قماش مرن", en:"Stretch Fabric Senior Abaya" }, price:690, category:"seniors", image:"assets/images/senior13.jpg", desc:{ ar:"حرية في الحركة", en:"Freedom of movement" } },
    { id:514, name:{ ar:"عباية كبار بلون رمادي فاتح", en:"Light Gray Senior Abaya" }, price:620, category:"seniors", image:"assets/images/senior14.jpg", desc:{ ar:"لون عملي وأنيق", en:"Practical and elegant color" } },
    { id:515, name:{ ar:"عباية كبار بخامة مضادة للحساسية", en:"Hypoallergenic Senior Abaya" }, price:730, category:"senipients", image:"assets/images/senior15.jpg", desc:{ ar:"آمنة للبشرة الحساسة", en:"Safe for sensitive skin" } },
    { id:516, name:{ ar:"عباية كبار بتصميم كلاسيكي", en:"Classic Senior Abaya" }, price:610, category:"seniors", image:"assets/images/senior16.jpg", desc:{ ar:"للمحجبات التقليديات", en:"For traditional hijabis" } },
    { id:517, name:{ ar:"عباية كبار بخامة قطنية نقية", en:"Pure Cotton Senior Abaya" }, price:650, category:"seniors", image:"assets/images/senior17.jpg", desc:{ ar:"تهوية ممتازة", en:"Excellent breathability" } },
    { id:518, name:{ ar:"عباية كبار بطول متوسط", en:"Mid-Length Senior Abaya" }, price:600, category:"seniors", image:"assets/images/senior18.jpg", desc:{ ar:"مريحة للجلوس والمشي", en:"Comfortable for sitting and walking" } },
    { id:519, name:{ ar:"عباية كبار بلون بني داكن", en:"Dark Brown Senior Abaya" }, price:630, category:"seniors", image:"assets/images/senior19.jpg", desc:{ ar:"لون يناسب كل الأعمار", en:"Color suitable for all ages" } },
    { id:520, name:{ ar:"عباية كبار بخامة شتوية", en:"Winter Fabric Senior Abaya" }, price:760, category:"seniors", image:"assets/images/senior20.jpg", desc:{ ar:"دافئة في أيام الشتاء الباردة", en:"Warm on cold winter days" } }
  ];