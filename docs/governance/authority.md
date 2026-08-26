# Authority model

Capability does not grant authority. Consequential work records identity,
operation, resource, environment, duration/revocation, approval boundary, audit
receipt, rollback, and escalation. Repository code owns desired state; external
systems own current provider state; a runbook obtains fresh readback before and
after mutation. Secrets and live inventories are never copied into this page.

For this repository, read-only Instapaper listing is allowed after authenticated
MCP access. `instapaper_save_approved` is the only bookmark mutation and requires
Cooper to approve the exact article before invocation. Infrastructure plans are
read-only; a Cloudflare apply requires the approved account and stage. Bookmark
deletion, replacement, provider destroy and credential revocation are separate
consequential operations and are not implied by build or deploy authority.
