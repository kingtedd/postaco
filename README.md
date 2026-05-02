# Postaco - POS Multi-Tenant Application

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-Development-yellow)
![License](https://img.shields.io/badge/license-MIT-green)

Postaco adalah aplikasi **Point of Sale (POS) multi-tenant** yang komprehensif untuk bisnis retail, restoran, dan warung. Platform ini menyediakan solusi terintegrasi untuk kasir, manajemen produk, inventori, resep, dan laporan detail.

## 🎯 Fitur Utama

✅ **Perkasiran (Cashier)** - Sistem checkout real-time dengan pembayaran fleksibel
✅ **Manajemen Produk** - CRUD produk, kategori, barcode, gambar
✅ **Manajemen Stok** - Tracking inventori, penyesuaian stok, alert stok rendah
✅ **Manajemen Resep** - Formulasi produk, tracking bahan baku
✅ **Manajemen Admin** - User management, roles & permissions, audit logs
✅ **Laporan Detail** - Sales report, inventory, profit & loss analysis

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js 20.x LTS
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 15.x
- **Cache**: Redis 7.x
- **ORM**: Prisma 5.x
- **Auth**: JWT + bcryptjs
- **Real-time**: Socket.io 4.x

### Web Frontend
- **Framework**: React 18.x
- **Build Tool**: Vite 5.x
- **Language**: TypeScript 5.x
- **State Mgmt**: Redux Toolkit 2.x
- **Server State**: React Query 5.x
- **Styling**: Tailwind CSS 4.x
- **Forms**: React Hook Form 7.x
- **HTTP**: Axios 1.x

### Mobile (Android/iOS)
- **Framework**: React Native (Expo)
- **Router**: Expo Router
- **State**: Redux Toolkit 2.x
- **Local DB**: SQLite, AsyncStorage
- **Notifications**: Firebase Cloud Messaging
- **Offline Sync**: Custom implementation

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions (template included)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x LTS
- Docker & Docker Compose
- PostgreSQL 15.x
- Redis 7.x
- npm or yarn

### 1. Clone Repository

```bash
git clone <repository-url>
cd postaco
```

### 2. Environment Setup

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env dengan konfigurasi database Anda
```

**Web App:**
```bash
cd web-app
cp .env.example .env
# Edit .env dengan API URL
```

**Mobile App:**
```bash
cd mobile-app
cp .env.example .env
# Edit .env dengan API URL dan Firebase config
```

### 3. Docker Compose (Recommended)

Jalankan seluruh stack dengan Docker:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

Services yang akan berjalan:
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- Backend API: `localhost:5000`

### 4. Backend Setup (Manual)

```bash
cd backend

# Install dependencies
npm install

# Setup database
npx prisma migrate dev

# Seed initial data (optional)
npm run prisma:seed

# Start development server
npm run dev
```

**Backend akan tersedia di:** `http://localhost:5000`

### 5. Web App Setup

```bash
cd web-app

# Install dependencies
npm install

# Start development server
npm run dev
```

**Web App akan tersedia di:** `http://localhost:3000`

### 6. Mobile App Setup

```bash
cd mobile-app

# Install dependencies
npm install

# Start development server
npm start

# For Android
npm run android

# For iOS  
npm run ios

# For Web
npm run web
```

---

## 📁 Project Structure

```
postaco/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── middleware/  # Express middlewares
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   ├── repositories/ # Data access layer
│   │   ├── types/       # TypeScript types
│   │   ├── utils/       # Utilities
│   │   └── websocket/   # Socket.io handlers
│   ├── prisma/          # Database schema & migrations
│   └── tests/           # Test files
│
├── web-app/             # React Frontend
│   ├── src/
│   │   ├── api/        # API client
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── redux/      # State management
│   │   ├── hooks/      # Custom hooks
│   │   └── utils/      # Utilities
│   └── public/         # Static files
│
├── mobile-app/          # React Native Mobile
│   ├── app/            # Expo Router screens
│   ├── src/
│   │   ├── api/        # API client
│   │   ├── components/ # React Native components
│   │   ├── redux/      # State management
│   │   └── utils/      # Utilities
│   └── assets/         # Images & fonts
│
├── docs/               # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── DEPLOYMENT.md
│   └── ARCHITECTURE.md
│
├── docker-compose.yml  # Full stack orchestration
├── .gitignore
├── TECH_STACK.md       # Tech stack details
├── PROJECT_STRUCTURE.md # Project structure details
├── DATABASE_SCHEMA.md   # Database schema
└── API_SPECIFICATION.md # API endpoints
```

---

## 📚 Documentation

- [TECH_STACK.md](./TECH_STACK.md) - Detailed tech stack explanation
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Database schema & design
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Folder structure detail
- [API_SPECIFICATION.md](./API_SPECIFICATION.md) - API endpoints & features

---

## 🔐 Authentication & Authorization

### JWT Implementation
- Access Token: 7 hari
- Refresh Token: 30 hari
- Algorithm: HS256

### User Roles
1. **Cashier** - Akses kasir, lihat stok
2. **Manager** - Cashier + product/stock management
3. **Admin** - Manager + user management, settings
4. **Owner** - Admin + tenant management

---

## 🗄️ Database Setup

### Running Migrations

```bash
cd backend

# Create new migration
npx prisma migrate dev --name add_new_feature

# Apply migrations
npx prisma migrate deploy

# Reset database (caution!)
npx prisma migrate reset

# Open database GUI
npx prisma studio
```

### Database Connection

Default Docker Compose configuration:
- **Host**: `postgres`
- **Port**: `5432`
- **User**: `postaco_user`
- **Password**: `postaco_password`
- **Database**: `postaco_db`

Untuk production, ubah credentials di environment variables!

---

## 🔌 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Daftar user baru
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Stock
- `GET /api/stocks` - Get stock levels
- `PUT /api/stocks/:id` - Adjust stock
- `POST /api/stocks/movement` - Record stock movement
- `GET /api/stocks/low-level` - Get low stock alerts

### Transactions (Cashier)
- `GET /api/transactions` - Get transactions
- `POST /api/transactions` - Create transaction
- `POST /api/transactions/:id/checkout` - Complete checkout
- `GET /api/transactions/daily` - Get today's transactions

### Reports
- `GET /api/reports/daily` - Daily sales report
- `GET /api/reports/product-sales` - Product sales analysis
- `GET /api/reports/inventory` - Inventory report
- `GET /api/reports/profit-loss` - P&L report

Lihat [API_SPECIFICATION.md](./API_SPECIFICATION.md) untuk endpoint lengkap.

---

## 📊 Real-Time Features

Menggunakan Socket.io untuk fitur real-time:

- **stock-updated** - Stock level berubah
- **transaction-created** - Transaksi baru selesai
- **product-updated** - Product data diubah
- **alert-notification** - Low stock alerts
- **user-activity** - User action broadcast

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Frontend Tests

```bash
cd web-app

# Tests coming soon
```

---

## 📱 Mobile App Notes

### Development

```bash
cd mobile-app

# Start Expo development server
npm start

# Launch emulator
npm run android    # Android Emulator
npm run ios        # iOS Simulator
npm run web        # Web browser
```

### Building for Production

```bash
# Using EAS Build (recommended)
eas build

# Or locally with Expo
expo build:android
expo build:ios
```

---

## 🚢 Deployment

### Backend Deployment

Opsi cloud:
- **AWS** (EC2 + RDS + ElastiCache)
- **Google Cloud** (Compute Engine + Cloud SQL)
- **Digital Ocean** (App Platform + Managed DB)
- **Railway** / **Render** (PaaS)

Lihat [DEPLOYMENT.md](./docs/deployment-guide.md) untuk guide lengkap.

### Frontend Deployment

- **Vercel** (Recommended for React)
- **Netlify**
- **AWS S3 + CloudFront**
- **GitHub Pages** (Static)

### Mobile Deployment

- **Google Play Store** (Android)
- **Apple App Store** (iOS)
- **Expo Application Services** (EAS)

---

## 🔄 Multi-Tenancy Architecture

**Shared Database + Row-Level Isolation**

Setiap table memiliki `tenant_id` untuk isolasi data per tenant.

Fitur:
- ✅ Tenant switching
- ✅ Row-level security (via application layer)
- ✅ Isolated tenant data
- ✅ Shared infrastructure
- ✅ Cost-effective scaling

---

## 📝 Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Make Changes**
   - Ikuti project structure
   - Gunakan TypeScript
   - Follow naming conventions

3. **Test Locally**
   ```bash
   npm test
   npm run build
   ```

4. **Commit & Push**
   ```bash
   git commit -m "feat: description"
   git push origin feature/feature-name
   ```

5. **Create Pull Request**
   - Describe changes
   - Link related issues
   - Request review

---

## 🐛 Troubleshooting

### Backend Issues

**Error: Database connection refused**
```bash
# Check PostgreSQL is running
docker-compose ps

# Check DATABASE_URL in .env
# Format: postgresql://user:password@host:port/database
```

**Error: Port 5000 already in use**
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or change PORT in .env
```

### Frontend Issues

**Error: CORS blocked**
```bash
# Ensure CORS_ORIGIN in backend .env includes frontend URL
# Check CORS configuration in app.ts
```

**Blank page**
```bash
# Check browser console for errors
# Clear cache and rebuild
rm -rf node_modules dist
npm install && npm run build
```

---

## 📞 Support & Contributing

- 📧 Email: support@postaco.com
- 🐛 [Issues](https://github.com/postaco/postaco/issues)
- 💬 [Discussions](https://github.com/postaco/postaco/discussions)

---

## 📄 License

MIT License - See LICENSE file for details

---

## ✨ Acknowledgments

- Express.js team
- Prisma team
- React community
- Expo team
- Contributors

---

**Status**: 🚀 Development in Progress

Untuk update terbaru, ikuti repository ini!

