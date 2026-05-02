# POS Multi-Tenant Application - Database Schema & Architecture

## 🏢 Multi-Tenant Implementation

### **Tenant Table**
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  logo_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active' -- active, suspended, inactive
  subscription_plan VARCHAR(50) -- free, basic, premium
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 👥 Users & Authentication

### **Users Table (Multi-Tenant)**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  role VARCHAR(50) NOT NULL, -- admin, manager, cashier, staff
  status VARCHAR(50) DEFAULT 'active',
  last_login_at TIMESTAMP,
  is_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, email)
);

CREATE INDEX idx_users_tenant_id ON users(tenant_id);
```

### **User Roles & Permissions**
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]'::jsonb, -- array of permission strings
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, name)
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, role_id)
);
```

---

## 📦 Products Management

### **Products Table**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  sku VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES product_categories(id),
  price DECIMAL(15, 2) NOT NULL,
  cost_price DECIMAL(15, 2), -- harga cost untuk margin
  image_url VARCHAR(500),
  barcode VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, sku)
);

CREATE INDEX idx_products_tenant_id ON products(tenant_id);
CREATE INDEX idx_products_category_id ON products(category_id);
```

### **Product Categories**
```sql
CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES product_categories(id), -- for nested categories
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, name)
);
```

---

## 🧂 Recipe Management

### **Recipes Table**
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  yield_quantity DECIMAL(10, 2), -- jumlah produk setelah memasak
  yield_unit VARCHAR(50), -- kg, liter, piece
  instructions TEXT, -- langkah-langkah pembuatan
  estimated_cost DECIMAL(15, 2),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, product_id)
);

CREATE INDEX idx_recipes_tenant_id ON recipes(tenant_id);
```

### **Recipe Ingredients (Bahan Baku)**
```sql
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_product_id UUID NOT NULL REFERENCES products(id),
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL, -- kg, liter, piece, gram
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(recipe_id, ingredient_product_id)
);
```

---

## 📊 Stock Management

### **Stock/Inventory Table**
```sql
CREATE TABLE stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  warehouse_id UUID REFERENCES warehouses(id),
  quantity DECIMAL(15, 3) NOT NULL DEFAULT 0,
  reorder_level DECIMAL(15, 3), -- minimum stock level
  reorder_quantity DECIMAL(15, 3), -- jumlah reorder
  last_stock_check_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, product_id, warehouse_id)
);

CREATE INDEX idx_stocks_tenant_id ON stocks(tenant_id);
CREATE INDEX idx_stocks_product_id ON stocks(product_id);
```

### **Warehouses**
```sql
CREATE TABLE warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  address TEXT,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, name)
);
```

### **Stock Movements (Audit Trail)**
```sql
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  stock_id UUID NOT NULL REFERENCES stocks(id),
  product_id UUID NOT NULL REFERENCES products(id),
  warehouse_id UUID REFERENCES warehouses(id),
  type VARCHAR(50) NOT NULL, -- in, out, adjustment, return
  quantity DECIMAL(15, 3) NOT NULL,
  reference_type VARCHAR(100), -- transaction, purchase, adjustment
  reference_id VARCHAR(255),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, stock_id)
);

CREATE INDEX idx_stock_movements_tenant_id ON stock_movements(tenant_id);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at);
```

---

## 🛒 Transaction (Cashier)

### **Transactions Table**
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  transaction_number VARCHAR(100) NOT NULL,
  cashier_user_id UUID NOT NULL REFERENCES users(id),
  warehouse_id UUID REFERENCES warehouses(id),
  transaction_type VARCHAR(50) DEFAULT 'sale', -- sale, return, exchange
  subtotal DECIMAL(15, 2) NOT NULL,
  discount_amount DECIMAL(15, 2) DEFAULT 0,
  discount_percent DECIMAL(5, 2) DEFAULT 0,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  total_amount DECIMAL(15, 2) NOT NULL,
  payment_method VARCHAR(50), -- cash, card, transfer, other
  payment_status VARCHAR(50) DEFAULT 'completed', -- pending, completed, failed
  notes TEXT,
  status VARCHAR(50) DEFAULT 'completed', -- completed, cancelled, return
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, transaction_number)
);

