import type { AuthRequest } from "@cloudflare/workers-oauth-provider";
import { createRemoteJWKSet, jwtVerify } from "jose";

import type { Env } from "./env";
import { upstreamOAuthErrorResponse } from "./oauth-errors";
import { homePage, privacyPage } from "./public-pages";

interface StoredAuthorization {
  readonly request: AuthRequest;
  readonly verifier: string;
}

const base64Url = (bytes: Uint8Array): string => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
};

const randomValue = (): string => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
};

const challenge = async (verifier: string): Promise<string> =>
  base64Url(
    new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))),
  );

const stateKey = (state: string): string => `access-oauth-state:${state}`;

const redirectToAccess = async (request: Request, env: Env, oauthRequest: AuthRequest) => {
  const state = randomValue();
  const verifier = randomValue();
  await env.OAUTH_KV.put(
    stateKey(state),
    JSON.stringify({ request: oauthRequest, verifier } satisfies StoredAuthorization),
    { expirationTtl: 600 },
  );
  const upstream = new URL(env.ACCESS_AUTHORIZATION_URL);
  upstream.searchParams.set("client_id", env.ACCESS_CLIENT_ID);
  upstream.searchParams.set("redirect_uri", new URL("/callback", request.url).href);
  upstream.searchParams.set("response_type", "code");
  upstream.searchParams.set("scope", "openid email profile");
  upstream.searchParams.set("state", state);
  upstream.searchParams.set("code_challenge", await challenge(verifier));
  upstream.searchParams.set("code_challenge_method", "S256");
  return Response.redirect(upstream, 302);
};

const beginAuthorization = async (request: Request, env: Env) => {
  const oauthRequest = await env.OAUTH_PROVIDER.parseAuthRequest(request);
  if (!oauthRequest.clientId || !(await env.OAUTH_PROVIDER.lookupClient(oauthRequest.clientId))) {
    return new Response("Invalid OAuth client", { status: 400 });
  }
  return redirectToAccess(request, env, oauthRequest);
};

const completeAuthorization = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  const upstreamError = upstreamOAuthErrorResponse(url);
  if (upstreamError !== undefined) return upstreamError;
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  if (!state || !code) return new Response("Missing OAuth callback values", { status: 400 });
  const key = stateKey(state);
  const stored = await env.OAUTH_KV.get<StoredAuthorization>(key, "json");
  await env.OAUTH_KV.delete(key);
  if (!stored?.request.clientId || !stored.verifier) {
    return new Response("Expired OAuth state", { status: 400 });
  }
  const tokenResponse = await fetch(env.ACCESS_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: env.ACCESS_CLIENT_ID,
      client_secret: env.ACCESS_CLIENT_SECRET,
      redirect_uri: new URL("/callback", request.url).href,
      code,
      code_verifier: stored.verifier,
    }),
  });
  const tokenPayload: unknown = await tokenResponse.json();
  if (!tokenResponse.ok || typeof tokenPayload !== "object" || tokenPayload === null) {
    return new Response("Upstream OAuth exchange failed", { status: 502 });
  }
  const idToken = Reflect.get(tokenPayload, "id_token");
  if (typeof idToken !== "string") return new Response("Missing identity token", { status: 502 });
  const verified = await jwtVerify(idToken, createRemoteJWKSet(new URL(env.ACCESS_JWKS_URL)), {
    audience: env.ACCESS_CLIENT_ID,
    issuer: env.ACCESS_ISSUER,
  });
  const email = verified.payload.email;
  const subject = verified.payload.sub;
  if (typeof email !== "string" || typeof subject !== "string" || email !== env.ALLOWED_EMAIL) {
    return new Response("Not authorised", { status: 403 });
  }
  const { redirectTo } = await env.OAUTH_PROVIDER.completeAuthorization({
    request: stored.request,
    userId: subject,
    scope: stored.request.scope,
    metadata: { label: email },
    props: { email, subject },
  });
  return Response.redirect(redirectTo, 302);
};

export const authHandler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/") {
      return homePage();
    }
    if (request.method === "GET" && url.pathname === "/privacy") {
      return privacyPage();
    }
    if (request.method === "GET" && url.pathname === "/authorize") {
      return beginAuthorization(request, env);
    }
    if (request.method === "GET" && url.pathname === "/callback") {
      return completeAuthorization(request, env);
    }
    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ status: "ok" });
    }
    return new Response("Not found", { status: 404 });
  },
};
