# The Atlantic

Status: researched and smoke-tested on 2026-06-25 using the live site, official Atom feeds, direct HTTP metadata, archive.md latest resolution, browser-rendered snapshots, and cleaned-content checks. Feed and sitemap discovery refreshed on 2026-06-29.

Base URL: https://www.theatlantic.com

## Discovery Surfaces

Official machine-readable surfaces:

- `https://www.theatlantic.com/feed/all/` - sitewide Atom feed. Returned `200` on 2026-06-29.
- `https://www.theatlantic.com/sitemap.xml` - XML sitemap index. Returned `200` on 2026-06-29.
- `https://www.theatlantic.com/robots.txt` - robots file. Returned `200` on 2026-06-25.

Sitemap shape observed on 2026-06-29:

- Root type: `sitemapindex`.
- Useful child sitemaps include:
  - `https://www.theatlantic.com/sitemaps/categories.xml`
  - `https://www.theatlantic.com/sitemaps/landing.xml`
  - `https://www.theatlantic.com/sitemaps/magazine-issues.xml`
  - `https://www.theatlantic.com/sitemaps/photo-articles.xml`
  - `https://www.theatlantic.com/sitemaps/podcast-series.xml`
  - `https://www.theatlantic.com/sitemaps/special-reports.xml`
  - `https://www.theatlantic.com/sitemaps/video-articles.xml`
  - `https://www.theatlantic.com/sitemaps/video-series.xml`
  - Monthly article sitemaps such as `https://www.theatlantic.com/sitemaps/web-2026-06.xml`.

Channel Atom feeds that returned `200` on 2026-06-29:

- `https://www.theatlantic.com/feed/channel/ideas/`
- `https://www.theatlantic.com/feed/channel/politics/`
- `https://www.theatlantic.com/feed/channel/international/`
- `https://www.theatlantic.com/feed/channel/national/`
- `https://www.theatlantic.com/feed/channel/national-security/`
- `https://www.theatlantic.com/feed/channel/technology/`
- `https://www.theatlantic.com/feed/channel/science/`
- `https://www.theatlantic.com/feed/channel/culture/`
- `https://www.theatlantic.com/feed/channel/books/`
- `https://www.theatlantic.com/feed/channel/family/`
- `https://www.theatlantic.com/feed/channel/health/`
- `https://www.theatlantic.com/feed/channel/education/`
- `https://www.theatlantic.com/feed/channel/business/`
- `https://www.theatlantic.com/feed/channel/newsletters/`
- `https://www.theatlantic.com/feed/channel/podcasts/`

Feed guesses that returned HTTP errors on 2026-06-29 and should not be treated as working:

- `https://www.theatlantic.com/feed/channel/magazine/`
- `https://www.theatlantic.com/feed/channel/atlantic-magazine/`
- `https://www.theatlantic.com/feed/channel/projects/`
- `https://www.theatlantic.com/feed/channel/photo/`
- `https://www.theatlantic.com/feed/channel/audio/`
- `https://www.theatlantic.com/feed/channel/entertainment/`

The feeds are Atom, not RSS. Parse with the Atom namespace:

- Feed title: `/feed/title`
- Entries: `/feed/entry`
- Article URL: `entry/link[@rel="alternate"]/@href`
- Title: `entry/title`
- Published time: `entry/published`
- Updated time: `entry/updated`
- Body HTML: `entry/content[@type="html"]`

The Atom `content` field can contain full article HTML. This is useful for feed-discovered latest articles, but still validate title, canonical URL, and cleaned word count before saving. Strip `?utm_source=feed` and other tracking query params before archive lookup or canonical storage unless the user explicitly wants the feed URL.

Latest-feed examples observed on 2026-06-25:

- Sitewide feed: `The Most Confusing Jacket in America`, Technology, 1,929 words in Atom content.
- Ideas feed: `The 10,000-Year Flood`, 4,943 words in Atom content.
- Politics feed: `Trump's Other Paint Job`, 1,283 words in Atom content.
- International feed: `America's Big Mistake in Iran`, 1,118 words in Atom content.
- Science feed: `Is It Warm Out There?`, 1,610 words in Atom content.
- Culture feed: `Vanilla Ice Knows When America Was Great`, 2,482 words in Atom content.

