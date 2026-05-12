import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <p className="text-8xl font-bold text-blue-200">404</p>
        <h2 className="text-2xl font-bold text-gray-700 mt-4">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-500 mt-2 text-sm">Halaman yang Anda cari tidak ada atau sudah dipindahkan.</p>
        <Link
          to="/"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage

export default NotFoundPage
