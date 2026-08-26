# Bloomberg Green

Status: live-tested through 2026-07-20. Nine Bloomberg Green pieces have been saved from browser-verified short `archive.ph` snapshots with lossless chunked HTML capture, story-boundary trimming, and successful marker-free `bookmarks/get_text` readback: eight essays and one user-approved shorter article.

Base URL: https://www.bloomberg.com/green/

Use source slug:

- `bloomberg-green`

Use source tag:

- `Bloomberg Green`

## Discovery Surfaces

- `https://feeds.bloomberg.com/green/news.rss` - returned HTTP 404 on 2026-07-16 after previously serving an RSS 2.0 feed; do not rely on it until a current replacement feed is verified.
- `https://www.bloomberg.com/green/` - primary section page.
- Green index modules labelled `Climate Features`, `The Big Take`, and named series such as `Bottlenecks`.
- Bloomberg's `Bottlenecks` index currently lists five instalments dated March 25, June 4, August 21, October 2, and December 15, 2025. The December story, `Electricity Is Now Holding Back Growth Across the Global Economy`, is a confirmed series item but its verified `archive.ph/z2Xsi` capture dry-ran at 1,753 words and read back at 1,669 words. It was saved only after the user approved a shorter `Article` exception, so do not treat series membership as an automatic essay qualification.
- `https://www.bloomberg.com/green/new-energy`
- `https://www.bloomberg.com/green/cleaner-tech`
- `https://www.bloomberg.com/green/climate-politics`
- `https://www.bloomberg.com/green/weather-science`
- `/news/features/` and `/features/` URLs whose primary section is Green.

The RSS feed exposes discovery metadata but no full article body in sampled `content` fields. It includes short weather, policy, company, newsletter, and market items alongside occasional deeper reporting.

## Triage

Prioritize only:

- Climate Features and written Green Big Takes.
- Named reported series such as Bottlenecks.
- BloombergNEF-backed features that combine reporting with a sustained analytical narrative.
- Deep reporting on climate politics, energy systems, adaptation, clean technology, environmental science, and transition finance.

Require at least 2,500 cleaned story words before saving in this user's workflow. Do not equate `Climate Features` with essay length or use a page-level count that includes recommendation tails.

Skip daily weather, commodity moves, company briefs, deal news, newsletters, Zero podcast pages, videos, and ordinary Green news below the threshold.

## Default Save Workflow

1. Discover from Green RSS plus Climate Features, Big Take, Bottlenecks, and other named feature-series modules.
2. Keep the original canonical URL for duplicate checking.
3. Find and open the article's `archive.ph` snapshot in the available browser, then use the final short snapshot URL, such as `https://archive.ph/Zw8tQ`.
4. Follow the shared lossless capture rules in `bloomberg.md`: choose the complete story container, retrieve raw `innerHTML` in bounded chunks when needed, prove exact assembled length, trim at the first post-story marker, and preserve an outer `<article>` wrapper.
5. Require zero truncation markers in raw HTML and cleaned content, then
   confirm the title and cleaned word count.
6. Save only when the cleaned story count is at least 2,500 words unless the
   user explicitly approves a shorter exception. After approval, call
   `instapaper_save_approved` with source tag `Bloomberg Green` and the correct
   length tag.

## Archive.ph Notes

For validated Green saves:

- Direct terminal and Chrome navigation to the original article were blocked (`403` and a robot page).
- Terminal access to archive snapshots can return `429`; use the available browser rather than treating that response as proof the snapshot is unavailable.
- Use the browser to verify that the short `archive.ph` snapshot renders the full title, dek, byline, dates, and story body.
- `https://archive.ph/Z3JCC` dry-ran at 2,915 cleaned words and read back at 2,613 words.
- `https://archive.ph/1Kewa` dry-ran at 3,059 cleaned words and read back at 2,588 words.
- Both raw captures, cleaned payloads, and Instapaper readbacks contained zero truncation markers.

Do not use URL-only archive saves.

## Extraction Notes

Use the longest `<article>` when it contains the intended headline, opening, and complete ending. For visual feature layouts whose `<article>` elements are only cards, use `<main>` only when it contains the full story. Capture raw `innerHTML` losslessly, preserve the headline, dek, byline, dates, body paragraphs, meaningful lists, figures, and captions, and remove archive controls, navigation, share/save/translate UI, terminal promos, related cards, scripts, styles, buttons, forms, and iframes during cleaning.

## Tags

- Source tag: `Bloomberg Green`.
- Length tag: `Essay` at 2,500 or more cleaned words.
- Use `Article` below 2,500 words only when the user explicitly approves the shorter exception.

## Known Failure Modes

- RSS is useful for freshness but noisy for long-read discovery.
- Direct Bloomberg requests can return `403`, and Chrome can show a robot challenge.
- Terminal archive requests can return `429` even when Chrome succeeds.
- Inner HTML without a restored outer `<article>` can make the cleaner select a nested related card.
- A one-shot raw HTML return can be capped near 200 KB; use bounded chunks and exact length comparison.
- Page-level counts can include recommendation tails and misclassify short Green stories as essays.
- Some visually rich climate features remain below the essay threshold.

## Validation

For every live save, refresh Green discovery surfaces; check the original URL,
archive URL, and normalised title through `instapaper_check_candidates`; resolve
and inspect a short `archive.ph` snapshot; capture it losslessly; require zero
markers; apply `Essay` at 2,500 words or more and allow `Article` below the
cutoff only with explicit user approval; then call `instapaper_save_approved`
and accept only a marker-free `verified` receipt.