Human-readable section pages include:

- `https://www.theatlantic.com/ideas/`
- `https://www.theatlantic.com/politics/`
- `https://www.theatlantic.com/international/`
- `https://www.theatlantic.com/national/`
- `https://www.theatlantic.com/national-security/`
- `https://www.theatlantic.com/technology/`
- `https://www.theatlantic.com/science/`
- `https://www.theatlantic.com/culture/`
- `https://www.theatlantic.com/books/`
- `https://www.theatlantic.com/family/`
- `https://www.theatlantic.com/health/`
- `https://www.theatlantic.com/education/`
- `https://www.theatlantic.com/business/`

## Tested URL

Tested user URL:

- `https://www.theatlantic.com/ideas/2026/06/trump-iran-foreign-policy/687683/`

Direct HTTP and Chrome observations from 2026-06-25:

- Direct original URL returned HTTP `200`.
- Response headers identified the page as metered: `x-is-metered: 1`, `x-meter-content: 687683`, `x-jwt-state: Anonymous`.
- Chrome rendered one `<article>`, one `<main>`, and 24 useful article paragraphs.
- Canonical URL matched the original URL.
- Section metadata: `Ideas`.
- Author metadata: `Tom Nichols`.
- Published metadata: `2026-06-24T22:16:44Z`.
- Title metadata: `The Whiplash of Trump's Iran Capitulation`.

Cleaned-content validation of the browser-captured original page produced:

- Title: `The Whiplash of Trump's Iran Capitulation`
- Cleaned words: 1,886
- Length tag: `Article`

No live Instapaper add was performed for this test.

## Default Save Workflow

Use this routing order unless the user explicitly asks for a different URL policy:

1. Prefer Atom `entry/content[@type="html"]` with the original canonical Atlantic URL when the Atom content is full and the cleaned word count is plausible.
2. Use original browser capture when Atom content is absent or truncated but the original page renders the full article in the available browser.
3. Use archive.md snapshot capture when the user requests archive URLs, the original URL is inaccessible, or Atom/original capture is truncated.
4. Confirm the title, cleaned word count, and final length tag before a live save.
5. Check candidates through `instapaper_check_candidates` and accept only a
   `verified` receipt from `instapaper_save_approved` after approval.

## Archive.md Workflow

Use this workflow whenever the user asks to save Atlantic archive.md snapshots to Instapaper.

1. Start from the clean original Atlantic URL, without feed tracking params.
2. Resolve the latest snapshot with `https://archive.md/latest/{originalAtlanticURL}`.
3. If the `latest` URL redirects, use the final short snapshot URL, not the wrapper URL, as the saved bookmark URL.
4. Open the final snapshot in the available browser and verify the rendered title matches the intended article.
5. Extract clean article HTML from the rendered page. Do not send raw archive.md HTML and do not save the snapshot URL as a URL-only Instapaper bookmark.
6. Check the original URL, final archive URL, and title through
   `instapaper_check_candidates`.
7. After approval, submit complete HTML through `instapaper_save_approved` with
   source tag `The Atlantic` and the word-count-based length tag.

Verified archive observation from 2026-06-25:

- Local DNS resolved `archive.md`, `archive.ph`, and `archive.today`.
- `https://archive.md/latest/https://www.theatlantic.com/ideas/2026/06/trump-iran-foreign-policy/687683/` redirected to `https://archive.md/20260625044208/https://www.theatlantic.com/ideas/2026/06/trump-iran-foreign-policy/687683/`.
- Direct non-browser fetch of the timestamped snapshot returned HTTP `429`, which is expected archive.md captcha/rate-limit behavior for script fetches.
- Chrome loaded the timestamped snapshot successfully.
- Rendered snapshot title: `The Whiplash of Trump's Iran Capitulation - The Atlantic`.
- Rendered `<h1>`: `The Whiplash of Trump's Iran Capitulation`.
- Expected author `Tom Nichols` was visible.
- Snapshot structure had one useful main article plus related story cards: 10 `<article>` elements, one `<main>`, and zero `<p>` elements.
- Main article text was nested in archive-rendered `<div>` and `<section>` blocks. Do not rely on `<p>` selectors.
- Cleaned archive extraction produced 21 paragraph-like blocks and 1,848 words.

