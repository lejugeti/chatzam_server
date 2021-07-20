const { spawn } = require("child_process");
const youtubedl = require("youtube-dl-exec");

class ProcessService {
  downloadMusic(url, options) {
    return new Promise((resolve, reject) => {
      youtubedl(url, options)
        .then((output) => {
          console.log(output);
          resolve(0); // success code
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }

  executePythonScript(path) {
    var output;
    const pythonProcess = spawn("python", [path]);

    pythonProcess.stdout.on("data", (data) => {
      const formatedPythonOutput = this.formatPythonOutput(data);
      output = JSON.parse(formatedPythonOutput);
    });

    pythonProcess.on("close", (code) => {
      console.log(`End of script with code ${code} and data => ${output}`);
    });
  }

  formatPythonOutput(output) {
    var stringOutput = typeof output === "string" ? output : output.toString();
    console.log({ stringOutput });
    var formated = stringOutput.replace(/'/g, '"');
    return formated;
  }
}

module.exports = new ProcessService();
