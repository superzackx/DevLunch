var express     = require('express')
var app         = express();
var mongoose    = require("mongoose")
var bodyParser  = require("body-parser")
var Recipe      = require('./models/recipe')
var {port, url} = require("./config.json") 

app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })

app.get('/' , (req , res) =>{
    res.json({message: 'Welcome to DeveloperLunch API! Please add an ingrident to the URL.'})
})

app.get('/ingredients/:i' , (req , res) =>{
    try{
        Recipe.find({ ingredients: { $regex: req.params.i, $options: "i" }}, function(e, recipes) {
            res.json(recipes)
        });
        }catch(e){
            console.log(e)
        }
})

app.get("/recipe/:r" , (req , res) =>{
    var id = req.params.r
    if(mongoose.Types.ObjectId.isValid(id)) {
        Recipe.findById(id, function (err, recipe){
            if (err){
                console.log(err)
            } else{
                res.json(recipe)
            }
        })
    }
})

app.post("/recipe/new" , async (req , res) =>{
    var recipe = new Recipe({
        title: req.body.name,
        ingredients: req.body.ingredients,
        directions: req.body.directions
    })
    await recipe.save();
    res.redirect("/")
})

app.listen(port, ()=>{
    console.log('Server up on port' + port)
})
