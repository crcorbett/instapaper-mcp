import type { Ref } from "effect";

import type { Candidate } from "../schemas";

export interface InstapaperObservations {
  readonly checkedCandidates: Ref.Ref<readonly Candidate[]>;
  readonly approvedTitles: Ref.Ref<readonly string[]>;
}
