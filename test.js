const YoutubeParserService = require("./Services/YoutubeParserService");
const RequestService = require("./Services/RequestService");
const fetch = require("node-fetch");

// const txt = YoutubeParserService.readFile("curl.js");
// const data = YoutubeParserService.parseYoutubeData(txt);
// console.log({ data });
// 0;

// RequestService.Get("https://www.youtube.com/results?search_query=daft+punk");
const url = "https://youtube.googleapis.com/youtube/v3/search";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const options = {
  method: "GET",
  body: JSON.stringify({
    part: "snippet",
    maxResults: 25,
    q: "Muse",
    key: YOUTUBE_API_KEY,
  }),
};

fetch(url, options)
  .then((res) => res.text())
  .then((body) => {
    console.log(body);
    resolve(body);
  });
