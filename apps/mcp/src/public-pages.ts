const securityHeaders = {
  "cache-control": "public, max-age=300",
  "content-security-policy":
    "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  "content-type": "text/html; charset=utf-8",
  "referrer-policy": "no-referrer",
  "x-content-type-options": "nosniff",
} as const;

const page = (title: string, body: string): Response =>
  new Response(
    `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <style>
      :root { color-scheme: light dark; font-family: ui-sans-serif, system-ui, sans-serif; }
      body { margin: 0; background: Canvas; color: CanvasText; }
      main { box-sizing: border-box; max-width: 46rem; min-height: 100vh; margin: 0 auto; padding: 4rem 1.5rem; }
      h1, h2 { line-height: 1.2; }
      h1 { font-size: clamp(2rem, 6vw, 3.5rem); letter-spacing: -0.04em; }
      h2 { margin-top: 2rem; font-size: 1.2rem; }
      p, li { line-height: 1.65; }
      a { color: LinkText; }
      .quiet { color: GrayText; }
    </style>
  </head>
  <body>
    <main>${body}</main>
  </body>
</html>`,
    { headers: securityHeaders },
  );

export const homePage = (): Response =>
  page(
    "Instapaper MCP",
    `<h1>Instapaper MCP</h1>
<p>A private reading tool that lets an authorised MCP client check an Instapaper library and save an article only after the account owner approves it.</p>
<p>Google sign-in is used only to confirm the account holder's identity. Cloudflare Access and the service itself restrict access to the approved email address.</p>
<p><a href="/privacy">Privacy notice</a></p>`,
  );

export const privacyPage = (): Response =>
  page(
    "Privacy notice — Instapaper MCP",
    `<h1>Privacy notice</h1>
<p class="quiet">Effective 26 August 2026</p>
<p>Instapaper MCP is a private service operated by Cooper Corbett. It uses Google sign-in through Cloudflare Access to confirm who is requesting access.</p>
<h2>Google account information</h2>
<p>The sign-in request asks Google for basic identity information. Cloudflare Access may receive your name, profile picture, email address and a stable account identifier. Instapaper MCP uses only the verified email address and account identifier to decide whether to grant access. It does not read Gmail, Google Drive, contacts or other Google content.</p>
<h2>How the information is used and stored</h2>
<p>The service uses the verified identity only for sign-in, access control and the MCP authorisation grant. Cloudflare processes the sign-in and stores limited session and grant records needed to operate the service. The Google identity information is not sent to Instapaper.</p>
<h2>Sharing and sale</h2>
<p>Google identity information is not sold. Google and Cloudflare process it only as needed to provide sign-in, security and hosting.</p>
<h2>Access and deletion</h2>
<p>You can ask for an MCP grant to be revoked or its associated records to be deleted through the support contact shown on the Google OAuth consent screen.</p>
<h2>Contact</h2>
<p>Questions about this notice can be sent through the support contact shown on the Google OAuth consent screen.</p>
<p><a href="/">Return to Instapaper MCP</a></p>`,
  );
