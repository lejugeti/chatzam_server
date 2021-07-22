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
}

module.exports = new FirebaseService();
