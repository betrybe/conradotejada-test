/* eslint-disable sonarjs/cognitive-complexity */
const express = require('express');

const expressAsyncHandler = require('express-async-handler');

const mongoose = require('mongoose');

const dotenv = require('dotenv');

const User = require('../models/userModel');

const Recipes = require('../models/recipesModel');

const { generateToken, isAuth } = require('./utils');

const seedDB = require('../../seed');

dotenv.config();

mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

seedDB();

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

  app.post('/login', expressAsyncHandler(async (req, res) => {
    if (req.body.email && req.body.password) { 
        const user = await User.findOne({ email: req.body.email });
        if (user && (user.password === req.body.password)) {
            const token = generateToken(user);
            res.send(token);
        } else {
            res.status(400).send({ message: 'Incorrect username or password' });
        }
    } else {
        res.status(401).send({ message: 'All fields must be filled' });
    }
    }));

    
  app.post('/recipes', isAuth, expressAsyncHandler(async (req, res) => {
    console.log(req.user);
    const recipe = new Recipes({
      name: req.body.name,
      ingredients: req.body.ingredients,
      preparetion: req.body.preparetion,
      userId: req.user.id,
    });

    const createRecipe = recipe.save();

    if (createRecipe) {
    res.send(recipe);
    } else {
    res.status(400).send({ message: 'Invalid entries. Try again' });
}
}));

app.get('/recipes', expressAsyncHandler(async (req, res) => {
  const recipes = await Recipes.find();
  res.send(recipes);  
}));

app.get('/recipes/:id', expressAsyncHandler(async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    const recipe = await Recipes.findOne({ _id: req.params.id });
    if (recipe) {
      res.send(recipe); 
    } else {
      res.status(404).send({ message: 'recipe not found' });
    }
  } else {
    res.status(404).send({ message: 'recipe not found' });
  }
  }));

  app.put('/recipes/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const recipe = await Recipes.findOne({ _id: req.params.id });
    if (recipe) {
    if ((recipe.userId === req.user.id) || (req.user.role === 'admin')) {
      recipe.name = req.body.name;
      recipe.ingredients = req.body.ingredients;
      recipe.preparetion = req.body.preparetion;
      recipe.save();
      res.status(200).send(recipe);
    } else {
      res.status(401).send({ message: 'invalid user' });
    }
    } else {
      res.status(404).send({ message: 'recipe not found' });
    }
  }));

module.exports = app;
