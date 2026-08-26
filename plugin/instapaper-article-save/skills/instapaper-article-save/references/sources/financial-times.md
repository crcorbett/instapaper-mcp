# Financial Times

Status: researched and smoke-tested on 2026-06-29 using official RSS feeds, the FT sitemap index, direct HTTP checks, browser-rendered article checks, archive.md snapshots, and cleaned-content checks. Discovery is ready. Full-text saving is validated for a browser-resolved archive.md snapshot on one FT Opinion article; still validate each article before a live save.

Base URL: https://www.ft.com

## Discovery Surfaces

Machine-readable surfaces that returned `200` on 2026-06-29:

- `https://www.ft.com/?format=rss` - redirects to `https://www.ft.com/rss/home/uk`, UK homepage RSS.
- `https://www.ft.com/rss/home` - redirects to `https://www.ft.com/rss/home/international`, international homepage RSS.
- `https://www.ft.com/world?format=rss` - World RSS.
- `https://www.ft.com/uk?format=rss` - redirects to UK homepage RSS.
- `https://www.ft.com/companies?format=rss` - Companies RSS.
- `https://www.ft.com/technology?format=rss` - Technology RSS.
- `https://www.ft.com/markets?format=rss` - Markets RSS.
- `https://www.ft.com/climate?format=rss` - redirects to `https://www.ft.com/climate-capital?format=rss`, Climate Capital RSS.
- `https://www.ft.com/opinion?format=rss` - Opinion RSS.
- `https://www.ft.com/lex?format=rss` - Lex RSS.
- `https://www.ft.com/alphaville?format=rss` - Alphaville RSS.
- `https://www.ft.com/life-arts?format=rss` - Life & Arts RSS.
- `https://www.ft.com/htsi?format=rss` - HTSI RSS.
- `https://www.ft.com/work-careers?format=rss` - Work & Careers RSS.
- `https://www.ft.com/sitemaps/index.xml` - XML sitemap index.
- `https://www.ft.com/robots.txt` - robots file.

Endpoints checked and not useful on 2026-06-29:

- `https://www.ft.com/rss` returned `301` to `https://www.ft.com/rss?format=rss`.
- `https://www.ft.com/rss?format=rss` produced an infinite redirect error in Python's URL opener.
- `https://www.ft.com/sitemap.xml` returned `404`. Use `https://www.ft.com/sitemaps/index.xml`.
- `https://www.ft.com/markets-capital-markets?format=rss` returned `404`.

Sitemap shape observed on 2026-06-29:

- Root type: `sitemapindex`.
- 287 child sitemap entries were observed.
- Current month archive: `https://www.ft.com/sitemaps/archive-2026-6.xml`.
- News sitemap: `https://www.ft.com/sitemaps/news.xml`.
- `archive-2026-6.xml` contained 3,104 article URLs. Recent entries use canonical content URLs such as `https://www.ft.com/content/acfc4ad4-447c-4bb6-aa46-608d5c829943`.

RSS parsing:

- Feed title: `/rss/channel/title`
- Items: `/rss/channel/item`
- Article URL: `item/link`
- Title: `item/title`
- Published time: `item/pubDate`
- Summary/dek: `item/description`
- GUID/content id: `item/guid`

Sampled FT RSS feeds did not include full article body HTML. `content:encoded` was absent or empty for sampled items. Use RSS for discovery, not supplied Instapaper content.

## Latest Examples Observed

Examples from RSS checks on 2026-06-29:

- Opinion: `Donald Trump and how strongman leaders fall`, `Britain's case for meaningful devolution is overwhelming`, `AInflation is real but tiny`.
- Technology: `AI money is going to swamp the midterms this year`, `China grounds light aircraft after Beijing tower crash`, `Samsung and SK Hynix plan $600bn chipmaking expansion`.
- Markets: `UK's Bridgepoint buys real estate unit in $1.4bn bet on US property`, `AInflation is real but tiny`, `How Citadel became an energy giant`.
- Lex: `Why keeping Europe cool need not be a luxury`, `Luxury may be in the doldrums, but perfume passes the smell test`, `Walmart's ad deal smartly puts its customers in the shopping basket`.
- Alphaville: `Artificial intelligence and Engels' Pause`, `FTAV's further reading`.

