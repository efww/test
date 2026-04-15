const assert = require("node:assert/strict");
const test = require("node:test");
const { inspectPdfBytes } = require("../src/shared/pdfGate");

test("pdf gate allows regular pdf header", () => {
  const result = inspectPdfBytes({
    fileName: "regular.pdf",
    bytes: Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\n", "utf8"),
  });

  assert.equal(result.kind, "regular_pdf");
  assert.equal(result.blocked, false);
  assert.equal(result.reason, "pdf_header_ok");
});

test("pdf gate blocks non-pdf input before parsing", () => {
  const result = inspectPdfBytes({
    fileName: "notes.txt",
    bytes: Buffer.from("not a pdf", "utf8"),
  });

  assert.equal(result.kind, "unsupported");
  assert.equal(result.blocked, true);
  assert.equal(result.reason, "not_pdf_header");
});

test("pdf gate blocks protected PDF candidates conservatively", () => {
  const result = inspectPdfBytes({
    fileName: "protected.pdf",
    bytes: Buffer.from("%PDF-1.7\n% Microsoft Information Protection sample marker", "utf8"),
  });

  assert.equal(result.kind, "protected_pdf_candidate");
  assert.equal(result.blocked, true);
  assert.match(result.reason, /protected_marker/);
});
