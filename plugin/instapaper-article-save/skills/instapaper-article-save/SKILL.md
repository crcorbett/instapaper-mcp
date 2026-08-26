---
name: instapaper-article-save
description: Discover, inspect, clean, check, and save newspaper or magazine articles through Executor Personal's Instapaper connection. Use when the user wants recent reading candidates, duplicate checks, approval-only saves, source and length tags, or reusable source-specific discovery notes.
---

# Instapaper Article Save

This skill has one current Instapaper path: Executor Personal's MCP and its
`instapaper` connection. The hosted Worker remains behind Executor and owns all
Instapaper credentials.

Use the Executor Personal tools whose names start with
`mcp__executor_personal__`. Do not use the separate Codex Apps Executor tool or
connect to the hosted Worker directly.

The current Instapaper operations are:

- `instapaper_access_check` confirms read-only access.
- `instapaper_check_candidates` checks proposed items against unread, starred,
  and archived bookmarks.
- `instapaper_save_approved` saves one exact, approved article through the Full
  API and verifies it by reading the saved text back.

Do not use local scripts, environment files, 1Password, Doppler, direct Worker
or Instapaper requests, or interactive credential prompts.

## Executor Personal route

Before the first Instapaper call in a run:

1. Call `mcp__executor_personal__skills` with `{ "name": "execute" }` and follow
   its current instructions.
2. Use `mcp__executor_personal__execute` to call
   `tools.executor.coreTools.connections.list({})`. Require one healthy
   `instapaper` connection. The connection observed on 2026-08-26 was
   `tools.instapaper.user.personalInstapaper`; treat this as a checked example,
   not a reason to skip live discovery.
3. Inside Executor, use `tools.search({ namespace: "instapaper", ... })` to find
   the required operation and `tools.describe.tool({ path })` to confirm its
   input. Call the full path returned by discovery through `tools[path](input)`.
   Do not guess a path or enumerate the lazy `tools` object.
4. Branch on Executor's outer `{ ok, data }` result. An outer `ok: true` means
   Executor reached the MCP tool; it does not by itself prove that a duplicate
   check or save succeeded. Inspect the Instapaper tool's structured result and
   its `status`.

Keep raw MCP content inside Executor. Return only the minimum fields needed for
the shortlist, duplicate decision, or verified receipt. Never emit credentials,
OAuth data, provider responses, or article HTML.

## Core workflow

1. Resolve the requested sources, count, reading style, and date window from the
   user's instructions. Ask only for a choice that would materially change the
   result.
2. Load the matching file under `references/sources/`.
3. Refresh the source's current feeds, sitemaps, or section pages. Treat dated
   examples in the reference as shape evidence, not current recommendations.
4. Build candidates with an original URL, intended saved URL, and title.
5. Call `instapaper_check_candidates` before recommending or saving. Exclude all
   URL, saved-URL, title, and archive-backed matches.
6. Present an approval-only shortlist. Do not save while approval is pending.
   A direct instruction to choose and save exactly N items within stated
   constraints delegates selection for that one run. Lock the exact N titles
   and URLs after duplicate checking and do not save any extra item.
7. For each approved article, obtain complete, marker-free article HTML. Count
   words from the exact cleaned content that will be submitted.
8. Call `instapaper_save_approved` once per approved article with:
   - `originalUrl`
   - `saveUrl`
   - `title`
   - `description`
   - `content`
   - `sourceTag`
   - `lengthTag`: `Essay` or `Article`
   - `sourceWords`
9. Report a save as successful only when the tool returns `status: verified`.

Never return article HTML, article text, credentials, OAuth tokens, or raw
provider responses in chat.

## Browser boundary

The hosted browser can use public, signed-out pages. It cannot use Cooper's Mac,
local browser profile, extensions, open tabs, saved logins, or existing archive
sessions.

For browser-captured content:

- Capture the real story container, normally an `<article>` or source-specific
  main story element.
- Use raw `innerHTML`, wrapped in an explicit `<article>` when needed.
- Remove post-story recommendations at the source-specific boundary.
- Reject sign-in screens, subscription barriers, robot checks, static-block
  pages, archive controls, site indexes, and article shells.
- Reject `...N more characters`, `… (N characters)`, and equivalent UI
  truncation markers.
- If the browser transport may limit a large return value, retrieve bounded
  slices and require their combined character count to equal the in-page
  `innerHTML.length`.
- Mark the article as not save-ready when complete content cannot be proved.

## Duplicate safety

Before recommending or saving, call `instapaper_check_candidates` with no more
than 25 candidates at a time. Match the original URL, intended saved URL, and
normalised title. Title matching catches archive-backed bookmarks whose stored
URL differs from the publisher URL.

If the tool returns `IncompleteLibraryError`, stop. Do not describe any item as
unsaved because complete duplicate coverage was not proved.

The hosted service does not delete or replace existing bookmarks. Do not try to
work around a duplicate by changing the URL or title.

## Approval and save safety

`instapaper_save_approved` is the only write tool. Use it only after Cooper
explicitly approves the exact article, or explicitly delegates choosing and
saving an exact count within clear constraints. One call saves one article.

Before each call:

1. Repeat the duplicate check if anything material changed after approval.
2. Confirm the title, original URL, saved URL, source tag, length tag, cleaned
   word count, and complete HTML.
