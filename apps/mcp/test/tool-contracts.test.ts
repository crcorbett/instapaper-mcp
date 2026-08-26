import { describe, expect, it } from "vitest";

import { TOOL_CONTRACTS } from "../src/tool-contracts";

describe("MCP tool contracts", () => {
  it("has only one external write tool", () => {
    const contracts = Object.values(TOOL_CONTRACTS);
    expect(contracts.filter((contract) => !contract.annotations.readOnlyHint)).toEqual([
      TOOL_CONTRACTS.saveApproved,
    ]);
    expect(TOOL_CONTRACTS.saveApproved.annotations).toMatchObject({
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    });
  });

  it("keeps duplicate and access checks read-only", () => {
    expect(TOOL_CONTRACTS.accessCheck.annotations.readOnlyHint).toBe(true);
    expect(TOOL_CONTRACTS.checkCandidates.annotations.readOnlyHint).toBe(true);
  });
});
