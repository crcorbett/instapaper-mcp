# Bootstrap the persistent Instapaper token

## Preconditions and authority

Cooper must approve this one-time xAuth exchange. The local process needs the
Instapaper app key and account password from 1Password, plus an authenticated
Doppler CLI and an existing project/config chosen for this service. The password
is used only for the token exchange and is never uploaded to Doppler.

## Procedure and bounded evidence

1. Confirm the Doppler project and config are dedicated to the intended
   Alchemy stage. Do not use Production by default.
2. Use local `op run` to inject `INSTAPAPER_CONSUMER_KEY`,
   `INSTAPAPER_CONSUMER_SECRET`, `INSTAPAPER_USERNAME` and
   `INSTAPAPER_PASSWORD`. Also set `DOPPLER_PROJECT` and `DOPPLER_CONFIG`.
3. Run `bun run auth:bootstrap`.
4. Accept only `INSTAPAPER_OAUTH_BOOTSTRAP_OK`. The command writes the consumer
   and access-token pair to Doppler through a mode-600 temporary file, suppresses
   provider output, deletes the temporary directory and never prints a secret.
5. Run a later deployed `instapaper_access_check` before any save.

This bootstrap is intentionally local and one-time. Scheduled Codex Work uses
the deployed Worker and does not need 1Password, Doppler or this Mac.

## Rollback, escalation, and cleanup

If the process fails, confirm that no temporary `instapaper-oauth-*` directory
remains in the system temporary folder and retry only after fixing the named
precondition. If custody is uncertain, revoke the Instapaper application token,
rotate the consumer secret if available, and replace the Doppler values. Token
bootstrap does not prove Cloudflare deployment or create a bookmark.
