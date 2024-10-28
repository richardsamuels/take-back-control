const { resolve } = require("path");
const fs = require("node:fs");
const p = require("process");

const { version } = require(resolve("./package.json"));

fs.writeFileSync(resolve(process.env.GITHUB_OUTPUT), `version=${version}`);
process.exit();
