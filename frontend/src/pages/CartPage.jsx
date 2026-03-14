import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Tag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const CartPage = () => {
  const { cartItems, cartSummary, loading, fetchCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  if (loading) return (
    <div className="page-container py-8 flex justify-center items-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-flipkart-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading cart...</p>
      </div>
    </div>
  );

  if (cartItems.length === 0) return (
    <div className="page-container py-8">
      <div className="bg-white rounded-sm shadow-card p-12 sm:p-20 text-center max-w-lg mx-auto">
        <ShoppingCart size={80} className="mx-auto text-gray-200 mb-6" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty!</h2>
        <p className="text-gray-400 mb-6">Add items to it now.</p>
        <Link to="/products"
          className="inline-flex items-center gap-2 btn-blue px-8 py-3">
          Shop Now <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="page-container py-4 animate-fade-in">
      <h1 className="text-xl font-bold text-flipkart-text-dark mb-4 flex items-center gap-2">
        <ShoppingCart size={22} /> My Cart
        <span className="text-base font-normal text-flipkart-gray-dark">({cartSummary?.itemCount} items)</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Cart Items */}
        <div className="flex-1 min-w-0 space-y-3">
          {cartItems.map(item => <CartItem key={item.id} item={item} />)}

          {/* Delivery message */}
          <div className="bg-white rounded-sm shadow-card p-4 flex items-center gap-3">
            <Truck className="text-flipkart-blue flex-shrink-0" size={20} />
            <div>
              {cartSummary?.deliveryCharge === 0 ? (
                <p className="text-sm">
                  <span className="font-semibold text-green-600"> Yay! Free delivery</span>
                  <span className="text-gray-600"> on this order</span>
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Add items worth{' '}
                  <span className="font-semibold text-flipkart-blue">
                    {formatPrice(499 - (cartSummary?.subtotal || 0))}
                  </span>{' '}
                  more for <span className="font-semibold text-green-600">FREE delivery</span>
                </p>
              )}
            </div>
          </div>

          {/* Place Order Button (mobile) */}
          <div className="lg:hidden">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full btn-orange py-4 text-base flex items-center justify-center gap-2">
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-80 w-full flex-shrink-0 space-y-3 lg:sticky-top">
          <div className="bg-white rounded-sm shadow-card overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-flipkart-gray-dark uppercase tracking-widest flex items-center gap-2">
                <Tag size={14} /> Price Details
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Price ({cartSummary?.itemCount} items)</span>
                <span>{formatPrice(cartSummary?.originalTotal)}</span>
              </div>
              {cartSummary?.totalDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>− {formatPrice(cartSummary?.totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-700">
                <span>Delivery Charges</span>
                <span className={cartSummary?.deliveryCharge === 0 ? 'text-green-600 font-medium' : ''}>
                  {cartSummary?.deliveryCharge === 0 ? ' FREE' : formatPrice(cartSummary?.deliveryCharge)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-base text-flipkart-text-dark">
                <span>Total Amount</span>
                <span>{formatPrice(cartSummary?.total)}</span>
              </div>
              {cartSummary?.totalDiscount > 0 && (
                <p className="text-sm text-green-600 font-semibold bg-green-50 px-3 py-2 rounded">
                  You save {formatPrice(cartSummary?.totalDiscount)} on this order
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="hidden lg:flex w-full btn-orange py-4 text-base items-center justify-center gap-2">
            Proceed to Checkout <ArrowRight size={18} />
          </button>

          {/* Safe Payment */}
          <div className="hidden lg:flex items-center justify-center gap-2 text-xs text-gray-400">
            <span>🔒</span>
            <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
