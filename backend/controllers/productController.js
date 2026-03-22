const { pool } = require('../config/db');

// GET all products with filters
const getProducts = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, c.name as category_name, c.icon as category_icon
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.stock > 0
    `;
    const params = [];

    if (category && category !== 'All') {
      query += ' AND c.name = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.title LIKE ? OR p.brand LIKE ? OR c.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Sorting
    switch (sort) {
      case 'price_asc': query += ' ORDER BY p.price ASC'; break;
      case 'price_desc': query += ' ORDER BY p.price DESC'; break;
      case 'rating': query += ' ORDER BY p.rating DESC'; break;
      case 'discount': query += ' ORDER BY p.discount_percent DESC'; break;
      default: query += ' ORDER BY p.is_featured DESC, p.created_at DESC';
    }

    // Count total
    const countQuery = query.replace(
      'SELECT p.*, c.name as category_name, c.icon as category_icon',
      'SELECT COUNT(*) as total'
    ).split('ORDER BY')[0];

    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    query += ` LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    const [products] = await pool.execute(query, params);

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// GET single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.execute(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get similar products
    const product = products[0];
    const [similar] = await pool.execute(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.category_id = ? AND p.id != ? AND p.stock > 0
       LIMIT 6`,
      [product.category_id, id]
    );

    res.json({ success: true, product, similar });
  } catch (error) {
    console.error('getProductById error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// GET featured products
// const getFeaturedProducts = async (req, res) => {
//   try {
//     const [products] = await pool.execute(
//       `SELECT p.*, c.name as category_name
//        FROM products p
//        LEFT JOIN categories c ON p.category_id = c.id
//        WHERE p.is_featured = TRUE AND p.stock > 0
//        ORDER BY p.rating DESC
//        LIMIT 8`
//     );
//     res.json({ success: true, products });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

module.exports = { getProducts, getProductById };
