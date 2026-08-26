import { describe, expect, it } from "vitest";

import type { Env } from "../src/env";
import { createInstapaperMcpHandler } from "../src/mcp-handler";

const testEnv = {
  MCP_ALLOWED_ORIGIN_HOSTNAMES: "instapaper.coopercorbett.com",
} as Env;

describe("MCP protocol compatibility", () => {
  it("accepts the 2025-11-25 protocol used by Executor", async () => {
    const handler = createInstapaperMcpHandler(testEnv);
    const response = await handler.fetch(
      new Request("https://instapaper.coopercorbett.com/mcp", {
        method: "POST",
        headers: {
          accept: "application/json, text/event-stream",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: {
            protocolVersion: "2025-11-25",
            capabilities: {},
            clientInfo: { name: "executor-compatibility-test", version: "1.0.0" },
          },
        }),
      }),
    );

    expect(response.status).toBe(200);
    const body = await response.text();
    const data = body
      .split("\n")
      .find((line) => line.startsWith("data:"))
      ?.slice("data:".length)
      .trim();

    expect(data).toBeDefined();
    expect(JSON.parse(data ?? "null")).toMatchObject({
      jsonrpc: "2.0",
      id: 1,
      result: { protocolVersion: "2025-11-25" },
    });
  });
});
