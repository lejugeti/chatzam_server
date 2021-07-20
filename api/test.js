var admin = require("firebase-admin");
var dotenv = require("dotenv");
dotenv.config();

var ProcessService = require("./Services/ProcessService");

const url = "https://www.youtube.com/watch?v=uK4-nUZiOH4";
const options = {
  extractAudio: true,
  audioFormat: "mp3",
  output: "downloads/%(title)s.%(ext)s",
};

ProcessService.downloadMusic(url, options);
