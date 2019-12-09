//scrape.js

const axios = require("axios");
const cheerio = require("cheerio");

//Retrieve input link from main page
const siteUrl = sessionStorage.getItem('amazonLink');

// Load the Amazon HTML code as a string, which returns a Cheerio instance
const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

//Scrape product and company info from amazon url
fetchData().then(($) => {
  
  var scrapedData = {
    "productTitle" : $("#productTitle").text().trim(),
    "companyName" : $("#bylineInfo").text(),
    "productImage": $('#landingImage').attr('src'),
  };
  console.log(scrapedData);
})
.catch((reason) => {
    console.log(reason);
})



// Scrape all articles for company csrhub-name
// Example : const articlesURL = "https://www.csrhub.com/CSR_and_sustainability_information/" +  csrhub-name + " /CSR_news"
const articlesURL = "https://www.csrhub.com/CSR_and_sustainability_information/Coca-Cola-Enterprises" + "/CSR_news"

const fetchArticles = async () => {
  const result = await axios.get(articlesURL);
  return cheerio.load(result.data);
};

fetchArticles().then(($) => {

//Retrieve all articles from csrhub
$( ".content-page__news_feed a" ).each(function( i ) {
    var articletitle = $(this).text().trim();
    var articleUrl = $(this).attr('href');
    console.log(articletitle);
    console.log(articleUrl);
}); })
.catch((reason) => {
    console.log(reason);
})


//Scrape rankings for company csrhub-name
// Example: const rankUrl = "https://www.csrhub.com/CSR_and_sustainability_information/" + csrhub-name
const rankUrl ="https://www.csrhub.com/CSR_and_sustainability_information/Coca-Cola-Enterprises"

const fetchRank = async () => {
    const result = await axios.get(rankUrl);
    return cheerio.load(result.data);
};
  
  
fetchRank().then(($) => {

  //CSR or ESG Ranking %
  var rank = $( "span.value" ).html();
  console.log(rank);

  //Company Description
  var about = $( "div.company-section_descr p").text();
  console.log(about);

  //Company Industry: 
  var industry = $("tr:contains('Industry') td ").text().slice(9);
  console.log(industry)

  //Phone #
  var phone = $("tr:contains('Phone') td").text().slice(9);
  console.log(phone);
 })
  
.catch((reason) => {
    console.log(reason);
})
  

