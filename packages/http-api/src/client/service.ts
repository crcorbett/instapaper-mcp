import type { DomainNotFoundError } from "@instapaper/domain/errors";
import type { DomainId, DomainItem } from "@instapaper/domain/schemas";
import { Context } from "effect";
import type { Effect, Schema } from "effect";
import type { HttpClientError } from "effect/unstable/http/HttpClientError";

export interface IHttpApiClient {
  readonly get: (
    id: DomainId,
  ) => Effect.Effect<DomainItem, DomainNotFoundError | HttpClientError | Schema.SchemaError>;
  readonly list: () => Effect.Effect<readonly DomainItem[], HttpClientError | Schema.SchemaError>;
}

export class HttpApiClientService extends Context.Service<HttpApiClientService, IHttpApiClient>()(
  "@instapaper/http-api/Client",
) {}
