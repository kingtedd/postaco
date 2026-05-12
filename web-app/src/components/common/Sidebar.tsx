import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { logout } from '@/redux/slices/authSlice'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/cashier', label: 'Kasir / POS', icon: '🛒' },
  { to: '/products', label: 'Produk', icon: '📦' },
  { to: '/stocks', label: 'Stok', icon: '🏭' },
  { to: '/recipes', label: 'Resep', icon: '🍳' },
  { to: '/reports', label: 'Laporan', icon: '📈' },
]

const adminItems = [
  { to: '/admin/users', label: 'Pengguna', icon: '👥' },
]

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.user.user)
  const tenant = useAppSelector((s) => s.tenant.current)
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <aside
      className={`flex flex-col h-screen bg-gray-900 text-white transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo / Brand */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold text-blue-400">POSTACO</h1>
            {tenant && (
              <p className="text-xs text-gray-400 truncate">{tenant.name}</p>
            )}
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white p-1 rounded"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}

          {user?.role === 'admin' && (
            <>
              {!collapsed && (
                <li className="pt-4 pb-1 px-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Admin</p>
                </li>
              )}
              {adminItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`
                    }
                  >
                    <span className="text-base">{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </>
          )}
        </ul>
      </nav>

      {/* User / Logout */}
      <div className="border-t border-gray-700 px-3 py-3">
        {!collapsed && user && (
          <div className="mb-2">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
        >
          <span>🚪</span>
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
