const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const html = fs.readFileSync(path.join(__dirname, "..", "src", "renderer", "index.html"), "utf8");

test("renderer shell exposes phase one entry points", () => {
  assert.match(html, /AIP PDF Gateway PoC/);
  assert.match(html, /1차 기술검증/);
  assert.match(html, /PDF 열기/);
  assert.match(html, /Microsoft 로그인/);
  assert.match(html, /aria-label="앱 상태"/);
});

test("phase one exposes PDF controls and Microsoft login entry", () => {
  assert.match(html, /<canvas id="pdf-canvas" aria-label="PDF 페이지"><\/canvas>/);
  assert.match(html, /<button class="primary-action" id="open-pdf" type="button">PDF 열기<\/button>/);
  assert.match(html, /<button class="secondary-action" id="login-button" type="button">Microsoft 로그인<\/button>/);
  assert.match(html, /id="auth-status"/);
  assert.match(html, /id="prev-page"[^>]+disabled/);
  assert.match(html, /id="next-page"[^>]+disabled/);
});
