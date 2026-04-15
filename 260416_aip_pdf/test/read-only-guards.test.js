const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const guards = fs.readFileSync(path.join(__dirname, "..", "src", "renderer", "readOnlyGuards.js"), "utf8");
const html = fs.readFileSync(path.join(__dirname, "..", "src", "renderer", "index.html"), "utf8");
const css = fs.readFileSync(path.join(__dirname, "..", "src", "renderer", "styles.css"), "utf8");

test("read-only guards block save print copy context menu and drag", () => {
  assert.match(guards, /contextmenu/);
  assert.match(guards, /dragstart/);
  assert.match(guards, /copy/);
  assert.match(guards, /beforeprint/);
  assert.match(guards, /window\.print/);
  assert.match(guards, /"p", "s", "c"/);
});

test("read-only UI does not expose save download or print commands", () => {
  assert.doesNotMatch(html, />저장</);
  assert.doesNotMatch(html, />다운로드</);
  assert.doesNotMatch(html, />인쇄</);
  assert.match(html, /저장·인쇄·복사 비활성/);
  assert.match(html, /id="readonly-status"/);
});

test("reader surface disables text selection and canvas dragging", () => {
  assert.match(css, /user-select: none/);
  assert.match(css, /-webkit-user-drag: none/);
});
