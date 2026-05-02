# POS Multi-Tenant Application - API Specification & Feature Breakdown

## 🔌 API Endpoints Structure

### **Base URL:** `http://localhost:5000/api`

### **Authentication Endpoints**
```
POST   /auth/register          - Register user
POST   /auth/login             - Login user
POST   /auth/refresh-token     - Refresh JWT token
POST   /auth/logout            - Logout user
POST   /auth/forgot-password   - Request password reset
POST   /auth/reset-password    - Reset password with token
GET    /auth/me                - Get current user
```

### **Tenant Endpoints** (Admin only)
```
POST   /tenants                - Create new tenant
GET    /tenants                - Get all tenants (superadmin)
GET    /tenants/:id            - Get tenant details
PUT    /tenants/:id            - Update tenant
DELETE /tenants/:id            - Delete tenant
POST   /tenants/:id/members    - Add member to tenant
```

### **Users Endpoints** (RBAC)
```
GET    /users                  - Get all users in tenant
GET    /users/:id              - Get user details
POST   /users                  - Create new user
PUT    /users/:id              - Update user
DELETE /users/:id              - Delete user
PUT    /users/:id/password     - Change user password
GET    /users/:id/roles        - Get user roles
POST   /users/:id/roles        - Assign role to user
```

### **Roles & Permissions Endpoints** (Admin)
```
GET    /roles                  - Get all roles
GET    /roles/:id              - Get role details
POST   /roles                  - Create new role
PUT    /roles/:id              - Update role
DELETE /roles/:id              - Delete role
GET    /roles/:id/permissions  - Get role permissions
```

### **Products Endpoints**
```
GET    /products               - Get all products (with pagination)
GET    /products/:id           - Get product details
POST   /products               - Create product
PUT    /products/:id           - Update product
DELETE /products/:id           - Delete product (soft delete)
POST   /products/:id/upload    - Upload product image
GET    /products/search?q=term - Search products
GET    /products/by-category/:catId - Get products by category
```

### **Product Categories Endpoints**
```
GET    /categories             - Get all categories (tree structure)
GET    /categories/:id         - Get category details
POST   /categories             - Create category
PUT    /categories/:id         - Update category
DELETE /categories/:id         - Delete category
```

### **Stock Management Endpoints**
```
GET    /stocks                 - Get current stock levels
GET    /stocks/:id             - Get stock details
PUT    /stocks/:id             - Adjust stock
POST   /stocks/movement        - Record stock movement (in/out)
GET    /stocks/movements       - Get stock movement history
POST   /stocks/adjustment      - Create stock adjustment
GET    /stocks/low-level       - Get products below reorder level
GET    /stocks/warehouse/:warehouseId - Get stocks by warehouse
```

### **Warehouse Endpoints**
```
GET    /warehouses             - Get all warehouses
GET    /warehouses/:id         - Get warehouse details
POST   /warehouses             - Create warehouse
PUT    /warehouses/:id         - Update warehouse
DELETE /warehouses/:id         - Delete warehouse
```

### **Recipes Endpoints**
```
GET    /recipes                - Get all recipes
GET    /recipes/:id            - Get recipe details
POST   /recipes                - Create recipe
PUT    /recipes/:id            - Update recipe
DELETE /recipes/:id            - Delete recipe
POST   /recipes/:id/ingredients - Add ingredient to recipe
PUT    /recipes/:id/ingredients/:ingredientId - Update ingredient
DELETE /recipes/:id/ingredients/:ingredientId - Remove ingredient
```

### **Transactions (Cashier) Endpoints**
```
GET    /transactions           - Get all transactions (with pagination)
GET    /transactions/:id       - Get transaction details
POST   /transactions           - Create new transaction
PUT    /transactions/:id       - Update transaction
DELETE /transactions/:id       - Cancel transaction (soft delete)
POST   /transactions/:id/items - Add items to transaction
PUT    /transactions/:id/items/:itemId - Update transaction item
DELETE /transactions/:id/items/:itemId - Remove transaction item
POST   /transactions/:id/checkout - Complete transaction
GET    /transactions/daily     - Get today's transactions
GET    /transactions/range?from=&to= - Get transactions by date range
POST   /transactions/:id/print-receipt - Print receipt
POST   /transactions/:id/send-receipt - Send receipt via email
```

### **Reports Endpoints**
```
GET    /reports/daily          - Daily sales report
GET    /reports/summary        - Sales summary by date range
GET    /reports/product-sales  - Product sales analysis
GET    /reports/inventory      - Inventory report
GET    /reports/profit-loss    - Profit & loss report
GET    /reports/top-products   - Top selling products
GET    /reports/customer-analysis - Customer spending analysis
POST   /reports/export         - Export report to Excel/PDF
```

### **Admin Management Endpoints**
```
GET    /admin/dashboard        - Admin dashboard metrics
GET    /admin/audit-logs       - Get audit logs
GET    /admin/settings         - Get system settings
PUT    /admin/settings         - Update system settings
POST   /admin/backup           - Trigger database backup
GET    /admin/system-health    - System health status
```

---

## 📊 Feature Breakdown & Requirements

### **1. CASHIER/CHECKOUT (Perkasiran)**

**Main Features:**
- Product search by name/barcode
- Quick product selection
- Item quantity adjustment
- Discount management (percent/fixed)
- Tax calculation
- Multiple payment methods (cash, card, transfer)
- Receipt printing/emailing
- Transaction history
- Return/refund management

**Technical Requirements:**
- Real-time stock checking
- Automatic receipt numbering
- Print integration
- Offline capability (mobile)
- Barcode scanning support
- Multiple language support

