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

// Common
import ProtectedRoute from './components/common/ProtectedRoute'
import Toast from './components/common/Toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/cashier" element={<ProtectedRoute><CashierPage /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
            <Route path="/stocks" element={<ProtectedRoute><StocksPage /></ProtectedRoute>} />
            <Route path="/recipes" element={<ProtectedRoute><RecipesPage /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/users" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
          <Toast />
        </Router>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
