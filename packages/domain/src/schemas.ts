import { Schema } from "effect";

export const DomainId = Schema.Trimmed.check(Schema.isMinLength(1)).pipe(Schema.brand("DomainId"));
export type DomainId = typeof DomainId.Type;

export const DomainItem = Schema.Struct({
  id: DomainId,
  name: Schema.Trimmed.check(Schema.isMinLength(1)),
});
export type DomainItem = typeof DomainItem.Type;
