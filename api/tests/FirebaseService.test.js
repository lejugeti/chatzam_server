var FirebaseService = require("../Services/FirebaseService");

describe("Firebase Service", () => {
  test("Add new video with good data", async () => {
    const data = {
      youtubeId: "testAddVideo",
      downloaded: false,
    };

    const newVideo = await FirebaseService.addVideo(data);
    console.log({ newVideo });
    expect(newVideo.youtubeId).toBe("testAddVideo");
    expect(newVideo.downloaded).toBe(false);
  });

  test("Add new video with bad data", async () => {
    const data = {
      downloaded: false,
    };

    FirebaseService.addVideo(data).catch((error) => {
      expect(typeof error).toBe("object");
      expect(error.message).toBe("No youtubeId given");
    });

    // expect(newVideo.downloaded).toBe(false);
  });

  test("Get videos not downloaded", async () => {
    const videos = await FirebaseService.getVideosNotDownloaded();

    let videosAreNotDownloaded = true;
    videos.forEach((vid) => {
      if (vid.downloaded !== false) {
        console.log({ badVideo: vid });
        videosAreNotDownloaded = false;
      }
    });

    expect(Array.isArray(videos)).toBe(true);
    expect(videosAreNotDownloaded).toBe(true);
  });
});
