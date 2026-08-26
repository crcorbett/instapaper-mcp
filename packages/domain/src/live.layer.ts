import { Effect, Layer, Option } from "effect";

import { DomainNotFoundError } from "./errors";
import type { DomainItem } from "./schemas";
import { DomainService } from "./service";

const items: readonly DomainItem[] = [];

export const DomainLive = Layer.succeed(DomainService, {
  get: (id) =>
    Option.fromUndefinedOr(items.find((item) => item.id === id)).pipe(
      Option.match({
        onNone: () => Effect.fail(new DomainNotFoundError({ id })),
        onSome: Effect.succeed,
      }),
    ),
  list: () => Effect.succeed(items),
});
