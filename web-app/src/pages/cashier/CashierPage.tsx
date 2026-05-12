import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import Layout from '@components/common/Layout'
import { productsApi } from '@api/products'
import { transactionsApi } from '@api/transactions'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { addToCart, removeFromCart, clearCart, updateCartItem } from '@redux/slices/cartSlice'
import { addNotification } from '@redux/slices/notificationSlice'

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

const CashierPage = () => {
  const dispatch = useAppDispatch()
  const { items, discountAmount } = useAppSelector((s) => s.cart)
  const [search, setSearch] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer' | 'digital_wallet'>('cash')
  const [amountPaid, setAmountPaid] = useState('')

  const { data } = useQuery({
    queryKey: ['products-pos', search],
    queryFn: () => productsApi.getAll({ page: 1, limit: 50, search, isActive: true }),
  })

  const products = data?.data?.data || []

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + tax - discountAmount
  const change = amountPaid ? Number(amountPaid) - total : 0

  const createTxMutation = useMutation({
    mutationFn: (dto: Parameters<typeof transactionsApi.create>[0]) => transactionsApi.create(dto),
    onSuccess: () => {
      dispatch(clearCart())
      setAmountPaid('')
      dispatch(addNotification({ type: 'success', message: 'Transaksi berhasil!' }))
    },
    onError: () => dispatch(addNotification({ type: 'error', message: 'Transaksi gagal' })),
  })

  const addProduct = (p: any) => {
    dispatch(addToCart({ productId: p.id, name: p.name, quantity: 1, unitPrice: p.price }))
  }

  const changeQty = (productId: string, name: string, unitPrice: number, qty: number) => {
    if (qty <= 0) {
      dispatch(removeFromCart(productId))
    } else {
      dispatch(updateCartItem({ productId, name, quantity: qty, unitPrice }))
    }
  }

  const checkout = () => {
    if (items.length === 0) {
      dispatch(addNotification({ type: 'warning', message: 'Keranjang kosong' }))
      return
    }
    if (paymentMethod === 'cash' && change < 0) {
      dispatch(addNotification({ type: 'error', message: 'Uang bayar kurang' }))
      return
    }
    createTxMutation.mutate({
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice })),
      subtotal,
      taxAmount: tax,
      discountAmount,
      total,
      paymentMethod,
      amountPaid: paymentMethod === 'cash' ? Number(amountPaid) : total,
      changeAmount: paymentMethod === 'cash' ? change : 0,
    })
  }

  return (
    <Layout title="Kasir / POS">
      <div className="flex gap-4 h-[calc(100vh-130px)]">
        {/* Left: Product Grid */}
        <div className="flex-1 flex flex-col min-w-0">
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 content-start">
            {products.map((p: any) => (
              <button
                key={p.id}
                onClick={() => addProduct(p)}
                className="bg-white rounded-xl border border-gray-200 p-3 text-left hover:border-blue-400 hover:shadow-sm transition-all"
              >
                <p className="text-sm font-medium text-gray-700 line-clamp-2 leading-tight">{p.name}</p>
                <p className="text-xs text-blue-600 font-semibold mt-1">{formatCurrency(p.price)}</p>
              </button>
            ))}
            {products.length === 0 && (
              <p className="col-span-full text-center text-gray-400 py-8 text-sm">Tidak ada produk</p>
            )}
          </div>
        </div>

        {/* Right: Cart */}
        <div className="w-80 bg-white rounded-xl border border-gray-200 flex flex-col shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-700">Keranjang</h3>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
            {items.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">Keranjang kosong</p>
            ) : items.map((item) => (
              <div key={item.productId} className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{formatCurrency(item.unitPrice)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => changeQty(item.productId, item.name, item.unitPrice, item.quantity - 1)}
                    className="w-6 h-6 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-bold flex items-center justify-center"
                  >−</button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => changeQty(item.productId, item.name, item.unitPrice, item.quantity + 1)}
                    className="w-6 h-6 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-bold flex items-center justify-center"
                  >+</button>
                </div>
                <p className="text-sm font-semibold text-gray-800 w-20 text-right">{formatCurrency(item.unitPrice * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border-t border-gray-100 px-4 py-3 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Pajak (10%)</span><span>{formatCurrency(tax)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Diskon</span><span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-gray-800 pt-1 border-t border-gray-100 text-base">
              <span>Total</span><span>{formatCurrency(total)}</span>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Metode Pembayaran</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cash">Tunai</option>
                <option value="card">Kartu</option>
                <option value="transfer">Transfer</option>
                <option value="digital_wallet">Dompet Digital</option>
              </select>
            </div>

            {paymentMethod === 'cash' && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Uang Bayar</label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
                {amountPaid && (
                  <p className={`text-xs mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    Kembalian: {formatCurrency(change)}
                  </p>
                )}
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={checkout}
              disabled={items.length === 0 || createTxMutation.isPending}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createTxMutation.isPending ? 'Memproses...' : 'Bayar Sekarang'}
            </button>

            <button
              onClick={() => dispatch(clearCart())}
              disabled={items.length === 0}
              className="w-full py-1.5 text-sm text-gray-500 hover:text-red-500 disabled:opacity-40"
            >
              Kosongkan Keranjang
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CashierPage
