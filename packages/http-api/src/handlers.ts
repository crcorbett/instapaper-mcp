import { DomainService } from "@instapaper/domain/service";
import { Effect } from "effect";
import { HttpApiBuilder as EffectHttpApiBuilder } from "effect/unstable/httpapi";

import { HttpApiApi } from "./api";

export const HttpApiHandlersLive = EffectHttpApiBuilder.group(HttpApiApi, "domain", (handlers) =>
  Effect.gen(function* () {
    const domain = yield* DomainService;
    return handlers
      .handle("list", () => domain.list())
      .handle("get", ({ params }) => domain.get(params.id));
  }),
);
