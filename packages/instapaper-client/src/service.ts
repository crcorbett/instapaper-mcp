import { Context } from "effect";
import type { Effect } from "effect";

import type { InstapaperError } from "./errors";
import type { AccessCheck, ApprovedSave, Candidate, CandidateCheck, SaveReceipt } from "./schemas";

export interface IInstapaperService {
  readonly accessCheck: () => Effect.Effect<AccessCheck, InstapaperError>;
  readonly checkCandidates: (
    candidates: readonly Candidate[],
  ) => Effect.Effect<CandidateCheck, InstapaperError>;
  readonly saveApproved: (approved: ApprovedSave) => Effect.Effect<SaveReceipt, InstapaperError>;
}

export class InstapaperService extends Context.Service<InstapaperService, IInstapaperService>()(
  "@instapaper/client/InstapaperService",
) {}
