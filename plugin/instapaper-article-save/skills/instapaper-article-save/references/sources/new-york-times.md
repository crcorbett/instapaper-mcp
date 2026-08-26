# New York Times

Status: researched and smoke-tested on 2026-06-29 using official RSS feeds, the current news sitemap, direct HTTP checks, browser-rendered archive.md snapshots, and cleaned-content checks. Discovery is ready. Full-text saving is validated for a browser-resolved archive.md snapshot on one Magazine article; still validate each article before a live save.

Base URL: https://www.nytimes.com

## Discovery Surfaces

Machine-readable RSS feeds that returned `200` on 2026-06-29:

- `https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml`
- `https://rss.nytimes.com/services/xml/rss/nyt/World.xml`
- `https://rss.nytimes.com/services/xml/rss/nyt/US.xml`
- `https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml`
- `https://rss.nytimes.com/services/xml/rss/nyt/Business.xml`
- `https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml`
- `https://rss.nytimes.com/services/xml/rss/nyt/Science.xml`
- `https://rss.nytimes.com/services/xml/rss/nyt/Health.xml`
- `https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml`
- `https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml`
- `https://rss.nytimes.com/services/xml/rss/nyt/Books.xml`
- `https://rss.nytimes.com/services/xml/rss/nyt/Style.xml`
- `https://rss.nytimes.com/services/xml/rss/nyt/FashionandStyle.xml`
- `https://rss.nytimes.com/services/xml/rss/nyt/Travel.xml`
- `https://rss.nytimes.com/services/xml/rss/nyt/Magazine.xml`
- `https://rss.nytimes.com/services/xml/rss/nyt/Opinion.xml`
- `https://rss.nytimes.com/services/xml/rss/nyt/Upshot.xml`
- `https://rss.nytimes.com/services/xml/rss/nyt/TMagazine.xml`

Endpoints checked and not useful on 2026-06-29:

- `https://rss.nytimes.com/services/xml/rss/nyt/Food.xml` returned `404`.
- `https://rss.nytimes.com/services/xml/rss/nyt/SundayReview.xml` returned `404`.
- `https://www.nytimes.com/sitemap.xml` returned `403` to direct HTTP fetches.
- `https://www.nytimes.com/sitemaps/new/sitemap.xml` returned `404`.

Other useful surfaces:

- `https://www.nytimes.com/rss` returned an HTML RSS directory page.
- `https://www.nytimes.com/sitemaps/new/news.xml.gz` returned `200` with XML content. It contained 442 URL entries on 2026-06-29 and included `news:publication_date`, `news:title`, and article URLs.
- `https://www.nytimes.com/robots.txt` returned `200`.

RSS parsing:

- Feed title: `/rss/channel/title`
- Items: `/rss/channel/item`
- Article URL: `item/link`
- Title: `item/title`
- Published time: `item/pubDate`
- Summary/dek: `item/description`
- GUID: `item/guid`
- Author: `dc:creator`
- Categories: repeated `item/category`

Sampled NYT RSS feeds did not include full article body HTML. `content:encoded` was absent or empty for sampled items. Use RSS and the current news sitemap for discovery, not supplied Instapaper content.

## Latest Examples Observed

Examples from RSS and news sitemap checks on 2026-06-29:

- Magazine: `Did American-Style 'Gentle Parenting' Spoil French Children?`, `Robby Hoffman Will Always Feel Poor, No Matter How Rich She Gets`, `Is There a Founding Story That Can Unify Left and Right?`.
- Opinion: `Why Was Keir Starmer So Disastrously Ineffective?`, `The Real A.I. Race Isn't America vs. China`.
- The Upshot: `Why Maine Has Turned Into Such a Tight Race`, `$22,000 Per Hour: Assistants Use a Legislative Loophole to Outearn Surgeons`.

Use these only as discovery examples. Re-pull feeds and the news sitemap before recommending current articles.

## Content Access Observations

Tested URL:

```text
https://www.nytimes.com/2026/06/29/magazine/american-parenting-french-children.html
```

Direct HTTP observations on 2026-06-29:

- Direct article fetch returned HTTP `403`.
- Direct Python fetch returned an HTML browser/security page asking for JavaScript.
- Sampled RSS metadata for this article did not include article body HTML.

Chrome/archive.md observations on 2026-06-29:

- `https://archive.md/latest/https://www.nytimes.com/2026/06/29/magazine/american-parenting-french-children.html` resolved in Chrome to `https://archive.md/20260629091959/https://www.nytimes.com/2026/06/29/magazine/american-parenting-french-children.html`.
- The archive document title can be misleading. In the tested snapshot, Chrome initially reported a static asset block title, but the captured `<article id="story">` contained the intended article headline and body.
- The rendered archive snapshot had one article container and zero paragraph tags, so do not rely on `<p>` selectors.
- Captured archive `<article>` HTML cleaned to 2,096 words and tag `Article`.

Additional archive smoke tests on 2026-06-29:

- Some NYT snapshots resolved to a shell page with too little content.
- Some NYT snapshots included `static01.nyt.com is blocked` or `myaccount.nytimes.com is blocked` text outside or around article content.
- Do not trust the archive page title alone. Verify the captured article container has the intended headline and a plausible body word count.

