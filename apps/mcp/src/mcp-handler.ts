import { createMcpHandler } from "agents/mcp/server";

import type { Env } from "./env";
import { createServer } from "./server";

export const createInstapaperMcpHandler = (env: Env) => {
  const allowedOriginHostnames = env.MCP_ALLOWED_ORIGIN_HOSTNAMES.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return createMcpHandler(() => createServer(env), {
    route: "/mcp",
    legacy: "stateless",
    corsOptions: false,
    ...(allowedOriginHostnames.length > 0 ? { allowedOriginHostnames } : {}),
  });
};
