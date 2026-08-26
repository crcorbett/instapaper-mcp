# Plan, deploy and read back the Instapaper MCP

## Preconditions and authority

Record the operator identity, Alchemy profile, Cloudflare account, exact stage,
secret-store project/config, Worker name, OAuth KV namespace and rollback
target in a private operator record, not in this repository.
Confirm that Cooper has approved the stage and that the Cloudflare token can
manage Workers, KV, Worker secrets and Access login methods. The Cloudflare
Access SaaS application and policy must already exist. Read them before any
change and confirm the policy includes only the configured allowed email.

Use a generic OIDC SaaS application between the Worker and Cloudflare Access.
Register the Worker's `/callback` URL, enable PKCE, request the
`openid email profile` scopes, and keep an allow policy for Cooper. Copy the
exact issuer, authorization, token and JWKS URLs into the matching secret names.
`MCP_ALLOWED_ORIGIN_HOSTNAMES` is a comma-separated list of hostnames, not full
URLs.

Use the dedicated external Google Cloud project for the Access login. Its OAuth
web client must register the Cloudflare Access team origin and callback supplied
by the provider. Do not record that account-specific team domain here.

Before moving the Google OAuth app to Production, serve a public home page at
`https://instapaper.coopercorbett.com/` and privacy notice at
`https://instapaper.coopercorbett.com/privacy`. Register `coopercorbett.com` as
an authorised domain, keep the approved private support and developer contacts,
and confirm Google's Data Access page lists no
sensitive or restricted scopes. Do not add a logo unless brand verification is
separately planned. Publishing makes the Google client available to Google
accounts generally; Cloudflare Access and the Worker must still enforce the
exact personal email.

Store its client ID and secret as `GOOGLE_ACCESS_CLIENT_ID` and
`GOOGLE_ACCESS_CLIENT_SECRET` in the approved production secret-store
configuration. Do not put either value or the private configuration name in a
command argument, repository file, log or evidence record.

Required Doppler values are listed in `.env.example`. Doppler injects them into
the Alchemy process; clear values must not appear in source, state, command
arguments, logs or evidence.

Cloudflare creates the Worker-facing OIDC client ID and secret and does not
reveal the secret again. The current Access application is the sole identity
application for this service. If either the Cloudflare or Google client pair is
lost or compromised, treat that as a separately approved credential rotation:
create one replacement, update the approved production secret configuration,
deploy and verify the hosted
OAuth journey, then remove the superseded credential. Never keep two active
Instapaper Access applications after verification.

Production uses the approved Alchemy stage and a private secret-store
configuration. Its canonical address is
`https://instapaper.coopercorbett.com/mcp`, and its Access callback is
`https://instapaper.coopercorbett.com/callback`. The production
cookie-encryption key must differ from development. The Access client and
Instapaper OAuth 1.0a credentials may be shared deliberately because they refer
to the same single-user upstream services.

## Procedure and bounded evidence

1. Run local verification and retain the commit SHA and clean/dirty status.
2. Read the selected Alchemy profile and Cloudflare account. Stop on mismatch.
3. Run `doppler run --project <project> --config <config> -- bun run infra:plan -- --stage <stage>`.
4. Inspect every create, update, replace and delete. For the Google login change,
   the expected plan is one account-level Google identity provider and no Worker
   or KV replacement. Any delete, replacement or unrelated resource is a stop
   condition. Ensure the Google client secret is absent from plan output.
5. Apply the same commit, profile, Doppler config and stage with
   `doppler run --project <project> --config <config> -- bun run infra:deploy -- --stage <stage>`.
6. Read the Google identity provider back from Cloudflare and confirm its name,
   type and client ID without retaining its secret. Read the existing Access
   application and policy again before attaching the provider.
7. Attach only the new Google identity-provider ID to the existing Access SaaS
   application and enable direct redirect to that provider. Use the smallest
   supported Cloudflare update. If the API requires the whole application,
   round-trip the observed document and change only `allowed_idps` and
   `auto_redirect_to_identity`. Stop if any client, redirect or policy value
   would change.
8. Read the Access application and policy back independently. Confirm the only
   allowed identity provider is the owned Google provider and the allow policy
   still contains exactly the configured allowed email.
9. Read Google's Branding, Audience and Data Access pages. Confirm the public
   home and privacy URLs, authorised domains, `In production` status and absence
   of sensitive or restricted scopes.
10. Call `/health`, complete or refresh the hosted MCP OAuth journey as the
    configured account owner, and run the read-only `instapaper_access_check`.
    Confirm the MCP endpoint accepts the current protocol and the stateless 2025
    protocol used by Executor. Do not save a bookmark.
11. Record bounded receipts only. Do not retain secret bindings, OAuth tokens,
    authorisation codes, full provider payloads or article text.

## Rollback, escalation, and cleanup

Revoke the MCP OAuth grant or Cloudflare Access policy first if access must stop
immediately. To roll back only the login change, re-enable the previously
verified login method on the existing application before detaching Google. Do
not delete the Alchemy-owned Google identity provider until the rollback journey
passes and a destructive plan is separately approved. Restore the last
provider-verified Worker version through the same Alchemy stage if Worker code
also changed. If publishing itself causes a Google-side problem, return the app
to Testing only after confirming the configured account owner remains a test
user.
Provider readback proves only the named resources and settings; it does not
prove publisher extraction or a successful Instapaper save.
