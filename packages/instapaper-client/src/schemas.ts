import { Schema } from "effect";

const NonEmptyText = Schema.Trimmed.check(Schema.isMinLength(1));
const HttpsUrl = Schema.String.check(Schema.isPattern(/^https:\/\/[^\s]+$/u));
const StoredUrl = Schema.String.check(Schema.isPattern(/^[a-z][a-z0-9+.-]*:[^\s]*$/iu));

export const BookmarkId = NonEmptyText.pipe(Schema.brand("BookmarkId"));
export type BookmarkId = typeof BookmarkId.Type;

export const ArticleUrl = HttpsUrl.pipe(Schema.brand("ArticleUrl"));
export type ArticleUrl = typeof ArticleUrl.Type;

export const BookmarkUrl = StoredUrl.pipe(Schema.brand("BookmarkUrl"));
export type BookmarkUrl = typeof BookmarkUrl.Type;

export const BookmarkFolder = Schema.Literals(["unread", "starred", "archive"]);
export type BookmarkFolder = typeof BookmarkFolder.Type;

export const Bookmark = Schema.Struct({
  bookmarkId: BookmarkId,
  url: BookmarkUrl,
  title: NonEmptyText,
  tags: Schema.Array(NonEmptyText),
});
export type Bookmark = typeof Bookmark.Type;

export const Candidate = Schema.Struct({
  originalUrl: ArticleUrl,
  saveUrl: ArticleUrl,
  title: NonEmptyText,
});
export type Candidate = typeof Candidate.Type;

export const DuplicateKind = Schema.Literals(["original-url", "save-url", "title"]);
export type DuplicateKind = typeof DuplicateKind.Type;

export const CandidateDuplicate = Schema.Struct({
  candidateIndex: Schema.Number.check(Schema.isInt(), Schema.isGreaterThanOrEqualTo(0)),
  kind: DuplicateKind,
  bookmark: Bookmark,
});
export type CandidateDuplicate = typeof CandidateDuplicate.Type;

export const CandidateCheck = Schema.Struct({
  folders: Schema.Array(BookmarkFolder),
  scannedBookmarks: Schema.Number.check(Schema.isInt(), Schema.isGreaterThanOrEqualTo(0)),
  duplicates: Schema.Array(CandidateDuplicate),
});
export type CandidateCheck = typeof CandidateCheck.Type;

export const AccessCheck = Schema.Struct({
  folderCounts: Schema.Struct({
    unread: Schema.Number.check(Schema.isInt(), Schema.isGreaterThanOrEqualTo(0)),
    starred: Schema.Number.check(Schema.isInt(), Schema.isGreaterThanOrEqualTo(0)),
    archive: Schema.Number.check(Schema.isInt(), Schema.isGreaterThanOrEqualTo(0)),
  }),
});
export type AccessCheck = typeof AccessCheck.Type;

export const LengthTag = Schema.Literals(["Essay", "Article"]);
export type LengthTag = typeof LengthTag.Type;

export const ApprovedSave = Schema.Struct({
  originalUrl: ArticleUrl,
  saveUrl: ArticleUrl,
  title: NonEmptyText,
  description: Schema.String,
  content: Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(1_500_000)),
  sourceTag: NonEmptyText,
  lengthTag: LengthTag,
  sourceWords: Schema.Number.check(Schema.isInt(), Schema.isGreaterThan(0)),
});
export type ApprovedSave = typeof ApprovedSave.Type;

export const SaveReceipt = Schema.Struct({
  status: Schema.Literal("verified"),
  bookmarkId: BookmarkId,
  title: NonEmptyText,
  savedUrl: ArticleUrl,
  tags: Schema.Array(NonEmptyText),
  sourceWords: Schema.Number.check(Schema.isInt(), Schema.isGreaterThan(0)),
  readbackWords: Schema.Number.check(Schema.isInt(), Schema.isGreaterThanOrEqualTo(0)),
});
export type SaveReceipt = typeof SaveReceipt.Type;
