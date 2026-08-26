import { Effect, Layer } from "effect";
import * as EffectRpcTest from "effect/unstable/rpc/RpcTest";

import { RpcGroup } from "./group";
import { RpcHandlersLive } from "./handlers";
import { RpcClient } from "./service";

export const RpcClientTest = Layer.effect(
  RpcClient,
  EffectRpcTest.makeClient(RpcGroup).pipe(
    Effect.map((client) =>
      RpcClient.of({
        get: (id) => client.GetDomain({ id }),
        list: () => client.ListDomain(),
      }),
    ),
  ),
).pipe(Layer.provide(RpcHandlersLive));
