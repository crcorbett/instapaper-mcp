import { DomainService } from "@instapaper/domain/service";
import { Effect } from "effect";

import { RpcGroup } from "./group";

export const RpcHandlersLive = RpcGroup.toLayer(
  Effect.gen(function* () {
    const domain = yield* DomainService;
    return RpcGroup.of({
      GetDomain: ({ id }) => domain.get(id),
      ListDomain: () => domain.list(),
    });
  }),
);
