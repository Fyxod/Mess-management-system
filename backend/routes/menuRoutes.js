import express from 'express';
import oracledb from 'oracledb';

import getConnection from '../config/db.js';

const router = express.Router();

// /api/menu/:date/:type
router.get('/:date/:type', async (req, res) => {
  const { date, type } = req.params;
  console.log('Received date:', date, 'and type:', type);
  try {
    const connection = await getConnection();

    const result = await connection.execute(
      `SELECT 
         mm.menu_id, 
         TO_CHAR(mm.meal_date, 'YYYY-MM-DD') AS meal_date, 
         mt.name AS meal_type, 
         mi.item_name
       FROM mess_menu mm
       JOIN meal_types mt ON mm.meal_type_id = mt.meal_type_id
       LEFT JOIN menu_items mi ON mm.menu_id = mi.menu_id
       WHERE mm.meal_date = TO_DATE(:meal_date, 'YYYY-MM-DD')
         AND mt.name = :meal_type_name`,
      {
        meal_date: date,
        meal_type_name: type
      }
    );
    console.log('Query executed successfully:', result.rows);

    await connection.close();

    // Group items by menu_id
    const grouped = {};
    result.rows.forEach(row => {
      const key = `${row.MENU_ID}`;
      if (!grouped[key]) {
        grouped[key] = {
          menu_id: row.MENU_ID,
          meal_date: row.MEAL_DATE,
          meal_type: row.MEAL_TYPE,
          items: [],
        };
      }
      if (row.ITEM_NAME) grouped[key].items.push(row.ITEM_NAME);
    });

    res.json(Object.values(grouped));
  } catch (err) {
    console.log('Error executing query:', err);
    res.status(500).json({ error: err.message });
  }
});

// /api/menu/:date
router.get('/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const connection = await getConnection();

    const result = await connection.execute(
      `SELECT mm.menu_id, TO_CHAR(mm.meal_date, 'YYYY-MM-DD') AS meal_date, mt.name AS meal_type, mi.item_name
       FROM mess_menu mm
       JOIN meal_types mt ON mm.meal_type_id = mt.meal_type_id
       LEFT JOIN menu_items mi ON mm.menu_id = mi.menu_id
       WHERE mm.meal_date = TO_DATE(:meal_date_param, 'YYYY-MM-DD')`,
      { meal_date_param: date }
    );

    await connection.close();

    // Group by menu_id
    const grouped = {};
    result.rows.forEach(row => {
      const key = `${row.MENU_ID}`;
      if (!grouped[key]) {
        grouped[key] = {
          menu_id: row.MENU_ID,
          meal_date: row.MEAL_DATE,
          meal_type: row.MEAL_TYPE,
          items: [],
        };
      }
      if (row.ITEM_NAME) grouped[key].items.push(row.ITEM_NAME);
    });

    res.json(Object.values(grouped));
  } catch (err) {
    console.log('Error executing query:', err);
    res.status(500).json({ error: err.message });
  }
});

// /api/menu
router.get('/', async (req, res) => {
  try {
    const connection = await getConnection();

    const result = await connection.execute(
      `SELECT mm.menu_id, TO_CHAR(mm.meal_date, 'YYYY-MM-DD') AS meal_date, mt.name AS meal_type, mi.item_name
       FROM mess_menu mm
       JOIN meal_types mt ON mm.meal_type_id = mt.meal_type_id
       LEFT JOIN menu_items mi ON mm.menu_id = mi.menu_id
       ORDER BY mm.meal_date DESC`
    );

    await connection.close();

    const grouped = {};
    result.rows.forEach(row => {
      const key = `${row.MENU_ID}`;
      if (!grouped[key]) {
        grouped[key] = {
          menu_id: row.MENU_ID,
          meal_date: row.MEAL_DATE,
          meal_type: row.MEAL_TYPE,
          items: [],
        };
      }
      if (row.ITEM_NAME) grouped[key].items.push(row.ITEM_NAME);
    });

    res.json(Object.values(grouped));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/menu/:date/:type
router.post('/:date/:type', async (req, res) => {
  const { date, type } = req.params;
  const { items } = req.body;

  console.log('Received date:', date, 'type:', type, 'items:', items);
  
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items array is required and cannot be empty.' });
  }

  let connection;

  try {
    connection = await getConnection();

    // 1. Get meal_type_id from meal_types
    const mealTypeResult = await connection.execute(
      `SELECT meal_type_id FROM meal_types WHERE name = :type`,
      { type }
    );

    if (mealTypeResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid meal type.' });
    }

    const mealTypeId = mealTypeResult.rows[0].MEAL_TYPE_ID;

    // 2. Check if mess_menu already exists
    const menuResult = await connection.execute(
      `SELECT menu_id FROM mess_menu WHERE meal_date = TO_DATE(:meal_date, 'YYYY-MM-DD') AND meal_type_id = :meal_type_id`,
      {
        meal_date: date,
        meal_type_id: mealTypeId
      }
    );

    let menuId;

    if (menuResult.rows.length > 0) {
      // Exists
      menuId = menuResult.rows[0].MENU_ID;
    } else {
      // 3. Insert new mess_menu entry
      const insertMenuResult = await connection.execute(
        `INSERT INTO mess_menu (meal_date, meal_type_id) 
         VALUES (TO_DATE(:meal_date, 'YYYY-MM-DD'), :meal_type_id)
         RETURNING menu_id INTO :menu_id`,
        {
          meal_date: date,
          meal_type_id: mealTypeId,
          menu_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        }
      );
      menuId = insertMenuResult.outBinds.menu_id[0];
    }

    // 4. Insert items into menu_items
    const insertItemsSql = `
      INSERT INTO menu_items (menu_id, item_name) 
      VALUES (:menu_id, :item_name)
    `;

    for (const item of items) {
      await connection.execute(insertItemsSql, {
        menu_id: menuId,
        item_name: item
      });
    }

    await connection.commit();

    res.json({ message: 'Menu items added successfully.', menu_id: menuId });
  } catch (err) {
    console.error('Error adding menu items:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error('Error closing DB connection:', closeErr);
      }
    }
  }
});

export default router;
