import { Effect, Layer } from "effect";
import { FetchHttpClient } from "effect/unstable/http";
import { HttpApiClient as EffectHttpApiClient } from "effect/unstable/httpapi";

import { HttpApiApi } from "../api";
import { HttpApiClientService } from "./service";

export const HttpApiClientBrowserLive = Layer.effect(
  HttpApiClientService,
  EffectHttpApiClient.make(HttpApiApi).pipe(
    Effect.map((client) =>
      HttpApiClientService.of({
        get: (id) => client.domain.get({ params: { id } }),
        list: () => client.domain.list({}),
      }),
    ),
  ),
).pipe(Layer.provide(FetchHttpClient.layer));
