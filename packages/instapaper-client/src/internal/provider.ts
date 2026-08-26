import { Effect, Option, Schema } from "effect";

import { InstapaperResponseError } from "../errors";
import { BookmarkId, BookmarkUrl, type Bookmark } from "../schemas";

const ProviderBookmarkFields = {
  bookmark_id: Schema.Union([Schema.String, Schema.Number]),
  url: Schema.String,
  title: Schema.optional(Schema.String),
  tags: Schema.optional(Schema.Array(Schema.Struct({ name: Schema.String }))),
} as const;

const ProviderBookmark = Schema.Struct(ProviderBookmarkFields);

const ProviderBookmarkList = Schema.Union([
  Schema.Struct({ bookmarks: Schema.Array(ProviderBookmark) }),
  Schema.Array(
    Schema.Union([
      Schema.Struct({ ...ProviderBookmarkFields, type: Schema.Literal("bookmark") }),
      Schema.Struct({ type: Schema.Literals(["meta", "user"]) }),
    ]),
  ),
]);

const responseError = (endpoint: string, status: number, message: string) =>
  new InstapaperResponseError({ endpoint, status, message });

const parseJson = (endpoint: string, status: number, body: string) =>
  Effect.try({
    try: () => JSON.parse(body) as unknown,
    catch: () => responseError(endpoint, status, "Instapaper returned invalid JSON"),
  });

const toBookmarks = (entries: readonly (typeof ProviderBookmark.Type)[]): readonly Bookmark[] => {
  const bookmarks: Bookmark[] = [];
  for (const entry of entries) {
    const url = Schema.decodeUnknownOption(BookmarkUrl)(entry.url);
    if (Option.isNone(url)) continue;
    bookmarks.push({
      bookmarkId: BookmarkId.make(String(entry.bookmark_id)),
      url: url.value,
      title: entry.title?.trim() || entry.url,
      tags: (entry.tags ?? []).map((tag) => tag.name),
    });
  }
  return bookmarks;
};

export const decodeBookmarkArray = (endpoint: string, status: number, body: string) =>
  Effect.gen(function* () {
    if (status < 200 || status >= 300) {
      return yield* Effect.fail(responseError(endpoint, status, "Instapaper request failed"));
    }
    const raw = yield* parseJson(endpoint, status, body);
    const entries = yield* Schema.decodeUnknownEffect(Schema.Array(ProviderBookmark))(raw).pipe(
      Effect.mapError(() => responseError(endpoint, status, "Instapaper returned an invalid list")),
    );
    return toBookmarks(entries);
  });

export const decodeBookmarkList = (endpoint: string, status: number, body: string) =>
  Effect.gen(function* () {
    if (status < 200 || status >= 300) {
      return yield* Effect.fail(responseError(endpoint, status, "Instapaper request failed"));
    }
    const raw = yield* parseJson(endpoint, status, body);
    const decoded = yield* Schema.decodeUnknownEffect(ProviderBookmarkList)(raw).pipe(
      Effect.mapError(() =>
        responseError(endpoint, status, "Instapaper returned an invalid bookmark list"),
      ),
    );
    const entries =
      "bookmarks" in decoded
        ? decoded.bookmarks
        : decoded.flatMap((entry) => (entry.type === "bookmark" ? [entry] : []));
    return toBookmarks(entries);
  });
