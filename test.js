const YoutubeParserService = require("./Services/YoutubeParserService");
const YoutubeService = require("./Services/YoutubeService");
const RequestService = require("./Services/RequestService");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

// const txt = YoutubeParserService.readFile("curl.js");
// const data = YoutubeParserService.parseYoutubeData(txt);
// console.log({ data });
// 0;

// RequestService.Get("https://www.youtube.com/results?search_query=daft+punk");
const url = "https://youtube.googleapis.com/youtube/v3/search";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
YoutubeService.search("daft+punk", 10)
  .then((res) => console.log(JSON.stringify(res)))
  .catch((err) => console.log(err));

