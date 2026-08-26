import { assert, describe, it } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { DomainLive } from "@instapaper/domain/live";

import { RpcClient } from "../src/service";
import { RpcClientTest } from "../src/test.layer";

describe("Rpc RPC", () => {
  it.effect("lists through the in-process client", () =>
    Effect.gen(function* () {
      const client = yield* RpcClient;
      const items = yield* client.list();
      assert.isArray(items);
    }).pipe(Effect.provide(RpcClientTest.pipe(Layer.provide(DomainLive)))),
  );
});
