# The Economist

Status: researched and live-tested on 2026-06-25 using The Economist RSS feeds,
the live site, archive.md snapshots, and Instapaper Full API supplied-content
saves. Discovery surfaces are mapped; direct authenticated publisher extraction
is still not implemented.

Base URL: https://www.economist.com

## Discovery Surfaces

Direct requests to `www.economist.com`, `sitemap.xml`, `googlenews.xml`, and HTML
pages can be blocked by Cloudflare and return "Just a moment" or `403`. Prefer
RSS for machine discovery. Use the available signed-out browser for public live
navigation. Mark pages requiring a personal login as not save-ready.

Official human-readable sitemap:

- `https://www.economist.com/sitemap`
- Loaded in Chrome on 2026-06-25.
- Useful for current topic taxonomy because many old section URLs now redirect to `/topics/...`.

Weekly edition pages:

- Current path pattern: `https://www.economist.com/weeklyedition/YYYY-MM-DD`
- Archive path: `https://www.economist.com/weeklyedition/archive`
- Example found on 2026-06-25: `https://www.economist.com/weeklyedition/2026-06-20`, title `America's AI power grab | June 20th 2026`.
- A route-level RSS guess such as `https://www.economist.com/weeklyedition/2026-06-20/rss.xml` returned `AccessDenied` on 2026-06-25.
- The live weekly edition page can resolve to the right edition but render an empty body or time out in Chrome. Use it only as one signal; cross-check long-form candidates through the section feeds below.

## Current Site Taxonomy

Observed from `https://www.economist.com/sitemap` in Chrome on 2026-06-25.

Opinion:

- `https://www.economist.com/topics/leaders` - Leaders.
- `https://www.economist.com/topics/letters` - Letters to the editor.
- `https://www.economist.com/topics/by-invitation` - By Invitation.
- `https://www.economist.com/topics/essay` - Essay.
- `https://www.economist.com/topics/schools-brief` - Schools Brief.

Featured and weekly:

- `https://www.economist.com/the-world-in-brief` - The world in brief.
- `https://www.economist.com/weeklyedition/` - Current weekly edition.
- `https://www.economist.com/weeklyedition/archive` - All editions.
- `https://www.economist.com/1843` and `https://www.economist.com/topics/1843` - 1843.

Business and economics:

- `https://www.economist.com/topics/finance-and-economics` - Finance & economics.
- `https://www.economist.com/topics/economics` - Economics.
- `https://www.economist.com/topics/business` - Business.
- `https://www.economist.com/big-mac-index` - Big Mac index.
- `https://www.economist.com/economics-a-to-z` - A-Z of economics.
- `https://www.economist.com/economic-and-financial-indicators` - Economic & financial indicators.

In depth:

- `https://www.economist.com/topics/science-and-technology` - Science & technology.
- `https://www.economist.com/topics/briefing` - Briefing.
- `https://www.economist.com/topics/graphic-detail` - Graphic detail.
- `https://www.economist.com/topics/the-economist-explains` - The Economist explains.
- `https://www.economist.com/special-reports` - Special reports.
- `https://www.economist.com/technology-quarterly` - Technology Quarterly.
- `https://www.economist.com/topics/interactives` - Interactives.

World:

- `https://www.economist.com/the-world-this-week` - The world this week.
- `https://www.economist.com/topics/asia`
- `https://www.economist.com/topics/britain`
- `https://www.economist.com/topics/china`
- `https://www.economist.com/topics/europe`
- `https://www.economist.com/topics/international`
- `https://www.economist.com/topics/africa`
- `https://www.economist.com/topics/the-americas`
- `https://www.economist.com/topics/united-states`

Culture and society:

- `https://www.economist.com/topics/culture` - Culture.
- `https://www.economist.com/topics/obituary` - Obituary.
- `https://www.economist.com/topics/the-economist-reads` - The Economist reads.
- `https://www.economist.com/christmas-specials` - Christmas Specials.

Columns:

