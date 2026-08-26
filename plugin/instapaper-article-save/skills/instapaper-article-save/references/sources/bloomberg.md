# Bloomberg

Status: live-tested through 2026-07-20 across 32 Bloomberg-family archive saves. Fifteen items use the `Bloomberg` source tag, alongside eight Bloomberg Technology and nine Bloomberg Green saves. All used browser-verified short `archive.ph` URLs, lossless chunked HTML capture, story-boundary trimming, dry-run validation, Full API saves, and marker-free `bookmarks/get_text` verification.

Base URL: https://www.bloomberg.com

Use source slug:

- `bloomberg`

Use source tag:

- `Bloomberg`

## Discovery Surfaces

- `https://www.bloomberg.com/bigtake` - strongest general-purpose index for substantial reported features. Use the written stories, not Big Take podcast or video pages.
- `https://www.bloomberg.com/businessweek` - magazine features, profiles, investigations, and issue packages.
- `https://www.bloomberg.com/features/` - visual and reported feature packages.
- `https://feeds.bloomberg.com/business/news.rss`
- `https://feeds.bloomberg.com/markets/news.rss`
- `https://feeds.bloomberg.com/politics/news.rss`

The official feeds returned RSS 2.0 with up to 30 sampled items. Parse `item/title`, `item/link`, `item/pubDate`, `dc:creator`, `item/category`, and `item/description`. The sampled `content` fields were empty, so use RSS only for discovery.

Direct terminal requests to Bloomberg section pages, article pages, and `sitemap.xml` returned `403`. Searchable/public index rendering can still expose current Big Take, Businessweek, and section cards.

## Triage

This source is configured for deep reads, not a general Bloomberg news firehose.

Prioritize:

- The Big Take written features.
- Bloomberg Businessweek features, investigations, profiles, and issue packages.
- URLs under `/news/features/` and `/features/`.
- Substantial explanatory or investigative pieces with a sustained narrative or argument.

Only shortlist pieces expected to reach at least 2,500 cleaned story words. Confirm
the cleaned count after related cards, recommendation tails, archive controls,
and footers are removed. Do not use the archive page or raw story-container
count for the threshold. A Bloomberg feature label alone is not enough.

Skip routine market updates, breaking news, live blogs, newsletters, audio, podcasts, videos, TV pages, transcripts, listicles, and explainers that do not meet the word threshold.

## Default Save Workflow

1. Track the original canonical Bloomberg URL and intended short archive URL.
2. Call `instapaper_check_candidates` with the original URL, archive URL, and
   normalised title.
3. Open the article's `archive.ph` snapshot in the available browser and use the final short URL, such as `https://archive.ph/Zw8tQ`, as the saved URL.
4. Verify the headline, dek, byline, dates, opening, and ending belong to the intended article. Reject archive shells, challenges, unrelated pages, and incomplete bodies.
5. Select the longest story `<article>`. For visual `/features/` layouts whose `<article>` elements are only cards, use `<main>` only when it contains the complete headline-to-ending story.
6. Read the selected container's raw `innerHTML`. Do not use `getCleanHTML` or any preview/clean utility as the capture source.
7. Compare `innerHTML.length` in the page with the assembled local capture. If a one-shot return may be capped, retrieve slices below the transport limit and concatenate them; reject any length mismatch. A roughly 200 KB one-shot browser return was observed to cut larger Bloomberg captures.
8. Before measuring, remove the recommendation tail at the first post-story boundary. Observed markers are `Read next:`, `Follow all new stories by`, `Get Alerts` or `Get Alerts for:`, `In this Article`, `Up Next`, `More From Bloomberg`, `Top Reads`, and `More On Bloomberg`. Keep the complete final paragraph and author/editor credits before the marker.
9. Wrap the story-only fragment in a simple document with one explicit outer
   `<article>`, then confirm its title and cleaned word count.
10. Require zero truncation placeholders in raw HTML and cleaned payload, and at least 2,500 cleaned story words after recommendation/footer removal.
11. After approval, call `instapaper_save_approved` with source tag `Bloomberg`
    and length tag `Essay`. Accept only a `verified` receipt.

## Archive.ph Notes

- Prefer the stable short snapshot form `https://archive.ph/{snapshotId}` rather than a timestamped archive URL.
- Terminal access to the supplied `https://archive.ph/Zw8tQ` snapshot returned `429` on 2026-07-18. Use the available browser to resolve and inspect archive snapshots.
- Accept a snapshot only when it renders the full title, dek, byline, dates, and body for the intended Bloomberg article.
- The sampled snapshot contained ten `<article>` elements. The first held the 12,522-character story; the other nine were short recommendation cards. `<main>` matched the story length.
- Visual feature snapshots can instead place the full story in `<main>` while nested `<article>` elements are short cards. Choose by headline, opening, ending, and text length rather than tag name alone.
- Browser evaluation transports can cap a large returned string. Measure the raw HTML in-page, retrieve it in bounded slices when necessary, and require exact reassembly before saving.
- Do not use URL-only archive saves. Supply the cleaned, wrapped story HTML.

## Extraction Notes

- Primary body: longest `<article>` when it contains the intended `<h1>`, opening, and complete ending.
- Feature fallback: `<main>` when it clearly contains the complete story and all `<article>` elements are short cards.
- Title: story `<h1>`, then `og:title`, stripping a trailing ` - Bloomberg` only when needed.
- Dek: the text immediately below the story headline, then `meta[name="description"]` or `og:description`.
- Author and date: visible byline and `<time>`, then article metadata.
- Canonical: preserve the original Bloomberg URL for tracking; save the verified short `archive.ph` snapshot URL when using archive content.
- Remove archive controls, navigation, subscription UI, share/save/translate controls, related-story cards, terminal promos, scripts, styles, buttons, and iframes.

## Tags

- Source tag: `Bloomberg`.
- Length tag: `Essay` only when the cleaned word count is at least 2,500 words.
- In this user's deep-read workflow, do not save sub-2,500-word Bloomberg pieces unless explicitly requested.

## Known Failure Modes

- Direct scripted article requests returned `403`.
- Chrome showed `Bloomberg - Are you a robot?` for the sampled original article.
- Terminal archive requests returned `429`, although Chrome resolved the same wrapper successfully.
- Capturing article inner HTML without restoring the outer `<article>` caused a
  nested related card to be selected and produced only ten words.
- Returning a large raw HTML string in one browser call can silently cap it near 200 KB. Chunk the raw `innerHTML` and compare exact lengths.
- Page-level or pre-clean counts include recommendation tails and can misclassify a sub-2,500-word story as an essay.
- Generic class-based cleaning does not always remove Bloomberg's `Up Next`, `More On Bloomberg`, or other recommendation modules. Cut the captured DOM at the first post-story text marker before counting.
- Feature branding does not guarantee essay length.

## Validation

For every live batch:

1. Refresh Big Take, Businessweek, Features, and relevant RSS feeds.
2. Confirm the original URL, archive URL, and normalized title are absent from unread, starred, and archived Instapaper folders.
3. Resolve and verify a short `archive.ph` snapshot URL in the available browser.
4. Capture raw story HTML losslessly, prove exact assembled length, trim at the first post-story boundary, wrap it, and count the cleaned story.
5. Require zero raw/clean truncation markers and at least 2,500 cleaned story words for a deep-read batch.
6. After approval, call `instapaper_save_approved` with `Bloomberg` and `Essay`.
7. Accept only a `verified` receipt with the intended title, URL, tags, and
   marker-free readback count.
