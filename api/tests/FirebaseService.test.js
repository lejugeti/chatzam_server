var FirebaseService = require("../Services/FirebaseService");
var ProcessService = require("../Services/ProcessService");

describe("Firebase Service", () => {
  // TODO : delete collection
  test("Delete all videos", async () => {
    await FirebaseService.deleteAllVideos();
  });

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

  test("Format update video data", () => {
    const dataToCheck = {
      artist: "testArtist",
      youtubeId: "testId",
      title: "testTitle",
      date: "testDate",
      downloaded: "testDownloaded",
      otherField: "otherField",
    };

    const formated = FirebaseService.checkUpdateVideoData(dataToCheck);

    const fieldsAreOkay = Object.keys(formated).every((key) =>
      FirebaseService.videoKeys.includes(key)
    );

    expect(fieldsAreOkay).toBeTruthy();
  });

  test("Update video", async () => {
    const options = {
      artist: "updated",
      youtubeId: "updated",
      title: "updated",
      downloaded: false,
    };

    await FirebaseService.updateVideo("test", options).then((updatedVideo) => {
      console.log({ testUpdateVideo: updatedVideo });
      expect(updatedVideo.artist).toBe("updated");
      expect(updatedVideo.downloaded).toBe(false);
    });
  });

  test("Check if video exists", async () => {
    const realVideoId = "testAddVideo";
    const falseVideoId = "falseVideoId";

    const realIdExists = await FirebaseService.checkIfVideoExists(realVideoId);
    const falseIdExists = await FirebaseService.checkIfVideoExists(
      falseVideoId
    );

    expect(realIdExists).toBeTruthy();
    expect(falseIdExists).toBeFalsy();
  });

  test("create response", async () => {
    const http = require("http");
    var rep = new http.ServerResponse();
  });
});
