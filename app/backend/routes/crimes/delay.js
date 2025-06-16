const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/', async (req, res) => {
  const { 'ageRange[]': ageRange, 'crimeParts[]': crimeParts, } = req.query;
  try {
    const params = [];
    let crimePartsFilter = '';

    if (crimeParts) {
      let crimePartsArray = typeof(crimeParts) == 'string' ? [crimeParts] : crimeParts
      crimePartsFilter = `\nAND c.crime_part IN (${crimePartsArray.map(() => '?').join(',')})`;
      params.push(...crimePartsArray);
    }

    let sql = `
      SELECT
        c.description AS crime,
        AVG(DATEDIFF(cr.date_reported, DATE(cr.datetime_occurred))) AS avg_delay_days
      FROM crimes_reported cr
      JOIN report_crimes rc ON cr.report_number = rc.report_number AND rc.crime_order = 1
      JOIN crimes c ON rc.crime_code = c.crime_code
      WHERE datetime_occurred < date_reported
      AND cr.victim_age BETWEEN ${parseInt(ageRange[0])} AND ${parseInt(ageRange[1])}
      ${crimePartsFilter}
      GROUP BY crime
      ORDER BY avg_delay_days DESC
      LIMIT 10;
    `;

    const [rows] = await db.execute(sql, params);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;