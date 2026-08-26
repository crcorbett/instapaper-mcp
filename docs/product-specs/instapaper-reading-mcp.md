---
status: active
owner: cooper
task_plan: ./instapaper-reading-mcp.tasks.json
review_trigger: Instapaper API, MCP authentication, browser capability, or save policy change
---

# Instapaper reading MCP

## Outcome

Give scheduled Codex Work tasks a private, hosted way to check Instapaper and,
only after Cooper approves named items, save complete articles through the Full
API and verify each save by reading it back.

## Users and jobs

- Cooper reviews a weekly shortlist without creating bookmarks.
- A scheduled Codex Work task checks proposed URLs and titles against unread,
  starred and archived bookmarks.
- After Cooper approves specific items, an interactive task submits the exact
  save payload and receives a small verification receipt.
- A maintainer deploys one Cloudflare Worker through Alchemy and can roll it
  back without exposing credentials.

## System boundary

The Codex plugin contains the `instapaper-article-save` skill and points to a
remote MCP endpoint. The Cloudflare Worker owns MCP authentication, input
decoding, the Instapaper client runtime and safe response shaping. The Effect
client package owns OAuth 1.0a signing, Full API calls, duplicate policy,
truncation checks and readback verification. Alchemy owns the Worker, its OAuth
KV namespace, bindings and the production Google login method. The existing
Cloudflare Access SaaS application and exact-email policy remain external
prerequisites. Access admits only the configured allowed email, and the Worker
checks the same email from the verified Access token.

Two unrelated authentication systems are required:

1. OAuth 2.1 protects Codex-to-MCP access.
2. OAuth 1.0a HMAC-SHA1 signs Worker-to-Instapaper Full API requests.

Instapaper xAuth is a one-time credential bootstrap. The deployed Worker stores
the resulting access token and token secret, not the Instapaper password.

## Functional requirements

### Read operations

- `instapaper_access_check` proves the authenticated Worker can list bookmarks
  and returns counts only.
- `instapaper_check_candidates` accepts at most 25 candidates and checks unread,
  starred and archived folders before recommending or saving anything.
- Duplicate matching uses normalised original URL, intended save URL and a
  whitespace-normalised, case-insensitive title. Archive-backed copies are
  caught by title when their stored URL differs.
- Instapaper returns at most 500 bookmarks per folder. If any checked folder
  reaches that limit, the read fails closed because complete duplicate coverage
  cannot be proved. No candidate may be called unsaved in that state.
- Read tools return bounded metadata and never return article text, OAuth
  tokens, raw provider responses or credentials.

### Write operation

- `instapaper_save_approved` is the only bookmark mutation tool.
- Its MCP annotations identify it as a non-destructive, non-idempotent external
  write so the host can require Cooper's confirmation.
- It accepts exactly one approved article per call, including canonical URL,
  intended saved URL, title, source tag, cleaned HTML and expected word count.
- It rejects UI truncation markers before any Instapaper write.
- It repeats the duplicate check immediately before adding.
- It uses `resolve_final_url=0`, supplies the cleaned HTML and attaches the
  source tag plus exactly one length tag.
- It reports success only after `bookmarks/get_text` returns the intended
  article, has no truncation marker and reaches at least 70 percent of the
  submitted word count. A short or unavailable readback is reported as
  pending or failed, never verified.
- The service never deletes or replaces a pre-existing bookmark.

## Browser and scheduled-task limits

Codex Work can load the bundled skill and its source notes. Its cloud browser is
separate from Cooper's Mac. It can visit public, signed-out pages, but it cannot
use Cooper's local Chrome profile, extensions, saved logins or open tabs. Some
publishers, paywalls, archives and bot checks can still block it. The browser
transport also does not guarantee the lossless `innerHTML` chunking used by the
local workflow.

Therefore the hosted weekly task may discover from public feeds and sitemaps,
use the cloud browser where it works, and query Instapaper through MCP. It must
mark any article whose complete body cannot be proved as not save-ready. The
remote MCP does not pretend to remove this browser limit.

## Infrastructure and secret custody

- Use one stateless MCP Worker built with Cloudflare Agents SDK
  `createMcpHandler` and MCP SDK v2. Do not add a Durable Object.
- Use a KV namespace only for the OAuth provider's grants and state.
- Configure exact allowed Host and Origin values; CORS is not authentication.
- Bind Instapaper consumer key, consumer secret, access token and access-token
  secret as Worker secrets. Never place their clear values in Alchemy state,
  source, logs, task output or MCP responses.
- Bind Cloudflare Access OAuth client values and a random cookie-encryption key
  as Worker secrets.
- Supply the Google OAuth client pair from Doppler to the Alchemy-owned Access
  login method. Keep the existing Access SaaS application and exact-email policy
  outside Alchemy until Alchemy can describe their full live shape without
  dropping settings.
- Serve a public home page and privacy notice from the production Worker. Keep
  the Google OAuth app in Production with those exact URLs, the authorised
  `coopercorbett.com` domain and no sensitive or restricted scopes.
- Use separate Alchemy stages. A plan is required before apply. Provider
  readback is required before calling a deployment successful.

## Acceptance

- Local unit tests prove deterministic OAuth signing, the current object-shaped
  `bookmarks/list` response, URL/title duplicate matching and truncation checks.
- MCP contract tests prove all inputs decode, outputs stay bounded, read tools
  do not mutate and the write tool has explicit write annotations.
- A local Worker build succeeds with no secret values.
- Alchemy plan shows only the approved stage and resources.
- After an authorised apply, Cloudflare readback proves the exact Worker,
  bindings, route and OAuth KV namespace exist.
- Google readback shows the OAuth app is In production and its registered home
  and privacy pages return the intended public content.
- A live read-only access check succeeds.
- A live save is not part of initial deployment acceptance. Its first use still
  requires Cooper to approve a specific article, followed by Instapaper
  readback.

## Rollback and recovery

- Disable or remove the Codex plugin connection first to stop new calls.
- Revoke the MCP OAuth client or Cloudflare Access policy to stop access.
- Rotate or remove Worker secrets if custody is in doubt.
- Roll the Worker back to the last provider-verified version through the owned
  Alchemy stage. Destroy only with a separately approved destructive plan.
- Revoke the Instapaper application token if the Worker credential is exposed.
  This does not delete existing bookmarks.

## Non-claims

- Local tests do not prove Cloudflare deployment or Instapaper access.
- Cloudflare deployment does not prove a publisher page can be extracted.
- A successful add response does not prove saved article quality; only
  `bookmarks/get_text` readback can establish the verification claim.
- Bundling the skill does not give hosted Codex access to Cooper's local Chrome.
