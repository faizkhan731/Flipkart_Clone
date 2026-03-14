const { pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// PLACE order
const placeOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const sessionId = req.headers['x-session-id'] || 'default_session';
    const { customer_name, customer_phone, address_line1, address_line2, city, state, pincode, payment_method = 'COD' } = req.body;

    // Validate required fields
    if (!customer_name || !customer_phone || !address_line1 || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: 'All address fields are required' });
    }

    // Get cart items
    const [cartItems] = await connection.execute(
      `SELECT c.quantity, p.id as product_id, p.title, p.price, p.images, p.stock
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.session_id = ?`,
      [sessionId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Check stock
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.title}`
        });
      }
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = subtotal > 499 ? 0 : 40;
    const totalAmount = subtotal + deliveryCharge;

    // Generate unique order ID
    const orderId = 'FK' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();

    // Create order
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (order_id, session_id, customer_name, customer_phone, address_line1, address_line2, city, state, pincode, subtotal, delivery_charge, total_amount, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderId, sessionId, customer_name, customer_phone, address_line1, address_line2 || null, city, state, pincode, subtotal, deliveryCharge, totalAmount, payment_method]
    );

    const dbOrderId = orderResult.insertId;

    // Create order items
    for (const item of cartItems) {
      const images = JSON.parse(item.images || '[]');
      const firstImage = images[0] || '';

      await connection.execute(
        `INSERT INTO order_items (order_id, product_id, product_title, product_image, price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [dbOrderId, item.product_id, item.title, firstImage, item.price, item.quantity, item.price * item.quantity]
      );

      // Reduce stock
      await connection.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await connection.execute('DELETE FROM cart WHERE session_id = ?', [sessionId]);

    await connection.commit();

    res.json({
      success: true,
      message: 'Order placed successfully!',
      order: {
        orderId,
        totalAmount,
        itemCount: cartItems.length,
        estimatedDelivery: '3-5 Business Days'
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('placeOrder error:', error);
    res.status(500).json({ success: false, message: 'Failed to place order', error: error.message });
  } finally {
    connection.release();
  }
};

// GET orders
// const getOrders = async (req, res) => {
//   try {
//     const sessionId = req.headers['x-session-id'] || 'default_session';

//     const [orders] = await pool.execute(
//       `SELECT o.*, 
//               JSON_ARRAYAGG(
//                 JSON_OBJECT(
//                   'id', oi.id,
//                   'product_id', oi.product_id,
//                   'title', oi.product_title,
//                   'image', oi.product_image,
//                   'price', oi.price,
//                   'quantity', oi.quantity,
//                   'subtotal', oi.subtotal
//                 )
//               ) as items
//        FROM orders o
//        LEFT JOIN order_items oi ON o.id = oi.order_id
//        WHERE o.session_id = ?
//        GROUP BY o.id
//        ORDER BY o.created_at DESC`,
//       [sessionId]
//     );

//     res.json({ success: true, orders });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };
const getOrders = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'];

    if (!sessionId) {
      return res.json({ success: true, orders: [] });
    }

    // Pehle orders fetch karo
    const [orders] = await pool.execute(
      `SELECT * FROM orders 
       WHERE session_id = ? 
       ORDER BY created_at DESC`,
      [sessionId]
    );

    // Har order ke liye items fetch karo
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const [items] = await pool.execute(
          `SELECT * FROM order_items WHERE order_id = ?`,
          [order.id]
        );
        return { ...order, items };
      })
    );

    res.json({ success: true, orders: ordersWithItems });

  } catch (error) {
    console.error('getOrders error:', error.message); // ← terminal mein dikhega
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// GET single order
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE order_id = ?', [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const [items] = await pool.execute(
      'SELECT * FROM order_items WHERE order_id = ?', [orders[0].id]
    );

    res.json({ success: true, order: orders[0], items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { placeOrder, getOrders, getOrderById };
