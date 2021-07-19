var admin = require("firebase-admin");

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
  async addVideo(addVideoData) {
    const data = {
      youtubeId: addVideoData.youtubeId,
      downloaded: addVideoData.downloaded || false,
    };

    if (data.youtubeId) {
      const newVidRef = await (
        await this.db.collection("videos").add(data)
      ).get();

      const newVideo = this.formatDocSnapshot(newVidRef);
      console.log(`Video added with success ${JSON.stringify(newVideo)}`);

      return newVideo;
    }
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
