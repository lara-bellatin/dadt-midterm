const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/', async (req, res) => {
  const { 'sex[]': sex, descent } = req.query;
  try {
    const params = [];
    let sexFilter = '';
    let descentFilter = '';

    if (sex) {
      let sexArray = typeof(sex) == 'string' ? [sex] : sex
      sexFilter = `\nAND cr.victim_sex IN (${sexArray.map(() => '?').join(',')})`;
      params.push(...sexArray);
    }

    if (descent) {
      descentFilter = '\nAND cr.victim_descent = ?';
      params.push(descent);
    }

    let sql = `
      SELECT
        c.description AS crime,
        cr.weapon,
        COUNT(*) AS count
      FROM crimes_reported cr
      JOIN report_crimes rc ON cr.report_number = rc.report_number
      JOIN crimes c ON rc.crime_code = c.crime_code
      WHERE cr.weapon IS NOT NULL
      ${sexFilter}
      ${descentFilter}
      GROUP BY c.description, cr.weapon
      HAVING count > 10
      ORDER BY count DESC;
    `;

    const [rows] = await db.execute(sql, params);

    const pivot = {};
    const weaponSet = new Set();

    for (const row of rows) {
      const { crime, weapon, count } = row;
      weaponSet.add(weapon);
      if (!pivot[crime]) pivot[crime] = { crime };
      pivot[crime][weapon] = count;
    }

    res.json({
      data: Object.values(pivot),
      weaponTypes: Array.from(weaponSet),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;