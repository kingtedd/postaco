# POS Multi-Tenant Application - Project Structure

## 📁 Directory Structure

```
postaco/
│
├── 📄 README.md
├── 📄 .gitignore
├── 📄 .env.example
├── 📄 docker-compose.yml
├── 📄 Makefile
│
├── 📁 backend/                          # Node.js + Express API
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 .env.example
│   ├── 📄 Dockerfile
│   ├── 📄 .dockerignore
│   │
│   ├── 📁 src/
│   │   ├── 📄 index.ts                 # Entry point
│   │   ├── 📄 app.ts                   # Express app setup
│   │   ├── 📄 server.ts                # Server initialization
│   │   │
│   │   ├── 📁 config/
│   │   │   ├── 📄 database.ts          # Database connection
│   │   │   ├── 📄 redis.ts             # Redis connection
│   │   │   ├── 📄 jwt.ts               # JWT configuration
│   │   │   ├── 📄 cors.ts              # CORS settings
│   │   │   └── 📄 env.ts               # Environment variables
│   │   │
│   │   ├── 📁 middleware/
│   │   │   ├── 📄 auth.ts              # JWT authentication
│   │   │   ├── 📄 tenant.ts            # Multi-tenant extraction
│   │   │   ├── 📄 errorHandler.ts      # Global error handling
│   │   │   ├── 📄 validation.ts        # Input validation
│   │   │   ├── 📄 logger.ts            # Request logging
│   │   │   └── 📄 roleCheck.ts         # Role-based access control
│   │   │
│   │   ├── 📁 routes/
│   │   │   ├── 📄 index.ts             # Route aggregator
│   │   │   ├── 📄 auth.routes.ts       # Authentication routes
│   │   │   ├── 📄 products.routes.ts   # Product management
│   │   │   ├── 📄 stocks.routes.ts     # Stock management
│   │   │   ├── 📄 recipes.routes.ts    # Recipe management
│   │   │   ├── 📄 transactions.routes.ts # Cashier/POS
│   │   │   ├── 📄 users.routes.ts      # User management
│   │   │   ├── 📄 reports.routes.ts    # Reports & analytics
│   │   │   ├── 📄 tenants.routes.ts    # Tenant management
│   │   │   └── 📄 admin.routes.ts      # Admin operations
│   │   │
│   │   ├── 📁 controllers/
│   │   │   ├── 📄 auth.controller.ts
│   │   │   ├── 📄 products.controller.ts
│   │   │   ├── 📄 stocks.controller.ts
│   │   │   ├── 📄 recipes.controller.ts
│   │   │   ├── 📄 transactions.controller.ts
│   │   │   ├── 📄 users.controller.ts
│   │   │   ├── 📄 reports.controller.ts
│   │   │   ├── 📄 tenants.controller.ts
│   │   │   └── 📄 admin.controller.ts
│   │   │
│   │   ├── 📁 services/
│   │   │   ├── 📄 auth.service.ts
│   │   │   ├── 📄 products.service.ts
│   │   │   ├── 📄 stocks.service.ts
│   │   │   ├── 📄 recipes.service.ts
│   │   │   ├── 📄 transactions.service.ts
│   │   │   ├── 📄 transactions.helper.ts
│   │   │   ├── 📄 users.service.ts
│   │   │   ├── 📄 reports.service.ts
│   │   │   ├── 📄 tenants.service.ts
│   │   │   ├── 📄 cache.service.ts
│   │   │   └── 📄 email.service.ts
│   │   │
│   │   ├── 📁 repositories/           # Data access layer
│   │   │   ├── 📄 base.repository.ts
│   │   │   ├── 📄 products.repository.ts
│   │   │   ├── 📄 stocks.repository.ts
│   │   │   ├── 📄 transactions.repository.ts
│   │   │   ├── 📄 users.repository.ts
│   │   │   └── 📄 reports.repository.ts
│   │   │
│   │   ├── 📁 models/
│   │   │   ├── 📄 response.model.ts
│   │   │   ├── 📄 error.model.ts
│   │   │   └── 📄 pagination.model.ts
│   │   │
│   │   ├── 📁 types/
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 auth.types.ts
│   │   │   ├── 📄 product.types.ts
│   │   │   ├── 📄 transaction.types.ts
│   │   │   └── 📄 common.types.ts
│   │   │
│   │   ├── 📁 utils/
│   │   │   ├── 📄 validators.ts
│   │   │   ├── 📄 formatters.ts
│   │   │   ├── 📄 constants.ts
│   │   │   ├── 📄 helpers.ts
│   │   │   └── 📄 logger.ts
│   │   │
│   │   └── 📁 websocket/
│   │       ├── 📄 index.ts
│   │       ├── 📄 handlers.ts
│   │       └── 📄 events.ts
│   │
│   ├── 📁 prisma/
│   │   ├── 📄 schema.prisma             # Database schema
│   │   └── 📁 migrations/               # Migration files
│   │
│   ├── 📁 tests/
│   │   ├── 📄 setup.ts
│   │   ├── 📁 unit/
│   │   ├── 📁 integration/
│   │   └── 📁 fixtures/
│   │
│   └── 📁 scripts/
│       ├── 📄 seed.ts                  # Database seeding
│       └── 📄 migrate.ts               # Migration runner
│
├── 📁 web-app/                          # React Web Frontend
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 vite.config.ts
│   ├── 📄 .env.example
│   ├── 📄 Dockerfile
│   ├── 📄 nginx.conf
│   │
│   ├── 📁 src/
│   │   ├── 📄 main.tsx                 # Entry point
│   │   ├── 📄 App.tsx
│   │   ├── 📄 index.css
│   │   │
│   │   ├── 📁 api/
│   │   │   ├── 📄 client.ts            # Axios instance
│   │   │   ├── 📄 auth.api.ts
│   │   │   ├── 📄 products.api.ts
│   │   │   ├── 📄 stocks.api.ts
│   │   │   ├── 📄 recipes.api.ts
│   │   │   ├── 📄 transactions.api.ts
│   │   │   ├── 📄 users.api.ts
│   │   │   ├── 📄 reports.api.ts
│   │   │   └── 📄 tenants.api.ts
│   │   │
│   │   ├── 📁 components/
│   │   │   ├── 📁 common/
│   │   │   │   ├── 📄 Navbar.tsx
│   │   │   │   ├── 📄 Sidebar.tsx
│   │   │   │   ├── 📄 Card.tsx
│   │   │   │   ├── 📄 Button.tsx
│   │   │   │   ├── 📄 Modal.tsx
│   │   │   │   ├── 📄 Table.tsx
│   │   │   │   ├── 📄 Pagination.tsx
│   │   │   │   └── 📄 Loading.tsx
│   │   │   │
│   │   │   ├── 📁 forms/
│   │   │   │   ├── 📄 LoginForm.tsx
│   │   │   │   ├── 📄 ProductForm.tsx
│   │   │   │   ├── 📄 RecipeForm.tsx
│   │   │   │   └── 📄 UserForm.tsx
│   │   │   │
│   │   │   ├── 📁 dashboard/
│   │   │   │   ├── 📄 DashboardCard.tsx
│   │   │   │   ├── 📄 SalesChart.tsx
│   │   │   │   └── 📄 StockAlert.tsx
│   │   │   │
│   │   │   └── 📁 cashier/
│   │   │       ├── 📄 CartItem.tsx
│   │   │       ├── 📄 CartSummary.tsx
│   │   │       ├── 📄 ProductSearch.tsx
│   │   │       └── 📄 PaymentModal.tsx
│   │   │
│   │   ├── 📁 pages/
│   │   │   ├── 📁 auth/
│   │   │   │   ├── 📄 LoginPage.tsx
│   │   │   │   ├── 📄 ForgotPasswordPage.tsx
│   │   │   │   └── 📄 RegisterPage.tsx
│   │   │   │
│   │   │   ├── 📁 cashier/
│   │   │   │   ├── 📄 CashierPage.tsx
│   │   │   │   ├── 📄 TransactionHistoryPage.tsx
│   │   │   │   └── 📄 ReceiptPage.tsx
│   │   │   │
│   │   │   ├── 📁 products/
│   │   │   │   ├── 📄 ProductsPage.tsx
│   │   │   │   ├── 📄 ProductDetailPage.tsx
│   │   │   │   └── 📄 ProductFormPage.tsx
│   │   │   │
│   │   │   ├── 📁 stocks/
│   │   │   │   ├── 📄 StocksPage.tsx
│   │   │   │   ├── 📄 StockMovementsPage.tsx
│   │   │   │   └── 📄 AdjustmentPage.tsx
│   │   │   │
│   │   │   ├── 📁 recipes/
│   │   │   │   ├── 📄 RecipesPage.tsx
│   │   │   │   ├── 📄 RecipeDetailPage.tsx
│   │   │   │   └── 📄 RecipeFormPage.tsx
│   │   │   │
│   │   │   ├── 📁 reports/
│   │   │   │   ├── 📄 ReportsPage.tsx
│   │   │   │   ├── 📄 SalesReportPage.tsx
│   │   │   │   ├── 📄 InventoryReportPage.tsx
│   │   │   │   └── 📄 ProfitReportPage.tsx
│   │   │   │
│   │   │   ├── 📁 admin/
│   │   │   │   ├── 📄 UsersPage.tsx
│   │   │   │   ├── 📄 RolesPage.tsx
│   │   │   │   ├── 📄 SettingsPage.tsx
│   │   │   │   ├── 📄 TenantSettingsPage.tsx
│   │   │   │   └── 📄 AuditLogsPage.tsx
│   │   │   │
│   │   │   ├── 📁 dashboard/
│   │   │   │   └── 📄 DashboardPage.tsx
│   │   │   │
│   │   │   └── 📄 NotFoundPage.tsx
│   │   │
│   │   ├── 📁 redux/
│   │   │   ├── 📄 store.ts
│   │   │   ├── 📁 slices/
│   │   │   │   ├── 📄 authSlice.ts
│   │   │   │   ├── 📄 userSlice.ts
│   │   │   │   ├── 📄 cartSlice.ts
│   │   │   │   ├── 📄 tenantSlice.ts
│   │   │   │   └── 📄 notificationSlice.ts
│   │   │   └── 📁 hooks/
│   │   │       ├── 📄 useAuth.ts
│   │   │       ├── 📄 useCart.ts
│   │   │       └── 📄 useTenant.ts
│   │   │
│   │   ├── 📁 hooks/
│   │   │   ├── 📄 useApi.ts
│   │   │   ├── 📄 usePagination.ts
│   │   │   ├── 📄 useLocalStorage.ts
│   │   │   └── 📄 useDebounce.ts
│   │   │
│   │   ├── 📁 utils/
│   │   │   ├── 📄 constants.ts
│   │   │   ├── 📄 formatters.ts
│   │   │   ├── 📄 validators.ts
│   │   │   └── 📄 helpers.ts
│   │   │
│   │   ├── 📁 types/
│   │   │   └── 📄 index.ts
│   │   │
│   │   ├── 📁 styles/
│   │   │   ├── 📄 theme.ts
│   │   │   └── 📄 global.css
│   │   │
│   │   └── 📁 context/
│   │       └── 📄 SocketContext.tsx
│   │
│   ├── 📁 public/
│   │   ├── 📄 favicon.ico
│   │   └── 📄 index.html
│   │
│   └── 📁 tests/
│       ├── 📁 unit/
│       └── 📁 integration/
│
├── 📁 mobile-app/                       # React Native Mobile
│   ├── 📄 app.json
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 eas.json
│   ├── 📄 .env.example
│   │
│   ├── 📁 app/
│   │   ├── 📄 _layout.tsx              # Root layout (Expo Router)
│   │   │
│   │   ├── 📁 (auth)/
│   │   │   ├── 📄 _layout.tsx
│   │   │   ├── 📄 login.tsx
│   │   │   ├── 📄 register.tsx
│   │   │   └── 📄 forgot-password.tsx
│   │   │
│   │   ├── 📁 (tabs)/
│   │   │   ├── 📄 _layout.tsx
│   │   │   ├── 📄 cashier.tsx          # Main POS screen
│   │   │   ├── 📄 products.tsx
│   │   │   ├── 📄 stocks.tsx
│   │   │   ├── 📄 recipes.tsx
│   │   │   └── 📄 reports.tsx
│   │   │
│   │   ├── 📁 admin/
│   │   │   ├── 📄 users.tsx
│   │   │   ├── 📄 settings.tsx
│   │   │   └── 📄 audit-logs.tsx
│   │   │
│   │   └── 📁 details/
│   │       ├── 📄 product-detail.tsx
│   │       ├── 📄 transaction-detail.tsx
│   │       └── 📄 recipe-detail.tsx
│   │
│   ├── 📁 src/
│   │   ├── 📁 api/
│   │   │   ├── 📄 client.ts
│   │   │   ├── 📄 auth.api.ts
│   │   │   ├── 📄 products.api.ts
│   │   │   ├── 📄 transactions.api.ts
│   │   │   └── 📄 reports.api.ts
│   │   │
│   │   ├── 📁 components/
│   │   │   ├── 📁 common/
│   │   │   │   ├── 📄 Button.tsx
│   │   │   │   ├── 📄 Card.tsx
│   │   │   │   ├── 📄 Input.tsx
│   │   │   │   ├── 📄 Modal.tsx
│   │   │   │   └── 📄 Loading.tsx
│   │   │   │
│   │   │   ├── 📁 cashier/
│   │   │   │   ├── 📄 CartItem.tsx
│   │   │   │   ├── 📄 CartSummary.tsx
│   │   │   │   ├── 📄 ProductSearch.tsx
│   │   │   │   ├── 📄 BarcodeScan.tsx
│   │   │   │   └── 📄 PaymentModal.tsx
│   │   │   │
│   │   │   └── 📁 products/
│   │   │       ├── 📄 ProductList.tsx
│   │   │       └── 📄 ProductItem.tsx
│   │   │
│   │   ├── 📁 redux/
│   │   │   ├── 📄 store.ts
│   │   │   ├── 📁 slices/
│   │   │   │   ├── 📄 authSlice.ts
│   │   │   │   ├── 📄 cartSlice.ts
│   │   │   │   └── 📄 appSlice.ts
│   │   │   └── 📁 hooks/
│   │   │       ├── 📄 useAuth.ts
│   │   │       └── 📄 useCart.ts
│   │   │
│   │   ├── 📁 hooks/
│   │   │   ├── 📄 useSQLite.ts
│   │   │   ├── 📄 useOfflineQueue.ts
│   │   │   ├── 📄 useApi.ts
│   │   │   └── 📄 useBarcodeScanner.ts
│   │   │
│   │   ├── 📁 utils/
│   │   │   ├── 📄 constants.ts
│   │   │   ├── 📄 formatters.ts
│   │   │   ├── 📄 storage.ts            # SQLite/AsyncStorage
│   │   │   └── 📄 helpers.ts
│   │   │
│   │   ├── 📁 types/
│   │   │   └── 📄 index.ts
│   │   │
│   │   └── 📁 database/
│   │       ├── 📄 sqlite.ts
│   │       └── 📄 schema.ts
│   │
│   └── 📁 assets/
│       ├── 📁 images/
│       └── 📁 fonts/
│
├── 📁 docs/
│   ├── 📄 API_DOCUMENTATION.md
│   ├── 📄 DATABASE_SCHEMA.md
│   ├── 📄 DEPLOYMENT.md
│   ├── 📄 ARCHITECTURE.md
│   └── 📄 CONTRIBUTING.md
│
├── 📁 .github/
│   └── 📁 workflows/
│       ├── 📄 backend-ci.yml
│       ├── 📄 web-ci.yml
│       └── 📄 mobile-ci.yml
│
└── 📁 infrastructure/
    ├── 📄 docker-compose.yml            # Full stack compose
    ├── 📁 docker/
    │   ├── 📄 Dockerfile.backend
    │   ├── 📄 Dockerfile.web
    │   └── 📄 nginx.conf
    └── 📁 k8s/
        ├── 📄 deployment.yml
        └── 📄 service.yml
```

