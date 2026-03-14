import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Zap, Shield, RotateCcw, Truck, Plus, Minus, Heart, Share2 } from 'lucide-react';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingCart, setAddingCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await productService.getById(id);
        if (data.success) {
          setProduct(data.product);
          setSimilar(data.similar || []);
          setSelectedImage(0);
          setQuantity(1);
        }
      } catch (err) {
        console.error('Product load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="page-container py-6">
      <div className="bg-white rounded-sm shadow-card p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="skeleton md:w-96 h-80 rounded" />
          <div className="flex-1 space-y-4">
            {[80, 60, 40, 30, 50].map((w, i) => (
              <div key={i} className={`skeleton h-5 rounded`} style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="page-container py-16 text-center">
      <p className="text-5xl mb-4">😕</p>
      <h2 className="text-xl font-bold text-gray-600 mb-2">Product not found</h2>
      <button onClick={() => navigate('/products')} className="btn-blue mt-4">Browse Products</button>
    </div>
  );

  const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images || [];
  const specs = typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications || {};

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const renderStars = (rating) => Array.from({ length: 5 }, (_, i) => (
    <Star key={i} size={16}
      className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
  ));

  const handleAddToCart = async () => {
    setAddingCart(true);
    const res = await addToCart(product.id, quantity);
    if (res?.success !== false) {
      addToast('Added to cart successfully!', 'success');
    } else {
      addToast(res.message || 'Failed to add to cart', 'error');
    }
    setAddingCart(false);
  };

  const handleBuyNow = async () => {
    setAddingCart(true);
    const res = await addToCart(product.id, quantity);
    setAddingCart(false);
    if (res?.success !== false) {
      navigate('/cart');
    } else {
      addToast(res.message || 'Failed to add to cart', 'error');
    }
  };

  return (
    <div className="page-container py-4 animate-fade-in">
      {/* Breadcrumb */}
      <div className="text-xs text-flipkart-gray-dark mb-3 flex items-center gap-1">
        <button onClick={() => navigate('/')} className="hover:text-flipkart-blue">Home</button>
        <span>/</span>
        <button onClick={() => navigate(`/products?category=${product.category_name}`)}
          className="hover:text-flipkart-blue">{product.category_name}</button>
        <span>/</span>
        <span className="text-gray-500 truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Product Card */}
      <div className="bg-white rounded-sm shadow-card overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left: Images */}
          <div className="md:w-96 md:border-r border-gray-100 p-6 flex flex-col gap-4 sticky-top bg-white">
            <div className="relative">
              <img
                src={images[selectedImage] || 'https://via.placeholder.com/400x400'}
                alt={product.title}
                className="w-full h-72 sm:h-80 object-contain rounded"
                onError={e => { e.target.src = 'https://via.placeholder.com/400?text=No+Image'; }}
              />
              {product.discount_percent > 0 && (
                <span className="absolute top-2 left-2 badge-discount text-sm">{product.discount_percent}% off</span>
              )}
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="absolute top-2 right-2 p-2 rounded-full bg-white shadow hover:shadow-md transition-all">
                <Heart size={18} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {images.map((img, i) => (
                  <button key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`border-2 rounded p-1 transition-all ${i === selectedImage ? 'border-flipkart-blue' : 'border-gray-200 hover:border-gray-400'}`}>
                    <img src={img} alt="" className="w-12 h-12 object-contain"
                      onError={e => { e.target.src = 'https://via.placeholder.com/50'; }} />
                  </button>
                ))}
              </div>
            )}


            <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full">
              <button
                onClick={handleAddToCart}
                disabled={addingCart || product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-150 active:scale-95 disabled:opacity-50"
                style={{
                  fontSize: 'clamp(11px, 2.5vw, 14px)',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  border: '1.5px solid #bfdbfe',
                }}
                onMouseEnter={e => { if (!addingCart && product.stock > 0) e.currentTarget.style.background = '#dbeafe'; }}
                onMouseLeave={e => { if (!addingCart && product.stock > 0) e.currentTarget.style.background = '#eff6ff'; }}
              >
                <ShoppingCart size={16} />
                {addingCart ? 'Adding...' : 'Add to Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={addingCart || product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-150 active:scale-95 disabled:opacity-50"
                style={{
                  fontSize: 'clamp(11px, 2.5vw, 14px)',
                  background: '#ff6000',
                  color: '#fff',
                  border: '1.5px solid #ff6000',
                }}
                onMouseEnter={e => { if (!addingCart && product.stock > 0) e.currentTarget.style.background = '#e55500'; }}
                onMouseLeave={e => { if (!addingCart && product.stock > 0) e.currentTarget.style.background = '#ff6000'; }}
              >
                <Zap size={16} />
                Buy Now
              </button>
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex-1 p-6">
            {/* Title & Rating */}
            <h1 className="text-xl font-semibold text-flipkart-text-dark leading-snug">{product.title}</h1>

            <div className="flex items-center gap-3 mt-2">
              <span className="rating-badge text-sm">
                {product.rating} <Star size={12} className="fill-current" />
              </span>
              <span className="text-sm text-flipkart-gray-dark">
                {(product.rating_count || 0).toLocaleString('en-IN')} Ratings &amp; Reviews
              </span>
              {product.brand && (
                <span className="text-sm text-flipkart-gray-dark border-l pl-3">by <strong>{product.brand}</strong></span>
              )}
            </div>

            {/* Price */}
            <div className="mt-4 pb-4 border-b border-dashed border-gray-200">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-flipkart-text-dark">{formatPrice(product.price)}</span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-lg text-flipkart-gray-dark line-through">{formatPrice(product.original_price)}</span>
                )}
                {product.discount_percent > 0 && (
                  <span className="text-lg text-green-600 font-bold">{product.discount_percent}% off</span>
                )}
              </div>
              <p className="text-sm text-green-600 font-medium mt-1">
                {product.price >= 499 ? '✅ Free delivery on this order' : 'Delivery charge: ₹40'}
              </p>
            </div>

            {/* Stock */}
            <div className="mt-4">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium text-green-600">
                    In Stock {product.stock < 10 && <span className="text-orange-500">(Only {product.stock} left)</span>}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm font-medium text-red-500">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-600">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100 font-bold transition-colors">
                  <Minus size={14} />
                </button>
                <span className="px-5 py-2 font-bold text-sm border-x border-gray-300 min-w-[44px] text-center">
                  {quantity}
                </span>
                <button onClick={() => setQuantity(q => Math.min(Math.min(product.stock, 10), q + 1))}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100 font-bold transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Highlights */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <Truck size={20} />, label: 'Free Delivery', sub: 'On orders ₹499+' },
                { icon: <RotateCcw size={20} />, label: '7 Day Returns', sub: 'No questions asked' },
                { icon: <Shield size={20} />, label: '1 Year Warranty', sub: 'Brand warranty' },
                { icon: <Zap size={20} />, label: 'Cash on Delivery', sub: 'Available' },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-flipkart-blue mb-1">{icon}</div>
                  <span className="text-xs font-semibold text-gray-700">{label}</span>
                  <span className="text-xs text-gray-500">{sub}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mt-6">
              <div className="flex border-b border-gray-200">
                {['description', 'specifications'].map(tab => (
                  <button key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px
                      ${activeTab === tab ? 'border-flipkart-blue text-flipkart-blue' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="pt-4">
                {activeTab === 'description' ? (
                  <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-gray-100">
                    <table className="w-full text-sm">
                      <tbody>
                        {Object.entries(specs).map(([key, val], i) => (
                          <tr key={key} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-4 py-2.5 font-medium text-gray-600 w-40">{key}</td>
                            <td className="px-4 py-2.5 text-gray-800">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similar.length > 0 && (
        <div className="mt-4 bg-white rounded-sm shadow-card p-4">
          <h2 className="section-title">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {similar.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
