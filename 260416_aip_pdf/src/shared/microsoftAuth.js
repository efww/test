const DEFAULT_SCOPES = ["openid", "profile", "email", "offline_access"];

function getMicrosoftAuthConfig(env = process.env) {
  const clientId = env.AIP_PDF_CLIENT_ID || "";
  const tenantId = env.AIP_PDF_TENANT_ID || "organizations";
  const redirectUri = env.AIP_PDF_REDIRECT_URI || "http://localhost:38461/auth/callback";

  return {
    clientId,
    tenantId,
    redirectUri,
    scopes: DEFAULT_SCOPES,
    configured: Boolean(clientId),
  };
}

function buildAuthorizeUrl(config) {
  if (!config.clientId) {
    throw new Error("AIP_PDF_CLIENT_ID is required before Microsoft login can start.");
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    response_type: "code",
    redirect_uri: config.redirectUri,
    response_mode: "query",
    scope: config.scopes.join(" "),
    prompt: "select_account",
  });

  return `https://login.microsoftonline.com/${encodeURIComponent(config.tenantId)}/oauth2/v2.0/authorize?${params.toString()}`;
}

module.exports = {
  DEFAULT_SCOPES,
  buildAuthorizeUrl,
  getMicrosoftAuthConfig,
};
