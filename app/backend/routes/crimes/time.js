const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/', async (req, res) => {
  const { 'crimeParts[]': crimeParts, crime } = req.query;
  try {
    const params = [];
    let crimePartsFilter = '';
    let crimeFilter = '';

    if (crimeParts) {
      let crimePartsArray = typeof(crimeParts) == 'string' ? [crimeParts] : crimeParts
      crimePartsFilter = `\nAND c.crime_part IN (${crimePartsArray.map(() => '?').join(',')})`;
      params.push(...crimePartsArray);
    }
    
    if (crime) {
      crimeFilter = 'AND c.crime_code = ?';
      params.push(crime);
    }

    let sql = `
      SELECT
        DAYNAME(cr.datetime_occurred) AS day_of_week,
        CASE
          WHEN HOUR(cr.datetime_occurred) BETWEEN 5 AND 12 THEN 'Morning'
          WHEN HOUR(cr.datetime_occurred) BETWEEN 12 AND 17 THEN 'Afternoon'
          WHEN HOUR(cr.datetime_occurred) BETWEEN 17 AND 21 THEN 'Evening'
          WHEN HOUR(cr.datetime_occurred) BETWEEN 21 AND 24 OR HOUR(cr.datetime_occurred) BETWEEN 0 AND 5 THEN 'Night'
        END AS time_of_day,
        COUNT(*) AS count
      FROM crimes_reported cr
      JOIN report_crimes rc ON cr.report_number = rc.report_number AND rc.crime_order = 1
      JOIN crimes c ON rc.crime_code = c.crime_code
      WHERE c.description IS NOT NULL
      ${crimePartsFilter}
      ${crimeFilter}
      GROUP BY day_of_week, time_of_day
      ORDER BY FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), FIELD(time_of_day, 'Morning', 'Afternoon', 'Evening', 'Night');
    `;

    const [rows] = await db.execute(sql, params);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;