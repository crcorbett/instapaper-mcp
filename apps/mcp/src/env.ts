import type { OAuthHelpers } from "@cloudflare/workers-oauth-provider";

export interface Env {
  readonly OAUTH_PROVIDER: OAuthHelpers;
  readonly OAUTH_KV: KVNamespace;
  readonly ACCESS_CLIENT_ID: string;
  readonly ACCESS_CLIENT_SECRET: string;
  readonly ACCESS_TOKEN_URL: string;
  readonly ACCESS_AUTHORIZATION_URL: string;
  readonly ACCESS_JWKS_URL: string;
  readonly ACCESS_ISSUER: string;
  readonly COOKIE_ENCRYPTION_KEY: string;
  readonly ALLOWED_EMAIL: string;
  readonly MCP_ALLOWED_ORIGIN_HOSTNAMES: string;
  readonly INSTAPAPER_CONSUMER_KEY: string;
  readonly INSTAPAPER_CONSUMER_SECRET: string;
  readonly INSTAPAPER_ACCESS_TOKEN: string;
  readonly INSTAPAPER_ACCESS_TOKEN_SECRET: string;
}
