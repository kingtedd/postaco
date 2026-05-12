import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import Layout from '@components/common/Layout'
import Modal from '@components/common/Modal'
import { stocksApi } from '@api/stocks'
import { useAppDispatch } from '@redux/hooks'
import { addNotification } from '@redux/slices/notificationSlice'

interface AdjustForm {
  type: 'in' | 'out' | 'adjustment'
  quantity: number
  notes: string
}

const StocksPage = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [adjustModal, setAdjustModal] = useState(false)
  const [selectedStock, setSelectedStock] = useState<{ id: string; name: string } | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['stocks', page, search],
    queryFn: () => stocksApi.getAll({ page, limit: 10, search }),
  })

  const stocks = data?.data?.data || []
  const total = data?.data?.total || 0
  const totalPages = Math.ceil(total / 10)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdjustForm>({
    defaultValues: { type: 'in', quantity: 1, notes: '' },
  })

  const adjustMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: AdjustForm }) => stocksApi.adjust(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] })
      dispatch(addNotification({ type: 'success', message: 'Stok berhasil disesuaikan' }))
      setAdjustModal(false)
      setSelectedStock(null)
      reset()
    },
    onError: () => dispatch(addNotification({ type: 'error', message: 'Gagal menyesuaikan stok' })),
  })

  const openAdjust = (s: any) => {
    setSelectedStock({ id: s.id, name: s.product?.name || s.id })
    reset({ type: 'in', quantity: 1, notes: '' })
    setAdjustModal(true)
  }

  const onSubmit = (data: AdjustForm) => {
    if (!selectedStock) return
    adjustMutation.mutate({ id: selectedStock.id, dto: data })
  }

  const getStockStatus = (qty: number, reorderLevel: number) => {
    if (qty <= 0) return { label: 'Habis', css: 'bg-red-100 text-red-700' }
    if (qty <= reorderLevel) return { label: 'Rendah', css: 'bg-yellow-100 text-yellow-700' }
    return { label: 'Tersedia', css: 'bg-green-100 text-green-700' }
  }

  return (
    <Layout title="Manajemen Stok">
      {/* Toolbar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="w-full sm:w-80 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Produk</th>
              <th className="px-4 py-3 text-left">Stok Saat Ini</th>
              <th className="px-4 py-3 text-left">Reorder Level</th>
              <th className="px-4 py-3 text-left">Satuan</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Memuat...</td></tr>
            ) : stocks.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Tidak ada data stok</td></tr>
            ) : stocks.map((s: any) => {
              const status = getStockStatus(s.quantity, s.reorderLevel || 0)
              return (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{s.product?.name || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${s.quantity <= 0 ? 'text-red-600' : s.quantity <= (s.reorderLevel || 0) ? 'text-yellow-600' : 'text-gray-700'}`}>
                      {s.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{s.reorderLevel || 0}</td>
                  <td className="px-4 py-3 text-gray-500">{s.unit || s.product?.unit || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.css}`}>{status.label}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openAdjust(s)} className="text-blue-600 hover:underline text-xs">Sesuaikan</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 text-sm border rounded disabled:opacity-40">←</button>
          <span className="px-3 py-1 text-sm text-gray-600">{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 text-sm border rounded disabled:opacity-40">→</button>
        </div>
      )}

      {/* Adjust Modal */}
      <Modal isOpen={adjustModal} onClose={() => setAdjustModal(false)}
        title={`Sesuaikan Stok — ${selectedStock?.name}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Penyesuaian</label>
            <select {...register('type')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="in">Masuk (Stok Bertambah)</option>
              <option value="out">Keluar (Stok Berkurang)</option>
              <option value="adjustment">Koreksi Manual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah *</label>
            <input type="number" min={1} {...register('quantity', { required: 'Jumlah wajib diisi', valueAsNumber: true, min: { value: 1, message: 'Min 1' } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
            <textarea rows={2} {...register('notes')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setAdjustModal(false)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
            <button type="submit" disabled={adjustMutation.isPending}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {adjustMutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}

export default StocksPage
