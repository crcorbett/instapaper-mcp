import { describe, expect, it } from "vitest";

import { homePage, privacyPage } from "../src/public-pages";

describe("public OAuth app pages", () => {
  it("describes the private service and links to its privacy notice", async () => {
    const response = homePage();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");
    await expect(response.text()).resolves.toContain('href="/privacy"');
  });

  it("explains the bounded use of Google identity information", async () => {
    const response = privacyPage();
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain("does not read Gmail, Google Drive, contacts or other Google content");
    expect(body).toContain("not sent to Instapaper");
    expect(response.headers.get("content-security-policy")).toContain("frame-ancestors 'none'");
  });
});
