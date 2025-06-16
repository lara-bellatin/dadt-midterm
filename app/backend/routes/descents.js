const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    let sql = `
      SELECT
        DISTINCT(victim_descent)
      FROM crimes_reported
      WHERE victim_descent IS NOT NULL
    `;

    const [rows] = await db.execute(sql);

    res.json(rows.map(row => row.victim_descent));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;