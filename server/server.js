const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 2986
const mongoose = require('./db')

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

// Routing
const UIRouter = express.Router()
app.use('/', UIRouter);
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

app.listen(PORT, () => {console.log("Main server listening")})
