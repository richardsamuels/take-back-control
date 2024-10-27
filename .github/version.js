const { resolve } = require("path");
const fs = require("node:fs");

const { version } = require(resolve("./package.json"));

if (version) {
  core.setOutput("version", version);
} else {
  core.setFailed("Unable to read version from package.json.");
}
fs.writeFileSync("version", version);
