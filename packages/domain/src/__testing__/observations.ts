import type { Ref } from "effect";

import type { DomainId } from "../schemas";

export interface DomainObservations {
  readonly requested: Ref.Ref<readonly DomainId[]>;
}
