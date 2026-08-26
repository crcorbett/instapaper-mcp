import { ArticleUrl, BookmarkId, BookmarkUrl, type Bookmark, type Candidate } from "../schemas";

export const exampleBookmark = {
  bookmarkId: BookmarkId.make("42"),
  url: BookmarkUrl.make("http://example.com/deep-read"),
  title: "A Deep Read",
  tags: ["Example", "Essay"],
} satisfies Bookmark;

export const exampleCandidate = {
  originalUrl: ArticleUrl.make("https://www.example.com/deep-read?utm_source=feed"),
  saveUrl: ArticleUrl.make("https://example.com/deep-read"),
  title: "A DEEP read",
} satisfies Candidate;
