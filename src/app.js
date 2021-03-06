var express     = require('express')
var app         = express();
var mongoose    = require("mongoose")
var bodyParser  = require("body-parser")
var Recipe      = require('./models/recipe')
var {port, url} = require("./config.json") 
var morgan      = require("morgan")
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests! Please wait 24 hours!"
});

//  apply to all requests
app.use(limiter);

app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })

app.get('/' , (req , res) =>{
    res.status(200);
    res.json({message: 'Welcome to DeveloperLunch API! Please add an ingrident to the URL.' , ip: req.ip})
})

app.get('/ingredients/:i' , (req , res) =>{
    try{
        Recipe.find({ ingredients: { $regex: req.params.i, $options: "i" }}, function(e, recipes) {
            res.status(200)
            res.json(recipes)
        });
        }catch(e){
            res.status(400)
            console.log(e)
        }
})

app.get("/recipe/:r" , (req , res) =>{
    var id = req.params.r
    if(mongoose.Types.ObjectId.isValid(id)) {
        Recipe.findById(id, function (err, recipe){
            if (err){
                res.status(400)
                console.log(err)
            } else{
                res.status(200)
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
    res.status(200)
    res.redirect("/")
})

app.listen(port, ()=>{
    console.log('Server up on port' + port)
})
