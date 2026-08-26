import { assert, describe, it } from "@effect/vitest";
import { Effect } from "effect";
import { HttpApiApi } from "../src/api";

describe("HttpApi HTTP API", () => {
  it.effect("owns one API contract", () => Effect.sync(() => assert.ok(HttpApiApi)));
});
