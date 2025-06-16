const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const { primary } = req.query;
  try {
    let sql = `
      SELECT
        DISTINCT(c.crime_code),
        c.description,
        c.crime_part
      FROM crimes c
    `;

    if (primary) {
      sql += `
        JOIN report_crimes rc ON rc.crime_code = c.crime_code
      `
    }

    const [rows] = await db.execute(sql);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;