var admin = require("firebase-admin");
var YoutubeService = require("../Services/YoutubeService");
var FirebaseService = require("../Services/FirebaseService");

class VideoController {
  async getVideosNotDownloaded(req, res) {
    FirebaseService.getVideosNotDownloaded().then((videos) => {
      console.log({ videoNotDownloaded: videos });
      res.send(videos);
    });
  }

  async searchVideos(req, res) {
    const query = req.query.q;
    const limit = req.query.limit ? req.query.limit : 10;

    const videos = await YoutubeService.search(query, limit);
    res.send(videos);
  }

  async saveVideoToDownload(req, res, next) {
    const videoId = req.query.videoId;

    const addVideoData = {
      youtubeId: videoId,
      downloaded: false,
    };

    if (addVideoData.youtubeId) {
      FirebaseService.addVideo(addVideoData).then((newVideo) => {
        res.send(newVideo);
      });
    } else {
      const error = new Error("Bad request");
      error.status = 400;
      next(error);
    }
  }
}

module.exports = new VideoController();
