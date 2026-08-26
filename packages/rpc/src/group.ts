import { DomainNotFoundError } from "@instapaper/domain/errors";
import { DomainItem } from "@instapaper/domain/schemas";
import { Schema } from "effect";
import * as EffectRpc from "effect/unstable/rpc/Rpc";
import * as EffectRpcGroup from "effect/unstable/rpc/RpcGroup";

export class ListDomain extends EffectRpc.make("ListDomain", {
  success: Schema.Array(DomainItem),
}) {}

export class GetDomain extends EffectRpc.make("GetDomain", {
  error: DomainNotFoundError,
  payload: Schema.Struct({ id: DomainItem.fields.id }),
  success: DomainItem,
}) {}

export const RpcGroup = EffectRpcGroup.make(ListDomain, GetDomain);
