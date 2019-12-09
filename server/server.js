const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3000
const mongoose = require('./db')
var mustacheExpress = require('mustache-express')

// Mongoose Schemas
const CompanyArticleSchema = new mongoose.Schema({
    company: {type: String, required: true},
    url: {type: String}
})
const Article = mongoose.model("Article", CompanyArticleSchema)

const CompanyRatingSchema = new mongoose.Schema({
    company: {type: String, required: true},
    overallRating: {type: Number, min: 0, max: 100}
})
const Rating = mongoose.model("Rating", CompanyRatingSchema)

const UserReviewSchema = new mongoose.Schema({
    title : {type: String},
    user : {type: String},
    textarea_form : {type: String}
})
const Review = mongoose.model("Review", UserReviewSchema)

// Routing
const UIRouter = express.Router()
app.use('/', UIRouter);
app.set('views', './view');
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
UIRouter.use(express.static(path.join(__dirname + './../view')))

app.get('/companies/:company/articles', (req, res) => {
    const company = req.params.company
    try{
        Article.find({ company: company }, (err, articles) => {
            if (err){
                console.log("Unsuccessful in reading articles")
                res.sendStatus(500);
            }
            else{
                res.json(articles);
            }
        })
    } catch (err){
        res.sendStatus(500);
    }
})

app.get('/companies/:company/rating', (req, res) => {
    const company = req.params.company
    try {
        Rating.aggregate([
            {$match: {company: company}}, 
            {$group: {_id: "$company", overallAverage: {$avg: "$overallRating"}}}
        ]).then(ratings => {
            res.json(ratings)
        }, reason => {
            console.log(reason)
            res.sendStatus(500)
        })
    } catch (err){
        res.sendStatus(500)
    }
})

app.get('/', function (req, res) {
    res.render('mainPage');
})

//example of rendering a page with json object
app.get('/Amazon', function (req, res) {
    info = {
        "product-name": "Wildorn Dover Premium Mens Ski Jacket - Designed in USA - Insulated Waterproof",
        "product-img": "./img/jacket.jpg",
        "comp-name": "Amazon",
        "comp-logo": "./img/amazon.png",
        "location": "Seattle, WA",
        "industry": "Online Marketplace",
        "about": "Amazon.com, Inc., is an American multinational technology company based in Seattle that focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence. It is considered one of the Big Four tech companies, along with Google, Apple, and Facebook",
        "ratings": 4.2,
        "links": {
            "Website": "https://amazon.com",
            "Facebook": "https://facebook.com"
        },
        "articles": [
            {
                "title": "One thing I was sure of, that my uncle Leo was definitely the hero of my childhood.",
                "published_date": "October 17, 2008",
                "excerpt": "The smell of his Old Spice cologne carried me back into that lost childhood more than the home movies did. My uncle didn't know it, but It was the sweet, cheap smell of car dealers that took me back, and made me dissolve into a dream of the past. Leo was the last dinosaur that smelled of cheap cologne.",
                "url": "https://nytimes.com"
            },

            {
                "title": "Splintered Isle: A Journey Through Brexit Britain",
                "published_date": "December 7, 2019",
                "excerpt": "The smell of his Old Spice cologne carried me back into that lost childhood more than the home movies did. My uncle didn't know it, but It was the sweet, cheap smell of car dealers that took me back, and made me dissolve into a dream of the past. Leo was the last dinosaur that smelled of cheap cologne.",
                "url": "https://nytimes.com"
            },
        ]
    }
    res.render('product', info)
})

app.listen(PORT, () => {console.log("Main server listening")})
