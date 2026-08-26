# The New Yorker

Status: researched and smoke-tested on 2026-06-29 using the official feed page, RSS feeds, sitemap, direct article HTML, archive.md latest probing, and cleaned-content checks. No live Instapaper add was performed during source setup.

Base URL: https://www.newyorker.com

## Discovery Surfaces

Machine-readable and index surfaces that returned `200` on 2026-06-29:

- `https://www.newyorker.com/about/feeds` - official feed directory.
- `https://www.newyorker.com/feed/rss` - sitewide RSS feed advertised as the page alternate.
- `https://www.newyorker.com/feed/everything` - broad RSS feed, 50 items in the sampled response.
- `https://www.newyorker.com/feed/latest/rss` - official latest feed. It returned `502` during one batch check and `200` on immediate retry, so retry before treating it as unavailable.
- `https://www.newyorker.com/sitemap.xml` - XML sitemap index.
- `https://www.newyorker.com/robots.txt` - robots file.

Human-readable pages that returned `200` on 2026-06-29:

- `https://www.newyorker.com/magazine`
- `https://www.newyorker.com/news`
- `https://www.newyorker.com/culture`
- `https://www.newyorker.com/humor`

`https://www.newyorker.com/books` redirected to `https://www.newyorker.com/culture` on 2026-06-29.

Sitemap shape observed on 2026-06-29:

- Root type: `sitemapindex`.
- Child sitemaps are monthly files, such as `https://www.newyorker.com/sitemap-2026-06.xml`.
- Monthly sitemap entries are plain `urlset` article URLs with `lastmod` timestamps.

The RSS feeds are RSS 2.0, not Atom. Parse them with:

- Feed title: `/rss/channel/title`
- Items: `/rss/channel/item`
- Article URL: `item/link`
- Title: `item/title`
- Published time: `item/pubDate`
- Summary/dek: `item/description`
- Section/category: one or more `item/category`
- Author: `dc:creator`
- Thumbnail: `media:thumbnail/@url`

Sampled feeds did not include full article body HTML. `content:encoded` was absent and `media:content` was empty in the sampled items. Use feeds for discovery, not for supplied Instapaper article content.

## Useful Feeds

Official feed endpoints from `https://www.newyorker.com/about/feeds` that returned `200` on 2026-06-29:

- `https://www.newyorker.com/feed/magazine/reporting/rss` - Reporting & Essays. Best first stop for long-form reporting, profiles, personal history, and magazine features.
- `https://www.newyorker.com/feed/magazine/rss` - Current magazine issue.
- `https://www.newyorker.com/feed/news/rss` - News, politics, opinion, commentary, and analysis.
- `https://www.newyorker.com/feed/the-lede/rss` - The Lede.
- `https://www.newyorker.com/feed/magazine/the-financial-page/rss` - The Financial Page.
- `https://www.newyorker.com/feed/culture/rss` - Books & Culture.
- `https://www.newyorker.com/feed/culture/open-questions/rss` - Open Questions.
- `https://www.newyorker.com/feed/culture/infinite-scroll/rss` - Infinite Scroll.
- `https://www.newyorker.com/feed/culture/critics-notebook/rss` - Critic's Notebook.
- `https://www.newyorker.com/feed/science/science-and-technology/rss` - Science & Technology.
- `https://www.newyorker.com/feed/news/letter-from-trumps-washington/rss` - Letter from Trump's Washington.
- `https://www.newyorker.com/feed/news/fault-lines/rss` - Fault Lines.
- `https://www.newyorker.com/feed/sports/sporting-scene/rss` - The Sporting Scene.
- `https://www.newyorker.com/feed/goings-on/rss` - Goings On.
- `https://www.newyorker.com/feed/fiction-and-poetry/rss` - Fiction & Poetry.
- `https://www.newyorker.com/feed/humor/rss` - Cartoons & Humor.

Podcast, puzzle, cartoon-gallery, and audio feeds may be useful for discovery but are usually not Instapaper article candidates unless the user explicitly asks for them.

Short feed aliases checked on 2026-06-29:

- `https://www.newyorker.com/feed/news`, `https://www.newyorker.com/feed/culture`, `https://www.newyorker.com/feed/humor`, `https://www.newyorker.com/feed/magazine`, and `https://www.newyorker.com/feed/everything` returned `200`.
- `https://www.newyorker.com/feed/books` returned `400`.
- `https://www.newyorker.com/feed/fiction` and `https://www.newyorker.com/feed/poetry` returned `404`. Use `https://www.newyorker.com/feed/fiction-and-poetry/rss` instead.

Latest examples observed on 2026-06-29:

- Reporting & Essays: `Are Humanoid Robots Ready to Be Deployed?`, `The Tick That Hunts Down Its Hosts--Including Us`, `Did a Climber Leave His Girlfriend to Die at the Top of a Mountain?`, `The Billionaires' Vagina Club`, `OnlyFans Creators Bare All`.
- Culture: `What Happened to Your Face?`, `Laszlo Krasznahorkai Writes Because He Fails`, `The Popularity Contests of "Love Island"`, `Scenes from La Canicule in Paris`, `Refik Anadol, the Art World's Happy Warrior for A.I.`
- Fiction & Poetry: recent fiction and poetry items are present, but save them only when the user asks for fiction or poems.

