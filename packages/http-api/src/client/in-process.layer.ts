import type { Context } from "effect";
import { Effect, Layer } from "effect";
import { FetchHttpClient } from "effect/unstable/http";
import { HttpApiClient as EffectHttpApiClient } from "effect/unstable/httpapi";

import { HttpApiApi } from "../api";
import { HttpApiClientService } from "./service";

export const makeHttpApiInProcessClient = (
  handler: (request: Request, context?: Context.Context<never>) => Promise<Response>,
) =>
  Layer.effect(
    HttpApiClientService,
    EffectHttpApiClient.make(HttpApiApi, { baseUrl: "http://in-process.local" }).pipe(
      Effect.map((client) =>
        HttpApiClientService.of({
          get: (id) => client.domain.get({ params: { id } }),
          list: () => client.domain.list({}),
        }),
      ),
    ),
  ).pipe(
    Layer.provide(FetchHttpClient.layer),
    Layer.provide(
      Layer.succeed(
        FetchHttpClient.Fetch,
        Object.assign(
          (...args: Parameters<typeof globalThis.fetch>) => handler(new Request(args[0], args[1])),
          globalThis.fetch,
        ),
      ),
    ),
  );
