# Bloomberg Technology

Status: live-tested through 2026-07-18. Eight Bloomberg Technology essays have been saved from browser-verified short `archive.ph` snapshots with lossless chunked HTML capture, story-boundary trimming, `Bloomberg Technology` and `Essay` tags, and successful marker-free `bookmarks/get_text` readback.

Base URL: https://www.bloomberg.com/technology

Use source slug:

- `bloomberg-technology`

Use source tag:

- `Bloomberg Technology`

## Discovery Surfaces

- `https://feeds.bloomberg.com/technology/news.rss` - working RSS 2.0 feed; 30 items in the 2026-07-13 sample.
- `https://www.bloomberg.com/technology` - current Technology index.
- `https://www.bloomberg.com/technology/big-tech`
- Technology index modules labelled `Tech In Depth` and `The Big Take`.
- `https://www.bloomberg.com/bigtake` and `https://www.bloomberg.com/businessweek` for technology-led features.
- `/news/features/` and `/features/` URLs whose primary section or subject is technology.

The RSS feed includes title, URL, date, creator, categories, and description, but sampled `content` fields were empty. It mixes routine news, newsletters, and video with features, so it is a freshness index rather than a long-read feed.

## Triage

Prioritize only:

- `Tech In Depth`.
- Written `The Big Take` technology features.
- Bloomberg Businessweek technology profiles and investigations.
- Long-form reporting on AI, chips, cybersecurity, platforms, startups, and the political economy of technology.

Require at least 2,500 cleaned words before saving in this user's workflow. Use
the URL path, section label, dek, and cleaned count together; do not infer length
from a technology topic alone.

Skip routine company news, funding announcements, earnings, product briefs, newsletters, `Bloomberg Technology` TV episodes, podcast/audio pages, videos, and ordinary explainers below the threshold.

## Default Save Workflow

1. Discover from the Technology RSS feed and the Technology, Tech In Depth, Big Take, and Businessweek indexes.
2. Keep the original canonical Bloomberg URL for duplicate checking.
3. Follow the lossless archive capture workflow in `bloomberg.md`: verify the short `archive.ph` URL in the available browser, choose the complete story container, retrieve raw `innerHTML` in bounded chunks when needed, prove exact assembled length, trim at the first post-story marker, and preserve an explicit outer `<article>` wrapper.
4. Require zero truncation markers in raw HTML and cleaned content, then
   confirm the title and cleaned word count.
5. Save only when the cleaned story count is at least 2,500 words. After
   approval, call `instapaper_save_approved` with source tag
   `Bloomberg Technology` and length tag `Essay`.

## Archive.ph Notes

Original browser navigation can hit a robot block. Use a browser-verified short `archive.ph` snapshot URL such as `https://archive.ph/Zw8tQ`; terminal archive access can return `429`. Never save a raw archive page or a URL-only snapshot.

## Extraction Notes

Use the shared selectors and wrapper requirements in `bloomberg.md`. Confirm the main article is about technology and is not a video, newsletter, podcast transcript, or related-story card. Preserve the original canonical URL for tracking even though the saved URL is the verified short `archive.ph` snapshot.

## Tags

- Source tag: `Bloomberg Technology`.
- Length tag: `Essay` at 2,500 or more cleaned words.
- Do not save shorter items in the default deep-read workflow.

## Known Failure Modes

- The RSS feed is dominated by timely short news and includes non-article media.
- Direct Bloomberg fetches can return `403`, and Chrome can show a robot challenge.
- Nested related-story `<article>` tags can produce a false short extraction unless the main captured article is wrapped.
- A one-shot raw HTML return can be capped near 200 KB; use bounded chunks and exact length comparison.
- Page-level counts can include recommendation tails. Use the cleaned story-only count for the 2,500-word decision.
- `Bloomberg Technology` can refer to a TV program; those video pages are not reading candidates.

## Validation

For every live save, refresh discovery surfaces; check the original URL, archive
URL, and normalised title through `instapaper_check_candidates`; resolve the
archive snapshot in the available browser; capture it losslessly; require at
least 2,500 cleaned words and zero markers; then, after approval, call
`instapaper_save_approved` with `Bloomberg Technology` and `Essay`. Accept only
a marker-free `verified` receipt.
