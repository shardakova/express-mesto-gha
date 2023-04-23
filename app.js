const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');

// Prepare env variables
try {
  const envFilePath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envFilePath)) {
    fs.copyFileSync(path.resolve(process.cwd(), '.env.example'), envFilePath);
  }
} catch (err) {
  console.error(err);
  process.exit(1);
}
require('dotenv').config();

// Connect to the database
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

// Prepare and run the server
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64459d5c226d3741c0d045a8',
  };
  next();
});

Object.values(routes).forEach((route) => {
  app.use(route);
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500);
  return res.send(err.message);
});

app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
  console.log(`Express server has been started at http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
});
