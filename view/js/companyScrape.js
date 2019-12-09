//scrape.js

const axios = require("axios");
const cheerio = require("cheerio");

// const articlesURL = "https://www.csrhub.com/CSR_and_sustainability_information/" +  csrhub-name + " /CSR_news"
const articlesURL = "https://www.csrhub.com/CSR_and_sustainability_information/Coca-Cola-Enterprises" + "/CSR_news"



// Scrape all articles for company csrhub-name
const fetchData = async () => {
  const result = await axios.get(articlesURL);
  return cheerio.load(result.data);
};


fetchData().then(($) => {

$( ".content-page__news_feed a" ).each(function( i ) {
    var articletitle = $(this).text().trim();
    console.log(articletitle);
    var articleUrl = $(this).attr('href');
    console.log(articleUrl);
}); })

.catch((reason) => {
    console.log(reason);
})





//Scrape rankings for company with csrhub-name
// const rankUrl = "https://www.csrhub.com/CSR_and_sustainability_information/" + csrhub-name

const rankUrl ="https://www.csrhub.com/CSR_and_sustainability_information/Coca-Cola-Enterprises"

const fetchRank = async () => {
    const result = await axios.get(rankUrl);
    return cheerio.load(result.data);
  };
  
  
  fetchRank().then(($) => {

    //CSR / ESG Ranking %
    var rank = $( "span.value" ).html();
    console.log(rank);

    //Company Description
    var about = $( "div.company-section_descr p").text();
    console.log(about);

    //Industry
    var industry = $("tr:contains('Industry') td ").text().slice(9);
    console.log(industry)

    //Phone #
    var phone = $("tr:contains('Phone') td").text().slice(9);
    console.log(phone);
 })
  
  .catch((reason) => {
      console.log(reason);
  })
  