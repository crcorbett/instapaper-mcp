const safeProviderError = (value: string): string =>
  /^[a-z0-9_]{1,64}$/u.test(value) ? value : "unknown_error";

const safeProviderDescription = (value: string): string =>
  value.replace(/[^\u0020-\u007e]/gu, "").slice(0, 160);

export const upstreamOAuthErrorResponse = (url: URL): Response | undefined => {
  const error = url.searchParams.get("error");
  if (error === null) return undefined;
  const description = url.searchParams.get("error_description");
  return Response.json(
    {
      error: "Upstream OAuth authorization failed",
      providerError: safeProviderError(error),
      ...(description === null
        ? {}
        : { providerDescription: safeProviderDescription(description) }),
    },
    { status: 400 },
  );
};
