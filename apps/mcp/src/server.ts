import { getMcpAuthContext } from "agents/mcp/server";
import { McpServer } from "@modelcontextprotocol/server";
import { ApprovedSave, Candidate } from "@instapaper/client/schemas";
import { Schema } from "effect";
import { z } from "zod";

import type { Env } from "./env";
import { accessCheck, checkCandidates, saveApproved } from "./instapaper-runtime";
import { TOOL_CONTRACTS } from "./tool-contracts";

const httpsUrl = z.url().refine((value) => value.startsWith("https://"), "Use an HTTPS URL");
const candidateInput = z.object({
  originalUrl: httpsUrl,
  saveUrl: httpsUrl,
  title: z.string().trim().min(1).max(500),
});
const approvedSaveInput = z.object({
  originalUrl: httpsUrl,
  saveUrl: httpsUrl,
  title: z.string().trim().min(1).max(500),
  description: z.string().max(2_000),
  content: z.string().min(1).max(1_500_000),
  sourceTag: z.string().trim().min(1).max(100),
  lengthTag: z.enum(["Essay", "Article"]),
  sourceWords: z.number().int().positive().max(500_000),
});

const content = (value: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(value) }],
});

const failure = (error: unknown) => ({
  isError: true,
  content: [
    {
      type: "text" as const,
      text: JSON.stringify({
        status: "failed",
        error:
          typeof error === "object" &&
          error !== null &&
          typeof Reflect.get(error, "_tag") === "string"
            ? Reflect.get(error, "_tag")
            : "InstapaperOperationFailed",
      }),
    },
  ],
});

const requireCooper = (env: Env): void => {
  const auth = getMcpAuthContext();
  if (auth?.props?.email !== env.ALLOWED_EMAIL) throw new Error("Not authorised");
};

export const createServer = (env: Env) => {
  const server = new McpServer({ name: "Cooper Instapaper", version: "0.1.0" });

  server.registerTool(
    TOOL_CONTRACTS.accessCheck.name,
    {
      description: "Read-only check that the service can list Cooper's Instapaper folders.",
      annotations: TOOL_CONTRACTS.accessCheck.annotations,
    },
    async () => {
      try {
        requireCooper(env);
        return content(await accessCheck(env));
      } catch (error) {
        return failure(error);
      }
    },
  );

  server.registerTool(
    TOOL_CONTRACTS.checkCandidates.name,
    {
      description:
        "Check up to 25 proposed articles against unread, starred and archived Instapaper bookmarks. This never saves anything.",
      inputSchema: { candidates: z.array(candidateInput).min(1).max(25) },
      annotations: TOOL_CONTRACTS.checkCandidates.annotations,
    },
    async ({ candidates }) => {
      try {
        requireCooper(env);
        const decoded = await Schema.decodeUnknownPromise(Schema.Array(Candidate))(candidates);
        return content(await checkCandidates(env, decoded));
      } catch (error) {
        return failure(error);
      }
    },
  );

  server.registerTool(
    TOOL_CONTRACTS.saveApproved.name,
    {
      description:
        "Save one exact article only after Cooper explicitly approves it. This writes to Instapaper and verifies the saved text by readback.",
      inputSchema: approvedSaveInput.shape,
      annotations: TOOL_CONTRACTS.saveApproved.annotations,
    },
    async (input) => {
      try {
        requireCooper(env);
        const decoded = await Schema.decodeUnknownPromise(ApprovedSave)(input);
        return content(await saveApproved(env, decoded));
      } catch (error) {
        return failure(error);
      }
    },
  );

  return server;
};
