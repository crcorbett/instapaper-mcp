import { mkdtemp, open, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment value: ${name}`);
  return value;
};

const present = (name: string): string => {
  const value = process.env[name];
  if (value === undefined) throw new Error(`Missing required environment value: ${name}`);
  return value;
};

const encode = (value: string): string =>
  encodeURIComponent(value).replace(
    /[!'()*]/gu,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );

const signature = async (
  endpoint: string,
  form: Readonly<Record<string, string>>,
  consumerKey: string,
  consumerSecret: string,
): Promise<string> => {
  const oauth = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: crypto.randomUUID().replaceAll("-", ""),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_version: "1.0",
  };
  const parameters = Object.entries({ ...form, ...oauth })
    .map(([key, value]) => [encode(key), encode(value)] as const)
    .sort(([leftKey, leftValue], [rightKey, rightValue]) =>
      leftKey === rightKey ? leftValue.localeCompare(rightValue) : leftKey.localeCompare(rightKey),
    )
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const base = ["POST", encode(endpoint), encode(parameters)].join("&");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(`${encode(consumerSecret)}&`),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const signed = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(base)),
  );
  let binary = "";
  for (const byte of signed) binary += String.fromCharCode(byte);
  const oauthSignature = btoa(binary);
  return `OAuth ${Object.entries({ ...oauth, oauth_signature: oauthSignature })
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, value]) => `${encode(name)}="${encode(value)}"`)
    .join(", ")}`;
};

const endpoint = "https://www.instapaper.com/api/1/oauth/access_token";
const consumerKey = required("INSTAPAPER_CONSUMER_KEY");
const consumerSecret = required("INSTAPAPER_CONSUMER_SECRET");
const form = {
  x_auth_username: required("INSTAPAPER_USERNAME"),
  x_auth_password: present("INSTAPAPER_PASSWORD"),
  x_auth_mode: "client_auth",
};
const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    authorization: await signature(endpoint, form, consumerKey, consumerSecret),
    "content-type": "application/x-www-form-urlencoded",
    "user-agent": "cooper-instapaper-oauth-bootstrap/0.1",
  },
  body: new URLSearchParams(form),
});
if (!response.ok) throw new Error(`Instapaper xAuth failed with HTTP ${response.status}`);
const tokenValues = new URLSearchParams(await response.text());
const accessToken = tokenValues.get("oauth_token");
const accessTokenSecret = tokenValues.get("oauth_token_secret");
if (!accessToken || !accessTokenSecret)
  throw new Error("Instapaper returned an invalid token response");

const directory = await mkdtemp(join(tmpdir(), "instapaper-oauth-"));
const secretFile = join(directory, "secrets.json");
try {
  const handle = await open(secretFile, "wx", 0o600);
  try {
    await handle.writeFile(
      JSON.stringify({
        INSTAPAPER_CONSUMER_KEY: consumerKey,
        INSTAPAPER_CONSUMER_SECRET: consumerSecret,
        INSTAPAPER_ACCESS_TOKEN: accessToken,
        INSTAPAPER_ACCESS_TOKEN_SECRET: accessTokenSecret,
      }),
    );
  } finally {
    await handle.close();
  }
  const upload = Bun.spawn(
    [
      "doppler",
      "secrets",
      "upload",
      "--project",
      required("DOPPLER_PROJECT"),
      "--config",
      required("DOPPLER_CONFIG"),
      "--silent",
      secretFile,
    ],
    { stdout: "ignore", stderr: "ignore" },
  );
  if ((await upload.exited) !== 0) throw new Error("Doppler secret upload failed");
  console.log("INSTAPAPER_OAUTH_BOOTSTRAP_OK");
} finally {
  await rm(directory, { recursive: true, force: true });
}
