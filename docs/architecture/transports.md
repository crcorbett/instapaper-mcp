# RPC and HTTP transport boundaries

`packages/rpc` and `packages/http-api` own their wire contracts, handlers,
named clients, server composition, and transport tests. They reuse domain
Schemas, branded identifiers, tagged errors, and service operations rather than
redeclaring semantic policy. Browser HTTP uses Fetch; server loaders use the
in-process HTTP client; RPC uses its named client service.

A public transport change updates this page, the affected package README and
tests, `docs/critical-journeys/journeys.json`, and a claim-matched proof packet
in the same slice. Domain semantic changes update the domain schema/service
owners first. Encoding and decoding occur only at ingress/egress boundaries.

`apps/mcp` is a separate protocol adapter. MCP SDK v2 owns the wire protocol and
Cloudflare's OAuth provider owns MCP OAuth 2.1. The adapter decodes tool inputs
into `@instapaper/client` Schemas, runs the Effect service and returns bounded
JSON receipts. It does not route MCP through the generic HTTP API package.
