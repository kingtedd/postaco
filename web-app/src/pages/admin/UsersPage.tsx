import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import Layout from '@components/common/Layout'
import Modal from '@components/common/Modal'
import apiClient from '@api/client'
import { useAppDispatch } from '@redux/hooks'
import { addNotification } from '@redux/slices/notificationSlice'

interface UserForm {
  name: string
  email: string
  password: string
  role: 'admin' | 'cashier' | 'manager'
}

const fetchUsers = async (page: number) => {
  const res = await apiClient.get(`/api/users?page=${page}&limit=10`)
  return res.data
}

const AdminUsersPage = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['users', page],
    queryFn: () => fetchUsers(page),
  })

  const users = data?.data?.data || []
  const total = data?.data?.total || 0
  const totalPages = Math.ceil(total / 10)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserForm>({
    defaultValues: { role: 'cashier' },
  })

  const createMutation = useMutation({
    mutationFn: (dto: UserForm) => apiClient.post('/api/users', dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      dispatch(addNotification({ type: 'success', message: 'Pengguna berhasil ditambahkan' }))
      setModalOpen(false)
      reset()
    },
    onError: () => dispatch(addNotification({ type: 'error', message: 'Gagal menambahkan pengguna' })),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      dispatch(addNotification({ type: 'success', message: 'Pengguna berhasil dihapus' }))
    },
    onError: () => dispatch(addNotification({ type: 'error', message: 'Gagal menghapus pengguna' })),
  })

  const roleLabel: Record<string, string> = { admin: 'Admin', cashier: 'Kasir', manager: 'Manajer' }
  const roleBadge: Record<string, string> = {
    admin: 'bg-red-100 text-red-700',
    cashier: 'bg-blue-100 text-blue-700',
    manager: 'bg-purple-100 text-purple-700',
  }

  return (
    <Layout title="Manajemen Pengguna">
      {/* Toolbar */}
      <div className="flex justify-end mb-4">
        <button onClick={() => { reset(); setModalOpen(true) }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          + Tambah Pengguna
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">Memuat...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">Tidak ada pengguna</td></tr>
            ) : users.map((u: any) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge[u.role] || 'bg-gray-100 text-gray-600'}`}>
                    {roleLabel[u.role] || u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => window.confirm(`Hapus pengguna "${u.name}"?`) && deleteMutation.mutate(u.id)}
                    className="text-red-500 hover:underline text-xs">Hapus</button>
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
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); reset() }} title="Tambah Pengguna">
        <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
            <input {...register('name', { required: 'Nama wajib diisi' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" {...register('email', { required: 'Email wajib diisi' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input type="password" {...register('password', { required: 'Password wajib diisi', minLength: { value: 6, message: 'Min 6 karakter' } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select {...register('role')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="cashier">Kasir</option>
              <option value="manager">Manajer</option>
              <option value="admin">Admin</option>
            </select>
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
    </Layout>
  )
}

export default AdminUsersPage
