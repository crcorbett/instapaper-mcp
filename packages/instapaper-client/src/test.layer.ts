import { Effect, Layer, Ref } from "effect";

import { findDuplicates } from "./internal/policy";
import type { AccessCheck, Bookmark, Candidate, SaveReceipt } from "./schemas";
import { InstapaperService } from "./service";

export interface InstapaperTestSetup {
  readonly bookmarks?: readonly Bookmark[];
  readonly saveReceipt?: SaveReceipt;
}

export const makeInstapaperTest = (setup: InstapaperTestSetup = {}) =>
  Effect.gen(function* () {
    const checkedCandidates = yield* Ref.make<readonly Candidate[]>([]);
    const approvedTitles = yield* Ref.make<readonly string[]>([]);
    const bookmarks = setup.bookmarks ?? [];
    const layer = Layer.succeed(
      InstapaperService,
      InstapaperService.of({
        accessCheck: () =>
          Effect.succeed({
            folderCounts: { unread: bookmarks.length, starred: 0, archive: 0 },
          } satisfies AccessCheck),
        checkCandidates: (candidates) =>
          Ref.set(checkedCandidates, candidates).pipe(
            Effect.as({
              folders: ["unread", "starred", "archive"] as const,
              scannedBookmarks: bookmarks.length,
              duplicates: [...findDuplicates(candidates, bookmarks)],
            }),
          ),
        saveApproved: (approved) =>
          Ref.update(approvedTitles, (titles) => [...titles, approved.title]).pipe(
            Effect.andThen(
              setup.saveReceipt === undefined
                ? Effect.die("The deterministic save receipt was not configured")
                : Effect.succeed(setup.saveReceipt),
            ),
          ),
      }),
    );
    return { layer, observations: { checkedCandidates, approvedTitles } } as const;
  });
