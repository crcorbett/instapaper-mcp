export const TOOL_CONTRACTS = {
  accessCheck: {
    name: "instapaper_access_check",
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  checkCandidates: {
    name: "instapaper_check_candidates",
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  saveApproved: {
    name: "instapaper_save_approved",
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
} as const;
