// === تخزين المستخدمين والمنتجات محليًا (لأغراض العرض – في الإنتاج استخدم backend آمن ===
const SUPERVISOR_USERNAME = "admin";
const SUPERVISOR_PASSWORD_HASH = btoa("secureAdminPass123"); // مثال للتشفير البسيط

let users = JSON.parse(localStorage.getItem('users')) || [];
let products = JSON.parse(localStorage.getItem('products')) || [];
let currentUser = null;

// === وظائف التسجيل والدخول ===
function showRegister() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('registerSection').style.display = 'block';
}

function showLogin() {
  document.getElementById('registerSection').style.display = 'none';
  document.getElementById('loginSection').style.display = 'block';
}

function registerUser() {
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value;
  if (!username || !password) return alert("يرجى ملء جميع الحقول");

  const exists = users.some(u => u.username === username);
  if (exists) return alert("اسم المستخدم مستخدم بالفعل!");

  // تخزين كلمة المرور مشفرة (Base64 ليس آمنًا حقًا – لكنه يكفي للعميل)
  users.push({ username, passwordHash: btoa(password), role: 'customer' });
  localStorage.setItem('users', JSON.stringify(users));
  alert("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.");
  showLogin();
}

function login() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!username || !password) return alert("يرجى إدخال اسم المستخدم وكلمة المرور");

  if (username === SUPERVISOR_USERNAME && btoa(password) === SUPERVISOR_PASSWORD_HASH) {
    currentUser = { username, role: 'supervisor' };
    showAdminPanel();
  } else {
    const user = users.find(u => u.username === username && u.passwordHash === btoa(password));
    if (user) {
      currentUser = user;
      // العملاء لا يحصلون على لوحة تحكم – يتم تحويلهم لموقع العميل
      window.location.href = "https://meid2.github.io/MENT-MEILA---MAHER/";
    } else {
      alert("بيانات الدخول غير صحيحة");
    }
  }
}

function logout() {
  currentUser = null;
  document.getElementById('adminPanel').style.display = 'none';
  showLogin();
}

// === لوحة التحكم للمشرف ===
function showAdminPanel() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  renderProducts();
}

function saveProduct() {
  const name = document.getElementById('productName').value.trim();
  const category = document.getElementById('productCategory').value;
  const price = parseFloat(document.getElementById('productPrice').value);
  const fileInput = document.getElementById('productImage');
  
  if (!name || isNaN(price) || price <= 0) return alert("يرجى ملء البيانات بشكل صحيح");

  let imageUrl = null;
  if (fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const newProduct = {
        id: Date.now(),
        name,
        category,
        price,
        image: e.target.result
      };
      products.push(newProduct);
      saveData();
      renderProducts();
      resetForm();
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    const newProduct = { id: Date.now(), name, category, price, image: null };
    products.push(newProduct);
    saveData();
    renderProducts();
    resetForm();
  }
}

function renderProducts() {
  const container = document.getElementById('productsList');
  container.innerHTML = products.length ? '' : '<p>لا توجد منتجات.</p>';
  
  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product-item';
    div.innerHTML = `
      <div>
        <strong>${p.name}</strong> | ${p.category} | ${p.price} ريال
        ${p.image ? `<img src="${p.image}" width="50" style="margin-right:10px; border-radius:4px;">` : ''}
      </div>
      <div>
        <button onclick="editProduct(${p.id})">تعديل</button>
        <button onclick="deleteProduct(${p.id})">حذف</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function deleteProduct(id) {
  if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
    products = products.filter(p => p.id !== id);
    saveData();
    renderProducts();
  }
}

function editProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  document.getElementById('productName').value = p.name;
  document.getElementById('productCategory').value = p.category;
  document.getElementById('productPrice').value = p.price;
  // ملاحظة: تعديل الصورة يتطلب إعادة الرفع
  // يمكنك توسيع هذه الميزة لاحقًا
  // هنا نقوم بحذف المنتج القديم مؤقتًا
  products = products.filter(x => x.id !== id);
  saveData();
  renderProducts();
}

function resetForm() {
  document.getElementById('productForm').reset();
}

function saveData() {
  localStorage.setItem('products', JSON.stringify(products));
}

// === عند التحميل ===
document.addEventListener('DOMContentLoaded', () => {
  // إذا كان هناك جلسة سابقة للمشرف (يمكنك توسيعها لاستخدام JWT لاحقًا)
  // حالياً نعيد تسجيل الدخول كل مرة لأسباب أمان على العميل
});
