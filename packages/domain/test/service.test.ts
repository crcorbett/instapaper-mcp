import { assert, describe, it } from "@effect/vitest";
import { Effect } from "effect";

import { exampleDomain } from "../src/__testing__/fixtures";
import { DomainService } from "../src/service";
import { makeDomainTest } from "../src/test.layer";

describe("DomainService", () => {
  it.effect("uses the deterministic Layer", () =>
    Effect.gen(function* () {
      const setup = yield* makeDomainTest([exampleDomain]);
      const item = yield* Effect.gen(function* () {
        const service = yield* DomainService;
        return yield* service.get(exampleDomain.id);
      }).pipe(Effect.provide(setup.layer));
      assert.strictEqual(item.name, "Example");
    }),
  );
});
