const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, errors } = require('celebrate');
const routes = require('./routes/index');
const usersController = require('./contollers/users');
const validationSchemas = require('./utils/validationSchemas');

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
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mestodb');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

// Prepare and run the server
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.post('/signin', celebrate(validationSchemas.login), usersController.login);
app.post('/signup', celebrate(validationSchemas.createUser), usersController.createUser);
app.use(routes);

app.use(errors());

app.use((req, res) => {
  res.status(404).send({ message: 'Not Found' });
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
