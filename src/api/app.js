/* eslint-disable sonarjs/cognitive-complexity */
const express = require('express');

const expressAsyncHandler = require('express-async-handler');

const mongoose = require('mongoose');

const dotenv = require('dotenv');

const User = require('../models/userModel');

dotenv.config();

mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador
app.post('/users', expressAsyncHandler(async (req, res) => {
  const usedEmail = await User.findOne({ email: req.body.email });
  if (!usedEmail) {
      const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          role: 'user',
      });
      const createUser = user.save();
      
      if (createUser) {
          res.send(user);
      } else {
          res.status(400).send({ message: 'Invalid entries. Try again' });
      }
  } else {
    res.status(409).send({ message: 'Email already registered' });
  }
  }));
module.exports = app;
