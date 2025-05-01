import express from 'express';
import oracledb from 'oracledb';
import getConnection from '../config/db.js';

const router = express.Router();

// Get all stock items
router.get('/', async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute('SELECT * FROM stock_items'); // Corrected table name
    await connection.close();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching stock items:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all stock orders
router.get('/orders', async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute('SELECT * FROM stock_orders'); // Corrected table name
    await connection.close();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching stock orders:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get stock item by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await getConnection();
    const result = await connection.execute(
      'SELECT * FROM stock_items WHERE item_id = :id', // Corrected table and column names
      { id }
    );
    await connection.close();
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Use stock (call PL/SQL proc use_stock)
router.post('/usage', async (req, res) => {
  const { stock_id, quantity } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `BEGIN
         use_stock(:stock_id, :quantity);
       END;`,
      { stock_id, quantity }
    );
    await connection.commit();
    await connection.close();
    res.json({ message: 'Stock usage recorded.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a stock order (call PL/SQL proc create_stock_order)
router.post('/order', async (req, res) => {
  const { stock_id, supplier_id, quantity } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `BEGIN
         create_stock_order(:stock_id, :supplier_id, :quantity);
       END;`,
      { stock_id, supplier_id, quantity }
    );
    await connection.commit();
    await connection.close();
    res.json({ message: 'Stock order placed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