- `https://www.economist.com/topics/columns` - Columns index.
- `https://www.economist.com/topics/back-story` - Back Story.
- `https://www.economist.com/topics/bagehot` - Bagehot.
- `https://www.economist.com/topics/banyan` - Banyan.
- `https://www.economist.com/topics/bartleby` - Bartleby.
- `https://www.economist.com/topics/buttonwood` - Buttonwood.
- `https://www.economist.com/topics/chaguan` - Chaguan.
- `https://www.economist.com/topics/charlemagne` - Charlemagne.
- `https://www.economist.com/topics/free-exchange` - Free Exchange.
- `https://www.economist.com/topics/johnson` - Johnson.
- `https://www.economist.com/topics/lexington` - Lexington.
- `https://www.economist.com/topics/schumpeter` - Schumpeter.
- `https://www.economist.com/topics/world-in-a-dish` - World in a dish.
- `https://www.economist.com/topics/the-sports-page` - Sports.
- `https://www.economist.com/topics/the-telegram` - The Telegram.

## RSS Feeds

RSS feeds that returned `200` on 2026-06-25:

- `https://www.economist.com/rss/the_world_this_week_rss.xml` - The world this week.
- `https://www.economist.com/rss/leaders_rss.xml` - Leaders.
- `https://www.economist.com/rss/letters_rss.xml` - Letters.
- `https://www.economist.com/rss/briefings_rss.xml` - Briefing.
- `https://www.economist.com/rss/business_rss.xml` - Business.
- `https://www.economist.com/rss/finance_and_economics_rss.xml` - Finance & economics.
- `https://www.economist.com/rss/science_and_technology_rss.xml` - Science & technology.
- `https://www.economist.com/rss/books_and_arts_rss.xml` - Older Books & arts feed.
- `https://www.economist.com/rss/united_states_rss.xml` - United States.
- `https://www.economist.com/rss/china_rss.xml` - China.
- `https://www.economist.com/rss/asia_rss.xml` - Asia.
- `https://www.economist.com/rss/middle_east_and_africa_rss.xml` - Middle East & Africa.
- `https://www.economist.com/rss/europe_rss.xml` - Europe.
- `https://www.economist.com/rss/britain_rss.xml` - Britain.
- `https://www.economist.com/rss/international_rss.xml` - International.
- `https://www.economist.com/rss/the_americas_rss.xml` - The Americas.
- `https://www.economist.com/rss/obituary_rss.xml` - Obituary.
- `https://www.economist.com/rss/special_reports_rss.xml` - Special report.

Route-owned RSS feeds that returned `200` on 2026-06-25 and are better for long-form discovery:

- `https://www.economist.com/briefing/rss.xml` - Briefing. Example current item on 2026-06-25: `Anthropic's astonishing commercial success makes it a target`, published 2026-06-18.
- `https://www.economist.com/1843/rss.xml` - 1843 long-form features. Example current item on 2026-06-25: `The strange disappearance of Japan's animators`, published 2026-06-19.
- `https://www.economist.com/essay/rss.xml` - Essays. Example current item on 2026-06-25: `From morning in America to endless conflict`, published 2026-06-10.
- `https://www.economist.com/special-report/rss.xml` - Special reports. This overlaps with the older special reports feed.

RSS endpoints tested and not useful on 2026-06-25:

- `https://www.economist.com/rss/graphic_detail_rss.xml` returned `404`.
- `https://www.economist.com/rss/technology_quarterly_rss.xml` returned `404`.
- `https://www.economist.com/rss/by_invitation_rss.xml` returned `404`.
- `https://www.economist.com/rss/columns_rss.xml` returned `404`.
- `https://www.economist.com/rss/essay_rss.xml` and `https://www.economist.com/rss/essays_rss.xml` returned `404`. Use `https://www.economist.com/essay/rss.xml` instead.
- `https://www.economist.com/rss/schools_brief_rss.xml` returned `404`.
- `https://www.economist.com/rss/free_exchange_rss.xml`, `buttonwood`, `bartleby`, `schumpeter`, `lexington`, `chaguan`, `charlemagne`, `johnson`, `world_in_a_dish`, `the_telegram`, and `sports` returned `404`.
- `https://www.economist.com/rss/1843_rss.xml` and `https://www.economist.com/rss/the_economist_reads_rss.xml` returned `404`. Use `https://www.economist.com/1843/rss.xml` for 1843.

Path notes:

- Legacy paths such as `/leaders`, `/business`, and `/science-and-technology` redirected in Chrome to `/topics/leaders`, `/topics/business`, and `/topics/science-and-technology`.
- `/finance-and-economics` redirected to `/topics/finance-and-economics`.
- `/books-and-arts` showed a 404 in Chrome, even though `books_and_arts_rss.xml` still returned `200`. Prefer `https://www.economist.com/topics/culture` for live navigation.

