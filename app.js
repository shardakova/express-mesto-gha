const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const config = require('./config');

// Connect to the database
(async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

// Prepare and run the server
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(routes);
app.use(errors());

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next();
  }
  if (!err.status) {
    console.error(err);
    res.status(500);
    return res.send({ message: 'Произошла неизвестная ошибка. Мы работаем над этим.' });
  }
  res.status(err.status);
  return res.send({ message: err.message });
});

app.listen(config.SERVER_PORT, config.SERVER_HOST, () => {
  console.log(`Express server has been started at http://${config.SERVER_HOST}:${config.SERVER_PORT}`);
});
