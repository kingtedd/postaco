import { useQuery } from '@tanstack/react-query'
import Layout from '@components/common/Layout'
import { reportsApi } from '@api/reports'
import { transactionsApi } from '@api/transactions'
import { useAppSelector } from '@redux/hooks'

interface StatCardProps {
  title: string
  value: string | number
  sub?: string
  color: string
  icon: string
}

const StatCard = ({ title, value, sub, color, icon }: StatCardProps) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4`}>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
)

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

const today = new Date().toISOString().slice(0, 10)

const DashboardPage = () => {
  const tenant = useAppSelector((s) => s.tenant.current)

  const { data: summary } = useQuery({
    queryKey: ['reports', 'summary', today],
    queryFn: () => reportsApi.getSummary({ startDate: today, endDate: today }),
  })

  const { data: txData } = useQuery({
    queryKey: ['transactions', 'recent'],
    queryFn: () => transactionsApi.getAll({ page: 1, limit: 5 }),
  })

  const { data: topProducts } = useQuery({
    queryKey: ['reports', 'top-products', today],
    queryFn: () => reportsApi.getTopProducts({ startDate: today, endDate: today, limit: 5 }),
  })

  const stats = summary?.data || {}
  const recentTx = txData?.data?.data || []

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Greeting */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Selamat datang{tenant?.name ? `, ${tenant.name}` : ''}!
          </h2>
          <p className="text-sm text-gray-500">
            Ini ringkasan bisnis Anda hari ini, {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Pendapatan Hari Ini"
            value={formatCurrency(stats.totalRevenue || 0)}
            color="bg-green-100 text-green-600"
            icon="💰"
          />
          <StatCard
            title="Transaksi Hari Ini"
            value={stats.transactionCount || 0}
            color="bg-blue-100 text-blue-600"
            icon="🧾"
          />
          <StatCard
            title="Rata-rata Transaksi"
            value={formatCurrency(stats.averageTransaction || 0)}
            color="bg-purple-100 text-purple-600"
            icon="📊"
          />
          <StatCard
            title="Total Item Terjual"
            value={stats.totalItems || 0}
            color="bg-orange-100 text-orange-600"
            icon="📦"
          />
        </div>

        {/* Bottom Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-700 mb-4">Transaksi Terbaru</h3>
            {recentTx.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Belum ada transaksi hari ini</p>
            ) : (
              <div className="space-y-3">
                {recentTx.map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-700">{tx.receiptNumber || tx.id.slice(0, 8)}</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(tx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                      tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {tx.status}
                    </span>
                    <p className="font-semibold text-gray-800">{formatCurrency(tx.total)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-700 mb-4">Produk Terlaris Hari Ini</h3>
            {!topProducts?.data || topProducts.data.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Belum ada data penjualan</p>
            ) : (
              <div className="space-y-3">
                {topProducts.data.map((item: any, idx: number) => (
                  <div key={item.productId} className="flex items-center gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <p className="flex-1 font-medium text-gray-700">{item.productName}</p>
                    <p className="text-gray-500">{item.quantity} pcs</p>
                    <p className="font-semibold text-gray-800">{formatCurrency(item.revenue)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DashboardPage
