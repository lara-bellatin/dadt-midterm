require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crimesRoute = require('./routes/crimes');
const descentsRoute = require('./routes/descents');
const crimeWeaponsRoute = require('./routes/crimes/weapons');
const crimeTimesRoute = require('./routes/crimes/time');
const crimeDelaysRoute = require('./routes/crimes/delay');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/crimes', crimesRoute);
app.use('/api/descents', descentsRoute);
app.use('/api/descents', descentsRoute);
app.use('/api/crimes/weapons', crimeWeaponsRoute);
app.use('/api/crimes/time', crimeTimesRoute);
app.use('/api/crimes/delay', crimeDelaysRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});