## Content Types and Length Guidance

Use the measured cleaned word count as the final length tag decision whenever
possible. The notes below are discovery and triage hints.

Default article candidates:

- Regional and beat feeds: Business, Finance & economics, Science & technology, United States, China, Asia, Middle East & Africa, Europe, Britain, International, The Americas, Culture, Obituary.
- Opinion feeds and pages: Leaders, Letters, By Invitation.
- Columns such as Bartleby, Buttonwood, Free Exchange, Chaguan, Charlemagne, Lexington, Schumpeter, Johnson, Bagehot, Banyan, Back Story, World in a dish, Sports, and The Telegram.

Long-read or essay candidates:

- `https://www.economist.com/topics/essay` - Chrome meta description says these are long-form essays on major global themes.
- `https://www.economist.com/topics/1843` - Chrome meta description says 1843 offers in-depth global features on culture, lifestyle, and ideas.
- `https://www.economist.com/topics/briefing` - In-depth analysis of major global issues. Usually save as `Article` unless cleaned word count or user instruction supports `Essay`.
- `https://www.economist.com/topics/schools-brief` - Essential guides for complex ideas. Often worth reviewing as long-form candidates.
- `https://www.economist.com/special-reports` - Multi-article reports. Save individual article URLs, not only the report index.
- `https://www.economist.com/technology-quarterly` - Multi-article technology reports. Save individual article URLs where possible.
- Christmas Specials can be long features, but confirm by article page and word count.

Data-heavy or interactive candidates:

- `https://www.economist.com/topics/graphic-detail` - Data and analytics stories. Good candidates when article text is readable.
- `https://www.economist.com/topics/interactives` - Often script-heavy; only save if the extracted HTML produces coherent text.
- Big Mac index, A-Z pages, and economic indicators are reference surfaces. Save only on explicit request.

Usually skip unless requested:

- `The world in brief`, `The world this week`, audio/video pages, games, newsletters, election trackers, and live indicators.

Edition long-form triage:

- Do not assume the current weekly edition contains a strict `/essay/` item.
- Check `https://www.economist.com/essay/rss.xml` for true Essay pieces.
- Check `https://www.economist.com/1843/rss.xml` for current long-form features close to the edition date.
- Check `https://www.economist.com/briefing/rss.xml` for the edition's in-depth briefing. These can exceed 2500 cleaned words but should usually remain tagged `Article` unless the user asks for `Essay`.
- For the June 20th 2026 edition window, the confirmed long-form candidates were `Anthropic's astonishing commercial success makes it a target` from Briefing on 2026-06-18 and `The strange disappearance of Japan's animators` from 1843 on 2026-06-19. The Essay feed's latest item was from 2026-06-10, not the June 20th edition window.

## Candidate Discovery Workflow

1. If the user asks for a specific URL, treat it as the original candidate URL.
   Follow the archive supplied-content workflow unless a direct original-URL
   save has been explicitly validated with full-content readback.
2. If the user asks for recent candidates, start with the relevant RSS feeds.
3. For long reads, include the route-owned feeds `briefing/rss.xml`, `1843/rss.xml`, and `essay/rss.xml`; the older `/rss/*_rss.xml` pattern does not cover every long-form surface.
4. If the requested surface has no RSS feed, use the available browser with the live sitemap/topic pages.
5. Prefer original Economist URLs for candidate tracking and archive lookup.
6. When saving archive.md snapshots to Instapaper, do not use URL-only saves.
   Submit complete cleaned HTML through `instapaper_save_approved`.
7. For multi-article report pages, identify the individual article URLs before saving unless the user explicitly wants the index.

## Archive.md Observation

Direct curl to archive.md wrapper URLs returned `429` with captcha markers.

Chrome could render archive.md for the public weekly-edition landing page:

- Query URL: `https://archive.md/https://www.economist.com/weeklyedition/2026-06-20`
- Snapshot observed: `https://archive.md/PVbbk`
- Snapshot title: `America's AI power grab | June 20th 2026 | The Economist`
- Visible content included the weekly edition header and contents sections.

For archive.md saves, prefer a browser-verified snapshot URL. If direct fetch is
blocked, capture complete rendered HTML from the available public page.

