const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { db } = require('./db');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/api', require('./api'));

const init = async () => {
  await db.sync({ force: true });
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
};

init();
