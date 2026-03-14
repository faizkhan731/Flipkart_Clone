



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp, MapPin, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { orderService } from '../services/api';

const STATUS_CONFIG = {
  confirmed: { color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', label: 'Confirmed' },
  shipped: { color: '#c2410c', bg: '#fff7ed', border: '#fed7aa', label: 'Shipped' },
  delivered: { color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', label: 'Delivered' },
  cancelled: { color: '#b91c1c', bg: '#fef2f2', border: '#fecaca', label: 'Cancelled' },
  pending: { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb', label: 'Pending' },
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    orderService.getOrders()
      .then(({ data }) => { if (data.success) setOrders(data.orders); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  if (loading) return (
    <div className="page-container py-16 flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Loading your orders...</p>
    </div>
  );

  return (
    <div className="page-container py-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
          <Package size={18} style={{ color: '#2563eb' }} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-none">My Orders</h1>
          <p className="text-xs text-gray-400 mt-0.5">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-sm mx-auto">
          <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <Package size={36} style={{ color: '#d1d5db' }} />
          </div>
          <h2 className="text-base font-bold text-gray-700 mb-1">No orders yet</h2>
          <p className="text-sm text-gray-400 mb-5">Your order history will appear here</p>
          <Link to="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
            style={{ background: '#2563eb' }}
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items || [];
            const isExpanded = expanded[order.id];
            const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl overflow-hidden"
                style={{ border: '1.5px solid #f0f0f0' }}
              >
                {/* ── Order Header ── */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Status dot */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: status.bg, border: `1px solid ${status.border}` }}>
                      <CheckCircle size={16} style={{ color: status.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold" style={{ color: '#111827' }}>
                          #{order.order_id}
                        </span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-right">
                      <p className="text-sm font-black" style={{ color: '#111827' }}>
                        {formatPrice(order.total_amount)}
                      </p>
                      <p className="text-xs" style={{ color: '#9ca3af' }}>
                        {items.length} item{items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                      style={{ background: isExpanded ? '#eff6ff' : '#f9fafb', border: '1px solid #e5e7eb' }}
                    >
                      {isExpanded
                        ? <ChevronUp size={15} style={{ color: '#2563eb' }} />
                        : <ChevronDown size={15} style={{ color: '#6b7280' }} />
                      }
                    </button>
                  </div>
                </div>

                {/* ── Collapsed Preview ── */}
                {!isExpanded && (
                  <div
                    className="px-4 pb-4 flex gap-2 overflow-x-auto"
                    style={{ scrollbarWidth: 'none' }}
                  >
                    {items.slice(0, 4).map((item, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 flex items-center gap-2 rounded-xl p-2"
                        style={{ background: '#f9fafb', border: '1px solid #f0f0f0', minWidth: 0 }}
                      >
                        <img
                          src={item.product_image || item.image}
                          alt={item.product_title || item.title}
                          className="w-10 h-10 object-contain rounded-lg flex-shrink-0"
                          style={{ background: '#fff', border: '1px solid #f0f0f0' }}
                          onError={e => { e.target.src = 'https://via.placeholder.com/40'; }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <p className="text-xs font-medium truncate" style={{ maxWidth: 110, color: '#374151' }}>
                            {item.product_title || item.title}
                          </p>
                          <p className="text-[10px]" style={{ color: '#9ca3af' }}>×{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {items.length > 4 && (
                      <div className="flex-shrink-0 flex items-center px-3 text-xs font-medium" style={{ color: '#6b7280' }}>
                        +{items.length - 4} more
                      </div>
                    )}
                  </div>
                )}

                {/* ── Expanded Details ── */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 animate-fade-in">
                    <div style={{ height: 1, background: '#f3f4f6' }} />

                    {/* Delivery Address */}
                    <div className="rounded-xl p-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <MapPin size={13} style={{ color: '#16a34a' }} />
                        <span className="text-xs font-bold" style={{ color: '#15803d' }}>Delivery Address</span>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: '#111827' }}>
                        {order.customer_name}
                        {order.customer_phone && (
                          <span className="font-normal text-xs ml-2" style={{ color: '#6b7280' }}>
                            · {order.customer_phone}
                          </span>
                        )}
                      </p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#4b5563' }}>
                        {[order.address_line1, order.address_line2, order.city, order.state, order.pincode]
                          .filter(Boolean).join(', ')}
                      </p>
                    </div>

                    {/* Payment */}
                    <div className="rounded-xl p-3 flex items-center gap-3"
                      style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                      <CreditCard size={15} style={{ color: '#2563eb' }} />
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: '#93c5fd' }}>Payment</p>
                        <p className="text-xs font-bold" style={{ color: '#1d4ed8' }}>
                          {order.payment_method === 'COD' ? 'Cash on Delivery'
                            : order.payment_method === 'UPI' ? 'UPI Payment'
                              : order.payment_method === 'CARD' ? 'Credit / Debit Card'
                                : order.payment_method === 'NET_BANKING' ? 'Net Banking'
                                  : order.payment_method}
                        </p>
                      </div>
                      <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: order.payment_method === 'COD' ? '#fff7ed' : '#f0fdf4', color: order.payment_method === 'COD' ? '#c2410c' : '#15803d', border: `1px solid ${order.payment_method === 'COD' ? '#fed7aa' : '#bbf7d0'}` }}>
                        {order.payment_method === 'COD' ? 'Pay on Delivery' : 'Paid'}
                      </span>
                    </div>

                    {/* Items list */}
                    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #f0f0f0' }}>
                      {items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3"
                          style={{ borderBottom: i < items.length - 1 ? '1px solid #f9fafb' : 'none' }}
                        >
                          <Link to={`/product/${item.product_id}`} className="flex-shrink-0">
                            <img
                              src={item.product_image || item.image}
                              alt={item.product_title || item.title}
                              className="w-14 h-14 object-contain rounded-xl"
                              style={{ background: '#f9fafb', border: '1px solid #f0f0f0' }}
                              onError={e => { e.target.src = 'https://via.placeholder.com/56'; }}
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${item.product_id}`}>
                              <p className="text-sm font-semibold line-clamp-2 hover:text-blue-600 transition-colors"
                                style={{ color: '#111827' }}>
                                {item.product_title || item.title}
                              </p>
                            </Link>
                            <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-bold flex-shrink-0" style={{ color: '#111827' }}>
                            {formatPrice(item.subtotal)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Price Summary */}
                    <div className="rounded-xl p-3 space-y-2" style={{ background: '#f9fafb', border: '1px solid #f0f0f0' }}>
                      <div className="flex justify-between text-xs" style={{ color: '#6b7280' }}>
                        <span>Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-xs" style={{ color: '#6b7280' }}>
                        <span>Delivery</span>
                        <span style={{ color: order.delivery_charge === 0 ? '#16a34a' : '#6b7280', fontWeight: order.delivery_charge === 0 ? 600 : 400 }}>
                          {order.delivery_charge === 0 ? 'FREE' : formatPrice(order.delivery_charge)}
                        </span>
                      </div>
                      <div
                        className="flex justify-between text-sm font-black pt-2"
                        style={{ borderTop: '1px solid #e5e7eb', color: '#111827' }}
                      >
                        <span>Total</span>
                        <span>{formatPrice(order.total_amount)}</span>
                      </div>
                    </div>

                    {/* Delivery estimate */}
                    <div className="flex items-center gap-2 px-1">
                      <Truck size={13} style={{ color: '#f97316' }} />
                      <p className="text-xs font-medium" style={{ color: '#6b7280' }}>
                        Estimated delivery: <span style={{ color: '#ea580c', fontWeight: 700 }}>3–5 business days</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
