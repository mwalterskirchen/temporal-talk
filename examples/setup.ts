import { Temporal } from "temporal-polyfill";

(globalThis as unknown as { Temporal: typeof Temporal }).Temporal = Temporal;
