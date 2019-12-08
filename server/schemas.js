const mongoose = require('./db')

// Mongoose Schemas
const CompanyArticleSchema = new mongoose.Schema({
    company: {type: String, required: true},
    url: {type: String}
})

const CompanyRatingSchema = new mongoose.Schema({
    company: {type: String, required: true},
    overallRating: {type: Number, min: 0, max: 100}
})

const CompanyInfoSchema = new mongoose.Schema({
    company: {type: String, required: true},
    industry: {type: String},
    location: {type: String},
    about: {type: String},
    links: {
        type: {website: {type: String}, facebook: {type: String}},
        default: null
    }
})

module.exports = {connection: mongoose, company: CompanyInfoSchema, rating: CompanyRatingSchema, article: CompanyArticleSchema}