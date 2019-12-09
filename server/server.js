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
const getInfo = require("./scrape")


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

app.get('compaies/:company/review',(req,res)=>{
    const company = req.params.company
    requests.getUserReview(company).then(
        (review)=>{
            console.log(review)
            res.json(review)
        },
        (reason) =>{
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

app.post('companies/:company/reivew', (req,res) => {
    let reivew = req.body
    reivew.company = req.params.company
    requests.insertCompanyInfo(review).then((info) => {
        console.log("Successfully inserted review")
        res.sendStatus(200)
    }, (reason) => {
        console.log(reason)
        res.sendStatus(500)
    })
    /* example companyInfo:
    {
        company: "CocaCola",
        title : "This company is nice",
        user : ""
        rating : "4.5",
        review : "hohohoho"
    }
    */
})

app.get('/', function (req, res) {
    res.render('mainPage');
})

app.post('/processLink', function (req, res) {
    res.redirect(307, '/product');
})


//example of rendering a page with json object
app.post('/product', async function (req, res) {
    var siteURL = req.body.searchBar;

    ///Block added here
    var articlesUrl = "https://www.csrhub.com/CSR_and_sustainability_information/Coca-Cola-Enterprises" + "/CSR_news"; //The company name(Coca-Cola) in this link should be fetch from the database
    var rankUrl = "https://www.csrhub.com/CSR_and_sustainability_information/Coca-Cola-Enterprises"; //The company name(Coca-Cola) in this link should be fetch from the database
    var info = await getInfo(siteURL, articlesUrl, rankUrl);
    
    res.render('product', info);
    ///Block end here

    const info = {}
    axios.get(siteURL)
        .then((response) => {
            if (response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html);
 

                info.product_name = $("#productTitle").text().trim();
                info.comp_name = $("#bylineInfo").text().trim();
                info.product_img = $('#landingImage').attr('src');

                companyArticles = requests.getCompanyArticles(info.comp_name)
                companyRating = requests.getCompanyRating(info.comp_name)
                companyInfo = requests.getCompanyInfo(info.comp_name)

                Promise.all([companyArticles, companyRating, companyInfo])
                    .then((companyInfoFields) => {
                        let articles = companyInfoFields[0]
                        const ratings = companyInfoFields[1]
                        console.log(ratings)
                        const compInfo = companyInfoFields[2]
                        articles = articles.map((object) => {return {
                            url: object.url, 
                            title: object.title, 
                            published_date: object.published_date,
                            excerpt: object.excerpt
                        }})
                        info.articles = articles;
                        info.location = compInfo.location;
                        info.about = compInfo.about;
                        info.links = compInfo.links;
                        info.industry = compInfo.industry;
                        info.ratings = ratings.overallAverage;

                        console.log(info)

                        res.render('product', info);
                    }).catch((err) => {
                        console.log(err)
                    })


                // let info = {
                //     "product_name": $("#productTitle").text().trim(),
                //     "comp_name": $("#bylineInfo").text().trim(),
                //     "product_img": $('#landingImage').attr('src')
                // };


            }
        }, (error) => {console.log(error)})
        .then(($) => {
            
        }).catch(error => console.log(error))
    

    // info = {
    //     "product_name": "wildorn dover premium mens ski jacket - designed in usa - insulated waterproof",
    //     "product_img": "./img/jacket.jpg",
    //     "comp_name": "amazon",
    //     "csrhub": {
    //        "comp_logo": "./img/amazon.png",
    //        "phone": "123456789",
    //        "industry": "online marketplace",
    //        "about": "amazon.com, inc., is an american multinational technology company based in seattle that focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence. it is considered one of the big four tech companies, along with google, apple, and facebook",
    //        "ratings": 4.2
    //     }
    //     "links": {
    //         "website": "https://amazon.com",
    //         "facebook": "https://facebook.com"
    //     },
    //     "articles": [
    //         {
    //             "title": "one thing i was sure of, that my uncle leo was definitely the hero of my childhood.",
    //             "published_date": "october 17, 2008",
    //             "excerpt": "the smell of his old spice cologne carried me back into that lost childhood more than the home movies did. my uncle didn't know it, but it was the sweet, cheap smell of car dealers that took me back, and made me dissolve into a dream of the past. leo was the last dinosaur that smelled of cheap cologne.",
    //             "url": "https://nytimes.com"
    //         },

    //         {
    //             "title": "splintered isle: a journey through brexit britain",
    //             "published_date": "december 7, 2019",
    //             "excerpt": "the smell of his old spice cologne carried me back into that lost childhood more than the home movies did. my uncle didn't know it, but it was the sweet, cheap smell of car dealers that took me back, and made me dissolve into a dream of the past. leo was the last dinosaur that smelled of cheap cologne.",
    //             "url": "https://nytimes.com"
    //         },
    //     ]
    // }


    
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

// let company = "CocaCola"
// companyArticles = requests.getCompanyArticles(company)
// companyRating = requests.getCompanyRating(company)
// companyInfo = requests.getCompanyInfo(company)

// Promise.all([companyArticles, companyRating, companyInfo]).then((companyInfoFields) => {
//     let articles = companyInfoFields[0]
//     const ratings = companyInfoFields[1]
//     const compInfo = companyInfoFields[2]

//     console.log("articles: \n" + articles)
//     console.log("ratings: \n" + ratings)
//     console.log("info: \n" + compInfo)

//     articles = articles.map((object) => { return { url: object.url}})

//     console.log("\n\n mapped articles: " + articles[0].url)
// })