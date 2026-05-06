const assert = require("node:assert/strict");
const test = require("node:test");
const { buildAuthorizeUrl, getMicrosoftAuthConfig } = require("../src/shared/microsoftAuth");

test("auth config reports missing client id before company approval", () => {
  const config = getMicrosoftAuthConfig({});

  assert.equal(config.configured, false);
  assert.equal(config.tenantId, "organizations");
  assert.equal(config.redirectUri, "http://localhost:38461/auth/callback");
  assert.deepEqual(config.scopes, ["openid", "profile", "email", "offline_access"]);
});

test("auth config accepts approved company app values from env", () => {
  const config = getMicrosoftAuthConfig({
    AIP_PDF_CLIENT_ID: "client-id",
    AIP_PDF_TENANT_ID: "tenant-id",
    AIP_PDF_REDIRECT_URI: "http://localhost/callback",
  });

  assert.equal(config.configured, true);
  assert.equal(config.clientId, "client-id");
  assert.equal(config.tenantId, "tenant-id");
  assert.equal(config.redirectUri, "http://localhost/callback");
});

test("authorize URL targets Microsoft identity platform without logging tokens", () => {
  const url = buildAuthorizeUrl(
    getMicrosoftAuthConfig({
      AIP_PDF_CLIENT_ID: "client-id",
      AIP_PDF_TENANT_ID: "tenant-id",
      AIP_PDF_REDIRECT_URI: "http://localhost/callback",
    }),
  );

  assert.match(url, /^https:\/\/login\.microsoftonline\.com\/tenant-id\/oauth2\/v2\.0\/authorize\?/);
  assert.match(url, /client_id=client-id/);
  assert.match(url, /response_type=code/);
  assert.match(url, /scope=openid\+profile\+email\+offline_access/);
  assert.doesNotMatch(url, /token/i);
});
