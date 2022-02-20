const mongoose = require('mongoose');

const recipesSchema = new mongoose.Schema({
    name: { type: String, require: true },
    ingredients: { type: String, require: true },
    preparetion: { type: String, require: true },
    userId: { type: String, required: true },
    image: { type: String },
});

module.exports = mongoose.model('Recipes', recipesSchema);