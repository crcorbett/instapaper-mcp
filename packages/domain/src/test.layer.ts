import { Array, Effect, Layer, Option, Ref } from "effect";

import { DomainNotFoundError } from "./errors";
import type { DomainId, DomainItem } from "./schemas";
import { DomainService } from "./service";

export const makeDomainTest = (items: readonly DomainItem[]) =>
  Effect.gen(function* () {
    const requested = yield* Ref.make<readonly DomainId[]>([]);
    const layer = Layer.succeed(DomainService, {
      get: (id) =>
        Ref.update(requested, Array.append(id)).pipe(
          Effect.andThen(
            Option.fromUndefinedOr(items.find((item) => item.id === id)).pipe(
              Option.match({
                onNone: () => Effect.fail(new DomainNotFoundError({ id })),
                onSome: Effect.succeed,
              }),
            ),
          ),
        ),
      list: () => Effect.succeed(items),
    });
    return { layer, observations: { requested } } as const;
  });
