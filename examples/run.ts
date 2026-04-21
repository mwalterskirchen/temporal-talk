import { pathToFileURL, fileURLToPath } from "node:url";
import { resolve, dirname, basename } from "node:path";
import { readdirSync } from "node:fs";
import { intro, outro, select, isCancel, cancel, log } from "@clack/prompts";
import pc from "picocolors";
import "./setup.ts";

const examplesDir = dirname(fileURLToPath(import.meta.url));
const self = basename(fileURLToPath(import.meta.url));

function listExamples() {
  return readdirSync(examplesDir)
    .filter((f) => f.endsWith(".ts") && f !== self && f !== "setup.ts" && !f.endsWith(".d.ts"))
    .sort();
}

intro(pc.bgCyan(pc.black(" temporal-talk examples ")));

while (true) {
  const files = listExamples();
  if (files.length === 0) {
    cancel("No examples found.");
    process.exit(1);
  }

  const choice = await select({
    message: "Pick an example",
    options: [
      ...files.map((f) => ({ value: f, label: f })),
      { value: "__quit__", label: pc.dim("quit") },
    ],
  });

  if (isCancel(choice) || choice === "__quit__") {
    outro(pc.dim("bye"));
    break;
  }

  log.step(pc.cyan(choice as string));
  try {
    await import(`${pathToFileURL(resolve(examplesDir, choice as string)).href}?t=${Date.now()}`);
  } catch (err) {
    log.error(String(err));
  }
}
