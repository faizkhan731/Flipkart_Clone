

import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Zap, BadgeCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const [adding, setAdding] = useState(false);

  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const images = typeof product.images === 'string'
    ? JSON.parse(product.images)
    : product.images || [];
  const image = (!imgError && images[0]) || 'https://via.placeholder.com/300x300?text=No+Image';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    const res = await addToCart(product.id);
    if (res?.success !== false) {
      addToast(`"${product.title.slice(0, 30)}..." added to cart!`, 'success');
    } else {
      addToast(res.message || 'Failed to add to cart', 'error');
    }
    setAdding(false);
  };

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const ratingColor =
    product.rating >= 4 ? '#2e7d32' :
      product.rating >= 3 ? '#f57c00' : '#c62828';

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col rounded-2xl overflow-hidden animate-fade-in"
      style={{
        background: '#fff',
        border: '1.5px solid #f0f0f0',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.15s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)';
        e.currentTarget.style.borderColor = '#d6e4ff';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#f0f0f0';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* ── Image Block ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f8f9ff 0%, #eef2ff 50%, #f8f9ff 100%)',
          // aspectRatio: '1 / 1',
          aspectRatio: '4 / 3',

        }}
      >
        <img
          src={image}
          alt={product.title}
          onError={() => setImgError(true)}
          // className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          style={{ imageRendering: 'crisp-edges' }}
        />

        {/* Wishlist btn */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(!wishlisted); }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: wishlisted ? '#fff0f0' : '#fff',
            border: wishlisted ? '1.5px solid #fca5a5' : '1.5px solid #e5e7eb',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          <Heart
            size={13}
            className="transition-all"
            style={{ fill: wishlisted ? '#ef4444' : 'none', color: wishlisted ? '#ef4444' : '#9ca3af' }}
          />
        </button>

        {/* Discount pill */}
        {product.discount_percent > 0 && (
          <span
            className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}
          >
            -{product.discount_percent}%
          </span>
        )}

        {/* Out of stock */}
        {product.stock === 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(2px)' }}
          >
            <span
              className="text-[11px] font-bold px-3 py-1 rounded-full"
              style={{ background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb' }}
            >
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── Content Block ── */}
      <div className="flex flex-col flex-1 px-3 pt-2.5 pb-3 gap-1.5">

        {/* Brand */}
        {product.brand && (
          <div className="flex items-center gap-1">
            <BadgeCheck size={11} style={{ color: '#3b82f6' }} />
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#3b82f6' }}>
              {product.brand}
            </span>
          </div>
        )}

        {/* Title */}
        <h3
          className="text-[13px] leading-snug line-clamp-2 transition-colors duration-150"
          style={{ fontWeight: 600, color: '#1f2937' }}
        >
          {product.title}
        </h3>

        {/* Rating row */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1.5">
            <span
              className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white"
              style={{ background: ratingColor }}
            >
              {product.rating}
              <Star size={8} style={{ fill: 'white', color: 'white' }} />
            </span>
            <span className="text-[11px]" style={{ color: '#9ca3af' }}>
              ({(product.rating_count || 0).toLocaleString('en-IN')})
            </span>
          </div>
        )}

        {/* Price row */}
        <div className="flex items-baseline gap-1.5 flex-wrap mt-0.5">
          <span className="text-[16px] font-black" style={{ color: '#111827' }}>
            {formatPrice(product.price)}
          </span>
          {product.original_price > product.price && (
            <span className="text-[11px] line-through" style={{ color: '#d1d5db' }}>
              {formatPrice(product.original_price)}
            </span>
          )}
          {product.discount_percent > 0 && (
            <span className="text-[11px] font-semibold" style={{ color: '#16a34a' }}>
              {product.discount_percent}% off
            </span>
          )}
        </div>

        {/* Free delivery */}
        <div className="flex items-center gap-1">
          <Zap size={10} style={{ color: '#2563eb', fill: '#2563eb' }} />
          <span className="text-[10px] font-medium" style={{ color: '#2563eb' }}>Free delivery</span>
        </div>

        {/* Buttons */}
        {/* Buttons */}
        <div className="flex gap-1.5 mt-1.5 w-full">
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="flex-1 min-w-0 flex items-center justify-center py-2 rounded-xl font-semibold transition-all duration-150 active:scale-95 disabled:opacity-50"
            style={{
              gap: '4px',
              fontSize: 'clamp(9px, 1.8vw, 12px)',
              background: product.stock === 0 ? '#f3f4f6' : adding ? '#eff6ff' : '#eff6ff',
              color: product.stock === 0 ? '#9ca3af' : '#1d4ed8',
              border: product.stock === 0 ? '1.5px solid #e5e7eb' : '1.5px solid #bfdbfe',
              cursor: product.stock === 0 ? 'not-allowed' : adding ? 'wait' : 'pointer',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
            onMouseEnter={e => { if (product.stock > 0 && !adding) e.currentTarget.style.background = '#dbeafe'; }}
            onMouseLeave={e => { if (product.stock > 0 && !adding) e.currentTarget.style.background = '#eff6ff'; }}
          >
            <ShoppingCart size={11} style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {product.stock === 0 ? 'N/A' : adding ? '...' : 'Cart'}
            </span>
          </button>

          {product.stock > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/product/${product.id}`);
              }}
              className="flex-1 min-w-0 flex items-center justify-center py-2 rounded-xl font-semibold transition-all duration-150 active:scale-95"
              style={{
                gap: '4px',
                fontSize: 'clamp(9px, 1.8vw, 12px)',
                background: '#ff6000',
                color: '#fff',
                border: '1.5px solid #ff6000',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e55500'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#ff6000'; }}
            >
              <Zap size={11} style={{ flexShrink: 0 }} />
              <span>Buy</span>
            </button>
          )}
        </div>
        {/* Buttons */}
        {/* <div className="mt-1.5">
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-semibold transition-all duration-150 active:scale-95"
            style={
              product.stock === 0
                ? { background: '#f3f4f6', color: '#9ca3af', cursor: 'not-allowed', border: '1.5px solid #e5e7eb' }
                : adding
                  ? { background: '#eff6ff', color: '#3b82f6', border: '1.5px solid #bfdbfe', cursor: 'wait' }
                  : { background: '#eff6ff', color: '#1d4ed8', border: '1.5px solid #bfdbfe' }
            }
            onMouseEnter={e => { if (product.stock > 0 && !adding) e.currentTarget.style.background = '#dbeafe'; }}
            onMouseLeave={e => { if (product.stock > 0 && !adding) e.currentTarget.style.background = '#eff6ff'; }}
          >
            <ShoppingCart size={13} />
            {product.stock === 0 ? 'Unavailable' : adding ? 'Adding...' : 'Add to cart'}
          </button>
        </div> */}

      </div>
    </Link>
  );
};

export default ProductCard;