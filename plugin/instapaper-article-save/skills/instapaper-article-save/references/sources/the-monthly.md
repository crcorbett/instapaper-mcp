# The Monthly

Status: tested live on 2026-06-25.

Base URL: https://www.themonthly.com.au

## Discovery Surfaces

The Monthly does not expose useful RSS/Atom feeds at the obvious paths. Tested paths such as `/rss.xml`, `/feed`, `/atom`, and section RSS variants returned 404.

Use sitemap XML and Next.js JSON instead.

Sitemap index:

- `https://www.themonthly.com.au/sitemap.xml`

Useful sitemaps:

- `https://www.themonthly.com.au/sitemaps/news.xml`
- `https://www.themonthly.com.au/sitemaps/articles-1.xml`
- `https://www.themonthly.com.au/sitemaps/articles-2.xml`
- `https://www.themonthly.com.au/sitemaps/editions.xml`
- `https://www.themonthly.com.au/sitemaps/contributors.xml`
- `https://www.themonthly.com.au/sitemaps/categories.xml`
- `https://www.themonthly.com.au/sitemaps/topics.xml`

Observed counts on 2026-06-25:

- `articles-1.xml`: 5000 URLs.
- `articles-2.xml`: 1078 URLs.
- `contributors.xml`: 1851 contributor URLs.
- `editions.xml`: 233 issue URLs.

## Next.js JSON Indexes

Fetch the homepage and extract the current Next build ID from `#__NEXT_DATA__` or `_next/static/build-...`.

Then call:

```text
https://www.themonthly.com.au/_next/data/{BUILD_ID}/{path}.json
```

Paginated category, topic, and section pages accept `?page=N`.

Category feeds:

- `/politics`
- `/society`
- `/culture`
- `/personal-essays`

Category JSON examples:

```text
/_next/data/{BUILD_ID}/politics.json?page=1
/_next/data/{BUILD_ID}/society.json?page=1
/_next/data/{BUILD_ID}/culture.json?page=1
/_next/data/{BUILD_ID}/personal-essays.json?page=1
```

Useful section feeds:

- `/section/essays`
- `/section/nation-reviewed`
- `/arts-and-letters`
- `/section/noted`
- `/section/life-sentences`
- `/section/vox`
- `/section/encounters`
- `/section/cartoon`
- `/section/letters-editor`

Section JSON examples:

```text
/_next/data/{BUILD_ID}/section/essays.json?page=1
/_next/data/{BUILD_ID}/section/nation-reviewed.json?page=1
/_next/data/{BUILD_ID}/arts-and-letters.json?page=1
```

Contributor feed example:

```text
/_next/data/{BUILD_ID}/contributor/martin-mckenzie-murray.json
```

Contributor pages may not expose the same `currentPage` metadata as category pages. Extract article objects recursively where `type == "node--article"` and read `title`, `created`, `path.alias`, `field_category.name`, and contributors.

Topic feed example:

```text
/_next/data/{BUILD_ID}/topics/literature.json?page=1
```

Issue feed examples:

```text
/_next/data/{BUILD_ID}/current-issue.json
/_next/data/{BUILD_ID}/magazine/june-2026.json
```

## Feed Selection Rules

- For latest overall articles, start with `sitemaps/articles-1.xml`.
- For latest essays, use `/section/essays`.
- For a writer, use their contributor page. This catches non-essay byline pieces that the essays feed misses.
- For topic/category browsing, use the relevant category or topic JSON endpoint.
- For issue-based browsing, use `/current-issue` or a `/magazine/{issue}` JSON endpoint.

Martin McKenzie-Murray recent article example:

- Contributor page: `https://www.themonthly.com.au/contributor/martin-mckenzie-murray`
- JSON path: `/contributor/martin-mckenzie-murray.json`
- Recent 2026 items found here included:
  - `The proof is in the cliche` / `/martin-mckenzie-murray/2026-06-22/proof-cliche`
  - `Chapter and multiverse` / `/martin-mckenzie-murray/2026-06-05/chapter-and-multiverse`
  - `Some reason to get excited` / `/martin-mckenzie-murray/2026-05-25/some-reason-get-excited`

## Article Extraction

Always save the real The Monthly URL, not wrapper/proxy URLs.

Known issue:

- Some The Monthly pages expose or leak a bad canonical/admin URL such as `http://themonthly-admin/...`.
- A URL-only save can preserve the bad URL because Instapaper performs its own crawl.

Fix:

1. Fetch the real article URL.
2. Extract `main` content first. Some pages render related story teasers as the first `article`, so do not blindly select the first `article` element.
3. Strip scripts, styles, nav, ads, subscribe/paywall UI, share widgets, related links, and forms.
4. Build a clean HTML document.
5. Inject:
   - `<link rel="canonical" href="{real_url}">`
   - `<meta property="og:url" content="{real_url}">`
6. Check the candidate through `instapaper_check_candidates`, then send the
   clean HTML through `instapaper_save_approved` after approval.

## Tags

Default tags:

- `The Monthly`
- `Essay` when word count is at least 2500 words.
- `Article` otherwise.

When the URL path contains `/essays/`, `Essay` is usually appropriate even before full text is fetched. Still compute the word count when saving.

## Validation

For each added article, verify:

- HTTP status is success.
- Returned bookmark URL is the real `https://www.themonthly.com.au/...` URL.
- Returned tags include `The Monthly` and `Essay` or `Article`.
- For live batches, verify Instapaper `bookmarks/get_text` without displaying article text. Accept only when the returned title/text match the intended article and the verified word count is close to the cleaned count.
