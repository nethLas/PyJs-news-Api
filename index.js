const express = require("express");
const fs = require("fs");
var FormData = require("form-data");
var Stream = require("stream").Transform;
const { spawn } = require("child_process");
const axios = require("axios");
const API = require("./fetchnews");
const app = express();
const port = 3001;

const getArticles = async function () {
  try {
    const results = await API.GetTop5();
    const articles = results.articles;
    await articles.forEach(async (article) => await createStory(article));
    console.log("uploaded articles");
  } catch (error) {
    return;
  }
};
const createStory = async function (article) {
  try {
    const length = +article.content?.slice(-20).replace(/\D/g, "");

    let text = await API.GetFullContent(article.url);
    if (text.length > 3500 || !length) return;
    console.log(article.description, article.content);
    const python = spawn("python", [
      "extractLocations.py",
      article.description + article.content,
    ]);

    // collect data from script
    python.stdout.on("data", async function (data) {
      const tagregex = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;

      console.log("Pipe data from python script ...");
      addresses = JSON.parse(data.toString());
      const promises = await Promise.allSettled(
        addresses.map((address) => API.getLocations(address))
      );
      locations = promises.map((pm) => pm.value);
      locations = locations.filter((loc) => loc);
      //   if (locations.length < 1) return;
      console.log(locations);
      const story = {
        title: article.title.replace(tagregex, ""),
        sources: [article.url],
        locations,
        text: text.replace(tagregex, ""),
        summary: article.description.replace(tagregex, ""),
      };
      var form = new FormData();
      const { data: stream } = await axios.get(article.urlToImage, {
        responseType: "stream",
      });
      form.append("imageCover", stream);
      form.append("data", JSON.stringify(story));

      await axios
        .post("https://opensourcenews.herokuapp.com/api/v1/stories", form, {
          headers: {
            ...form.getHeaders(),
            Authorization: `Bearer ${process.env.JWT}`,
          },
        })
        .catch((err) => console.log(err));
    });
    // in close event we are sure that stream from child process is closed
    python.on("close", (code) => {
      console.log(`child process close all stdio with code ${code}`);
    });
    python.stderr.on("data", (data) => {
      console.error(`stdErr:${data}`);
    });
  } catch (error) {
    console.log(error, article.title);
    return;
  }
};
(async () => {
  try {
    await getArticles();
  } catch (error) {}
})();
