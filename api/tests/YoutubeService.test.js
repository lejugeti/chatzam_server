var YoutubeService = require("../Services/YoutubeService");

describe("Youtube Service", () => {
  test("Search videos", async () => {
    const videos = await YoutubeService.search("daft punk", 5);

    const formatedResult = {
      id: "test",
      channelId: "test",
      channelTitle: "Daft Punk",
      title: "test",
      description: "test",
      thumbnails: "test",
    };

    const formatIsGood = (video) => {
      return (
        video.hasOwnProperty("id") &&
        video.hasOwnProperty("channelId") &&
        video.hasOwnProperty("channelTitle") &&
        video.hasOwnProperty("title") &&
        video.hasOwnProperty("description") &&
        video.hasOwnProperty("thumbnails")
      );
    };

    const videosHaveGoodFormat = videos.every(formatIsGood);

    expect(videos.length).toBe(5);
    expect(videosHaveGoodFormat).toBeTruthy();
  });
});
