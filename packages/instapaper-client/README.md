# `@instapaper/client`

Effect service package for the Instapaper Full API. It owns OAuth 1.0a signing,
bookmark listing, duplicate policy, approval-only adds and readback verification.
Folder reads fail closed at Instapaper's 500-item limit so callers never treat a
partial library scan as proof that a candidate is new.

## Exports

- `./schemas`: public Schemas, brands, and derived types.
- `./errors`: public typed failures.
- `./service`: public Effect service contract.
- `./live`: production Layer; compose only at an application/runtime boundary.
- `./test`: deterministic contract-level test Layer.
- `./testing/fixtures`: narrow test fixtures.
- `./testing/observations`: narrow test observation types.

## Documentation impact

The package owns its semantic schemas and service contract. It does not own app
runtime execution, transport adapters, or provider runbooks. Update the nearest
repository architecture owner when a public schema or service operation changes;
update its proof/critical-journey owner when observable behavior changes.

## Runbook applicability

The live Layer calls Instapaper. Compose it only in the MCP Worker and follow
the credential-bootstrap and deployment runbooks before a live call.

## Non-claims

These exports and tests do not prove app composition, transport behavior,
provider state, deployment, or a packed publisher artifact.
