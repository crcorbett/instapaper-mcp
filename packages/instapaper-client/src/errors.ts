import { Schema } from "effect";

import { Bookmark, BookmarkFolder, BookmarkId } from "./schemas";

const Endpoint = Schema.Trimmed.check(Schema.isMinLength(1));
const Message = Schema.Trimmed.check(Schema.isMinLength(1));

export class InstapaperRequestError extends Schema.TaggedError<InstapaperRequestError>()(
  "InstapaperRequestError",
  { endpoint: Endpoint, message: Message },
) {}

export class InstapaperResponseError extends Schema.TaggedError<InstapaperResponseError>()(
  "InstapaperResponseError",
  { endpoint: Endpoint, status: Schema.Number.check(Schema.isInt()), message: Message },
) {}

export class DuplicateBookmarkError extends Schema.TaggedError<DuplicateBookmarkError>()(
  "DuplicateBookmarkError",
  { bookmark: Bookmark },
) {}

export class TruncationMarkerError extends Schema.TaggedError<TruncationMarkerError>()(
  "TruncationMarkerError",
  { markers: Schema.Array(Message) },
) {}

export class ReadbackVerificationError extends Schema.TaggedError<ReadbackVerificationError>()(
  "ReadbackVerificationError",
  {
    bookmarkId: BookmarkId,
    expectedWords: Schema.Number.check(Schema.isInt(), Schema.isGreaterThan(0)),
    observedWords: Schema.Number.check(Schema.isInt(), Schema.isGreaterThanOrEqualTo(0)),
    message: Message,
  },
) {}

export class IncompleteLibraryError extends Schema.TaggedError<IncompleteLibraryError>()(
  "IncompleteLibraryError",
  {
    folders: Schema.Array(BookmarkFolder),
    limit: Schema.Number.check(Schema.isInt(), Schema.isGreaterThan(0)),
  },
) {}

export type InstapaperError =
  | InstapaperRequestError
  | InstapaperResponseError
  | DuplicateBookmarkError
  | TruncationMarkerError
  | ReadbackVerificationError
  | IncompleteLibraryError;
