const { pool } = require('../config/db');

// GET cart items
const getCart = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || 'default_session';

    const [items] = await pool.execute(
      `SELECT c.id, c.quantity, c.product_id,
              p.title, p.price, p.original_price, p.discount_percent,
              p.images, p.stock, p.brand
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.session_id = ?`,
      [sessionId]
    );

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const originalTotal = items.reduce((sum, item) => sum + ((item.original_price || item.price) * item.quantity), 0);
    const totalDiscount = originalTotal - subtotal;

    res.json({
      success: true,
      items,
      summary: {
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: parseFloat(subtotal.toFixed(2)),
        originalTotal: parseFloat(originalTotal.toFixed(2)),
        totalDiscount: parseFloat(totalDiscount.toFixed(2)),
        deliveryCharge: subtotal > 499 ? 0 : 40,
        total: parseFloat((subtotal + (subtotal > 499 ? 0 : 40)).toFixed(2))
      }
    });
  } catch (error) {
    console.error('getCart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ADD to cart
const addToCart = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || 'default_session';
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ success: false, message: 'Product ID required' });
    }

    // Check product exists and has stock
    const [products] = await pool.execute(
      'SELECT id, stock FROM products WHERE id = ?', [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Upsert cart item
    await pool.execute(
      `INSERT INTO cart (session_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
      [sessionId, product_id, quantity, quantity]
    );

    // Get updated count
    const [cartCount] = await pool.execute(
      'SELECT SUM(quantity) as count FROM cart WHERE session_id = ?',
      [sessionId]
    );

    res.json({
      success: true,
      message: 'Added to cart',
      cartCount: cartCount[0].count || 0
    });
  } catch (error) {
    console.error('addToCart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// UPDATE cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || 'default_session';
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    await pool.execute(
      'UPDATE cart SET quantity = ? WHERE id = ? AND session_id = ?',
      [quantity, id, sessionId]
    );

    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// REMOVE from cart
const removeFromCart = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || 'default_session';
    const { id } = req.params;

    await pool.execute(
      'DELETE FROM cart WHERE id = ? AND session_id = ?',
      [id, sessionId]
    );

    res.json({ success: true, message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// CLEAR cart
const clearCart = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || 'default_session';
    await pool.execute('DELETE FROM cart WHERE session_id = ?', [sessionId]);
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET cart count
const getCartCount = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || 'default_session';
    const [result] = await pool.execute(
      'SELECT SUM(quantity) as count FROM cart WHERE session_id = ?',
      [sessionId]
    );
    res.json({ success: true, count: result[0].count || 0 });
  } catch (error) {
    res.status(500).json({ success: false, count: 0 });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart, getCartCount };
