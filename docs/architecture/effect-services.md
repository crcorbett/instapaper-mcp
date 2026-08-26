# Effect services

Contracts use `Context.Service`; live and deterministic test Layers use separate
export paths. Serializable boundaries use Schema errors/codecs. Provider SDKs
stay private to live adapters. Browser clients use Fetch and server loaders use
in-process handlers. Effects execute only at app/framework/CLI boundaries.

`@instapaper/client` is the product service. It owns OAuth 1.0a signing,
Instapaper Full API requests, duplicate matching, truncation rejection and
readback verification. Its live Layer requires Effect's Fetch HTTP client and
redacted credentials. The MCP Worker is the runtime boundary that runs these
Effects; MCP and OAuth SDK objects remain thin host adapters.

The Full API limits each folder listing to 500 bookmarks. The service refuses
to make a duplicate-free claim when a folder reaches that limit.
