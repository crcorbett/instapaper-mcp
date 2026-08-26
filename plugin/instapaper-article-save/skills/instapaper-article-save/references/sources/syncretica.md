# Syncretica

Status: researched and smoke-tested on 2026-06-29 using the public Substack RSS feed, sitemap, live post headers, archive.md latest probing, and cleaned-content checks. No live Instapaper add was performed during source setup.

Base URL: https://syncretica.substack.com

## Discovery Surfaces

Machine-readable surfaces that returned `200` on 2026-06-29:

- `https://syncretica.substack.com/feed` - RSS feed.
- `https://syncretica.substack.com/sitemap.xml` - XML sitemap.
- `https://syncretica.substack.com/archive` - human-readable archive page.

The sitemap is a simple `urlset`, not a sitemap index. Sample sitemap URLs observed on 2026-06-29:

- `https://syncretica.substack.com/archive`
- `https://syncretica.substack.com/about`
- `https://syncretica.substack.com/p/read-em-and-weep-australian-power`
- `https://syncretica.substack.com/p/what-did-we-learn`
- `https://syncretica.substack.com/p/non-recourse-national-strategy`
- `https://syncretica.substack.com/p/where-to-from-here`
- `https://syncretica.substack.com/p/the-missing-model-why-finance-has`
- `https://syncretica.substack.com/p/gallium`

The feed is RSS and includes `content:encoded` HTML for sampled public posts. Prefer the feed for discovery and clean content capture.

RSS parsing:

- Feed title: `/rss/channel/title`
- Items: `/rss/channel/item`
- Article URL: `item/link`
- Title: `item/title`
- Published time: `item/pubDate`
- Summary: `item/description`
- Body HTML: `content:encoded`

Latest-feed examples observed on 2026-06-29:

- `Read 'Em and Weep: Australian Power Edition`, published 2026-05-18, 294 words in `content:encoded`.
- `What Did We Learn?`, published 2026-04-11, 803 words.
- `Non-Recourse National Strategy`, published 2026-04-10, 1,362 words.
- `Where To From Here?`, published 2026-04-08, 389 words.
- `The Missing Model: Why Finance Has No Good Framework for Commodity Procurement Under Geopolitical Risk`, published 2026-03-26, 1,906 words.
- `Gallium`, published 2025-05-14, 2,060 words; longest sampled feed item on 2026-06-29.

## Default Save Workflow

Use this workflow for Syncretica unless the user explicitly asks for archive.md snapshot URLs.

1. Discover candidate URLs from `https://syncretica.substack.com/feed` or `https://syncretica.substack.com/archive`.
2. Use the original canonical Substack post URL as the Instapaper bookmark URL.
3. Build a clean HTML document from the RSS `content:encoded` body.
4. Include:
   - Source marker: `Syncretica`.
   - `<h1>` from `item/title`.
   - Optional description/dek from `item/description`.
   - Cleaned post body from `content:encoded`.
   - Canonical and `og:url` metadata set to the original Substack post URL.
5. Call `instapaper_check_candidates` with the original URL, intended saved URL,
   and title.
6. After approval, call `instapaper_save_approved` with the cleaned RSS HTML,
   source tag `Syncretica`, and the word-count-based length tag.

Reason: the public feed carries usable post HTML, so relying on Instapaper's crawler or archive.md extraction is unnecessary for normal Syncretica saves.

## Archive.md Notes

Direct non-browser probing of:

```text
https://archive.md/latest/https://syncretica.substack.com/p/read-em-and-weep-australian-power
```

returned HTTP `429` on 2026-06-29. This matches archive.md's normal anti-bot behavior for scripted fetches and does not prove that no snapshot exists.

If the user explicitly wants archive snapshot URLs:

1. Resolve `https://archive.md/latest/{originalSyncreticaURL}` in the available browser.
2. Verify the rendered title matches the intended post.
3. Prefer using RSS `content:encoded` for the supplied Instapaper `content` field.
4. Use the final archive snapshot URL as the bookmark URL.

## Extraction Notes

For RSS-derived saves:

- Use `content:encoded` as the source of body HTML.
- Strip `script`, `style`, `noscript`, `svg`, `button`, `form`, `nav`, and `iframe`.
- Preserve ordinary Substack body tags such as paragraphs, headings, blockquotes, lists, links, images, and figures.
- Keep inline formatting where it is part of the post body.
- Remove subscription, share, sign-in, and related UI if encountered in live-page or archive-derived HTML.

For live page fallback:

- Direct post URL `https://syncretica.substack.com/p/read-em-and-weep-australian-power` returned HTTP `200` on 2026-06-29.
- Substack pages can include app shell and subscription UI. Prefer RSS content over scraping the live page.

Paid or subscriber-only posts:

- Public RSS may contain only previews for non-public posts. If cleaned word count is unexpectedly low or content contains subscribe/paywall prompts, report that the post is likely truncated and do not save it as a complete article without user approval.

## Tags

Default tags:

- `Syncretica`
- `Article`

Use `Essay` when:

- Cleaned word count is at least 2,500 words.
- The user explicitly asks for `Essay`.
- A post is clearly a long-form essay and the cleaned word count supports it.

As of the 2026-06-29 feed sample, sampled posts were below the 2,500-word automatic essay cutoff.

## Validation

Cleaned-content checks on 2026-06-29 produced:

- Title: `Read 'Em and Weep: Australian Power Edition`
- Cleaned words: 283
- Length tag: `Article`

- Title: `Gallium`
- Cleaned words: 2,056
- Length tag: `Article`

Before a live save:

1. Confirm the post URL is the intended Syncretica post.
2. Build clean content from RSS `content:encoded`.
3. Confirm title, cleaned word count, and expected length tag.
4. Check the candidate through `instapaper_check_candidates`.
5. After approval, submit it through `instapaper_save_approved` and accept only
   a `verified` receipt.

Do not paste Syncretica article text into chat. Report only the title, bookmark
ID, saved URL, tags, source word count, verified readback word count, and status.
