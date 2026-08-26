import { Schema } from "effect";

import { DomainId } from "./schemas";

export class DomainNotFoundError extends Schema.TaggedError<DomainNotFoundError>()(
  "DomainNotFoundError",
  { id: DomainId },
) {}
