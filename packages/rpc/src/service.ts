import type { DomainNotFoundError } from "@instapaper/domain/errors";
import type { DomainId, DomainItem } from "@instapaper/domain/schemas";
import { Context } from "effect";
import type { Effect } from "effect";
import type { RpcClientError } from "effect/unstable/rpc/RpcClientError";

export interface IRpcClient {
  readonly get: (id: DomainId) => Effect.Effect<DomainItem, DomainNotFoundError | RpcClientError>;
  readonly list: () => Effect.Effect<readonly DomainItem[], RpcClientError>;
}

export class RpcClient extends Context.Service<RpcClient, IRpcClient>()("@instapaper/rpc/Client") {}
