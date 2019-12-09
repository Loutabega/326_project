const axios = require("axios")
const cheerio = require("cheerio")


const fetchData = async (siteUrl) => {
    const result = await axios.get(siteUrl);
    return cheerio.load(result.data);
};

const getInfo = async (siteUrl, articlesUrl, rankUrl) => {
    const $ = await fetchData(siteUrl);
    let info = {
        "product_name": $("#productTitle").text().trim(),
        "comp_name": $("#bylineInfo").text().trim(),
        "product_img": $('#landingImage').attr('src'),
        "articles": await getArticles(articlesUrl),
        "csrhub": await getRanks(rankUrl)
    };
    return info;
}

const fetchArticles = async (articlesUrl) => {
    const result = await axios.get(articlesUrl);
    return cheerio.load(result.data);
};

const getArticles = async (articlesUrl) => {
    const $ = await fetchArticles(articlesUrl);
    let articles = [];
    $(".content-page__news_feed a").each(function (i) {
        var article = {
            "title": $(this).text().trim(),
            "url": $(this).attr('href')
        }
        articles.push(article);
    });
    return articles;
}

const fetchRank = async (rankUrl) => {
    const result = await axios.get(rankUrl);
    return cheerio.load(result.data);
};

const getRanks = async (rankUrl) => {
    const $ = await fetchRank(rankUrl);
    let csrhub = {
        "about": $("div.company-section_descr p").text(),
        "phone": $("tr:contains('Phone') td").text().slice(9),
        "industry": $("tr:contains('Industry') td ").text().slice(9),
        "ratings": $("span.value").html()
    }
    return csrhub;
}


module.exports = getInfo;