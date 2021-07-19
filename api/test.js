var admin = require("firebase-admin");
var dotenv = require("dotenv");
dotenv.config();

var FirebaseService = require("./Services/FirebaseService");

FirebaseService.addVideo({ youtubeId: "test", downloaded: true });
