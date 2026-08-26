import { Effect, Layer, Redacted } from "effect";
import { HttpClient, HttpClientRequest } from "effect/unstable/http";

import {
  DuplicateBookmarkError,
  IncompleteLibraryError,
  InstapaperRequestError,
  InstapaperResponseError,
  ReadbackVerificationError,
  TruncationMarkerError,
} from "./errors";
import { liveOAuthInputs, makeOAuthHeader, type OAuthCredentials } from "./internal/oauth";
import { assessReadback, findDuplicates, truncationMarkers } from "./internal/policy";
import { decodeBookmarkArray, decodeBookmarkList } from "./internal/provider";
import { type Bookmark, type BookmarkFolder, type Candidate } from "./schemas";
import { InstapaperService } from "./service";

const API = "https://www.instapaper.com/api/1";
const FOLDERS: readonly BookmarkFolder[] = ["unread", "starred", "archive"];
const FOLDER_LIMIT = 500;

const responseError = (endpoint: string, status: number, message: string) =>
  new InstapaperResponseError({ endpoint, status, message });

export interface InstapaperLiveConfig extends OAuthCredentials {
  readonly userAgent: string;
}

export const makeInstapaperLive = (config: InstapaperLiveConfig) =>
  Layer.effect(
    InstapaperService,
    Effect.gen(function* () {
      const client = yield* HttpClient.HttpClient;

      const post = (path: string, form: Readonly<Record<string, string>>) =>
        Effect.gen(function* () {
          const endpoint = `${API}/${path}`;
          const authorization = yield* makeOAuthHeader(
            "POST",
            endpoint,
            form,
            config,
            liveOAuthInputs(),
          );
          const request = HttpClientRequest.post(endpoint).pipe(
            HttpClientRequest.setHeaders({ authorization, "user-agent": config.userAgent }),
            HttpClientRequest.bodyUrlParams(form),
          );
          const response = yield* client
            .execute(request)
            .pipe(
              Effect.mapError(
                (cause) => new InstapaperRequestError({ endpoint, message: String(cause) }),
              ),
            );
          const body = yield* response.text.pipe(
            Effect.mapError(
              (cause) => new InstapaperRequestError({ endpoint, message: String(cause) }),
            ),
          );
          return { endpoint, status: response.status, body } as const;
        });

      const listFolder = (folder: BookmarkFolder) =>
        post("bookmarks/list", { folder_id: folder, limit: String(FOLDER_LIMIT) }).pipe(
          Effect.flatMap(({ endpoint, status, body }) =>
            decodeBookmarkList(endpoint, status, body),
          ),
        );

      const allBookmarks = Effect.gen(function* () {
        const byFolder = yield* Effect.forEach(FOLDERS, listFolder, { concurrency: 1 });
        const saturatedFolders = FOLDERS.filter(
          (_folder, index) => (byFolder[index]?.length ?? 0) >= FOLDER_LIMIT,
        );
        if (saturatedFolders.length > 0) {
          return yield* Effect.fail(
            new IncompleteLibraryError({ folders: [...saturatedFolders], limit: FOLDER_LIMIT }),
          );
        }
        const seen = new Set<string>();
        const bookmarks: Bookmark[] = [];
        for (const bookmark of byFolder.flat()) {
          if (seen.has(bookmark.bookmarkId)) continue;
          seen.add(bookmark.bookmarkId);
          bookmarks.push(bookmark);
        }
        return { byFolder, bookmarks: bookmarks as readonly Bookmark[] } as const;
      });

      const checkCandidates = (candidates: readonly Candidate[]) =>
        allBookmarks.pipe(
          Effect.map(({ bookmarks }) => ({
            folders: [...FOLDERS],
            scannedBookmarks: bookmarks.length,
            duplicates: [...findDuplicates(candidates, bookmarks)],
          })),
        );

      return InstapaperService.of({
        accessCheck: () =>
          Effect.gen(function* () {
            const { byFolder } = yield* allBookmarks;
            return {
              folderCounts: {
                unread: byFolder[0]?.length ?? 0,
                starred: byFolder[1]?.length ?? 0,
                archive: byFolder[2]?.length ?? 0,
              },
            };
          }),
        checkCandidates,
        saveApproved: (approved) =>
          Effect.gen(function* () {
            const markers = truncationMarkers(approved.content);
            if (markers.length > 0) {
              return yield* Effect.fail(new TruncationMarkerError({ markers: [...markers] }));
            }
            const candidate = {
              originalUrl: approved.originalUrl,
              saveUrl: approved.saveUrl,
              title: approved.title,
            } satisfies Candidate;
            const duplicateCheck = yield* checkCandidates([candidate]);
            const duplicate = duplicateCheck.duplicates[0];
            if (duplicate !== undefined) {
              return yield* Effect.fail(
                new DuplicateBookmarkError({ bookmark: duplicate.bookmark }),
              );
            }
            const expectedTags = [approved.sourceTag, approved.lengthTag];
            const added = yield* post("bookmarks/add", {
              url: approved.saveUrl,
              title: approved.title,
              description: approved.description,
              resolve_final_url: "0",
              content: approved.content,
              tags: JSON.stringify(expectedTags.map((name) => ({ name }))),
            });
            const addedBookmarks = yield* decodeBookmarkArray(
              added.endpoint,
              added.status,
              added.body,
            );
            const bookmark = addedBookmarks[0];
            if (bookmark === undefined) {
              return yield* Effect.fail(
                responseError(
                  added.endpoint,
                  added.status,
                  "Instapaper did not return the bookmark",
                ),
              );
            }
            if (
              String(bookmark.url) !== String(approved.saveUrl) ||
              bookmark.title.trim() !== approved.title.trim()
            ) {
              return yield* Effect.fail(
                responseError(
                  added.endpoint,
                  added.status,
                  "Added bookmark metadata did not match",
                ),
              );
            }
            if (!expectedTags.every((tag) => bookmark.tags.includes(tag))) {
              return yield* Effect.fail(
                responseError(added.endpoint, added.status, "Added bookmark tags did not match"),
              );
            }
            const readback = yield* post("bookmarks/get_text", {
              bookmark_id: bookmark.bookmarkId,
            });
            if (readback.status < 200 || readback.status >= 300) {
              return yield* Effect.fail(
                new ReadbackVerificationError({
                  bookmarkId: bookmark.bookmarkId,
                  expectedWords: approved.sourceWords,
                  observedWords: 0,
                  message: `Readback returned HTTP ${readback.status}`,
                }),
              );
            }
            const assessment = assessReadback(readback.body, approved.sourceWords);
            if (!assessment.verified) {
              return yield* Effect.fail(
                new ReadbackVerificationError({
                  bookmarkId: bookmark.bookmarkId,
                  expectedWords: approved.sourceWords,
                  observedWords: assessment.observedWords,
                  message:
                    assessment.markers.length > 0
                      ? "Readback contained a truncation marker"
                      : "Readback was shorter than the verification threshold",
                }),
              );
            }
            return {
              status: "verified" as const,
              bookmarkId: bookmark.bookmarkId,
              title: bookmark.title,
              savedUrl: approved.saveUrl,
              tags: bookmark.tags,
              sourceWords: approved.sourceWords,
              readbackWords: assessment.observedWords,
            };
          }),
      });
    }),
  );

export const credentialsFromStrings = (values: {
  readonly consumerKey: string;
  readonly consumerSecret: string;
  readonly accessToken: string;
  readonly accessTokenSecret: string;
}): OAuthCredentials => ({
  consumerKey: Redacted.make(values.consumerKey),
  consumerSecret: Redacted.make(values.consumerSecret),
  accessToken: Redacted.make(values.accessToken),
  accessTokenSecret: Redacted.make(values.accessTokenSecret),
});
