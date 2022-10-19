const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("bb63c55aa38448dc8dd098bfce958c3a");
const axios = require("axios");

// and we need jsdom and Readability to parse the article HTML
const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");
// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them
exports.GetTop5 = async function () {
  console.log("hello");
  const news = await newsapi.v2.topHeadlines({
    language: "en",
    country: "us",
    sortBy: "popularity",
    pageSize: 100,
  });
  console.log("total results: ", news.totalResults);
  return news;
};
exports.GetFullContent = async function (url) {
  const html = await axios.get(url);

  // We now have the article HTML, but before we can use Readability to locate the article content we need jsdom to convert it into a DOM object
  let dom = new JSDOM(html.data, {
    url: url,
  });

  // now pass the DOM document into readability to parse
  let article = new Readability(dom.window.document).parse();

  // Done! The article content is in the textContent property
  return article.textContent;
};
exports.getLocations = async function (address) {
  const response = await axios.get(
    `https://api.geoapify.com/v1/geocode/search?text=${address}&format=json&apiKey=${process.env.API_KEY}`
  );

  const { data } = response;
  // console.log(data);
  const lat = data?.results[0]?.lat ?? 0;
  const lng = data?.results[0]?.lon ?? 0;
  const formatted = data?.results[0]?.formatted ?? undefined;
  if (data?.results[0]?.rank?.confidence < 0.6) {
    throw new Error("Invalid Address");
  }
  if (formatted === undefined || formatted.includes("undefined")) {
    throw new Error("Invalid Address");
  }
  return {
    description: formatted,
    coordinates: [lng, lat],
    address: formatted,
    type: "Point",
  };
};
