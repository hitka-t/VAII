const express = require('express');
const cors = require('cors');
require('dotenv').config();

const technikaRoutes = require('./routes/technikaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', technikaRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server beží na porte ${PORT}`);
});
