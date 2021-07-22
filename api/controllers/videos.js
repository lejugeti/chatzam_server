var admin = require("firebase-admin");
var YoutubeService = require("../Services/YoutubeService");
var FirebaseService = require("../Services/FirebaseService");
var ProcessService = require("../Services/ProcessService");

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
    const { videoId, title, artist } = req.query;

    const addVideoData = {
      youtubeId: videoId,
      downloaded: false,
      title,
      artist,
    };

    const videoAlreadySaved = await FirebaseService.checkIfVideoExists(videoId);
    console.log({ videoAlreadySaved });

    if (addVideoData.youtubeId && !videoAlreadySaved) {
      FirebaseService.addVideo(addVideoData).then((newVideo) => {
        res.send(newVideo);

        console.log({ youtubeId: addVideoData.youtubeId });
        ProcessService.launchDownload(addVideoData.youtubeId)
          .then((code) => {
            console.log({ DownloadCode: code });
          })
          .catch((error) => console.log(error));
      });
    } else if (videoAlreadySaved) {
      const message = "Video already saved";
      res.writeHead(208, message);
      res.end(message);
    } else {
      const error = new Error("Bad request");
      error.status = 400;
      next(error);
    }
  }

  // TODO: update videos
}

module.exports = new VideoController();
