import type { $type } from "@arcote.tech/arc";
import { userId } from "./auth";

declare global {
  const BROWSER: boolean;
  const NOT_ON_BROWSER: boolean;
  const ONLY_BROWSER: boolean;
  const SERVER: boolean;
  const NOT_ON_SERVER: boolean;
  const ONLY_SERVER: boolean;
}

declare module "@arcote.tech/arc" {
  interface AuthContext {
    userId: $type<typeof userId>;
  }
}
