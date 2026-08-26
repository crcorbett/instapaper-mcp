import type { DomainItem } from "../schemas";
import { DomainId } from "../schemas";

export const exampleDomain = {
  id: DomainId.make("example"),
  name: "Example",
} satisfies DomainItem;