3. Require zero truncation markers in both the captured and cleaned content.
4. Use `Essay` at 2,500 words or more and `Article` below 2,500 words unless
   Cooper requested a specific length tag.

The service submits supplied HTML with `resolve_final_url=0`, then checks
`bookmarks/get_text`. A short, unavailable, or marker-bearing readback is not a
verified save.

## Source freshness

For `latest`, `recent`, `best new`, or another date-sensitive request:

1. Refresh each documented discovery surface.
2. Check publication dates against the requested window.
3. Prefer publisher essay, feature, magazine, analysis, profile, and long-read
   sections for deep reading.
4. If fewer items qualify, follow the user's stated fallback window.
5. Update a source reference only after verifying that its durable discovery or
   extraction behaviour changed.

## Output

For a discovery shortlist, use a compact table:

| #   | Type | Title | Source/section | Date | Why it fits | URL |
| --- | ---- | ----- | -------------- | ---- | ----------- | --- |

Use `Essay`, `Deep article`, or `Article` as discovery labels. These labels do
not replace the final word-count-based Instapaper length tag.

For approved saves, use:

| Status | Title | Bookmark ID | Saved URL | Tags | Source words | Readback words |
| ------ | ----- | ----------- | --------- | ---- | ------------ | -------------- |

Use only these status labels:

- `Verified`: the add and Full API readback passed.
- `Pending readback`: the service could not yet prove complete saved text.
- `Skipped`: the item was duplicate, unapproved, or not save-ready.
- `Failed`: the save or verification failed.

## Recovery

If content is incomplete, re-open the documented public source or archive path,
capture the intended article container again, and repeat the exact-length and
marker checks. Do not save a shorter substitute.

If readback is short or unavailable, report the tool result as pending or
failed. Do not delete or re-add the bookmark through another route.

If a duplicate exists, report the matching bookmark metadata returned by the
read tool. Do not replace it.

If archive access returns `429`, test the same documented URL in the available
browser. A terminal response alone does not prove that the snapshot is absent.
If the browser also fails, mark the article as not save-ready.

## Reading vocabulary

- `deep reads`, `essays`, `long reads`, or `long form`: favour sustained
  argument, reported features, profiles, analysis, explainers, and pieces
  expected to reward a slower read.
- `short reads`, `articles`, or `quick reads`: favour concise analysis,
  columns, editorials, reviews, and shorter reported articles.

## Source references

Load only the relevant source file:

- The Monthly: `references/sources/the-monthly.md`
- The Economist: `references/sources/the-economist.md`
- Syncretica: `references/sources/syncretica.md`
- Australian Financial Review: `references/sources/australian-financial-review.md`
- The Atlantic: `references/sources/the-atlantic.md`
- The New Yorker: `references/sources/the-new-yorker.md`
- Financial Times: `references/sources/financial-times.md`
- New York Times: `references/sources/new-york-times.md`
- Bloomberg: `references/sources/bloomberg.md`
- Bloomberg Technology: `references/sources/bloomberg-technology.md`
- Bloomberg Green: `references/sources/bloomberg-green.md`

## Source mode map

| Source                      | Discovery default                         | Saved URL default                                          | Content source                                               |
| --------------------------- | ----------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| Syncretica                  | Substack RSS                              | Original Substack URL                                      | RSS `content:encoded`                                        |
| The New Yorker              | Official RSS and sitemap                  | Original URL                                               | Complete public article body                                 |
| Financial Times             | Official RSS and sitemap                  | Final timestamped `archive.md` URL                         | Verified archive article container                           |
| New York Times              | Official RSS and news sitemap             | Final timestamped `archive.md` URL                         | Verified `article#story` or best story container             |
| Australian Financial Review | Section pages and hydration metadata      | Final timestamped `archive.md` URL                         | Complete article body from verified page or hydration data   |
| The Atlantic                | Atom feeds and sitemap                    | Original URL when complete; otherwise verified archive URL | Atom content or complete article container                   |
| The Economist               | RSS, sitemap, and topic pages             | Verified archive snapshot URL when needed                  | Complete rendered story container                            |
| The Monthly                 | Sitemap and Next.js JSON                  | Original URL                                               | Complete main article content                                |
| Bloomberg                   | RSS, Big Take, Businessweek, and Features | Verified short `archive.ph` URL                            | Lossless story-only `<article>` or complete feature `<main>` |
| Bloomberg Technology        | Technology RSS and feature pages          | Verified short `archive.ph` URL                            | Lossless story container                                     |
| Bloomberg Green             | Green and climate feature pages           | Verified short `archive.ph` URL                            | Lossless story container                                     |

When a source uses `archive.md/latest/{originalUrl}`, resolve it in the available
browser and save the final timestamped snapshot URL. For Bloomberg archive
items, use the verified short `archive.ph` snapshot URL.

## New source template

For a new source, add one Markdown file under `references/sources/` with:

- status and verification date;
- base URL, source tag, and discovery surfaces;
- triage rules;
- original and saved URL policy;
- complete-content capture rules;
- known failure pages and truncation checks;
- duplicate-check inputs;
- Full API readback expectations; and
- durable observations only.

Do not add a second saving route or a source-specific credential path.
