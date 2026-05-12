import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import Layout from '@components/common/Layout'
import Modal from '@components/common/Modal'
import { productsApi } from '@api/products'
import { useAppDispatch } from '@redux/hooks'
import { addNotification } from '@redux/slices/notificationSlice'

interface ProductForm {
  name: string
  sku: string
  price: number
  categoryId?: string
  unit: string
  isActive: boolean
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

const ProductsPage = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, search],
    queryFn: () => productsApi.getAll({ page, limit: 10, search }),
  })

  const products = data?.data?.data || []
  const total = data?.data?.total || 0
  const totalPages = Math.ceil(total / 10)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductForm>({
    defaultValues: { isActive: true, unit: 'pcs' },
  })

  const createMutation = useMutation({
    mutationFn: (dto: ProductForm) => productsApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      dispatch(addNotification({ type: 'success', message: 'Produk berhasil ditambahkan' }))
      setModalOpen(false)
      reset()
    },
    onError: () => dispatch(addNotification({ type: 'error', message: 'Gagal menambahkan produk' })),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<ProductForm> }) => productsApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      dispatch(addNotification({ type: 'success', message: 'Produk berhasil diperbarui' }))
      setModalOpen(false)
      setEditId(null)
      reset()
    },
    onError: () => dispatch(addNotification({ type: 'error', message: 'Gagal memperbarui produk' })),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      dispatch(addNotification({ type: 'success', message: 'Produk berhasil dihapus' }))
    },
    onError: () => dispatch(addNotification({ type: 'error', message: 'Gagal menghapus produk' })),
  })

  const openNew = () => {
    reset({ isActive: true, unit: 'pcs', name: '', sku: '', price: 0 })
    setEditId(null)
    setModalOpen(true)
  }

  const openEdit = (p: any) => {
    reset({ name: p.name, sku: p.sku, price: p.price, unit: p.unit, isActive: p.isActive, categoryId: p.categoryId })
    setEditId(p.id)
    setModalOpen(true)
  }

  const onSubmit = (data: ProductForm) => {
    if (editId) {
      updateMutation.mutate({ id: editId, dto: data })
    } else {
      createMutation.mutate(data)
    }
  }

  const confirmDelete = (id: string, name: string) => {
    if (window.confirm(`Hapus produk "${name}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <Layout title="Produk">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={openNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 whitespace-nowrap"
        >
          + Tambah Produk
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Nama Produk</th>
              <th className="px-4 py-3 text-left">SKU</th>
              <th className="px-4 py-3 text-left">Harga</th>
              <th className="px-4 py-3 text-left">Satuan</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Memuat...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Tidak ada produk</td></tr>
            ) : products.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.sku}</td>
                <td className="px-4 py-3 text-gray-700">{formatCurrency(p.price)}</td>
                <td className="px-4 py-3 text-gray-500">{p.unit}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(p)} className="text-blue-600 hover:underline text-xs">Edit</button>
                  <button onClick={() => confirmDelete(p.id, p.name)} className="text-red-500 hover:underline text-xs">Hapus</button>
                </td>
              </tr>
            ))}
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

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); reset() }}
        title={editId ? 'Edit Produk' : 'Tambah Produk'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk *</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('name', { required: 'Nama wajib diisi' })} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('sku')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('unit')} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga *</label>
            <input type="number" min={0} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('price', { required: 'Harga wajib diisi', valueAsNumber: true, min: { value: 0, message: 'Harga harus positif' } })} />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" {...register('isActive')} className="rounded" />
            <label htmlFor="isActive" className="text-sm text-gray-700">Produk aktif</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); setEditId(null); reset() }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}

export default ProductsPage

export default ProductsPage
