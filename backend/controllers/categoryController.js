const { pool } = require('../config/db');

const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT * FROM categories ORDER BY name ASC'
    );
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getCategories };
