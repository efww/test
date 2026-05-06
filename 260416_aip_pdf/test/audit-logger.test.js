const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { createAuditLogger } = require("../src/main/auditLogger");

test("audit logger writes jsonl events without requiring document content", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "aip-pdf-audit-"));
  const logger = createAuditLogger({ directory, appVersion: "0.1.0-test" });

  await logger.append({
    event: "open_pdf_requested",
    file_name: "sample.pdf",
    file_size: 42,
    result: "allowed",
  });

  const text = await fs.readFile(logger.logPath, "utf8");
  const line = JSON.parse(text.trim());
  assert.equal(line.event, "open_pdf_requested");
  assert.equal(line.app_version, "0.1.0-test");
  assert.equal(line.file_name, "sample.pdf");
  assert.equal(line.file_size, 42);
  assert.equal("token" in line, false);
  assert.equal("content" in line, false);
});
