import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Tag, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/api';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh'
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartSummary, fetchCart } = useCart();
  const { addToast } = useToast();

  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [form, setForm] = useState({
    customer_name: '', customer_phone: '',
    address_line1: '', address_line2: '',
    city: '', state: '', pincode: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (!cartItems.length && !cartSummary) return;
    if (cartItems.length === 0) navigate('/cart');
  }, [cartItems]);

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p || 0);

  const validate = () => {
    const e = {};
    if (!form.customer_name.trim()) e.customer_name = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(form.customer_phone)) e.customer_phone = 'Enter valid 10-digit phone';
    if (!form.address_line1.trim()) e.address_line1 = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state) e.state = 'State is required';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { addToast('Please fix the errors below', 'error'); return; }

    setPlacing(true);
    try {
      const { data } = await orderService.placeOrder({ ...form, payment_method: paymentMethod });
      if (data.success) {
        navigate('/order-success', { state: { order: data.order }, replace: true });
      } else {
        addToast(data.message || 'Failed to place order', 'error');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Server error. Try again.', 'error');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="page-container py-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate('/cart')}
          className="flex items-center gap-1.5 text-flipkart-blue text-sm font-medium hover:underline">
          <ArrowLeft size={16} /> Back to Cart
        </button>
        <span className="text-gray-300">|</span>
        <h1 className="text-xl font-bold text-flipkart-text-dark">Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="bg-flipkart-blue text-white rounded-sm shadow-card p-4 mb-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          {['Cart', 'Address', 'Payment', 'Confirmation'].map((step, i) => (
            <React.Fragment key={step}>
              <div className={`flex items-center gap-1.5 ${i <= 1 ? 'text-white' : 'text-blue-300'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                  ${i === 0 ? 'bg-white text-flipkart-blue' : i === 1 ? 'bg-yellow-400 text-gray-900' : 'bg-blue-500 text-blue-200'}`}>
                  {i < 1 ? <CheckCircle size={12} /> : i + 1}
                </div>
                <span className="hidden sm:inline">{step}</span>
              </div>
              {i < 3 && <div className={`flex-1 h-px ${i < 1 ? 'bg-white' : 'bg-blue-500'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Left: Address + Payment */}
          <div className="flex-1 space-y-4">
            {/* Delivery Address */}
            <div className="bg-white rounded-sm shadow-card overflow-hidden">
              <div className="bg-gray-50 border-b px-4 py-3 flex items-center gap-2">
                <MapPin size={18} className="text-flipkart-blue" />
                <h2 className="font-bold text-flipkart-text-dark">Delivery Address</h2>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                  <input type="text" value={form.customer_name} onChange={handleChange('customer_name')}
                    placeholder="Enter your full name"
                    className={`input-field ${errors.customer_name ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`} />
                  {errors.customer_name && <p className="text-xs text-red-500 mt-1">{errors.customer_name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number *</label>
                  <input type="tel" value={form.customer_phone} onChange={handleChange('customer_phone')}
                    placeholder="10-digit mobile number" maxLength={10}
                    className={`input-field ${errors.customer_phone ? 'border-red-400' : ''}`} />
                  {errors.customer_phone && <p className="text-xs text-red-500 mt-1">{errors.customer_phone}</p>}
                </div>

                {/* Address Line 1 */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Address Line 1 *</label>
                  <input type="text" value={form.address_line1} onChange={handleChange('address_line1')}
                    placeholder="House No., Building, Street, Area"
                    className={`input-field ${errors.address_line1 ? 'border-red-400' : ''}`} />
                  {errors.address_line1 && <p className="text-xs text-red-500 mt-1">{errors.address_line1}</p>}
                </div>

                {/* Address Line 2 */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Address Line 2 <span className="text-gray-400">(optional)</span></label>
                  <input type="text" value={form.address_line2} onChange={handleChange('address_line2')}
                    placeholder="Locality, Landmark (optional)"
                    className="input-field" />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">City *</label>
                  <input type="text" value={form.city} onChange={handleChange('city')}
                    placeholder="City" className={`input-field ${errors.city ? 'border-red-400' : ''}`} />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Pincode *</label>
                  <input type="text" value={form.pincode} onChange={handleChange('pincode')}
                    placeholder="6-digit pincode" maxLength={6}
                    className={`input-field ${errors.pincode ? 'border-red-400' : ''}`} />
                  {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                </div>

                {/* State */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">State *</label>
                  <select value={form.state} onChange={handleChange('state')}
                    className={`input-field ${errors.state ? 'border-red-400' : ''}`}>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-sm shadow-card overflow-hidden">
              <div className="bg-gray-50 border-b px-4 py-3 flex items-center gap-2">
                <CreditCard size={18} className="text-flipkart-blue" />
                <h2 className="font-bold text-flipkart-text-dark">Payment Method</h2>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { value: 'COD', label: 'Cash on Delivery', desc: 'Pay when order arrives' },
                  { value: 'UPI', label: 'UPI Payment', desc: 'Google Pay, PhonePe, Paytm' },
                  { value: 'CARD', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                  { value: 'NET_BANKING', label: 'Net Banking', desc: 'All major banks supported' },
                ].map(opt => (
                  <label key={opt.value}
                    className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all
                      ${paymentMethod === opt.value ? 'border-flipkart-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)} className="accent-flipkart-blue" />
                    <span className="text-2xl">{opt.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                      <p className="text-xs text-gray-500">{opt.desc}</p>
                    </div>
                    {paymentMethod === opt.value && (
                      <CheckCircle size={18} className="ml-auto text-flipkart-blue flex-shrink-0" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:w-80 w-full flex-shrink-0 space-y-3 lg:sticky-top">
            {/* Items Preview */}
            <div className="bg-white rounded-sm shadow-card overflow-hidden">
              <div className="bg-gray-50 border-b px-4 py-3">
                <h3 className="font-bold text-flipkart-text-dark">Order Summary ({cartSummary?.itemCount} items)</h3>
              </div>
              <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                {cartItems.map(item => {
                  const imgs = typeof item.images === 'string' ? JSON.parse(item.images) : item.images || [];
                  return (
                    <div key={item.id} className="px-4 py-3 flex items-center gap-3">
                      <img src={imgs[0]} alt={item.title}
                        className="w-12 h-12 object-contain border border-gray-100 rounded flex-shrink-0"
                        onError={e => { e.target.src = 'https://via.placeholder.com/48'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 line-clamp-1">{item.title}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 flex-shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-sm shadow-card overflow-hidden">
              <div className="bg-gray-50 border-b px-4 py-3 flex items-center gap-2">
                <Tag size={14} className="text-gray-500" />
                <h3 className="text-sm font-bold text-flipkart-gray-dark uppercase tracking-widest">Price Details</h3>
              </div>
              <div className="p-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Price ({cartSummary?.itemCount} items)</span>
                  <span>{formatPrice(cartSummary?.originalTotal)}</span>
                </div>
                {(cartSummary?.totalDiscount || 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>− {formatPrice(cartSummary?.totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Delivery</span>
                  <span className={cartSummary?.deliveryCharge === 0 ? 'text-green-600 font-medium' : ''}>
                    {cartSummary?.deliveryCharge === 0 ? 'FREE' : formatPrice(cartSummary?.deliveryCharge)}
                  </span>
                </div>
                <div className="border-t pt-2.5 flex justify-between font-bold text-base text-flipkart-text-dark">
                  <span>Total Amount</span>
                  <span>{formatPrice(cartSummary?.total)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={placing}
              className="w-full btn-orange py-4 text-base font-bold disabled:opacity-60 flex items-center justify-center gap-2">
              {placing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : (
                <> Place Order · {formatPrice(cartSummary?.total)}</>
              )}
            </button>

            <p className="text-xs text-center text-gray-400">
              🔒 By placing this order, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
