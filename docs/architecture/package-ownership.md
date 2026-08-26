# Package ownership

`domain` owns semantic policy. `rpc` and `http-api` are independent transports
over it. `effect-start` owns SSR codec primitives. `apps/web` owns framework
adaptation, execution, runtime composition, and disposal. New packages require a
stable capability boundary and consumer evidence; one-use code stays local.

`instapaper-client` is an independent external-service package used by the MCP
app. `apps/mcp` owns transport decoding, OAuth host adaptation, runtime
execution and bounded MCP responses. `plugin/instapaper-article-save` owns hosted
skill instructions and connector metadata. Alchemy composition remains at the
repository root rather than becoming a package.