Use these only as discovery examples. Re-pull feeds before recommending current articles.

## Content Access Observations

Tested URL:

```text
https://www.ft.com/content/a1f9bae6-35a6-4875-ad5a-e5fa3c1de87d
```

Direct HTTP observations on 2026-06-29:

- Direct article fetch returned HTTP `403`.
- Direct curl returned a security verification page for the same article.
- Direct non-browser archive.md latest probing returned HTTP `429`:

```text
https://archive.md/latest/https://www.ft.com/content/a1f9bae6-35a6-4875-ad5a-e5fa3c1de87d
```

Chrome observation on 2026-06-29:

- Chrome loaded the article URL without the security verification page.
- Chrome rendered the headline `Donald Trump and how strongman leaders fall`.
- Browser title was `Subscribe to read`.
- The visible page showed a subscriber barrier and subscription offers, not a full article body.
- The main page container had 9 paragraph tags, but paragraph word counts were short and the largest text containers were subscription/recommended-offer blocks.
- The page had `main#site-content` and a `div#barrier-page` container. Strip FT
  barrier and offer containers so gated pages do not produce misleadingly high
  word counts.

Chrome archive.md observation on 2026-06-29:

- `https://archive.md/latest/https://www.ft.com/content/a1f9bae6-35a6-4875-ad5a-e5fa3c1de87d` resolved in Chrome to `https://archive.md/20260629125338/https://www.ft.com/content/a1f9bae6-35a6-4875-ad5a-e5fa3c1de87d`.
- No CAPTCHA or security interstitial appeared in Chrome.
- Rendered snapshot title: `Donald Trump and how strongman leaders fall`.
- Rendered `<h1>`: `Donald Trump and how strongman leaders fall`.
- Rendered snapshot contained one `<article>` element and zero `<p>` elements, so do not rely on paragraph selectors.
- Captured archive `<article>` HTML cleaned to 1,176 words and tag `Article`.

## Default Save Workflow

For discovery and triage:

1. Pull candidate URLs from the official RSS feeds listed above.
2. Deduplicate by canonical `https://www.ft.com/content/{uuid}` URL.
3. Filter out puzzles, newsletters, audio/video, market-data pages, and pure index pages unless the user explicitly asks for them.
4. Use feed title, description, section/feed, and recency for candidate ranking.
5. When the user asks for `deep reads`, `essays`, or `long reads`, prioritize essay-like FT pieces: Big Read, FT Magazine, Life & Arts features, Work & Careers features, deep Opinion, Lex, Alphaville analysis, profiles, explainers, and reported narrative features. These are discovery labels; confirm final `Essay` tagging with cleaned word count after archive capture or dry-run.
6. When the user asks for `short reads`, `articles`, or `quick reads`, prioritize concise FT news analysis, columns, editorials, Lex notes, Alphaville posts, reviews, and shorter reported articles. Avoid large magazine or Big Read-style pieces unless the user asks for depth.

For full Instapaper saves:

1. Start from the original FT URL discovered by RSS or sitemap.
2. Resolve `https://archive.md/latest/{originalFTURL}` in the available browser.
3. Use the final timestamped archive URL, not the `latest` wrapper URL, as the bookmark URL.
4. Verify the rendered archive title matches the intended FT article.
5. Extract clean article HTML from the rendered archive snapshot.
6. Check the original URL, final archive URL, and title through
   `instapaper_check_candidates`.
7. Require a plausible title and body word count.
8. After approval, submit complete HTML through `instapaper_save_approved` with
   source tag `Financial Times` and accept only a `verified` receipt.

