import { Effect, Layer } from "effect";
import { FetchHttpClient } from "effect/unstable/http";
import { RpcClient as EffectRpcClient, RpcSerialization } from "effect/unstable/rpc";

import { RpcGroup } from "./group";
import { RpcClient } from "./service";

export const RpcClientLive = Layer.effect(RpcClient)(
  EffectRpcClient.make(RpcGroup).pipe(
    Effect.map((client) =>
      RpcClient.of({
        get: (id) => client.GetDomain({ id }),
        list: () => client.ListDomain(),
      }),
    ),
  ),
).pipe(
  Layer.provide(EffectRpcClient.layerProtocolHttp({ url: "/rpc" })),
  Layer.provide(FetchHttpClient.layer),
  Layer.provide(RpcSerialization.layerNdjson),
);
