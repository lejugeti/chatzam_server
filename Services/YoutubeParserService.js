const fs = require("fs");
const RequestService = require("./RequestService");

class YoutubeParserService {
  readFile(path) {
    const txt = fs.readFileSync(path, "utf8");
    return txt;
  }

  splitScripts(txt) {
    const re = /<\/script><script(.*?)>/;
    const splited = txt.split(re);
    return splited;
  }

  findScriptWithData(txtSplitedArray) {
    const re = /var ytInitialData/;
    let indexWithData = -1;

    for (let i = 0; i < txtSplitedArray.length; i++) {
      const chunk = txtSplitedArray[i];
      const containsData = re.test(chunk);
      // console.log(`Data is detected in chunk ${i} : ${containsData}`);

      if (containsData) {
        indexWithData = i;
        return txtSplitedArray[indexWithData];
      }
    }

    return null;
  }

  parseYoutubeData(rawString) {
    const txtSplited = this.splitScripts(rawString);
    const stringWithData = this.findScriptWithData(txtSplited);

    const resOpen = stringWithData.indexOf("{");
    const resClosed = stringWithData.lastIndexOf("}");
    console.log({ resOpen, resClosed });
    const jsonData = JSON.parse(
      stringWithData.substring(resOpen, resClosed + 1)
    );

    return jsonData;
  }
}

module.exports = new YoutubeParserService();
