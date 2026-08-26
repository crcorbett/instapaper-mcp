import { Effect, Redacted } from "effect";

import { InstapaperRequestError } from "../errors";

export interface OAuthCredentials {
  readonly consumerKey: Redacted.Redacted<string>;
  readonly consumerSecret: Redacted.Redacted<string>;
  readonly accessToken: Redacted.Redacted<string>;
  readonly accessTokenSecret: Redacted.Redacted<string>;
}

export interface OAuthInputs {
  readonly nonce: string;
  readonly timestampSeconds: number;
}

const encode = (value: string): string =>
  encodeURIComponent(value).replace(
    /[!'()*]/gu,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );

const serialise = (parameters: Readonly<Record<string, string>>): string =>
  Object.entries(parameters)
    .map(([key, value]) => [encode(key), encode(value)] as const)
    .sort(([leftKey, leftValue], [rightKey, rightValue]) =>
      leftKey === rightKey ? leftValue.localeCompare(rightValue) : leftKey.localeCompare(rightKey),
    )
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

const toBase64 = (bytes: ArrayBuffer): string => {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary);
};

export const makeOAuthHeader = (
  method: "POST",
  url: string,
  form: Readonly<Record<string, string>>,
  credentials: OAuthCredentials,
  inputs: OAuthInputs,
) =>
  Effect.tryPromise({
    try: async () => {
      const oauth = {
        oauth_consumer_key: Redacted.value(credentials.consumerKey),
        oauth_nonce: inputs.nonce,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: String(inputs.timestampSeconds),
        oauth_token: Redacted.value(credentials.accessToken),
        oauth_version: "1.0",
      } as const;
      const parameterString = serialise({ ...form, ...oauth });
      const baseString = [method, encode(url), encode(parameterString)].join("&");
      const signingKey = `${encode(Redacted.value(credentials.consumerSecret))}&${encode(
        Redacted.value(credentials.accessTokenSecret),
      )}`;
      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(signingKey),
        { name: "HMAC", hash: "SHA-1" },
        false,
        ["sign"],
      );
      const signature = toBase64(
        await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(baseString)),
      );
      return `OAuth ${Object.entries({ ...oauth, oauth_signature: signature })
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([keyName, value]) => `${encode(keyName)}="${encode(value)}"`)
        .join(", ")}`;
    },
    catch: (cause) => {
      const message =
        typeof cause === "object" &&
        cause !== null &&
        typeof Reflect.get(cause, "message") === "string"
          ? Reflect.get(cause, "message")
          : "OAuth signing failed";
      return new InstapaperRequestError({ endpoint: url, message });
    },
  });

export const liveOAuthInputs = (): OAuthInputs => ({
  nonce: crypto.randomUUID().replaceAll("-", ""),
  timestampSeconds: Math.floor(Date.now() / 1000),
});
