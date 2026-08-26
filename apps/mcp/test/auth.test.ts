import { describe, expect, it } from "vitest";

import { upstreamOAuthErrorResponse } from "../src/oauth-errors";

describe("OAuth callback errors", () => {
  it("reports a safe upstream error without hiding its cause", async () => {
    const response = upstreamOAuthErrorResponse(
      new URL(
        "https://instapaper.coopercorbett.com/callback?error=invalid_client&error_description=Invalid%20client%20ID",
      ),
    );

    expect(response?.status).toBe(400);
    await expect(response?.json()).resolves.toEqual({
      error: "Upstream OAuth authorization failed",
      providerError: "invalid_client",
      providerDescription: "Invalid client ID",
    });
  });

  it("does not reflect unsafe provider values", async () => {
    const response = upstreamOAuthErrorResponse(
      new URL(
        "https://instapaper.coopercorbett.com/callback?error=%3Cscript%3E&error_description=bad%0Avalue",
      ),
    );

    await expect(response?.json()).resolves.toEqual({
      error: "Upstream OAuth authorization failed",
      providerError: "unknown_error",
      providerDescription: "badvalue",
    });
  });
});
