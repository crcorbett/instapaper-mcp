import { credentialsFromStrings, makeInstapaperLive } from "@instapaper/client/live";
import { InstapaperService } from "@instapaper/client/service";
import type { ApprovedSave, Candidate } from "@instapaper/client/schemas";
import { Effect, Layer, ManagedRuntime } from "effect";
import { FetchHttpClient } from "effect/unstable/http";

import type { Env } from "./env";

const layer = (env: Env) =>
  makeInstapaperLive({
    ...credentialsFromStrings({
      consumerKey: env.INSTAPAPER_CONSUMER_KEY,
      consumerSecret: env.INSTAPAPER_CONSUMER_SECRET,
      accessToken: env.INSTAPAPER_ACCESS_TOKEN,
      accessTokenSecret: env.INSTAPAPER_ACCESS_TOKEN_SECRET,
    }),
    userAgent: "instapaper-mcp/0.1",
  }).pipe(Layer.provide(FetchHttpClient.layer));

const runtimeFor = (env: Env) => ManagedRuntime.make(layer(env));

const withRuntime = async <A>(
  env: Env,
  use: (runtime: ReturnType<typeof runtimeFor>) => Promise<A>,
) => {
  const runtime = runtimeFor(env);
  try {
    return await use(runtime);
  } finally {
    await runtime.dispose();
  }
};

export const accessCheck = (env: Env) =>
  withRuntime(env, (runtime) =>
    runtime.runPromise(
      Effect.gen(function* () {
        const service = yield* InstapaperService;
        return yield* service.accessCheck();
      }),
    ),
  );

export const checkCandidates = (env: Env, candidates: readonly Candidate[]) =>
  withRuntime(env, (runtime) =>
    runtime.runPromise(
      Effect.gen(function* () {
        const service = yield* InstapaperService;
        return yield* service.checkCandidates(candidates);
      }),
    ),
  );

export const saveApproved = (env: Env, approved: ApprovedSave) =>
  withRuntime(env, (runtime) =>
    runtime.runPromise(
      Effect.gen(function* () {
        const service = yield* InstapaperService;
        return yield* service.saveApproved(approved);
      }),
    ),
  );
