import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Layout from '@components/common/Layout'
import { reportsApi } from '@api/reports'

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

const toDateStr = (d: Date) => d.toISOString().slice(0, 10)

const ReportsPage = () => {
  const today = toDateStr(new Date())
  const firstOfMonth = toDateStr(new Date(new Date().getFullYear(), new Date().getMonth(), 1))

  const [startDate, setStartDate] = useState(firstOfMonth)
  const [endDate, setEndDate] = useState(today)

  const { data: summary } = useQuery({
    queryKey: ['reports', 'summary', startDate, endDate],
    queryFn: () => reportsApi.getSummary({ startDate, endDate }),
  })

  const { data: daily, isLoading: loadingDaily } = useQuery({
    queryKey: ['reports', 'daily', startDate, endDate],
    queryFn: () => reportsApi.getDaily({ startDate, endDate }),
  })

  const { data: topProds } = useQuery({
    queryKey: ['reports', 'top', startDate, endDate],
    queryFn: () => reportsApi.getTopProducts({ startDate, endDate, limit: 10 }),
  })

  const s = summary?.data || {}
  const dailyList = daily?.data || []
  const topList = topProds?.data || []

  return (
    <Layout title="Laporan">
      {/* Date Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Dari Tanggal</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Sampai Tanggal</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Pendapatan', value: formatCurrency(s.totalRevenue || 0), icon: '💰', color: 'bg-green-100 text-green-600' },
          { label: 'Total Transaksi', value: s.transactionCount || 0, icon: '🧾', color: 'bg-blue-100 text-blue-600' },
          { label: 'Rata-rata Transaksi', value: formatCurrency(s.averageTransaction || 0), icon: '📊', color: 'bg-purple-100 text-purple-600' },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${c.color}`}>{c.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{c.label}</p>
              <p className="text-xl font-bold text-gray-800">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two Columns: Daily Table + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-700">Laporan Harian</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Tanggal</th>
                <th className="px-4 py-3 text-right">Transaksi</th>
                <th className="px-4 py-3 text-right">Pendapatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingDaily ? (
                <tr><td colSpan={3} className="text-center py-6 text-gray-400">Memuat...</td></tr>
              ) : dailyList.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-6 text-gray-400">Tidak ada data</td></tr>
              ) : dailyList.map((d: any) => (
                <tr key={d.date} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{new Date(d.date).toLocaleDateString('id-ID')}</td>
                  <td className="px-4 py-3 text-gray-600 text-right">{d.transactionCount}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">{formatCurrency(d.totalRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Produk Terlaris</h3>
          {topList.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Tidak ada data</p>
          ) : topList.map((item: any, idx: number) => (
            <div key={item.productId} className="flex items-center gap-3 text-sm mb-3">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-700 truncate">{item.productName}</p>
                <p className="text-xs text-gray-400">{item.quantity} terjual</p>
              </div>
              <p className="font-semibold text-gray-800 text-xs">{formatCurrency(item.revenue)}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default ReportsPage
