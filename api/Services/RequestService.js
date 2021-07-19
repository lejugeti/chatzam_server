const fetch = require("node-fetch");

class RequestService {
  Get(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.text())
        .then((body) => {
          //   console.log(body);
          resolve(body);
        });
    });
  }
}

module.exports = new RequestService();
