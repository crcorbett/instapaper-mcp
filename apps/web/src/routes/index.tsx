import { createFileRoute } from "@tanstack/react-router";
import { Result } from "effect";

import { loadDomainItems } from "$/lib/domain-list";
import { domainListLoader } from "$/lib/loader";

export const Route = createFileRoute("/")({
  loader: () => loadDomainItems(),
  component: Home,
});

function Home() {
  return Result.match(domainListLoader.decode(Route.useLoaderData()), {
    onFailure: () => (
      <main>
        <h1>Data unavailable</h1>
      </main>
    ),
    onSuccess: (exit) =>
      domainListLoader.matchExit(exit, {
        onFailure: () => (
          <main>
            <h1>Data unavailable</h1>
          </main>
        ),
        onSuccess: (items) => (
          <main>
            <h1>instapaper</h1>
            <p>{items.length} items</p>
          </main>
        ),
      }),
  });
}
