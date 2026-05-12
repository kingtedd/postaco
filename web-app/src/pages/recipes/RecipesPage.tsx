import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import Layout from '@components/common/Layout'
import Modal from '@components/common/Modal'
import { recipesApi } from '@api/recipes'
import { useAppDispatch } from '@redux/hooks'
import { addNotification } from '@redux/slices/notificationSlice'

const RecipesPage = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [viewRecipe, setViewRecipe] = useState<any>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['recipes', page],
    queryFn: () => recipesApi.getAll({ page, limit: 12 }),
  })

  const recipes = data?.data?.data || []
  const total = data?.data?.total || 0
  const totalPages = Math.ceil(total / 12)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ name: string; description: string; instructions: string }>()

  const createMutation = useMutation({
    mutationFn: (dto: any) => recipesApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      dispatch(addNotification({ type: 'success', message: 'Resep berhasil ditambahkan' }))
      setModalOpen(false)
      reset()
    },
    onError: () => dispatch(addNotification({ type: 'error', message: 'Gagal menambahkan resep' })),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => recipesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      dispatch(addNotification({ type: 'success', message: 'Resep berhasil dihapus' }))
    },
    onError: () => dispatch(addNotification({ type: 'error', message: 'Gagal menghapus resep' })),
  })

  const openNew = () => {
    reset()
    setModalOpen(true)
  }

  const confirmDelete = (id: string, name: string) => {
    if (window.confirm(`Hapus resep "${name}"?`)) deleteMutation.mutate(id)
  }

  return (
    <Layout title="Resep">
      <div className="flex justify-between mb-4">
        <p className="text-sm text-gray-500">{total} resep ditemukan</p>
        <button onClick={openNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          + Tambah Resep
        </button>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <p className="text-center text-gray-400 py-12">Memuat...</p>
      ) : recipes.length === 0 ? (
        <p className="text-center text-gray-400 py-12">Belum ada resep</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recipes.map((r: any) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              <div className="text-2xl mb-2">🍳</div>
              <h3 className="font-semibold text-gray-800 text-sm">{r.name}</h3>
              {r.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.description}</p>
              )}
              {r.ingredients && r.ingredients.length > 0 && (
                <p className="text-xs text-gray-400 mt-2">{r.ingredients.length} bahan</p>
              )}
              <div className="mt-3 flex gap-2">
                <button onClick={() => { setViewRecipe(r); setDetailOpen(true) }}
                  className="flex-1 text-xs py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Detail</button>
                <button onClick={() => confirmDelete(r.id, r.name)}
                  className="text-xs py-1 px-2 text-red-500 hover:text-red-700">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 text-sm border rounded disabled:opacity-40">←</button>
          <span className="px-3 py-1 text-sm text-gray-600">{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 text-sm border rounded disabled:opacity-40">→</button>
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); reset() }} title="Tambah Resep">
        <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Resep *</label>
            <input {...register('name', { required: 'Nama wajib diisi' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea rows={2} {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instruksi</label>
            <textarea rows={4} {...register('instructions')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); reset() }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
            <button type="submit" disabled={createMutation.isPending}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title={viewRecipe?.name || ''} size="lg">
        {viewRecipe && (
          <div className="space-y-4">
            {viewRecipe.description && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-1">Deskripsi</h4>
                <p className="text-sm text-gray-700">{viewRecipe.description}</p>
              </div>
            )}
            {viewRecipe.instructions && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-1">Cara Membuat</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{viewRecipe.instructions}</p>
              </div>
            )}
            {viewRecipe.ingredients && viewRecipe.ingredients.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Bahan-bahan</h4>
                <ul className="space-y-1">
                  {viewRecipe.ingredients.map((ing: any, i: number) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{ing.product?.name || ing.productId} — {ing.quantity} {ing.unit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  )
}

export default RecipesPage
