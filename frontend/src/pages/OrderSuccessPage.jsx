
import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, ShoppingBag, MapPin, CreditCard, Phone } from 'lucide-react';

const OrderSuccessPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  useEffect(() => {
    if (!order) navigate('/', { replace: true });
  }, [order]);

  if (!order) return null;

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p || 0);

  const TIMELINE = [
    { label: 'Order Confirmed', time: 'Just now', done: true },
    { label: 'Order Packed', time: 'Within 24 hours', done: false },
    { label: 'Shipped', time: '1-2 business days', done: false },
    { label: 'Out for Delivery', time: '2-3 business days', done: false },
    { label: 'Delivered', time: `By ${order.estimatedDelivery}`, done: false },
  ];

  return (
    <div className="page-container py-6 animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* ── Success Hero Card ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-card">
          {/* Green header */}
          <div className="bg-green-500 px-6 py-8 text-center text-white relative overflow-hidden">
            {/* decorative circles */}
            <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -right-6 w-40 h-40 rounded-full bg-white/10" />

            <div className="relative">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-white/30">
                <CheckCircle size={44} className="text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">Order Placed!</h1>
              <p className="text-green-100 text-sm">Thank you for shopping with us </p>

              {/* Order ID pill */}
              <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white px-5 py-2 rounded-full font-bold text-base tracking-wider mt-4">
                <Package size={16} />
                #{order.orderId}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
            {[
              { label: 'Items', value: `${order.itemCount} item${order.itemCount > 1 ? 's' : ''}`, color: '#2563eb' },
              { label: 'Total', value: formatPrice(order.totalAmount), color: '#16a34a' },
              { label: 'Delivery', value: order.estimatedDelivery, color: '#ea580c' },
            ].map(({ label, value, color }) => (
              <div key={label} className="py-4 text-center px-2">
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-sm sm:text-base font-bold mt-0.5 leading-tight" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 space-y-4">

            {/* Delivery address */}
            {(order.address || order.customer_name) && (
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={15} style={{ color: '#2563eb' }} />
                  <span className="text-sm font-bold text-gray-700">Delivery Address</span>
                </div>
                <p className="text-sm font-semibold text-gray-800">{order.customer_name}</p>
                {order.customer_phone && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Phone size={11} /> {order.customer_phone}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {[order.address_line1, order.address_line2, order.city, order.state, order.pincode]
                    .filter(Boolean).join(', ')}
                </p>
              </div>
            )}

            {/* Payment method */}
            {order.payment_method && (
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 flex items-center gap-3">
                <CreditCard size={18} style={{ color: '#2563eb' }} />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Payment Method</p>
                  <p className="text-sm font-bold text-gray-800">
                    {order.payment_method === 'COD' ? 'Cash on Delivery'
                      : order.payment_method === 'UPI' ? 'UPI Payment'
                        : order.payment_method === 'CARD' ? 'Credit / Debit Card'
                          : order.payment_method === 'NET_BANKING' ? 'Net Banking'
                            : order.payment_method}
                  </p>
                </div>
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                  {order.payment_method === 'COD' ? 'Pay on Delivery' : 'Paid'}
                </span>
              </div>
            )}

            {/* Delivery Timeline */}
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Truck size={15} style={{ color: '#2563eb' }} />
                <span className="text-sm font-bold text-gray-700">Delivery Timeline</span>
              </div>
              <div className="relative">
                {/* vertical line */}
                <div className="absolute left-3.5 top-4 bottom-4 w-px bg-gray-200" />
                <div className="space-y-4">
                  {TIMELINE.map(({ label, time, done }, i) => (
                    <div key={i} className="flex items-start gap-3 relative">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-xs font-bold
                        ${done ? 'bg-green-500 text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                        {done ? '✓' : i + 1}
                      </div>
                      <div className="pt-0.5">
                        <p className={`text-sm font-semibold ${done ? 'text-green-600' : 'text-gray-600'}`}>{label}</p>
                        <p className="text-xs text-gray-400">{time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price breakdown */}
            {order.totalAmount && (
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-sm font-bold text-gray-700 mb-3">Price Breakdown</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({order.itemCount})</span>
                    <span>{formatPrice(order.originalTotal || order.totalAmount)}</span>
                  </div>
                  {order.totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>- {formatPrice(order.totalDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="text-green-600 font-medium">
                      {order.deliveryCharge === 0 ? 'FREE' : formatPrice(order.deliveryCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-gray-900 border-t border-gray-100 pt-2 mt-1">
                    <span>Total Paid</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link to="/" replace
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                style={{ background: '#2563eb' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; }}
              >
                <Home size={16} /> Continue Shopping
              </Link>
              <Link to="/orders"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
                style={{ background: '#fff', border: '1.5px solid #2563eb', color: '#2563eb' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
              >
                <Package size={16} /> Track My Order
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          Order ID #{order.orderId} · Happy Shopping! 🛍️
        </p>
      </div>
    </div>
  );
};

export default OrderSuccessPage;