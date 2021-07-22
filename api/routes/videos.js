var express = require("express");
var express = require("express");
var router = express.Router();

var VideoController = require("../controllers/videos");

router.get("/search", VideoController.searchVideos);
router.post("/", VideoController.saveVideoToDownload);
router.get("/notDownloaded", VideoController.getVideosNotDownloaded);
// TODO : update videos

module.exports = router;
