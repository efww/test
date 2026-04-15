const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const renderer = fs.readFileSync(path.join(__dirname, "..", "src", "renderer", "app.js"), "utf8");
const preload = fs.readFileSync(path.join(__dirname, "..", "src", "preload.js"), "utf8");
const main = fs.readFileSync(path.join(__dirname, "..", "src", "main.js"), "utf8");

test("viewer imports pdf.js and renders from in-memory bytes", () => {
  assert.match(renderer, /pdfjs-dist\/build\/pdf\.mjs/);
  assert.match(renderer, /new Uint8Array\(result\.bytes\)/);
  assert.match(renderer, /pdfjsLib\.getDocument\(\{ data \}\)/);
  assert.doesNotMatch(renderer, /file:\/\//);
});

test("preload exposes a narrow pdf open bridge", () => {
  assert.match(preload, /openPdfFile/);
  assert.match(preload, /ipcRenderer\.invoke\("pdf:openFile"\)/);
});

test("main process limits open dialog to pdf files", () => {
  assert.match(main, /filters: \[\{ name: "PDF", extensions: \["pdf"\] \}\]/);
  assert.match(main, /fs\.readFile\(filePath\)/);
});