Archive cleaned-content validation produced:

- Title: `The Whiplash of Trump's Iran Capitulation`
- Cleaned words: 1,848
- Length tag: `Article`

Earlier in the same test session, local DNS resolution for archive.today hostnames failed and Chrome returned `net::ERR_NAME_NOT_RESOLVED`. If that recurs, treat it as an environment resolver issue, not as proof that no archive snapshot exists.

Fallback if archive.md is unavailable:

1. Open the original Atlantic URL in the available browser.
2. Confirm the page renders a real article body, not only a paywall or teaser. Require a matching title and enough paragraph/body word count for the expected piece.
3. Capture the rendered `<article>` or `<main>` HTML.
4. Check the candidate, then submit the original URL and complete HTML through
   `instapaper_save_approved` after approval.

## Extraction Notes

Prefer semantic selectors over CSS-module class names because Atlantic class names are build-generated.

Primary content selection:

- Use `<article>` first.
- Fall back to `<main>`.
- Only fall back to `<body>` for feed-derived or unusual pages after checking the title and word count.
- For archive.md snapshots, choose the `<article>` containing the expected `<h1>`, then find the largest descendant `<section>` or `<div>` without headings as the body container. Atlantic archive snapshots can contain no `<p>` tags, so convert paragraph-like direct child blocks into `<p>` elements before passing content to Instapaper.

Useful metadata sources:

- Title: `<h1>`, then `og:title`, then document title with the `- The Atlantic` suffix stripped.
- Description/dek: visible dek element, then `og:description`, then `meta[name="description"]`.
- Author: `meta[name="author"]`, then `article:author`, then visible byline.
- Published time: `article:published_time`, then `<time datetime>`.
- Section: `article:section`, then visible rubric text.
- Canonical: `<link rel="canonical">`.

Remove:

- `script`, `style`, `noscript`, `svg`, `button`, `form`, `nav`, and `iframe`.
- Elements whose class, id, or aria label indicates ads, subscribe/subscription UI, newsletters, sign-in prompts, paywall modules, related content, share tools, popups, modals, or footer/header navigation.

Retain:

- The main headline and dek.
- Author and published metadata when useful.
- Article paragraphs.
- Lead figure and caption when present.
- Section dividers only if they help preserve essay structure; otherwise skip them.

Atlantic article pages observed on 2026-06-25 used classes such as `ArticleLayout_article__... article-content-body`, `ArticleBody_root__...`, and `ArticleParagraph_root__...`, but do not key the extractor to exact suffixes.

## Tags

Default tags:

- `The Atlantic`
- `Article`

Use `Essay` when:

- Cleaned word count is at least 2,500 words.
- The user explicitly asks for `Essay`.
- The piece is clearly a long-form narrative, Ideas feature, magazine feature, or reported essay and the cleaned word count supports it.

Be careful with the `books` and `newsletters` feeds: they can contain poems, announcements, or newsletter posts. Save them only when the title and cleaned article body match the user's request.

## Validation

Before a live save:

1. Verify the archive snapshot or original page in the available browser.
2. Confirm the visible title, canonical/original URL, and source section.
3. Check the cleaned title and word count.
4. Check the candidate through `instapaper_check_candidates`.
5. After approval, call `instapaper_save_approved`.
6. Accept only a `verified` receipt.

Acceptance signal for a live add:

- The hosted tool returns `status: verified`.
- Returned title matches the intended Atlantic article.
- Saved URL is the selected archive snapshot or original canonical URL.
- Returned tags include `The Atlantic` plus the expected length tag.
- Readback word count is close to the submitted source count.

Do not paste Atlantic article text into chat. Report only the title, bookmark
ID, saved URL, tags, source word count, verified readback word count, and status.

Do not infer Atlantic behavior from The Economist or The Monthly. Re-check archive rendering and article selectors when using a new Atlantic article type.
