//Make XMLHttpRequest to the passed in url using a proxy server
// function makeRequest(url){
//     var x = new XMLHttpRequest();
//     x.open('GET', 'https://cors-anywhere.herokuapp.com/' + url);
//     x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
//     x.onload = function() {
//         alert(x.responseText);
//     };
//     x.send();
// }


//Make XMLHttpRequest using the url from the searchbar
// $(document).ready(function() { 
//     // When the searchbar search/submit button is pressed  
//     $("#submitBtn").click(function() { 
//         //Retrieve the amazon link in the search bar                                                  
//         var amazonLink = $("#searchBar").val();
//         makeRequest(amazonLink);  
//     });
// });



const siteUrl = "https://www.amazon.com/dp/B01LWWY3E2/ref=cm_gf_aaam_iaaa_d_p0_c0_qd0_________________1Pjy485Yzh4K82Bo1GQb";
const axios = require("axios");
const cheerio = require("cheerio");


const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

fetchData().then((value) => {
    console.log(value);
    // const title = value("#productTitle").text();
    // const title = value("#productTitle").text();

    // console.log(title);
}).catch((reason) => {
    console.log(reason);
})



// use trim
//use