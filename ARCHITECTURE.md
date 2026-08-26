# Architecture

The repository is a Bun/Turbo monorepo. `packages/instapaper-client` owns the
Full API, OAuth 1.0a signing and save policy as an Effect service. `apps/mcp`
owns the Cloudflare MCP/OAuth host adapter and is the Effect runtime boundary.
The root `alchemy.run.ts` owns the staged Worker, OAuth KV namespace, secret
bindings and production Google login method for Cloudflare Access. The existing
Access SaaS application and its exact-email policy stay outside Alchemy until
Alchemy can safely represent their full live settings.
The production Worker also owns the public OAuth app home and privacy pages;
Google owns their branding registration and the app's publishing status.
`plugin/instapaper-article-save` bundles the hosted reading skill and, after
deployment, the exact remote MCP URL.

The rendered `apps/web`, `packages/domain`, `packages/rpc`,
`packages/http-api` and `packages/effect-start` remain the qualified standard
repository scaffold. They are not on the MCP call path.

Focused architecture decisions live under [`docs/architecture/`](docs/architecture/).
Operational procedures live under [`docs/runbooks/`](docs/runbooks/); proof and
current task state are intentionally separate. Start at [`docs/README.md`](docs/README.md).
