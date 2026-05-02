import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

// Redux store
import { store } from './redux/store'

// Pages
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import CashierPage from './pages/cashier/CashierPage'
import ProductsPage from './pages/products/ProductsPage'
import StocksPage from './pages/stocks/StocksPage'
import RecipesPage from './pages/recipes/RecipesPage'
import ReportsPage from './pages/reports/ReportsPage'
import AdminUsersPage from './pages/admin/UsersPage'
import NotFoundPage from './pages/NotFoundPage'

const queryClient = new QueryClient()

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/cashier" element={<CashierPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/stocks" element={<StocksPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/reports" element={<ReportsPage />} />

            {/* Admin Routes */}
            <Route path="/admin/users" element={<AdminUsersPage />} />

            {/* 404 */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
