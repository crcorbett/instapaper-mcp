# `instapaper`

Bun/Turbo monorepo for Cooper's private Instapaper reading service. It contains
an Effect Full API client, an authenticated Cloudflare MCP Worker, an Alchemy
resource graph and a private Codex plugin. Resolved dependency snapshot:
`2026-08-26`.

```bash
bun install
bun run verification
```

Read `AGENTS.md`, then use [`docs/README.md`](docs/README.md) to load only the
semantic owners needed for the change. The
[Instapaper product specification](docs/product-specs/instapaper-reading-mcp.md)
records the intended behaviour. The generic web, domain, RPC and HTTP packages
remain the qualified repository
scaffold; the MCP does not pretend to use them. Generated route trees, output
and caches are tool-owned. The recorded dependency snapshot was selected on
`2026-08-26`; it is not a claim that versions remain current.

No command in the normal build saves an article. Live saves remain behind
Cooper's explicit approval and Instapaper readback.
