import { OAuthProvider } from "@cloudflare/workers-oauth-provider";

import { authHandler } from "./auth";
import type { Env } from "./env";
import { createInstapaperMcpHandler } from "./mcp-handler";

const apiHandler = {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const handler = createInstapaperMcpHandler(env);
    return handler(request, env, ctx);
  },
};

export default new OAuthProvider({
  apiRoute: "/mcp",
  apiHandler,
  authorizeEndpoint: "/authorize",
  tokenEndpoint: "/oauth/token",
  clientRegistrationEndpoint: "/oauth/register",
  defaultHandler: authHandler,
});
