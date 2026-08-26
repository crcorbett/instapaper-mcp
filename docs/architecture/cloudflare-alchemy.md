# Cloudflare and Alchemy

The root `alchemy.run.ts` is one Effect composition root. It owns a staged
`Cloudflare.Worker`, one OAuth KV namespace and the Worker's bindings. The
production stage also owns the Google login method used by Cloudflare Access.
The Worker uses Cloudflare's stateless MCP handler; no Durable Object is needed.
The `prd` stage owns the Worker custom-domain attachment for
`instapaper.coopercorbett.com`. The existing `coopercorbett.com` zone remains
foreign infrastructure. Production disables the `workers.dev` surface, while
non-production stages retain their stage-specific `workers.dev` address.

Secret Worker bindings are `Config.redacted` inputs resolved only by the
deployment process. The Google client secret is supplied by Doppler directly to
Alchemy's Access identity-provider resource. Alchemy's remote state is encrypted
at rest; repository files, command output and proof records must not contain the
clear secret.

Google is the human login provider for Cloudflare Access. The Google Cloud
project and its OAuth client are external prerequisites because this repository
does not manage Google Cloud. The existing Access SaaS application and its
exact-email policy also remain foreign. Alchemy owns only the account-level
Google login method because the selected Alchemy version cannot safely describe
every setting on the existing SaaS application. After an Alchemy apply, a
bounded Cloudflare API update may attach the owned login method to that existing
application. It must preserve the application's client, redirect and policy
settings.

The shared Access OIDC application registers separate development and
production Worker callback URLs. Each Alchemy stage still has its own Worker,
OAuth KV namespace and cookie-encryption key. Access admits only the configured
allowed email, and the Worker independently checks the same email in the
verified ID token before it grants MCP access.

The production Worker serves public home and privacy pages at `/` and
`/privacy`. The external Google project registers those pages under the
authorised domain and has publishing status `In production`. The app requests
only basic Google sign-in identity; its Data Access page lists no sensitive or
restricted scopes. Google's broader audience setting does not replace the
exact-email checks in Access and the Worker.

Alchemy remote state and Cloudflare provider state remain authoritative for
live identity. Follow `docs/runbooks/deploy-instapaper-mcp.md`: plan before
apply, fail on unexpected deletes and read the Worker and KV namespace back
before making a deployment claim. The selected Alchemy beta is recorded in
`repo-structure.render.json`; upgrades open a new compatibility check.