**Database Tables Involved:**
- transactions
- transaction_items
- products
- stocks
- users (cashier)

---

### **2. PRODUCT MANAGEMENT (Produk Manajemen)**

**Main Features:**
- Create/edit/delete products
- Product categorization
- Product image upload
- SKU management
- Barcode generation
- Pricing management
- Bulk import from CSV/Excel
- Product history/versioning

**Technical Requirements:**
- Image optimization & storage
- CSV/Excel import functionality
- Barcode generation (Code128, QR)
- Product variants support (optional)
- SEO-friendly slugs

**Database Tables Involved:**
- products
- product_categories
- audit_logs

---

### **3. STOCK MANAGEMENT (Stock Management)**

**Main Features:**
- Real-time stock levels
- Manual stock adjustment
- Stock movement tracking
- Multiple warehouse support
- Stock reorder management
- Low stock alerts
- Stock expiry tracking (optional)
- Batch/serial number support (optional)
- Stock opname (inventory count)

**Technical Requirements:**
- FIFO/LIFO costing method
- Stock history audit trail
- Batch operations
- Alert notifications
- Negative stock prevention

**Database Tables Involved:**
- stocks
- stock_movements
- warehouses
- products

---

### **4. RECIPE MANAGEMENT (Resep Manajemen)**

**Main Features:**
- Create recipes/formulations
- Ingredient management
- Cost calculation per recipe
- Recipe instructions
- Yield management
- Recipe versioning
- Production tracking
- Ingredient substitution (optional)

**Technical Requirements:**
- Ingredient quantity validation
- Automatic cost calculation
- Unit conversion support
- Recipe scaling

**Database Tables Involved:**
- recipes
- recipe_ingredients
- products
- stocks

---

### **5. ADMIN MANAGEMENT (Admin Manajemen)**

**Main Features:**
- User management (CRUD)
- Role & permission management
- Audit logging
- System settings
- Tenant management
- Backup & restore
- Data export
- User activity monitoring

**Technical Requirements:**
- RBAC (Role-Based Access Control)
- Audit trail for all actions
- Data backup scheduling
- Export to Excel/PDF
- Activity dashboard

**Database Tables Involved:**
- users
- roles/permissions
- audit_logs
- tenants

---

### **6. DETAILED REPORTS (Report Detail)**

**Main Features:**
- Sales reports (daily, weekly, monthly)
- Product sales analysis
- Inventory reports
- Profit & loss statements
- Customer analysis
- Cashier performance
- Tax reports
- Export capabilities (Excel, PDF)

**Technical Requirements:**
- Chart visualization (bar, line, pie)
- Data filtering & sorting
- Date range selection
- Comparison analysis (YoY, MoM)
- Scheduled reports via email
- Custom report builder

**Database Tables Involved:**
- transactions
- transaction_items
- products
- stocks
- daily_reports
- product_sales

---

## 🔑 Key Features by User Role

### **Cashier Role**
- [ ] Access POS/Cashier interface
- [ ] Create & complete transactions
- [ ] View transaction history
- [ ] Basic stock checking
- [ ] Print receipts
- [ ] View daily sales

### **Manager Role**
- [ ] All Cashier permissions
- [ ] Product management
- [ ] Stock management
- [ ] User management (view)
- [ ] Reports access
- [ ] Settings (limited)

### **Admin Role**
- [ ] All Manager permissions
- [ ] Complete user management
- [ ] Role management
- [ ] Audit logs
- [ ] System settings
- [ ] Backup/restore

### **Owner/SuperAdmin**
- [ ] All Admin permissions
- [ ] Tenant management
- [ ] Billing management
- [ ] System-wide settings

---

## 🔐 Permission Matrix

| Feature | Cashier | Manager | Admin | Owner |
|---------|---------|---------|-------|-------|
| POS/Checkout | ✅ | ✅ | ✅ | ✅ |
| View Products | ✅ | ✅ | ✅ | ✅ |
| Create Product | ❌ | ✅ | ✅ | ✅ |
| Edit Product | ❌ | ✅ | ✅ | ✅ |
| View Stock | ✅ | ✅ | ✅ | ✅ |
| Adjust Stock | ❌ | ✅ | ✅ | ✅ |
| View Users | ❌ | ✅ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ✅ | ✅ |
| View Reports | ❌ | ✅ | ✅ | ✅ |
| Edit Settings | ❌ | ❌ | ✅ | ✅ |
| Manage Tenants | ❌ | ❌ | ❌ | ✅ |

---

## 🔄 Real-Time Features (Socket.io)

### **Events to Implement:**
1. **stock-updated** - Stock level changed
2. **transaction-created** - New transaction completed
3. **product-updated** - Product data changed
4. **user-activity** - User action broadcast
5. **alert-notification** - Low stock/alerts
6. **recipe-updated** - Recipe changed

---

## 📱 Mobile-Specific Features

1. **Offline Mode:**
   - Local SQLite database
   - Queue transactions for sync
   - Barcode scanning
   - Receipt printing (thermal printer)

2. **Performance:**
   - Data caching
   - Image lazy loading
   - Minimal network requests

3. **Hardware Integration:**
   - Barcode scanner support
   - Thermal printer integration
   - Camera for photo/barcode

---

## 🚀 Integration Points

1. **Payment Gateway** (Optional Phase 2)
   - Midtrans, Xendit, or local banks

2. **Email Service**
   - SendGrid, SMTP for receipts

3. **Cloud Storage** (Optional)
   - AWS S3 for product images

4. **Analytics** (Optional)
   - Google Analytics, Mixpanel