## Default Save Workflow

Use this workflow for New Yorker saves unless the user explicitly asks for archive.md snapshot URLs.

1. Discover candidate URLs from the official RSS feeds or the monthly sitemap.
2. Use the original canonical New Yorker article URL as the Instapaper bookmark URL.
3. Fetch the original article page directly.
4. Preserve body paragraphs whose class contains `paywall` when the complete
   server-rendered text is present.
5. Confirm the title, cleaned word count, and length tag.
6. Check the candidate through `instapaper_check_candidates`, then use
   `instapaper_save_approved` after approval.

Reason: sampled New Yorker article pages were server-rendered with full article text in the direct HTML. The feed did not carry body content, and direct archive.md fetching returned `429`.

Do not remove every element with a `paywall` class. New Yorker body paragraphs
can carry that class even when the full text is present; removing them can leave
only a teaser.

## Archive.md Notes

Direct non-browser probing of:

```text
https://archive.md/latest/https://www.newyorker.com/magazine/2026/07/06/the-tick-that-hunts-down-its-hosts-including-us
```

returned HTTP `429` on 2026-06-29. This is consistent with archive.md anti-bot behavior and does not prove that no snapshot exists.

If the user explicitly wants archive snapshot URLs:

1. Resolve `https://archive.md/latest/{originalNewYorkerURL}` in the available browser.
2. Use the final snapshot URL if the wrapper redirects.
3. Verify the rendered title matches the intended article.
4. Extract clean article HTML from the rendered snapshot, or use the original direct page as the content source if the snapshot is only needed as the saved URL.
5. Require a plausible article word count before saving.

For normal New Yorker saves, prefer the original URL and direct page extraction.

## Extraction Notes

Primary content selection:

- Use `<article>` first.
- Fall back to `<main>`.
- Use `<body>` only after title and word-count checks.

Useful metadata sources:

- Title: `<h1>`, then `og:title`, then document title with any `The New Yorker` suffix stripped.
- Description/dek: `meta[name="description"]`, then `og:description`, then feed `description`.
- Author: `meta[name="author"]`, then `article:author`, then `dc:creator` from the feed.
- Published time: `article:published_time`, then feed `pubDate`.
- Canonical: `<link rel="canonical">`, then the feed URL.
- Section: prefer feed `category` and URL path. Live `article:section` returned `tags` in sampled pages and is not useful for triage.

Remove:

- `script`, `style`, `noscript`, `svg`, `button`, `form`, `nav`, and `iframe`.
- Elements whose class, id, or aria label indicates ads, subscription boxes, newsletters, share tools, related links, breadcrumbs, navigation, footer, modals, popups, or sign-in UI.

Retain:

- Paragraphs with class `paywall` when they contain the complete article body.
- Headline, dek, byline, publication date, article paragraphs, blockquotes, lists, figures, and captions.

Failure mode to watch:

- If a known long article has a very low cleaned word count, do not save it.
  Re-check that the page still contains full server-rendered article text and
  that body paragraphs carrying the `paywall` class were retained.

## Tags

Default tags:

- `The New Yorker`
- `Article`

Use `Essay` when:

- Cleaned word count is at least 2,500 words.
- The piece is from Reporting & Essays, A Reporter at Large, Annals, Profiles, Personal History, Letter from..., The Weekend Essay, A Critic at Large, or another clearly long-form feature and the cleaned word count supports it.
- The user explicitly asks for `Essay`.

Usually skip unless requested:

- Puzzles, daily cartoons, cartoon galleries, podcasts, poems, audio-only items, issue indexes, and pure listings.
- Fiction should be offered separately from journalism or essays because the user may want a different reading mix.

## Validation

Initial cleaned-content checks on 2026-06-29 failed because the generic noise filter removed New Yorker body paragraphs marked with class `paywall`:

- `Are Humanoid Robots Ready to Be Deployed?` returned 49 words.
- `The Tick That Hunts Down Its Hosts--Including Us` returned 163 words.
- `The Popularity Contests of "Love Island"` returned 0 words.

After retaining those body paragraphs, the checks succeeded:

- Title: `Are Humanoid Robots Ready to Be Deployed?`
- Cleaned words: 5,739
- Length tag: `Essay`

- Title: `The Tick That Hunts Down Its Hosts--Including Us`
- Cleaned words: 9,155
- Length tag: `Essay`

- Title: `The Popularity Contests of "Love Island"`
- Cleaned words: 2,848
- Length tag: `Essay`

Before a live save:

1. Confirm the URL is the intended New Yorker article.
2. Confirm title, cleaned word count, and expected length tag.
3. Check the candidate through `instapaper_check_candidates`.
4. After approval, submit complete HTML through `instapaper_save_approved`.
5. Accept only a `verified` receipt.

Do not paste New Yorker article text into chat. Report only the title, bookmark
ID, saved URL, tags, source word count, verified readback word count, and status.
