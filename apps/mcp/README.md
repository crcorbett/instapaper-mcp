# Instapaper MCP Worker

This Cloudflare Worker exposes two read-only Instapaper tools and one external
write tool. Google signs the account owner into Cloudflare Access, which
authenticates the Worker's OAuth 2.1 provider. Access and the Worker both
restrict the identity to the configured allowed email. The Worker then uses the
separate OAuth 1.0a credentials owned by `@instapaper/client` when it calls
Instapaper.

The production origin also serves a public home page at `/` and privacy notice
at `/privacy`. Google uses these pages for the OAuth app's Production branding.
They contain no authenticated MCP data and do not weaken the `/mcp` access
checks.

The save tool must remain confirmation-controlled in Codex. A successful tool
result means the added bookmark also passed `bookmarks/get_text` readback.
