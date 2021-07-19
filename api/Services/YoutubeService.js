const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

class YoutubeService {
  apiKey = process.env.YOUTUBE_API_KEY;
  searchPath = "https://youtube.googleapis.com/youtube/v3/search";

  // search and retrieve the results as an array of videos
  search(searchString, limit) {
    return new Promise((resolve, reject) => {
      const config = {
        params: {
          key: this.apiKey,
          part: "snippet",
          maxResults: limit,
          q: searchString,
        },
      };

      console.log({ config });

      axios
        .get(this.searchPath, config)
        .then((response) => {
          const formatedResult = this.formatVideoSearchResult(
            response.data.items
          );
          resolve(formatedResult);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  formatVideoSearchResult(videoSearchResult) {
    const formatedResult = videoSearchResult.map((video) => ({
      id: video.id.videoId,
      channelId: video.snippet.channelId,
      channelTitle: video.snippet.channelTitle,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnails: video.snippet.thumbnails,
    }));

    return formatedResult;
  }
}

module.exports = new YoutubeService();
