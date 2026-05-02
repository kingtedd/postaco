# Postaco - Quick Reference Guide

## 🚀 Quick Start Commands

### Start Full Stack (Docker)
```bash
docker-compose up -d          # Start all services
docker-compose logs -f        # View logs
docker-compose down           # Stop all services
```

### Backend Development
```bash
cd backend
npm install                   # Install dependencies
npm run dev                   # Start development server (localhost:5000)
npx prisma studio           # Open database GUI
npx prisma migrate dev       # Create migration
npm run build                # Build TypeScript
```

### Web App Development
```bash
cd web-app
npm install                  # Install dependencies
npm run dev                  # Start dev server (localhost:3000)
npm run build                # Production build
npm run lint                 # Check code quality
```

### Mobile App Development
```bash
cd mobile-app
npm install                  # Install dependencies
npm start                    # Start Expo development
npm run android              # Launch Android emulator
npm run ios                  # Launch iOS simulator
```

---

## 📁 Project Structure Quick Map

```
postaco/
├── backend/                 # API server (Node.js + Express)
├── web-app/                 # Web dashboard (React)
├── mobile-app/              # Mobile POS (React Native)
├── docs/                    # Documentation
├── docker-compose.yml       # Full stack container setup
├── TECH_STACK.md           # Technology details
├── DATABASE_SCHEMA.md       # Database design
├── PROJECT_STRUCTURE.md     # Folder structure
├── API_SPECIFICATION.md     # API endpoints
├── SETUP_GUIDE.md          # Implementation guide
└── README.md               # Main documentation
```

---

## 🔌 API Endpoints (Base: http://localhost:5000/api)

### Account
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `POST /auth/refresh-token` - Refresh token
- `GET /auth/me` - Current user

### Products
- `GET /products` - List products
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Stock
- `GET /stocks` - Get stock levels
- `PUT /stocks/:id` - Adjust stock
- `POST /stocks/movement` - Record movement

### Transactions (Cashier)
- `GET /transactions` - List transactions
- `POST /transactions` - Create transaction
- `POST /transactions/:id/checkout` - Complete checkout

### Reports
- `GET /reports/daily` - Daily sales
- `GET /reports/product-sales` - Product analysis
- `GET /reports/inventory` - Inventory report

---

## 🌐 Service URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| Backend API | http://localhost:5000 | - |
| Web App | http://localhost:3000 | - |
| PostgreSQL | localhost:5432 | `postaco_user` / `postaco_password` |
| Redis | localhost:6379 | - |
| Prisma Studio | http://localhost:5555 | - |

---

## 🔐 Environment Files Location

- **Backend**: `backend/.env`
- **Web App**: `web-app/.env`
- **Mobile**: `mobile-app/.env`

See `.env.example` in each folder for template.

---

## 📊 Database Tables

**Core Tables:**
- `tenants` - Tenant organization data
- `users` - User accounts
- `roles` - User roles & permissions
- `products` - Product catalog
- `product_categories` - Product categories
- `stocks` - Inventory levels
- `stock_movements` - Stock audit trail
- `transactions` - Sales transactions
- `transaction_items` - Transaction details
- `recipes` - Product recipes/formulations
- `recipe_ingredients` - Recipe ingredients
- `daily_reports` - Daily summary reports
- `audit_logs` - System activity audit

---

## 👤 User Roles

| Role | Features | Access |
|------|----------|--------|
| **Cashier** | POS only | Sales |
| **Manager** | POS + Products + Stock | Sales + Inventory |
| **Admin** | All manager + Users + Reports | Full (except tenant) |
| **Owner** | All admin + Tenants | Full system |

---

## 🛠️ Development Tools

### Code Editor
- Visual Studio Code (Recommended)
- Install Extensions:
  - Thunder Client (API testing)
  - Prisma
  - ES7+ React/Redux/React-Native snippets

### Database GUI
```bash
npx prisma studio
```

### API Testing
- Thunder Client (VS Code)
- Postman
- Insomnia

---

## 📦 Main Technologies Version

- Node.js: 20.x LTS
- React: 18.x
- React Native: 0.73.x
- Express: 4.x
- TypeScript: 5.x
- PostgreSQL: 15.x
- Redis: 7.x
- Docker: Latest

---

## 🧪 Testing Commands

```bash
# Backend
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report

# Frontend (coming soon)
cd web-app
npm test                   # Run tests
```

---

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes, then:
git add .
git commit -m "feat: description"
git push origin feature/feature-name

# Create Pull Request on GitHub
```

### Commit Message Format
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style
- `refactor:` - Refactoring
- `perf:` - Performance
- `test:` - Tests

---

## 🐛 Common Issues & Solutions

### Port Already in Use
```bash
# Kill process
lsof -i :5000              # Find process
kill -9 <PID>              # Kill process
```

### Database Connection Failed
```bash
# Check .env DATABASE_URL
# Format: postgresql://user:password@host:port/database
# Make sure PostgreSQL is running
docker-compose ps
```

### CORS Issues
```bash
# Backend: Update .env CORS_ORIGIN
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Frontend: Check API URL matches backend
VITE_API_BASE_URL=http://localhost:5000/api
```

### Node Modules Issues
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

---

## 📚 Key Documentation

1. **TECH_STACK.md** - Technology choices & rationale
2. **DATABASE_SCHEMA.md** - Database design & relationships
3. **PROJECT_STRUCTURE.md** - Folder organization
4. **API_SPECIFICATION.md** - All API endpoints
5. **SETUP_GUIDE.md** - Development roadmap
6. **README.md** - Main guide

---

## 🎯 Next Steps

1. **Setup Backend**: Install dependencies, configure database
2. **Implement Authentication**: Login/Register/JWT
3. **Build API Endpoints**: Products, Stock, Transactions
4. **Create Frontend**: Dashboards, Forms, Tables
5. **Mobile Development**: Adapt for mobile + offline
6. **Testing & Deployment**: Tests, docker build, cloud setup

---

## 💡 Tips

- Use `npm run dev` for hot reload during development
- Check logs regularly: `docker-compose logs <service>`
- Keep `.env` files in `.gitignore`
- Test API endpoints before frontend integration
- Commit frequently with meaningful messages
- Keep branches up-to-date with main branch

---

## 📞 Quick Help

- **TypeScript errors?** Check `tsconfig.json`
- **Build failing?** Run `npm install` again
- **API not responding?** Check backend is running on 5000
- **Database error?** Check PostgreSQL is up: `docker-compose ps`
- **Port conflict?** Change `PORT` in `.env` or `.vite.config.ts`

---

**Ready to develop!** 🚀

