const path = require("node:path");

function getAppInfo({ appVersion, cwd = process.cwd(), platform = process.platform } = {}) {
  return {
    name: "AIP PDF Gateway PoC",
    version: appVersion || "0.1.0",
    phase: "1차 기술검증",
    platform,
    projectRoot: path.basename(cwd),
    buildTime: process.env.BUILD_TIME || "development",
  };
}

module.exports = { getAppInfo };