If the page is still gated:

- Do not save it as a full article.
- Do not treat the subscription barrier or offer copy as article content.
- Mark the item as not save-ready or choose another source. The hosted browser
  cannot use a personal FT login.

## Archive.md Notes

Non-browser archive.md latest probing returned HTTP `429` on 2026-06-29. This is normal for archive.md scripted fetches and does not prove that no snapshot exists.

Browser-resolved archive.md worked for the tested Opinion article on 2026-06-29.
Prefer that workflow when it returns a complete article. Do not save an archive
page URL-only; submit complete cleaned content and validate its word count.

## Extraction Notes

For an original public-page capture:

- Prefer `<article>` if present.
- Fall back to `<main>` only after confirming it contains the actual article body.
- Reject pages whose document title is `Subscribe to read`.
- Reject pages containing `#barrier-page` unless a separate article body container with plausible paragraph counts is present.
- Remove subscription, offer, recommended, related, share, navigation, newsletter, sign-in, footer, modal, popup, script, style, iframe, form, and button elements.

For archive.md capture:

- Prefer the rendered `<article>` element.
- Fall back to `<main>` only after confirming it contains the article headline and body.
- Archive snapshots can contain zero `<p>` elements; preserve paragraph-like text blocks nested in `<div>` or `<section>` containers.
- Strip archive controls, share widgets, related links, FT navigation, newsletter/signup modules, scripts, styles, buttons, forms, iframes, and offer/subscription blocks.

Useful metadata sources:

- Title: `<h1>`, then `og:title`, then feed title.
- Description/dek: `meta[name="description"]`, then `og:description`, then feed `description`.
- Canonical URL: `<link rel="canonical">`, then feed URL.
- Published time: page metadata if available, then feed `pubDate`.

Extraction safety:

- Strip `barrier`, `offer`, `recommended`, subscription, paywall, sign-in,
  share, related, navigation, and footer containers.
- An unexpectedly low word count usually means the capture saw the subscription
  barrier, not the article.
- Reject the capture when the browser title is `Subscribe to read`, even if the
  remaining page text has a high word count.

## Tags

Default tags:

- `Financial Times`
- `Article`

Use `Essay` when:

- Cleaned word count is at least 2,500 words.
- The user explicitly asks for `Essay`.
- The piece is clearly long-form analysis, FT Magazine, Big Read, deep opinion, or a feature and a validated full article word count supports it.

Candidate triage hints:

- Deep-read surfaces: Big Read, FT Magazine, Life & Arts features, Work & Careers features, selected Opinion, Lex, Alphaville, selected World/Companies/Markets features, profiles, explainers, and reported narrative features.
- Short-read surfaces: standard news analysis, concise columns, editorials, Lex notes, Alphaville posts, reviews, and shorter reported articles.
- Treat home feeds and World/Companies/Technology feeds as article discovery surfaces; rank by title, description, and feed source until full word counts are available.
- Skip FirstFT, newsletters, puzzles, rankings, market data, videos, and pure live/update pages unless requested.

## Validation

Validation performed on 2026-06-29:

- Failed before cleaning with HTTP `403`.

Original FT page Chrome validation for the same URL:

- Headline: `Donald Trump and how strongman leaders fall`.
- Browser title: `Subscribe to read`.
- Full article body was not available in the current Chrome session.
- `#barrier-page` accounted for the full visible main text and was correctly
  classified as a barrier rather than article content.

Archive.md browser validation for the same URL produced:

- Title: `Donald Trump and how strongman leaders fall`
- Cleaned words: 1,176
- Length tag: `Article`

Before any live FT save:

1. Re-check the browser-resolved archive snapshot in the available browser.
2. Confirm the title matches the intended FT article.
3. Capture or supply clean full article HTML.
4. Require a plausible title, source word count, and length tag.
5. Check the candidate through `instapaper_check_candidates`.
6. After approval, call `instapaper_save_approved` and accept only `verified`.
