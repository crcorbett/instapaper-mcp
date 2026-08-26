import type { Bookmark, Candidate, CandidateDuplicate, DuplicateKind } from "../schemas";

const TRACKING_PARAMETERS = new Set([
  "campaign_id",
  "fbclid",
  "gclid",
  "mc_cid",
  "mc_eid",
  "smid",
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "utm_source",
  "utm_term",
]);

const normaliseUrl = (raw: string): string => {
  const url = new URL(raw);
  url.protocol = "https:";
  url.hostname = url.hostname.toLowerCase().replace(/^www\./u, "");
  url.hash = "";
  for (const key of Array.from(url.searchParams.keys())) {
    if (TRACKING_PARAMETERS.has(key.toLowerCase())) url.searchParams.delete(key);
  }
  url.searchParams.sort();
  url.pathname = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/u, "");
  return url.toString();
};

const normaliseTitle = (title: string): string =>
  title.normalize("NFKC").replace(/\s+/gu, " ").trim().toLocaleLowerCase("en-AU");

export const findDuplicates = (
  candidates: readonly Candidate[],
  bookmarks: readonly Bookmark[],
): readonly CandidateDuplicate[] => {
  const matches: CandidateDuplicate[] = [];
  candidates.forEach((candidate, candidateIndex) => {
    const original = normaliseUrl(candidate.originalUrl);
    const save = normaliseUrl(candidate.saveUrl);
    const title = normaliseTitle(candidate.title);
    for (const bookmark of bookmarks) {
      const storedUrl = normaliseUrl(bookmark.url);
      let kind: DuplicateKind | undefined;
      if (storedUrl === original) kind = "original-url";
      else if (storedUrl === save) kind = "save-url";
      else if (normaliseTitle(bookmark.title) === title) kind = "title";
      if (kind !== undefined) matches.push({ candidateIndex, kind, bookmark });
    }
  });
  return matches;
};

const TRUNCATION_MARKER = /(?:\.\.\.|…)\s*(?:\(\s*)?\d{1,6}\s+(?:more\s+)?characters?\s*\)?/giu;

export const truncationMarkers = (value: string): readonly string[] => [
  ...new Set(value.match(TRUNCATION_MARKER) ?? []),
];

const textWordCount = (html: string): number => {
  const plain = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, " ")
    .replace(/<[^>]+>/gu, " ")
    .replace(/&(?:nbsp|amp|quot|apos|lt|gt);/giu, " ");
  return plain.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length ?? 0;
};

export const assessReadback = (html: string, sourceWords: number) => {
  const markers = truncationMarkers(html);
  const observedWords = textWordCount(html);
  const threshold = Math.ceil(sourceWords * 0.7);
  return {
    markers,
    observedWords,
    threshold,
    verified: markers.length === 0 && observedWords >= threshold,
  } as const;
};
