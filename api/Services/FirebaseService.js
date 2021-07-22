var admin = require("firebase-admin");
var dotenv = require("dotenv");
dotenv.config();

class FirebaseService {
  constructor() {
    const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const serviceAccount = require(keyPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    this.db = admin.firestore();
  }

  async deleteAllVideos() {
    const videoCollection = await this.db.collection("videos");
    const snapshot = await videoCollection.get();

    await snapshot.forEach((doc) => {
      doc.delete();
    });

    console.log("All videos deleted");
  }

  getVideosNotDownloaded() {
    return new Promise(async (resolve, reject) => {
      this.db
        .collection("videos")
        .where("downloaded", "==", false)
        .get()
        .then((videos) => {
          var formatedVideos = this.formatQuerySnapshot(videos);
          resolve(formatedVideos);
        })
        .catch((err) => reject(err));
    });
  }

  //
  /// add a new video
  /// return a Promise containing the video's DocumentReference
  //
  addVideo(addVideoData) {
    return new Promise(async (resolve, reject) => {
      const date = new Date();
      const data = {
        youtubeId: addVideoData.youtubeId,
        downloaded: addVideoData.downloaded || false,
        artist: addVideoData.artist || "",
        title: addVideoData.title || "",
        date: date.toLocaleString(),
      };

      if (data.youtubeId) {
        const collection = this.db.collection("videos");
        const newVidRef = await collection.add(data);
        const newVidSnapshot = await newVidRef.get();

        const newVideo = this.formatDocSnapshot(newVidSnapshot);
        console.log(`Video added with success ${JSON.stringify(newVideo)}`);

        resolve(newVideo);
      } else {
        reject(new Error("No youtubeId given"));
      }
    });
  }

  updateVideo(docId, optionsToUpdate) {
    return new Promise((resolve, reject) => {
      var updateData = this.checkUpdateVideoData(optionsToUpdate);
      var videoRef = this.db.collection("videos").doc(docId);

      videoRef.update(updateData).then(async () => {
        var videoUpdated = await videoRef.get();
        console.log({ videoUpdated: videoUpdated.data() });
        resolve(videoUpdated.data());
      });
    });
  }

  checkIfVideoExists(videoId) {
    return new Promise(async (resolve, reject) => {
      var existingVideoRef = await this.db
        .collection("videos")
        .where("youtubeId", "==", videoId);
      var existingVideoSnapshot = await existingVideoRef.get();

      resolve(existingVideoSnapshot.docs.length > 0);
    });
  }

  //#region format
  formatQuerySnapshot(querySnapshot) {
    let formated = querySnapshot.docs.map((doc) => {
      var video = doc.data();
      video._id = doc.id;
      return video;
    });

    return formated;
  }

  formatDocSnapshot(docSnapshot) {
    let formated = docSnapshot.data();
    formated._id = docSnapshot.id;

    return formated;
  }

  // check and format the data passed to update videos
  checkUpdateVideoData(data) {
    var updateData = {};

    for (let [key, value] of Object.entries(data)) {
      if (this.videoKeys.includes(key)) {
        updateData[key] = value;
      }
    }

    return updateData;
  }
  //#endregion

  // keys that are used for video documents
  videoKeys = ["artist", "youtubeId", "title", "date", "downloaded"];
}

module.exports = new FirebaseService();