---

## 🎯 Priority: File-to-Create Order

### **Fase 1 - Setup Awal (Backend)**
1. Backend package.json & dependencies
2. Backend TypeScript configuration
3. Backend .env configuration
4. Database setup (Prisma schema)
5. Backend app structure (index.ts, app.ts, config/)

### **Fase 2 - Core Features Backend**
6. Middleware (auth, tenant, error handling)
7. Database models & repositories
8. Authentication service & routes
9. Product management (service, controller, routes)
10. Stock management (service, controller, routes)

### **Fase 3 - Frontend Setup**
11. Web app package.json & Vite config
12. React Redux store setup
13. Axios API client configuration
14. Authentication pages & flow

### **Fase 4 - Additional Backend Features**
15. Cashier/Transaction service & routes
16. Recipe management
17. Reports service
18. Admin management
19. WebSocket setup for real-time

### **Fase 5 - Web App Pages**
20. Dashboard page
21. Products, Stocks, Recipes pages
22. Cashier interface
23. Reports pages
24. Admin pages

### **Fase 6 - Mobile Setup**
25. Mobile app Expo setup
26. Mobile Redux store
27. Mobile auth flow
28. Mobile cashier interface
29. Offline data sync

---

## 📋 Key Configuration Files Structure

### **Root Level:**
- `.gitignore` - Git configuration
- `docker-compose.yml` - All services orchestration
- `Makefile` - Command shortcuts
- `.env.example` - Environment template

### **Backend:**
- `backend/.env` - API keys, DB connection
- `backend/tsconfig.json` - TypeScript config
- `backend/prisma/.env` - Database URL
- `backend/Dockerfile` - Container setup

### **Web App:**
- `web-app/.env` - API base URL
- `web-app/vite.config.ts` - Build config
- `web-app/Dockerfile` - Container setup

### **Mobile:**
- `mobile-app/.env` - API base URL
- `mobile-app/eas.json` - Expo build config
- `mobile-app/app.json` - App configuration

