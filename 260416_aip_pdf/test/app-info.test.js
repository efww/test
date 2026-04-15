const assert = require("node:assert/strict");
const test = require("node:test");
const { getAppInfo } = require("../src/shared/appInfo");

test("app info exposes phase and version", () => {
  const info = getAppInfo({ appVersion: "9.9.9", cwd: "/tmp/260416_aip_pdf", platform: "test-os" });

  assert.equal(info.name, "AIP PDF Gateway PoC");
  assert.equal(info.version, "9.9.9");
  assert.equal(info.phase, "1차 기술검증");
  assert.equal(info.platform, "test-os");
  assert.equal(info.projectRoot, "260416_aip_pdf");
});
