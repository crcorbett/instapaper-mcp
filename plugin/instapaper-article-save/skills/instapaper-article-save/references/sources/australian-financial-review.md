# Australian Financial Review

Status: researched and tested on 2026-06-29.

Use source slug:

- `australian-financial-review`

Use source tag:

- `Australian Financial Review`

## Discovery Surfaces

AFR does not expose a useful public RSS endpoint in the tested paths. `https://www.afr.com/rss` returned `404`.

Use the server-rendered section pages and parse their React Router hydration object:

- Latest: `https://www.afr.com/latest`
- Sitemap/section index: `https://www.afr.com/sitemap`
- Companies: `https://www.afr.com/companies`
- Street Talk: `https://www.afr.com/street-talk`
- Policy: `https://www.afr.com/policy`
- Policy / Economy: `https://www.afr.com/policy/economy`
- World: `https://www.afr.com/world`
- Technology: `https://www.afr.com/technology`
- Opinion: `https://www.afr.com/opinion`
- The AFR View: `https://www.afr.com/the-afr-view`
- Chanticleer: `https://www.afr.com/chanticleer`
- Rear Window: `https://www.afr.com/rear-window`
- Wealth: `https://www.afr.com/wealth`
- Wealth / Investing: `https://www.afr.com/wealth/investing`
- Work & Careers: `https://www.afr.com/work-and-careers`
- Leaders: `https://www.afr.com/work-and-careers/leaders`
- BOSS: `https://www.afr.com/boss`
- AFR Magazine: `https://www.afr.com/afr-magazine`
- Life & Luxury: `https://www.afr.com/life-and-luxury`

The pages contain:

- `window.__staticRouterHydrationData = JSON.parse("...")`
- article cards with `assetType`, `asset.headlines.headline`, `asset.about`, `asset.wordCount`, `dates.published`, `tags.primary.displayName`, and `urls.canonical.path`

Dated sitemap probes such as `https://www.afr.com/sitemaps/afr-articles-20260629.xml` returned valid XML but an empty `<urlset>` during testing, so do not rely on dated sitemap XML for normal discovery unless rechecked.

## Triage

Treat these as strong deep-read surfaces:

- `AFR Magazine`
- `BOSS`
- `Lunch with the AFR`
- `Breakfast with the Boss`
- `Chanticleer`
- substantial `The AFR View`, `Policy`, `Wealth`, `Work & Careers`, `World`, and `Technology` analysis

Discovery labels:

- `Essay`: feature or analysis format, publisher word count around 1,200+ words, or sustained argument/reporting from AFR Magazine, BOSS, Chanticleer, The AFR View, Policy, Wealth, Work & Careers, World, or Technology.
- `Article`: shorter columns, news analysis, Rear Window items, Street Talk briefs, market/company updates, and routine reported news.

Keep this separate from Instapaper tags. The final `Essay`/`Article` Instapaper tag still comes from cleaned word count unless the user explicitly asks for an override.

## Extraction

Direct article pages are fetchable with a browser-like User-Agent and can contain the full article body inside `window.__staticRouterHydrationData`, even when the visible rendered DOM is truncated and response metadata contains `x-nine-article : truncate`.

For hosted extraction, use:

- title from `asset.headlines.headline`
- description from `asset.intro` or `asset.about`
- body HTML from `asset.body`
- placeholders from `asset.bodyPlaceholders`
- canonical path from `urls.canonical.path`
- publisher word count from `asset.wordCount` as a validation hint

For placeholder replacement:

- replace `linkExternal` placeholders with their display text
- remove related-story, iframe, and non-text placeholders from the supplied Instapaper HTML

Do not rely on generic `<article>` or `<main>` extraction for AFR direct pages. A tested long feature returned only 165 words through generic DOM extraction but 2,634 cleaned words through the AFR hydration parser.

## archive.md

`https://archive.md/latest/{AFR_URL}` works in a browser and redirects to a timestamped snapshot. Tested example:

- Original: `https://www.afr.com/policy/tax-and-super/what-australia-s-biggest-tax-overhaul-in-25-years-will-mean-for-you-20260625-p609x4`
- Browser-resolved archive: `https://archive.md/20260626075604/https://www.afr.com/policy/tax-and-super/what-australia-s-biggest-tax-overhaul-in-25-years-will-mean-for-you-20260625-p609x4`

Scripted access to `archive.md/latest/...` returned `429`, so use the available browser for archive validation or capture.

Live Instapaper validation on 2026-06-29 showed an important distinction:

- Direct AFR URLs can be parsed from the hydration object and are useful for discovery, word counts, and building supplied HTML.
- Saving direct AFR URLs to Instapaper with supplied HTML still produced truncated `bookmarks/get_text` output for most tested articles.
- Saving the browser-resolved timestamped archive URL produced full `bookmarks/get_text` output for all 15 tested articles.

For live Instapaper saves where correctness matters, prefer the browser-resolved archive URL as the bookmark URL. Use the original AFR URL only for extraction and metadata unless a direct-URL live save has been verified with `bookmarks/get_text`.

If the direct AFR hydration object is missing or malformed, then:

1. Open `https://archive.md/latest/{AFR_URL}` in the available browser.
2. Confirm the live archive page shows the expected headline and full body text.
3. Capture cleaned text/HTML from the live browser state.
4. Confirm title and cleaned word count before any Instapaper save.

## Instapaper workflow

For batch checks and approved saves:

1. Discover candidates from section pages.
2. Fetch each original AFR URL with a browser-like User-Agent.
3. Require a plausible title match and cleaned word count.
4. Resolve `https://archive.md/latest/{AFR_URL}` in the available browser and
   record the final timestamped archive URL.
5. Check the original URL, archive URL, and title through
   `instapaper_check_candidates`.
6. After approval, submit the archive URL and complete hydration-derived HTML
   through `instapaper_save_approved` with source tag
   `Australian Financial Review` and the final length tag.
7. Accept only a `verified` receipt.

## Known Failure Modes

- Generic extraction can save only the truncated visible article shell.
- Direct AFR URL saves can still show truncated text in Instapaper even when supplied HTML was posted successfully.
- `archive.md/latest/...` can return `429` to direct requests while still working in the browser.
- Archive snapshots may expose full text in the live browser DOM, but captured `document.documentElement.outerHTML` may not preserve the rendered article body in a reusable content file.
- Some AFR cards have no `asset.wordCount`; validate those more carefully before recommending them as deep reads.
- Index pages can repeat the same article across many sections; dedupe by canonical URL.

## Validation Checklist

For each save:

- Confirm the discovered headline and canonical URL.
- Confirm cleaned word count is not just a short shell.
- Confirm final length tag from cleaned word count.
- Confirm returned Instapaper URL is the final browser-resolved timestamped archive URL for preferred live saves. Only accept an original AFR URL when the direct-save path was intentional and `bookmarks/get_text` confirms full text.
- Confirm returned tags include `Australian Financial Review` and `Essay` or `Article`.
- Accept only the hosted save tool's verified Full API readback for each article.

Do not paste AFR article text into chat. Report only the title, bookmark ID,
saved URL, tags, source word count, verified readback word count, and status.
