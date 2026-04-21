import type { Temporal as PolyfillTemporal } from "temporal-polyfill";

declare global {
  const Temporal: typeof PolyfillTemporal;
}

export {};
