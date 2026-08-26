# Hosted Instapaper MCP notes

The hosted MCP is the only supported Instapaper path for this skill.

## Tools

### `instapaper_access_check`

This read-only tool lists unread, starred, and archived folders and returns
counts only. It does not create, edit, or delete a bookmark.

### `instapaper_check_candidates`

Send up to 25 candidates. Each candidate contains:

- `originalUrl`
- `saveUrl`
- `title`

The tool checks unread, starred, and archived bookmarks. It matches original
URLs, intended saved URLs, and normalised titles. If any folder reaches the
service's safe coverage limit, the tool fails with `IncompleteLibraryError` and
no candidate may be described as unsaved.

### `instapaper_save_approved`

Call this write tool only after Cooper approves one exact article. Send:

- `originalUrl`
- `saveUrl`
- `title`
- `description`
- complete, cleaned `content`
- `sourceTag`
- `lengthTag`: `Essay` or `Article`
- `sourceWords`

The Worker signs the Instapaper Full API request with its stored OAuth 1.0a
credentials. It supplies the cleaned HTML, uses `resolve_final_url=0`, adds the
source and length tags, and reads the saved article back through
`bookmarks/get_text`.

## Verification

A verified receipt contains the bookmark ID, title, saved URL, returned tags,
source word count, and readback word count. The service returns `verified` only
when the saved text belongs to the intended article, contains no UI truncation
marker, and reaches at least 70 per cent of the submitted word count.

Fresh saves may need another readback attempt. Treat a short, empty, or
marker-bearing response as pending or failed. Do not call another Instapaper API
route and do not delete or re-add the bookmark.

## Credential boundary

Cloudflare Worker secrets contain the Instapaper consumer key, consumer secret,
access token, and access-token secret. The plugin, skill, Executor task, and
browser never receive those values. Do not look for local credentials or use a
secret manager as a relay.

Instapaper xAuth remains a one-time maintainer operation for issuing the
persistent token stored by the Worker. It is not part of a reading run.

Official Full API documentation:

- https://www.instapaper.com/developers/v1/full-api
- https://www.instapaper.com/developers/applications/create
