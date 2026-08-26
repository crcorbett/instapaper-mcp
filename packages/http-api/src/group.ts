import { DomainNotFoundError } from "@instapaper/domain/errors";
import { DomainItem } from "@instapaper/domain/schemas";
import { Schema } from "effect";
import {
  HttpApiEndpoint as EffectHttpApiEndpoint,
  HttpApiGroup as EffectHttpApiGroup,
  HttpApiSchema as EffectHttpApiSchema,
} from "effect/unstable/httpapi";

const NotFound = DomainNotFoundError.pipe(EffectHttpApiSchema.status(404));

export const HttpApiGroup = EffectHttpApiGroup.make("domain")
  .add(
    EffectHttpApiEndpoint.get("list", "/api/items", {
      success: Schema.Array(DomainItem),
    }),
  )
  .add(
    EffectHttpApiEndpoint.get("get", "/api/items/:id", {
      error: NotFound,
      params: Schema.Struct({ id: DomainItem.fields.id }),
      success: DomainItem,
    }),
  );
