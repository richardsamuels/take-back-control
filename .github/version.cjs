const { resolve } = require("path");
const fs = require("node:fs");

const { version } = require(resolve("./package.json"));

fs.writeFileSync(resolve(".github", "version"), version);
process.exit();
