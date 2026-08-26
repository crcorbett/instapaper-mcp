import { HttpApiClientBrowserLive } from "@instapaper/http-api/client/browser";
import { ManagedRuntime } from "effect";

export const clientRuntime = ManagedRuntime.make(HttpApiClientBrowserLive);
export const disposeClientRuntime = () => clientRuntime.dispose();