CREATE INDEX idx_transactions_tenant_id ON transactions(tenant_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_cashier_user_id ON transactions(cashier_user_id);
```

### **Transaction Items (Detail Transaksi)**
```sql
CREATE TABLE transaction_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(15, 2) NOT NULL,
  discount_amount DECIMAL(15, 2) DEFAULT 0,
  subtotal DECIMAL(15, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transaction_items_transaction_id ON transaction_items(transaction_id);
```

---

## 📈 Reports & Analytics

### **Daily Reports (Cache)**
```sql
CREATE TABLE daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  total_transactions INT DEFAULT 0,
  total_revenue DECIMAL(15, 2) DEFAULT 0,
  total_discount DECIMAL(15, 2) DEFAULT 0,
  total_tax DECIMAL(15, 2) DEFAULT 0,
  total_items_sold INT DEFAULT 0,
  avg_transaction_value DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, report_date)
);

CREATE INDEX idx_daily_reports_tenant_id ON daily_reports(tenant_id);
```

### **Product Sales Report**
```sql
CREATE TABLE product_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  period_date DATE,
  quantity_sold DECIMAL(15, 2),
  total_revenue DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, product_id, period_date)
);
```

---

## 🔐 Audit Logs

### **Audit Logs Table**
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100), -- product, transaction, user, etc
  entity_id VARCHAR(255),
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

---

## 🗄️ Database Constraints & Indexes Summary

### **Important Constraints:**
1. All tables have `tenant_id` untuk multi-tenancy
2. Foreign key constraints dengan ON DELETE CASCADE
3. Unique constraints per tenant (bukan global)
4. Status columns untuk soft deletes atau state management

### **Performance Indexes:**
- tenant_id di semua tables (filter by tenant)
- created_at untuk time-range queries
- Foreign keys automatically indexed
- Status columns untuk filtering

---

## 🔄 Entity Relationship Diagram (ERD)

```
┌─────────────┐
│   TENANTS   │ (1)
└──────┬──────┘
       │
       │ (many)
       ├──────────────────────────────────────┐
       │                                      │
   ┌───▼────────┐  ┌──────────────┐  ┌──────┴─────┐
   │   USERS    │  │  ROLES       │  │ WAREHOUSES │
   └───┬────────┘  └──────────────┘  └───────┬────┘
       │                                      │
       │ (many)                               │ (many)
       │                                      │
   ┌───▼─────────────────┐            ┌──────┴───────┐
   │  USER_ROLES         │            │   STOCKS    │
   └─────────────────────┘            └──────┬───────┘
                                              │
                                              │ ref
        ┌──────────────────────────────────┐ │
        │                                  │ │
   ┌────▼──────────┐  ┌──────────────┐   │ │
   │   PRODUCTS    │  │  CATEGORIES  │   │ │
   └────┬──────────┘  └──────────────┘   │ │
        │ (1)                             │ │
        │                                 │ │
   ┌────▼───────────────────┐  ┌─────────┴─┘
   │   RECIPES              │  │
   └────┬───────────────────┘  │
        │                      │
        │ (1)                  │
   ┌────▼──────────────────────┘
   │   RECIPE_INGREDIENTS
   └───────────────────────────┘

   ┌─────────────────┐
   │  TRANSACTIONS   │ (1)
   └────────┬────────┘
            │
            │ (many)
            │
   ┌────────▼─────────────┐
   │ TRANSACTION_ITEMS    │
   └──────────────────────┘
            │ ref
            │
        PRODUCTS (many)

   ┌──────────────────┐
   │  STOCK_MOVEMENTS │
   └──────────────────┘

   ┌──────────────────┐
   │  DAILY_REPORTS   │
   └──────────────────┘

   ┌──────────────────┐
   │  AUDIT_LOGS      │
   └──────────────────┘
```

---

## 📝 SQL File Structure

Database akan di-manage dengan Prisma ORM dalam file:
- `prisma/schema.prisma` - Database schema definition
- `prisma/migrations/` - Database migration files

