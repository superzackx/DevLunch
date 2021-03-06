var mongoose = require('mongoose')

var recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name cannot be blank']
    },
    ingredients: {
        type: Array,
        required: [true, 'Ingredients cannot be blank']
    },
    directions: {
        type: String, 
        required: [true, 'Directions cannot be blank']
    },
    created_date: {
        type: Date,
        default: Date.now,
    }
})

module.exports =  mongoose.model('Recipe', recipeSchema)
