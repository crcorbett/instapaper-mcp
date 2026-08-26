import { assert, describe, it } from "@effect/vitest";
import { Effect, Redacted } from "effect";

import { exampleBookmark, exampleCandidate } from "../src/__testing__/fixtures";
import { makeOAuthHeader } from "../src/internal/oauth";
import { assessReadback, truncationMarkers } from "../src/internal/policy";
import { decodeBookmarkList } from "../src/internal/provider";
import { InstapaperService } from "../src/service";
import { makeInstapaperTest } from "../src/test.layer";

describe("InstapaperService", () => {
  it.effect("finds URL variants without writing", () =>
    Effect.gen(function* () {
      const setup = yield* makeInstapaperTest({ bookmarks: [exampleBookmark] });
      const result = yield* Effect.gen(function* () {
        const service = yield* InstapaperService;
        return yield* service.checkCandidates([exampleCandidate]);
      }).pipe(Effect.provide(setup.layer));
      assert.deepEqual(
        result.duplicates.map((duplicate) => duplicate.kind),
        ["original-url"],
      );
      assert.strictEqual(result.scannedBookmarks, 1);
    }),
  );

  it("detects transport truncation markers", () => {
    assert.deepEqual(truncationMarkers("Article … (70 more characters)"), [
      "… (70 more characters)",
    ]);
    assert.isFalse(assessReadback("<p>one two three</p>", 10).verified);
    assert.isTrue(assessReadback("<p>one two three four five six seven</p>", 10).verified);
  });

  it.effect("produces an OAuth 1.0a HMAC-SHA1 header", () =>
    Effect.gen(function* () {
      const header = yield* makeOAuthHeader(
        "POST",
        "https://photos.example.net/request_token",
        {},
        {
          consumerKey: Redacted.make("dpf43f3p2l4k3l03"),
          consumerSecret: Redacted.make("kd94hf93k423kf44"),
          accessToken: Redacted.make("nnch734d00sl2jdk"),
          accessTokenSecret: Redacted.make("pfkkdhi9sl3r4s00"),
        },
        { nonce: "kllo9940pd9333jh", timestampSeconds: 1_197_462_666 },
      );
      assert.include(header, 'oauth_signature_method="HMAC-SHA1"');
      assert.include(header, "oauth_signature=");
      assert.notInclude(header, "kd94hf93k423kf44");
      assert.notInclude(header, "pfkkdhi9sl3r4s00");
    }),
  );

  it.effect("decodes the object returned by bookmarks/list", () =>
    Effect.gen(function* () {
      const bookmarks = yield* decodeBookmarkList(
        "https://www.instapaper.com/api/1/bookmarks/list",
        200,
        JSON.stringify({
          user: { user_id: 7 },
          bookmarks: [
            {
              type: "bookmark",
              bookmark_id: 42,
              url: "https://example.com/deep-read",
              title: "A Deep Read",
              tags: [{ name: "Essay" }],
            },
          ],
          highlights: [],
          delete_ids: [],
        }),
      );
      assert.strictEqual(bookmarks.length, 1);
      assert.strictEqual(bookmarks[0]?.bookmarkId, "42");
    }),
  );

  it.effect("decodes the flat record array returned by bookmarks/list", () =>
    Effect.gen(function* () {
      const bookmarks = yield* decodeBookmarkList(
        "https://www.instapaper.com/api/1/bookmarks/list",
        200,
        JSON.stringify([
          { type: "meta" },
          { type: "user", user_id: 7 },
          {
            type: "bookmark",
            bookmark_id: 42,
            url: "https://example.com/deep-read",
            title: "A Deep Read",
            tags: [{ name: "Essay", id: 9 }],
          },
        ]),
      );
      assert.strictEqual(bookmarks.length, 1);
      assert.strictEqual(bookmarks[0]?.bookmarkId, "42");
      assert.deepEqual(bookmarks[0]?.tags, ["Essay"]);
    }),
  );
});