## Archive.md to Instapaper Workflow

Use this workflow whenever the user asks to save Economist archive.md snapshots to Instapaper.

1. Resolve the latest snapshot with `https://archive.md/latest/{originalEconomistURL}`. The result usually redirects to a short snapshot URL such as `https://archive.md/VQ0DK`.
2. Open the short snapshot in the available browser and verify the rendered title matches the intended article.
3. Extract clean article HTML from the rendered page. Do not send raw archive.md HTML and do not save the snapshot URL as a URL-only Instapaper bookmark.
   - Do not use Playwriter `getCleanHTML` as the content source for this step: it truncates long DOM text values into literal placeholders such as `...70 more characters`, which Instapaper will preserve.
   - Instead, capture the rendered story container's raw `innerHTML` (normally
     the first `main article`) and wrap it in an explicit outer `<article>`.
4. Build a simple HTML document with:
   - `<h1>` from the expected article title.
   - Optional subhead/description.
   - Optional `<time>` and lead figure.
   - Paragraph-like body blocks only.
5. Strip archive controls, related cards, subscribe/share UI, navigation, scripts, styles, buttons, iframes, and anything with archive/page boilerplate.
6. Confirm title, cleaned word count, and length tag.
7. Check the original URL, archive URL, and title through
   `instapaper_check_candidates`.
8. After approval, call `instapaper_save_approved` with source tag
   `The Economist` and the intended length tag. Do not delete or replace an
   existing bookmark through another route.

Reason: archive.md snapshots can render the visible article body as nested layout `<div>` blocks with no `<p>` tags. Instapaper's crawler may then save archive controls, partial text, or a broken download. Supplying cleaned HTML through the Full API fixed this on 2026-06-25.

Extraction notes from 2026-06-25:

- Normal article snapshots often have one `<article>` and one `<main>`, but the useful text can still be nested in plain `<div>` blocks.
- Interactive essay and 1843 snapshots may have no `<article>`, only `<main>`,
  and require scrolling in the browser before all lazy body blocks are present.
- For interactive/1843 pages, paragraph-like text blocks were nested inside extra wrappers; a strict "leaf node only" rule missed content. Use a layout-column filter and deduplicate contained/duplicate blocks.
- On 2026-07-13, six Treasury special-report bookmarks were found to contain literal `...N more characters` strings. Their source HTML had been captured through `getCleanHTML`, whose documented value truncation inserted those strings. Re-capturing raw `main article` `innerHTML`, wrapping it in `<article>`, and re-adding through the Full API removed all markers; new readback word counts were 650-1,612 and all verified.
- Good saved examples after cleanup:
  - `Both Donald Trump and Giorgia Meloni are begging for trouble`: 471 cleaned words, saved from `https://archive.md/VQ0DK`.
  - `The dangerous delusion of modern warfare`: 4754 cleaned words, saved from `https://archive.md/1gcwA`.
  - `The strange disappearance of Japan's animators`: 4837 cleaned words, saved from `https://archive.md/JVpLd`.
  - `Nike can't just do it any more`: 5249 cleaned words, saved from `https://archive.md/1NCN9`.

Validation note:

- Instapaper `bookmarks/add` returning HTTP `200`, the expected title, the archive URL, and returned tags is necessary but not sufficient for final acceptance.
- Accept only a `verified` receipt from `instapaper_save_approved`. Its Full API
  readback must contain the intended article and a plausible word count.
- If fresh readback is unavailable, report the save as pending or failed. Do not
  delete or re-add it through another route.

## Tags

Default tags:

- `The Economist`
- `Article`

Use `Essay` when:

- Cleaned word count is at least 2,500 words.
- The user explicitly asks for `Essay`.
- Source metadata and visible article structure clearly identify a long-form essay or feature and the cleaned word count is unavailable.

Do not tag index pages, trackers, or multi-article report landing pages as `Essay` unless saving them is deliberate.

## Validation

- Confirm the content came from a public page available to the hosted browser
  or another authorised source provided by the user.
- Confirm the cleaned title and word count match the visible article.
- For archive.md saves, submit complete cleaned content. A URL-only archive save
  is not sufficient.
- Check candidates before approval and accept only a `verified` hosted save
  receipt.
- Do not paste article text into chat.
