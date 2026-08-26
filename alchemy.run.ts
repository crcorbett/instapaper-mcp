import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Output from "alchemy/Output";
import { Stack } from "alchemy/Stack";
import { Config, Effect } from "effect";

export default Alchemy.Stack(
  "instapaperCloudflare",
  { providers: Cloudflare.providers(), state: Cloudflare.state() },
  Effect.gen(function* () {
    const stack = yield* Stack;
    const isProduction = stack.stage === "prd";
    const googleIdentityProvider = isProduction
      ? yield* Cloudflare.Access.IdentityProvider("InstapaperGoogle", {
          name: "Google - Instapaper MCP",
          type: "google",
          config: {
            clientId: Config.string("GOOGLE_ACCESS_CLIENT_ID"),
            clientSecret: Config.string("GOOGLE_ACCESS_CLIENT_SECRET"),
            emailClaimName: "email",
            pkceEnabled: true,
          },
        })
      : undefined;
    const oauth = yield* Cloudflare.KV.Namespace("McpOAuthState", {
      title: `instapaper-mcp-oauth-${stack.stage}`,
    });
    const worker = yield* Cloudflare.Worker("InstapaperMcp", {
      name: `instapaper-mcp-${stack.stage}`,
      main: "apps/mcp/src/worker.ts",
      compatibility: { date: "2026-08-25", flags: ["nodejs_compat"] },
      workersDev: isProduction ? false : { enabled: true, previewsEnabled: false },
      ...(isProduction ? { domain: "instapaper.coopercorbett.com" } : {}),
      observability: {
        enabled: true,
        logs: { enabled: true, invocationLogs: true },
        traces: { enabled: false },
      },
      env: {
        OAUTH_KV: oauth,
        ACCESS_CLIENT_ID: Config.redacted("ACCESS_CLIENT_ID"),
        ACCESS_CLIENT_SECRET: Config.redacted("ACCESS_CLIENT_SECRET"),
        ACCESS_TOKEN_URL: Config.redacted("ACCESS_TOKEN_URL"),
        ACCESS_AUTHORIZATION_URL: Config.redacted("ACCESS_AUTHORIZATION_URL"),
        ACCESS_JWKS_URL: Config.redacted("ACCESS_JWKS_URL"),
        ACCESS_ISSUER: Config.redacted("ACCESS_ISSUER"),
        COOKIE_ENCRYPTION_KEY: Config.redacted("COOKIE_ENCRYPTION_KEY"),
        ALLOWED_EMAIL: Config.redacted("ALLOWED_EMAIL"),
        MCP_ALLOWED_ORIGIN_HOSTNAMES: Config.redacted("MCP_ALLOWED_ORIGIN_HOSTNAMES"),
        INSTAPAPER_CONSUMER_KEY: Config.redacted("INSTAPAPER_CONSUMER_KEY"),
        INSTAPAPER_CONSUMER_SECRET: Config.redacted("INSTAPAPER_CONSUMER_SECRET"),
        INSTAPAPER_ACCESS_TOKEN: Config.redacted("INSTAPAPER_ACCESS_TOKEN"),
        INSTAPAPER_ACCESS_TOKEN_SECRET: Config.redacted("INSTAPAPER_ACCESS_TOKEN_SECRET"),
      },
    });
    return {
      stage: stack.stage,
      mcpUrl: Output.map(worker.url, (url) => (url === undefined ? undefined : `${url}/mcp`)),
      workerName: worker.workerName,
      oauthNamespaceId: oauth.namespaceId,
      googleIdentityProviderId: googleIdentityProvider?.identityProviderId,
    };
  }),
);
