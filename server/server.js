const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 2986
const mongoose = require('./db')
var mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser');
const schemas = require('./schemas')
const requests = require('./mongo_requests')
const axios = require("axios")
const cheerio = require("cheerio")


// Mongoose Models
const Article = mongoose.model("Article", schemas.article)
const Rating = mongoose.model("Rating", schemas.rating)
const Company = mongoose.model("Company", schemas.company)

// Routing Setup
const UIRouter = express.Router()
app.use('/', UIRouter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', './view');
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
UIRouter.use(express.static(path.join(__dirname + './../view')))

// Routes
app.get('/companies/:company/articles', (req, res) => {
    const company = req.params.company
    requests.getCompanyArticles(company).then((value) => {
        res.json(value)
    }, (reason) => {
        console.log(reason)
        res.sendStatus(500)
    })
})

app.get('/companies/:company/rating', (req, res) => {
    const company = req.params.company
    requests.getCompanyRating(company).then(
        (rating) => {
            console.log(rating)
            res.json(rating)
        },
        (reason) => {
            console.log(reason)
            res.sendStatus(500)
        })
})

app.get('/companies/:company/info', (req, res) => {
    requests.getCompanyInfo(req.params.company).then((info) => {
        console.log(info)
        res.json(info)
    }, (reason) => {
        console.log(reason)
        res.sendStatus(500)
    })
})

app.post('companies/:company/article', (req,res) => {
    /* {
        url: (link to the article)
    } */
    let article = req.body
    article.company = req.params.company
    requests.insertCompanyArticle(article).then(value => {
        res.sendStatus(200)
    }, reason => {
        console.log(reason)
        res.sendStatus(500)
    })
    
})

app.post('companies/:company/rating', (req,res) => {
    let rating = req.body 
    rating.company = req.params.company
    requests.insertCompanyRating(rating).then((value) => {
        res.sendStatus(200)
    }, (reason) => {
        console.log(reason)
        res.sendStatus(500)
    })
})

app.post('companies/:company/info', (req,res) => {
    let companyInfo = req.body
    companyInfo.company = req.params.company
    requests.insertCompanyInfo(companyInfo).then((info) => {
        console.log("Successfully inserted company info")
        res.sendStatus(200)
    }, (reason) => {
        console.log(reason)
        res.sendStatus(500)
    })
    /* example companyInfo:
    {
        company: "CocaCola",
        industry: "Food Service",
        location: "Dallas, TX",
        about: "CocaCola is a company that blah blah blah",
        links: {
            website: "https://www.coca-cola.com/",
            facebook: "https://www.facebook.com/CocaColaUnitedStates/"
        }
    }
    */
})



app.get('/', function (req, res) {
    res.render('mainPage');
})



//example of rendering a page with json object
app.get('/Amazon', function (req, res) {
    siteURL = "https://www.amazon.com/Apple-MWP22AM-A-AirPods-Pro/dp/B07ZPC9QD4/ref=sr_1_3?crid=33UPUV5CKKGKU&keywords=apple+airpods&qid=1575820602&sprefix=apple+%2Caps%2C168&sr=8-3"
    axios.get(siteURL)
        .then((response) => {
            if (response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html);
                let info = {
                    "product-name": $("#productTitle").text().trim(),
                    "comp-name": $("#bylineInfo").text().trim(),
                    "product-img": $('#landingImage').attr('src')
                };
                res.render('product', info);
            }
        }, (error) => console.log(err));
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
    
})

app.listen(PORT, () => {console.log("Main server listening")})

const AmazonInfo = {
    company: "Amazon",
    location: "Seattle, WA",
    industry: "Online Marketplace",
    about: "Amazon.com, Inc., is an American multinational technology company based in Seattle that focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence. It is considered one of the Big Four tech companies, along with Google, Apple, and Facebook",
    links: {
        website: "https://amazon.com",
        facebook: "https://facebook.com"
    }
}

const CocaColaInfo = {
    company: "CocaCola",
    industry: "Food Service",
    location: "Dallas, TX",
    about: "CocaCola is a company that blah blah blah",
    links: {
        website: "https://www.coca-cola.com/",
        facebook: "https://www.facebook.com/CocaColaUnitedStates/"
    }
}

const GoogleInfo = {
    company: "Google",
    industry: "Technology",
    location: "San Francisco, CA",
    about: "Google is a company that blah blah blah",
    links: {
        website: "https://www.google.com/",
        facebook: "https://www.facebook.com/Google/"
    }
}

// console.log("Attempting to insert article: ")
// requests.insertCompanyArticle({url: "www.google.com"}).then(value => {
//     console.log(value)
// })

// let testInsertInfo = (AmazonInfo, CocaColaInfo, GoogleInfo) => {
//     console.log("Attempting to insert to Company Info schema")

//     Company.findOneAndUpdate(
//         {company: AmazonInfo.company},
//         AmazonInfo,
//         {upsert: true, new: true, runValidators: true},
//         (err, doc) => {
//             if (err) {
//                 console.log("error" + err)
//             }
//             else {
//                 console.log(doc)
//             }
//         })

//         Company.findOneAndUpdate(
//             {company: CocaColaInfo.company},
//             CocaColaInfo,
//             {upsert: true, new: true, runValidators: true},
//             (err, doc) => {
//                 if (err) {
//                     console.log("error" + err)
//                 }
//                 else {
//                     console.log(doc)
//                 }
//             })

//             Company.findOneAndUpdate(
//                 {company: GoogleInfo.company},
//                 GoogleInfo,
//                 {upsert: true, new: true, runValidators: true},
//                 (err, doc) => {
//                     if (err) {
//                         console.log("error" + err)
//                     }
//                     else {
//                         console.log(doc)
//                     }
//                 })
// }

// testInsertInfo(AmazonInfo, CocaColaInfo, GoogleInfo)