Direct Chrome access to original NYT article pages was not available in the current Codex browser session. Do not work around browser safety restrictions. Use the archive workflow only when it produces a valid captured article container.

## Default Save Workflow

For discovery and triage:

1. Pull candidates from the official RSS feeds listed above and `https://www.nytimes.com/sitemaps/new/news.xml.gz`.
2. Deduplicate by canonical `https://www.nytimes.com/{yyyy}/{mm}/{dd}/...` URL.
3. Filter out live updates, games, newsletters, wire blurbs, recipes, audio/video, The Athletic links, and pure index pages unless the user explicitly asks for them.
4. Use feed title, section/feed, URL path, description, categories, publication time, and recency for candidate ranking.
5. When the user asks for `deep reads`, `essays`, or `long reads`, prioritize Magazine, Opinion guest essays, The Upshot explainers, investigations, profiles, and reported narrative features.
6. When the user asks for `short reads`, `articles`, or `quick reads`, prioritize concise news analysis, standard reported articles, columns, reviews, and shorter opinion pieces.

For full Instapaper saves:

1. Start from the original NYT URL discovered by RSS or sitemap.
2. Resolve `https://archive.md/latest/{originalNYTURL}` in the available browser.
3. Use the final timestamped archive URL, not the `latest` wrapper URL, as the bookmark URL.
4. Verify the rendered archive snapshot contains an article container with the intended headline and plausible body text.
5. Extract captured HTML from the rendered `<article id="story">` or, if absent, the best `<article>` container.
6. Check the original URL, final archive URL, and title through
   `instapaper_check_candidates`.
7. Require a plausible title and body word count.
8. After approval, submit complete HTML through `instapaper_save_approved` with
   source tag `New York Times` and accept only a `verified` receipt.

If the archive snapshot is only a shell or asset-block page:

- Do not save it as a full article.
- Do not treat `static01.nyt.com is blocked`, `myaccount.nytimes.com is blocked`, archive controls, comments, site index, or subscription copy as article content.
- Choose another article or ask the user for a clean content source.

## Archive.md Notes

Archive.md may resolve NYT URLs to timestamped snapshots, but NYT snapshots are less reliable than FT/New Yorker snapshots. Always validate the article container, not just the final URL.

For NYT archive capture:

- Prefer `article#story`.
- Fall back to `<article>` only after confirming it contains the intended headline and body.
- Reject snapshots with no intended headline.
- Reject snapshots with very low word count.
- Archive snapshots can contain zero `<p>` elements; preserve paragraph-like text blocks nested in `<div>` or `<section>` containers.
- Strip archive controls, share widgets, related links, comments, site index, NYT navigation, newsletter/signup modules, scripts, styles, buttons, forms, iframes, and subscription/account/static-block modules.

## Extraction Notes

Useful metadata sources:

- Title: `<article id="story"> h1`, then page `<h1>`, then `og:title`, then feed title.
- Description/dek: `meta[name="description"]`, then `og:description`, then feed `description`.
- Canonical URL: archive final URL for archive saves; original NYT URL for any future logged-in direct capture.
- Published time: page metadata if available, then feed `pubDate` or sitemap `news:publication_date`.

Extraction safety:

- Prefer `article#story` and strip subscription, paywall, comments, related,
  site-index, account, static-block, navigation, and footer containers.
- Do not save a capture titled `static01.nyt.com is blocked` or `nytimes.com`.
- Reject a high-word-count capture when its title is wrong.

## Tags

Default tags:

- `New York Times`
- `Article`

Use `Essay` when:

- Cleaned word count is at least 2,500 words.
- The user explicitly asks for `Essay`.
- The piece is clearly a Magazine feature, Opinion essay, reported narrative feature, investigation, profile, or long-form explainer and a validated full article word count supports it.

Candidate triage hints:

- Deep-read surfaces: Magazine, Opinion guest essays, The Upshot explainers, investigations, profiles, Science/Technology/Business features, T Magazine features, selected Arts/Books features.
- Short-read surfaces: standard news articles, concise analysis, columns, reviews, and shorter reported pieces.
- Treat HomePage, World, US, Politics, Business, Technology, Science, Health, Arts, Books, Style, Travel, and the news sitemap as article discovery surfaces; rank by title, description, category, section, and recency until full word counts are available.
- Skip live updates, games, newsletters, audio/video, recipes, The Athletic, wire-like sports updates, and pure index pages unless requested.

## Validation

Cleaned-content validation on 2026-06-29 produced:

- Title: `Did American-Style 'Gentle Parenting' Spoil French Children?`
- Cleaned words: 2,096
- Length tag: `Article`

Before any live NYT save:

1. Re-check the browser-resolved archive snapshot in the available browser.
2. Confirm the captured article container contains the intended headline.
3. Capture or supply clean full article HTML.
4. Require a plausible title, source word count, and length tag.
5. Check the candidate through `instapaper_check_candidates`.
6. After approval, call `instapaper_save_approved` and accept only `verified`.
