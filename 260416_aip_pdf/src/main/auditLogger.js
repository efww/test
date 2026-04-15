const fs = require("node:fs/promises");
const path = require("node:path");

function createAuditLogger({ directory, appVersion }) {
  const logPath = path.join(directory, "audit.jsonl");

  async function append(event) {
    await fs.mkdir(directory, { recursive: true });
    const safeEvent = {
      ts: new Date().toISOString(),
      app_version: appVersion,
      ...event,
    };
    await fs.appendFile(logPath, `${JSON.stringify(safeEvent)}\n`, "utf8");
    return safeEvent;
  }

  return {
    append,
    logPath,
  };
}

module.exports = { createAuditLogger };
