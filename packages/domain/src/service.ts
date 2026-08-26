import { Context } from "effect";
import type { Effect } from "effect";

import type { DomainNotFoundError } from "./errors";
import type { DomainId, DomainItem } from "./schemas";

export interface IDomainService {
  readonly get: (id: DomainId) => Effect.Effect<DomainItem, DomainNotFoundError>;
  readonly list: () => Effect.Effect<readonly DomainItem[]>;
}

export class DomainService extends Context.Service<DomainService, IDomainService>()(
  "@instapaper/domain/DomainService",
) {}
