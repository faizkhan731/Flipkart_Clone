



import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, User, ChevronDown, X, Menu,
  Package, Heart, Bell, HelpCircle, Tag, Truck,
  CreditCard, Shield, Phone, ChevronRight, LogIn, UserPlus
} from 'lucide-react';
import { useCart } from '../context/CartContext';

// ── More Dropdown Items ──────────────────────────────────────────
const MORE_ITEMS = [
  {
    section: 'Notifications',
    items: [
      { icon: Bell, label: 'Notification Preferences' },
      { icon: HelpCircle, label: 'Help Center' },
      { icon: Shield, label: 'Advertise' },
    ],
  },
  {
    section: 'Sell on Flipkart',
    items: [
      { icon: Tag, label: 'Sell on Flipkart' },
      { icon: Truck, label: 'Become a Seller' },
    ],
  },
];

// ── Login Modal ──────────────────────────────────────────────────
const LoginModal = ({ onClose }) => {
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (phone.length === 10) setShowOTP(true);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    alert('✅ Logged in successfully! (Demo mode)');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">

          {/* Header */}
          <div className="bg-flipkart-blue p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-1">
              {tab === 'login' ? 'Login' : 'Create Account'}
            </h2>
            <p className="text-blue-200 text-sm">
              {tab === 'login'
                ? 'Get access to your Orders, Wishlist and Recommendations'
                : 'Looks like you are new here!'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {['login', 'signup'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setShowOTP(false); setPhone(''); }}
                className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors
                  ${tab === t
                    ? 'text-flipkart-blue border-b-2 border-flipkart-blue'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {t === 'login' ? ' Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="p-6">
            {!showOTP ? (
              <form onSubmit={handleLogin} className="space-y-4">
                {tab === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-flipkart-blue focus:ring-1 focus:ring-flipkart-blue"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Mobile Number
                  </label>
                  <div className="flex items-center border border-gray-300 rounded overflow-hidden focus-within:border-flipkart-blue focus-within:ring-1 focus-within:ring-flipkart-blue">
                    <span className="px-3 py-2.5 bg-gray-50 text-sm text-gray-600 border-r border-gray-300 font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter mobile number"
                      className="flex-1 px-3 py-2.5 text-sm outline-none"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-400">
                  By continuing, you agree to Flipkart's{' '}
                  <span className="text-flipkart-blue cursor-pointer hover:underline">Terms of Use</span>
                  {' '}and{' '}
                  <span className="text-flipkart-blue cursor-pointer hover:underline">Privacy Policy</span>.
                </p>

                <button
                  type="submit"
                  disabled={phone.length !== 10}
                  className="w-full bg-flipkart-orange hover:bg-red-600 disabled:bg-orange-300 text-white font-bold py-3 rounded transition-all active:scale-95"
                >
                  {tab === 'login' ? 'Continue' : 'Create Account'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Phone size={28} className="text-flipkart-blue" />
                  </div>
                  <p className="text-sm text-gray-600">
                    OTP sent to <strong>+91 {phone}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowOTP(false)}
                    className="text-xs text-flipkart-blue hover:underline mt-1"
                  >
                    Change number
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-flipkart-blue focus:ring-1 focus:ring-flipkart-blue tracking-widest text-center text-lg font-bold"
                    maxLength={6}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-flipkart-orange hover:bg-red-600 text-white font-bold py-3 rounded transition-all active:scale-95"
                >
                  Verify OTP
                </button>

                <p className="text-center text-xs text-gray-400">
                  Didn't receive?{' '}
                  <button type="button" className="text-flipkart-blue hover:underline font-medium">
                    Resend OTP
                  </button>
                </p>
              </form>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
              className="w-full border-2 border-flipkart-blue text-flipkart-blue hover:bg-blue-50 font-semibold py-2.5 rounded transition-colors text-sm flex items-center justify-center gap-2"
            >
              {tab === 'login'
                ? <><UserPlus size={16} /> New to Flipkart? Create Account</>
                : <><LogIn size={16} /> Already have account? Login</>
              }
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ── More Dropdown ────────────────────────────────────────────────
const MoreDropdown = ({ onClose }) => {
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-lg shadow-2xl z-40 overflow-hidden border border-gray-100 animate-fade-in">
        {MORE_ITEMS.map((group) => (
          <div key={group.section}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 pt-3 pb-1">
              {group.section}
            </p>
            {group.items.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => onClose()}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-flipkart-blue transition-colors text-left"
              >
                <Icon size={15} className="flex-shrink-0 text-gray-400" />
                <span>{label}</span>
                <ChevronRight size={13} className="ml-auto text-gray-300" />
              </button>
            ))}
            <div className="border-b border-gray-100 mx-3" />
          </div>
        ))}

        {/* Quick Links */}
        <div className="p-2">
          <button
            onClick={() => handleNav('/orders')}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-flipkart-blue rounded-lg transition-colors"
          >
            <Package size={15} className="text-gray-400" />
            My Orders
            <ChevronRight size={13} className="ml-auto text-gray-300" />
          </button>
          <button
            onClick={() => handleNav('/products')}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-flipkart-blue rounded-lg transition-colors"
          >
            <Heart size={15} className="text-gray-400" />
            Wishlist
            <ChevronRight size={13} className="ml-auto text-gray-300" />
          </button>
          <button
            onClick={() => handleNav('/cart')}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-flipkart-blue rounded-lg transition-colors"
          >
            <CreditCard size={15} className="text-gray-400" />
            My Payments
            <ChevronRight size={13} className="ml-auto text-gray-300" />
          </button>
        </div>
      </div>
    </>
  );
};

// ── Main Navbar ──────────────────────────────────────────────────
const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const { cartCount, fetchCount } = useCart();
  const navigate = useNavigate();
  const inputRef = useRef();
  const moreRef = useRef();

  useEffect(() => { fetchCount(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    navigate(`/products?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <nav className="navbar-gradient sticky top-0 z-40 shadow-navbar w-full">
        <div className="w-full px-4 lg:px-6 xl:px-10">
          <div className="flex items-center h-14 gap-3">

            {/* ── Logo ── */}
            {/* <Link to="/" className="flex-shrink-0 flex flex-col items-start mr-1">
              <span className="text-white font-bold text-xl italic leading-none tracking-wide"
                style={{ fontFamily: 'Georgia, serif' }}>
                Flipkart
              </span>
              <span className="text-yellow-300 text-[10px] italic leading-none flex items-center gap-0.5">
                Explore <span className="text-white ml-0.5">Plus</span>
                <span className="text-yellow-300 ml-0.5">★</span>
              </span>
            </Link> */}
            <Link to="/" className="flex-shrink-0 flex flex-col items-start mr-1">
              <span
                className="text-white font-bold text-lg sm:text-xl italic leading-none tracking-wide"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Flipkart
              </span>
              <span className="text-yellow-300 text-[9px] sm:text-[12px] italic leading-none flex items-center gap-0.5">
                Explore <span className="text-white ml-0.5">Plus</span>
                <span className="text-yellow-300 ml-0.5">★</span>
              </span>
            </Link>

            {/* ── Search Bar ── */}
            {/* <form onSubmit={handleSearch} className="flex-1">
              <div className="flex items-center bg-white rounded-sm overflow-hidden shadow-sm">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more"
                  className="w-full px-4 py-2.5 text-sm text-gray-700 outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); inputRef.current?.focus(); }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={15} />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2.5 text-flipkart-blue hover:bg-blue-50 transition-colors border-l border-gray-100 flex-shrink-0"
                >
                  <Search size={20} />
                </button>
              </div>
            </form> */}

            {/* ── Search Bar ── */}
            <form onSubmit={handleSearch} className="flex-1 min-w-0">
              <div className="flex items-center bg-white rounded-sm overflow-hidden shadow-sm">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands..."
                  className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-700 outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    // onClick={() => { setSearchQuery(''); inputRef.current?.focus(); }}
                    onClick={() => {
                      setSearchQuery('');
                      navigate('/products');
                      inputRef.current?.focus();
                    }}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 sm:py-2.5 text-flipkart-blue hover:bg-blue-50 transition-colors border-l border-gray-100 flex-shrink-0"
                >
                  <Search size={18} className="sm:hidden" />
                  <Search size={20} className="hidden sm:block" />
                </button>
              </div>
            </form>

            {/* ── Desktop Nav ── */}
            <div className="hidden md:flex items-center gap-1 flex-shrink-0">

              {/* Login Button */}
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-1.5 bg-white text-flipkart-blue font-bold text-sm px-5 py-1.5 rounded-sm hover:bg-blue-50 transition-colors shadow-sm"
              >
                <User size={15} />
                Login
              </button>

              {/* More Button */}
              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setShowMore(v => !v)}
                  className={`flex items-center gap-1 text-white text-sm font-medium px-3 py-1.5 rounded-sm transition-colors
                    ${showMore ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                >
                  More
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* More Dropdown */}
                {showMore && (
                  <MoreDropdown onClose={() => setShowMore(false)} />
                )}
              </div>

              {/* Cart */}
              <Link
                to="/cart"
                className="flex items-center gap-1.5 text-white text-sm font-medium px-3 py-1.5 hover:bg-blue-700 rounded-sm transition-colors"
              >
                <div className="relative">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-flipkart-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden lg:inline">Cart</span>
              </Link>
            </div>

            {/* ── Mobile Icons ── */}
            <div className="flex md:hidden items-center gap-3 ml-auto flex-shrink-0">
              <Link to="/cart" className="text-white relative">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-flipkart-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(v => !v)}
                className="text-white"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-blue-300 animate-fade-in">
            {/* Login Row */}
            <button
              onClick={() => { setShowLogin(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={18} className="text-flipkart-blue" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-flipkart-blue">Login / Sign Up</p>
                <p className="text-xs text-gray-400">Access orders, wishlist & more</p>
              </div>
              <ChevronRight size={16} className="ml-auto text-gray-400" />
            </button>

            {/* Menu Links */}
            {[
              { icon: Package, label: 'My Orders', path: '/orders' },
              { icon: ShoppingCart, label: 'My Cart', path: '/cart' },
              { icon: Heart, label: 'Wishlist', path: '/products' },
              { icon: Tag, label: 'All Products', path: '/products' },
              { icon: HelpCircle, label: 'Help & Support', path: '/' },
            ].map(({ icon: Icon, label, path }) => (
              <Link
                key={label}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <Icon size={17} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <ChevronRight size={14} className="ml-auto text-gray-300" />
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ── Login Modal ── */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Navbar;