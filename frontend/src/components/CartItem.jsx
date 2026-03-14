import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const CartItem = ({ item }) => {
  const { updateItem, removeItem } = useCart();
  const { addToast } = useToast();

  const images = typeof item.images === 'string' ? JSON.parse(item.images) : item.images || [];
  const image = images[0] || 'https://via.placeholder.com/80x80?text=No+Image';

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const handleRemove = async () => {
    await removeItem(item.id);
    addToast('Item removed from cart', 'info');
  };

  const handleQty = async (delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return handleRemove();
    if (newQty > Math.min(item.stock, 10)) {
      addToast('Maximum quantity reached', 'error');
      return;
    }
    await updateItem(item.id, newQty);
  };

  return (
    <div className="bg-white p-4 rounded-sm shadow-card flex gap-4 animate-fade-in">
      {/* Product Image */}
      <Link to={`/product/${item.product_id}`} className="flex-shrink-0">
        <img
          src={image}
          alt={item.title}
          className="w-20 h-20 sm:w-24 sm:h-24 object-contain border border-gray-100 rounded"
          onError={e => { e.target.src = 'https://via.placeholder.com/80?text=No+Image'; }}
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link to={`/product/${item.product_id}`}>
          <h3 className="text-sm font-medium text-flipkart-text-dark hover:text-flipkart-blue line-clamp-2 leading-snug">
            {item.title}
          </h3>
        </Link>
        {item.brand && (
          <p className="text-xs text-flipkart-gray-dark mt-0.5">{item.brand}</p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-bold">{formatPrice(item.price)}</span>
          {item.original_price && item.original_price > item.price && (
            <>
              <span className="text-sm text-flipkart-gray-dark line-through">{formatPrice(item.original_price)}</span>
              <span className="badge-discount">{item.discount_percent}% off</span>
            </>
          )}
        </div>

        <p className="text-xs text-green-600 font-medium mt-0.5">
          Free delivery
        </p>

        {/* Actions Row */}
        <div className="flex items-center justify-between mt-3">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
            <button
              onClick={() => handleQty(-1)}
              className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors font-bold"
            >
              <Minus size={13} />
            </button>
            <span className="px-4 py-1.5 text-sm font-semibold bg-white min-w-[36px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQty(1)}
              className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors font-bold"
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={handleRemove}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded hover:bg-red-50"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="hidden sm:flex flex-col items-end justify-between flex-shrink-0">
        <span className="text-base font-bold text-flipkart-text-dark">
          {formatPrice(item.price * item.quantity)}
        </span>
        <span className="text-xs text-flipkart-gray-dark">
          {item.quantity} × {formatPrice(item.price)}
        </span>
      </div>
    </div>
  );
};

export default CartItem;
