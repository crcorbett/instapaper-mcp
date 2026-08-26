import { DomainItem } from "@instapaper/domain/schemas";
import { createSerializableLoader } from "@instapaper/effect-start/loader";
import { Schema } from "effect";

export const domainListLoader = createSerializableLoader({
  error: Schema.Never,
  success: Schema.Array(DomainItem),
});
