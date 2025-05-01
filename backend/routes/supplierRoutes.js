import express from 'express';
import oracledb from 'oracledb';

import getConnection from '../config/db.js';

const router = express.Router();
    

// Get all suppliers
router.get('/', async (req, res) => {
    try {
      const connection = await getConnection();
      const result = await connection.execute('SELECT * FROM suppliers');
      console.log('Suppliers fetched:', result.rows);
      await connection.close();
      res.json(result.rows);
    } catch (err) {
      console.log('Error fetching suppliers:', err);
      res.status(500).json({ error: err.message });
    }
  });

 // Add a new supplier
router.post('/', async (req, res) => {
  const { name, contact, address } = req.body;

  if (!name || !contact || !address) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const connection = await getConnection();
    await connection.execute(
      `INSERT INTO suppliers (name, contact, address) 
       VALUES (:name, :contact, :address)`,
      { name, contact, address }
    );
    await connection.commit();
    await connection.close();

    res.status(201).json({ message: 'Supplier added successfully.' });
  } catch (err) {
    console.error('Error adding supplier:', err);
    res.status(500).json({ error: err.message });
  }
});


  export default router;