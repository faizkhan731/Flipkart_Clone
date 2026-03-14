import React, { createContext, useContext, useState, useCallback } from 'react';
import { cartService } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await cartService.getCart();
      if (data.success) {
        setCartItems(data.items);
        setCartSummary(data.summary);
        setCartCount(data.summary.itemCount);
      }
    } catch (err) {
      console.error('fetchCart error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCount = useCallback(async () => {
    try {
      const { data } = await cartService.getCount();
      if (data.success) setCartCount(data.count);
    } catch (err) {}
  }, []);

  const addToCart = useCallback(async (productId, qty = 1) => {
    try {
      const { data } = await cartService.addItem(productId, qty);
      if (data.success) {
        setCartCount(data.cartCount);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add' };
    }
  }, []);

  const updateItem = useCallback(async (id, qty) => {
    try {
      await cartService.updateItem(id, qty);
      await fetchCart();
    } catch (err) {
      console.error('updateItem error:', err);
    }
  }, [fetchCart]);

  const removeItem = useCallback(async (id) => {
    try {
      await cartService.removeItem(id);
      await fetchCart();
    } catch (err) {
      console.error('removeItem error:', err);
    }
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{
      cartCount, cartItems, cartSummary, loading,
      fetchCart, fetchCount, addToCart, updateItem, removeItem
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
