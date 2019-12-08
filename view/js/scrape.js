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


fetchData().then(($) => {
  var scrapedData = {
    "productTitle" : $("#productTitle").text().trim(),
    "companyName" : $("#bylineInfo").text(),
    "productImage": $('#landingImage').attr('src'),
  };

  // console.log(scrapedData.productTitle);
  // console.log(scrapedData.companyName);

  return scrapedData 

})
.catch((reason) => {
    console.log(reason);
})
